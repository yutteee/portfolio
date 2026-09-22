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
    pcCount: document.querySelectorAll('.pc-column').length,
    images: rows.map(row => {
      const image = row.querySelector('img');
      const rect = image.getBoundingClientRect();
      return { width: rect.width, height: rect.height, alt: image.alt, clip: getComputedStyle(image).clipPath };
    }),
  };
})()`,
  });

try {
  run({ args: ["set", "viewport", "1440", "1000"] });
  run({ args: ["open", process.argv[2] ?? "http://127.0.0.1:4321/about/"] });
  run({
    args: [
      "wait",
      "--fn",
      "document.querySelector('.histories.is-stacking') !== null",
    ],
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
    run({ args: ["set", "viewport", String(width), String(height)] });
    settle();
    assert.equal(state().overflow, false);
    assert.deepEqual(state().text, initial.text);
    assert.ok(
      state().positions.every(
        (position) => position === "sticky" || position === "relative",
      ),
    );
    assert.ok(state().transforms.every((transform) => transform === "none"));
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

  run({ args: ["set", "viewport", "1440", "1000"] });
  evaluate({
    code: "window.scrollTo(0, document.querySelector('.career').getBoundingClientRect().top + scrollY - 120)",
  });
  settle();
  const beforeHover = evaluate({ code: "scrollY" });
  run({ args: ["hover", ".career-nav li:last-child a"] });
  assert.equal(evaluate({ code: "scrollY" }), beforeHover);
  for (const number of [4, 1, 3, 2]) {
    run({ args: ["click", `.career-nav a[href="#career-${number}"]`] });
    run({
      args: [
        "wait",
        "--fn",
        `Math.abs(document.getElementById('career-${number}').getBoundingClientRect().top - Number.parseFloat(getComputedStyle(document.querySelector('.histories')).getPropertyValue('--stack-top'))) < 2`,
      ],
    });
    settle();
    assert.equal(
      evaluate({
        code: "document.querySelector('.career-nav [aria-current]').hash",
      }),
      `#career-${number}`,
    );
  }
  assert.ok(
    evaluate({
      code: "getComputedStyle(document.querySelector('.history')).position === 'sticky'",
    }),
  );
  evaluate({
    code: "window.scrollTo({top: document.querySelector('.history-stage').getBoundingClientRect().top + scrollY - 120 + 40, behavior: 'instant'})",
  });
  settle();
  assert.ok(Math.abs(state().rects[0].top - state().stackTop) < 2);
  evaluate({
    code: "window.scrollTo({top: document.querySelectorAll('.history-stage')[1].getBoundingClientRect().top + scrollY - 120 - document.querySelector('.history-card').offsetHeight / 4, behavior: 'instant'})",
  });
  settle();
  const halfwayOpacity = evaluate({
    code: "Number(getComputedStyle(document.querySelector('.history-card')).opacity)",
  });
  assert.ok(
    Math.abs(halfwayOpacity - 1) < 0.02,
    "The previous card should remain opaque until three quarters covered",
  );
  evaluate({
    code: "window.scrollTo({top: document.querySelectorAll('.history-stage')[1].getBoundingClientRect().top + scrollY - 120, behavior: 'instant'})",
  });
  settle();
  assert.ok(
    Math.abs(state().rects[0].top - state().rects[1].top) < 2,
    "Next card should reach the previous card's top before it leaves",
  );
  evaluate({
    code: "window.scrollTo({top: document.querySelector('.history-stage:last-child').getBoundingClientRect().bottom + scrollY, behavior: 'instant'})",
  });
  settle();
  assert.ok(
    evaluate({
      code: "[...document.querySelectorAll('.history-card')].slice(0, -1).every(card => getComputedStyle(card).opacity === '0')",
    }),
    "Covered cards must not reappear above the final card",
  );
  run({
    args: [
      "find",
      "role",
      "button",
      "click",
      "--name",
      "アニメーションを停止する",
    ],
  });
  settle();
  assert.ok(
    evaluate({
      code: "[...document.querySelectorAll('.history')].every(row => getComputedStyle(row).position === 'relative')",
    }),
  );
  assert.deepEqual(state().text, initial.text);
  assert.ok(
    evaluate({
      code: "[...document.querySelectorAll('.history-card')].every(card => getComputedStyle(card).opacity === '1')",
    }),
  );
  run({
    args: [
      "find",
      "role",
      "button",
      "click",
      "--name",
      "アニメーションを有効にする",
    ],
  });

  run({ args: ["set", "viewport", "390", "844"] });
  settle();
  assert.ok(state().layouts.every((layout) => layout.vertical));
  evaluate({
    code: "window.scrollTo(0, document.querySelector('.career').getBoundingClientRect().top + scrollY - 64)",
  });
  settle();
  evaluate({
    code: "window.scrollTo({top: document.querySelector('.history-stage:last-child').getBoundingClientRect().top + scrollY - 40, behavior: 'instant'})",
  });
  settle();
  assert.ok(
    evaluate({
      code: `(() => {
      const nav = document.querySelector('.career-nav').getBoundingClientRect();
      return !document.elementsFromPoint(nav.left + 20, nav.top - 8)
        .some(element => element.closest('.histories'));
    })()`,
    }),
    "Mobile cards must be clipped above the career navigation",
  );
  run({ args: ["select", ".career-select", "3"] });
  run({
    args: [
      "wait",
      "--fn",
      "document.querySelector('.career-nav [aria-current]').hash === '#career-4'",
    ],
  });
  run({ args: ["set", "media", "light", "reduced-motion"] });
  settle();
  assert.ok(
    evaluate({
      code: "[...document.querySelectorAll('.history')].every(row => getComputedStyle(row).position === 'relative')",
    }),
  );
  console.log(
    "PASS: native reveal of every heading, paragraph and image; bounded sticky cards; navigation; mobile; stop and reduced motion. VoiceOver rotor requires a separate manual check.",
  );
} finally {
  run({ args: ["close"] });
}
