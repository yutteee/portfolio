import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

// 開発サーバー起動後: node scripts/check-about-scroll-stack.mjs [URL]
const session = `about-stack-test-${process.pid}`;
const run = ({ args }) => {
  const output = execFileSync(
    "agent-browser",
    ["--session", session, "--json", ...args],
    {
      encoding: "utf8",
    },
  );
  const result = JSON.parse(output);
  assert.ok(result.success, result.error);
  return result.data;
};
const evaluate = ({ code }) => run({ args: ["eval", code] }).result;
const settle = () =>
  evaluate({
    code: "new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve(true))))",
  });
const waitFor = ({ code }) => run({ args: ["wait", "--fn", code] });
const viewport = ({ width, height }) => {
  run({ args: ["set", "viewport", String(width), String(height)] });
  settle();
};
const clickButton = ({ name }) =>
  run({ args: ["find", "role", "button", "click", "--name", name] });
const scrollTo = ({ top }) => {
  evaluate({ code: `window.scrollTo({top: ${top}, behavior: 'instant'})` });
  settle();
};
const check = ({ code, message }) => assert.ok(evaluate({ code }), message);
const state = () =>
  evaluate({
    code: `(() => {
  const rows = [...document.querySelectorAll('.history')];
  return {
    stackTop: Number.parseFloat(getComputedStyle(document.querySelector(".histories")).getPropertyValue("--stack-top")),
    positions: rows.map(row => getComputedStyle(row).position),
    rects: rows.map(row => { const r = row.getBoundingClientRect(); return { top: r.top, bottom: r.bottom }; }),
    transforms: rows.map(row => getComputedStyle(row.firstElementChild).transform),
    text: rows.map(row => row.textContent),
    overflow: document.documentElement.scrollWidth > innerWidth,
    layouts: [document.querySelector('.intro'), ...rows.map(row => row.firstElementChild)].map(section => {
      const image = section.querySelector('.intro-figure, .section-image').getBoundingClientRect();
      const text = section.querySelector('.description').getBoundingClientRect();
      return { sideBySide: image.right <= text.left, vertical: image.top >= text.bottom };
    }),
  };
})()`,
  });

try {
  run({ args: ["set", "viewport", "1440", "1000"] });
  run({ args: ["open", process.argv[2] ?? "http://127.0.0.1:4321/about/"] });
  waitFor({
    code: "document.querySelector('.histories.is-stacking') !== null",
  });
  evaluate({
    code: "document.documentElement.classList.remove('stop'); window.scrollTo(0, 0)",
  });
  settle();
  const initial = state();
  assert.equal(initial.text.length, 4);
  assert.ok(initial.layouts.every((layout) => layout.sideBySide));

  for (const [width, height] of [
    [1440, 900],
    [1025, 921],
    [1024, 921],
    [877, 921],
    [390, 844],
    [320, 844],
  ]) {
    viewport({ width, height });
    const current = state();
    assert.equal(current.overflow, false);
    assert.deepEqual(current.text, initial.text);
    assert.ok(
      current.positions.every(
        (position) => position === "sticky" || position === "relative",
      ),
    );
    assert.ok(current.transforms.every((transform) => transform === "none"));
    const failures = evaluate({
      code: `(async () => {
      const settle = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const failures = [];
      for (const origin of [0, document.documentElement.scrollHeight]) {
      for (const target of document.querySelectorAll('.history h3, .history p, .history img')) {
        window.scrollTo(0, origin);
        await settle();
        target.scrollIntoView({block: 'start', behavior: 'instant'});
        await settle();
        const rect = target.getBoundingClientRect();
        const card = target.closest('.history-card');
        const pointY = Math.max(0, Math.min(innerHeight - 1, rect.top + Math.min(rect.height / 2, 20)));
        const hit = document.elementFromPoint(rect.left + rect.width / 2, pointY);
        const covered = !hit || !(target.contains(hit) || hit.contains(target));
        const nav = document.querySelector('.career-nav').getBoundingClientRect();
        const minimumTop = innerWidth <= 1024 ? nav.bottom : 96;
        if (rect.top < minimumTop - 2 || rect.top >= innerHeight || getComputedStyle(card).opacity !== '1' || covered) {
          failures.push(origin + ':' + target.tagName + ':' + target.textContent.slice(0, 25));
        }
      }
      }
      window.scrollTo(0, document.documentElement.scrollHeight);
      await settle();
      document.querySelector('.history h3').scrollIntoView({block: 'nearest', behavior: 'instant'});
      await settle();
      const heading = document.querySelector('.history h3').getBoundingClientRect();
      if (heading.bottom < 0 || heading.top >= innerHeight) failures.push('nearest');
      return failures;
    })()`,
    });
    assert.deepEqual(failures, [], `Native reveal failed at ${width}px`);
  }

  viewport({ width: 1440, height: 1000 });
  scrollTo({
    top: "document.querySelector('.career').getBoundingClientRect().top + scrollY - 120",
  });
  const beforeHover = evaluate({ code: "scrollY" });
  run({ args: ["hover", ".career-nav li:last-child a"] });
  assert.equal(evaluate({ code: "scrollY" }), beforeHover);
  for (const number of [4, 1, 3, 2]) {
    run({ args: ["click", `.career-nav a[href="#career-${number}"]`] });
    waitFor({
      code: `Math.abs(document.getElementById('career-${number}').getBoundingClientRect().top - Number.parseFloat(getComputedStyle(document.querySelector('.histories')).getPropertyValue('--stack-top'))) < 2`,
    });
    settle();
    assert.equal(
      evaluate({
        code: "document.querySelector('.career-nav [aria-current]').hash",
      }),
      `#career-${number}`,
    );
  }
  check({
    code: "getComputedStyle(document.querySelector('.history')).position === 'sticky'",
  });
  scrollTo({
    top: "document.querySelector('.history-stage').getBoundingClientRect().top + scrollY - 120 + 40",
  });
  assert.ok(Math.abs(state().rects[0].top - state().stackTop) < 2);
  scrollTo({
    top: "document.querySelectorAll('.history-stage')[1].getBoundingClientRect().top + scrollY - 120 - document.querySelector('.history-card').offsetHeight / 4",
  });
  const fadeStartOpacity = evaluate({
    code: "Number(getComputedStyle(document.querySelector('.history-card')).opacity)",
  });
  assert.ok(
    Math.abs(fadeStartOpacity - 1) < 0.02,
    "The previous card should remain opaque until three quarters covered",
  );
  scrollTo({
    top: "document.querySelectorAll('.history-stage')[1].getBoundingClientRect().top + scrollY - 120",
  });
  assert.ok(
    Math.abs(state().rects[0].top - state().rects[1].top) < 2,
    "Next card should reach the previous card's top before it leaves",
  );
  scrollTo({
    top: "document.querySelector('.history-stage:last-child').getBoundingClientRect().bottom + scrollY",
  });
  check({
    code: "[...document.querySelectorAll('.history-card')].slice(0, -1).every(card => getComputedStyle(card).opacity === '0')",
    message: "Covered cards must not reappear above the final card",
  });
  clickButton({ name: "アニメーションを停止する" });
  settle();
  check({
    code: "[...document.querySelectorAll('.history')].every(row => getComputedStyle(row).position === 'relative')",
  });
  assert.deepEqual(state().text, initial.text);
  check({
    code: "[...document.querySelectorAll('.history-card')].every(card => getComputedStyle(card).opacity === '1')",
  });
  clickButton({ name: "アニメーションを有効にする" });

  viewport({ width: 390, height: 844 });
  assert.ok(state().layouts.every((layout) => layout.vertical));
  scrollTo({
    top: "document.querySelector('.career').getBoundingClientRect().top + scrollY - 64",
  });
  scrollTo({
    top: "document.querySelector('.history-stage:last-child').getBoundingClientRect().top + scrollY - 40",
  });
  check({
    code: `(() => {
      const nav = document.querySelector('.career-nav').getBoundingClientRect();
      return !document.elementsFromPoint(nav.left + 20, nav.top - 8)
        .some(element => element.closest('.histories'));
    })()`,
    message: "Mobile cards must be clipped above the career navigation",
  });
  run({ args: ["select", ".career-select", "3"] });
  waitFor({
    code: "document.querySelector('.career-nav [aria-current]').hash === '#career-4'",
  });
  run({ args: ["set", "media", "light", "reduced-motion"] });
  settle();
  check({
    code: "[...document.querySelectorAll('.history')].every(row => getComputedStyle(row).position === 'relative')",
  });
  console.log(
    "PASS: native reveal of every heading, paragraph and image; bounded sticky cards; navigation; mobile; stop and reduced motion. VoiceOver rotor requires a separate manual check.",
  );
} finally {
  run({ args: ["close"] });
}
