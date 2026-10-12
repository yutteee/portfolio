import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:4321";
const session = "portfolio-profile-regression";
const browser = ({ args, input }) => {
  const output = execFileSync(
    "agent-browser",
    ["--session", session, "--json", ...args],
    { encoding: "utf8", input, timeout: 30_000 },
  );
  const response = JSON.parse(output);
  assert.ok(response.success, response.error);
  return response.data;
};

const inspect = `
(async () => {
  await document.fonts.ready;
  const image = document.querySelector('img[alt^="顔写真："]');
  if (!image) throw new Error("Profile photo is missing");
  image.scrollIntoView({ block: "center" });
  await image.decode();
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const monitor = image.parentElement;
  const computer = monitor.parentElement;
  const keyboard = computer.lastElementChild;
  const rect = monitor.getBoundingClientRect();
  const photo = image.getBoundingClientRect();
  const keys = keyboard.getBoundingClientRect();
  const frame = getComputedStyle(monitor);
  const bezel = parseFloat(frame.borderTopWidth);
  if (Math.abs(rect.width / rect.height - 8 / 5) > 0.01)
    throw new Error("Monitor aspect ratio changed");
  if (Math.abs(photo.width - (rect.width - bezel * 2)) > 1 ||
      Math.abs(photo.height - (rect.height - bezel * 2)) > 1)
    throw new Error("Photo does not fill the monitor");
  if (rect.left < 0 || rect.right > innerWidth || rect.width <= 0)
    throw new Error("Monitor overflows the viewport");
  if (keyboard.getAttribute("aria-hidden") !== "true")
    throw new Error("Decorative keyboard is exposed to assistive technology");
  if (Math.abs((keys.top - rect.bottom) / rect.width - 0.1) > 0.001 ||
      Math.abs(keys.width / rect.width - 0.5) > 0.001 ||
      Math.abs(keys.height / rect.width - 0.1) > 0.001)
    throw new Error("PC spacing or keyboard proportions changed");
  return [computer, monitor, image, keyboard].map(element => {
    const style = getComputedStyle(element);
    return Object.fromEntries([
      "width", "height", "gap", "borderRadius", "borderTopWidth",
      "borderBottomWidth", "borderLeftWidth", "borderRightWidth",
      "borderBottomColor", "backgroundColor", "objectFit"
    ].map(property => [property, style[property]]));
  });
})()
`;

const inspectHero = `
(() => {
  const monitor = document.getElementById("monitor").getBoundingClientRect();
  const keyboard = document.querySelector("#container .keyboard").getBoundingClientRect();
  if (Math.abs(monitor.width / monitor.height - 1.6) > 0.001 ||
      Math.abs((keyboard.top - monitor.bottom) / monitor.width - 0.1) > 0.001 ||
      Math.abs(keyboard.width / monitor.width - 0.5) > 0.001 ||
      Math.abs(keyboard.height / monitor.width - 0.1) > 0.001)
    throw new Error("Hero PC proportions changed");
  if (monitor.left < 0 || monitor.right > innerWidth)
    throw new Error("Hero monitor overflows the viewport");
})()
`;

try {
  browser({ args: ["open", baseUrl] });
  for (const width of [320, 390, 1024, 1440]) {
    browser({ args: ["set", "viewport", String(width), "900"] });
    for (const theme of ["light", "dark"]) {
      browser({
        args: ["eval", "--stdin"],
        input: `localStorage.setItem("theme", ${JSON.stringify(theme)}); localStorage.setItem("animation", "stop");`,
      });
      browser({ args: ["open", baseUrl] });
      browser({ args: ["eval", "--stdin"], input: inspectHero });
      const top = browser({ args: ["eval", "--stdin"], input: inspect }).result;
      browser({
        args: ["eval", "--stdin"],
        input:
          'document.querySelector(\'.texts a[href="/about/"]\').scrollIntoView({ block: "center" });',
      });
      browser({ args: ["click", '.texts a[href="/about/"]'] });
      browser({ args: ["wait", "--fn", 'location.pathname === "/about/"'] });
      const about = browser({
        args: ["eval", "--stdin"],
        input: inspect,
      }).result;
      assert.deepEqual(
        about,
        top,
        `PC appearance differs at ${width}px / ${theme}`,
      );
      console.log(
        `PASS ${width}px / ${theme}: hero and profile proportions, matching PC, loaded photo, viewport fit, navigation`,
      );
    }
  }
  for (const height of [650, 1080, 1600]) {
    browser({ args: ["set", "viewport", "1440", String(height)] });
    browser({ args: ["open", baseUrl] });
    browser({ args: ["eval", "--stdin"], input: inspectHero });
    console.log(`PASS hero at 1440 x ${height}: consistent proportions`);
  }
} finally {
  browser({ args: ["close"] });
}
