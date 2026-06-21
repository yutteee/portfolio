# design-sync notes — purple-proxima (yutteee Portfolio UI)

This repo is a portfolio app (Astro + React), not a packaged component library, so
the sync uses a few adaptations beyond the converter defaults.

## How this repo is wired for design-sync

- **Runtime entry**: `.design-sync/entry.tsx` — a barrel re-exporting the 9 storied
  React components. Passed via `--entry`; esbuild bundles it into `window.PurpleProxima`.
- **Types entry**: `.design-sync/ds-types.d.ts` — a declaration barrel re-exporting the
  components + their `*Props`. `package.json` `"types"` points at it. **Required**: the
  storybook-shape converter discovers the exported component surface and extracts props
  from this file (it has no built `dist/.d.ts` to read otherwise). Keep both barrels in
  sync with the storied components.
- **CSS**: `cfg.cssEntry = src/styles/global.css` (design tokens, appended into
  `_ds_bundle.css`). `cfg.tokensPkg/tokensGlob = destyle.css` ships the CSS reset first
  in the `styles.css` closure — **without it, native `<button>`/`<a>` styles leak**
  (IconButton showed a UA border + black icon until destyle was shipped).
- **Font**: BIZ UDPGothic is a Google Fonts webfont loaded at runtime. It is NOT in
  Storybook by default, so `.storybook/preview-head.html` was added to load it — this
  makes the reference render with the real font AND gets the `<link>` scraped into
  `styles.css` (`[FONT_REMOTE]`).

## Repo fixes made during the sync (review / keep)

- **`.storybook/main.ts`**: removed `@storybook/addon-viewport` — it was pinned at
  `^9.0.8` while the rest of Storybook is `10.4.1`, and it no longer exists in SB 9+.
  It crashed the preview runtime on EVERY story (your `pnpm storybook` was broken too).
  Viewport is built into SB10 core, so the `Header > SpMenu` `globals.viewport` story
  still works. Consider removing the `@storybook/addon-viewport` devDependency too.
- **`.storybook/preview-head.html`**: added (brand font, see above).
- **`package.json`**: added `"types": ".design-sync/ds-types.d.ts"` (see above).
- Local `node_modules` was reinstalled for darwin (it had been installed for
  linux-arm64 in a devcontainer; native bindings like oxc-parser were missing).

## Overrides / skips

- `Header`: `cardMode: single`, `viewport: 1200x100` (full-width fixed nav). Skipped the
  3 interaction-test stories (SpMenu / ThemeToggle / DarkMode) — they run play-functions
  that diverge from a static render.
- `AnimationIcon`: `cardMode: single`. Skipped `ToggleInteraction` (play-function test).

## Re-sync risks (watch these)

- **Footer social icons are NOT produced by the build.** `Footer` renders
  `<img src="/github.png">` etc. — absolute paths to `public/`. They are copied into the
  bundle root manually so the preview/designs resolve them. Every build (incl. the driver)
  WIPES `ds-bundle/`, so **after each build, before upload, re-run**:
  `cp public/github.png public/github_dark.png public/qiita.png public/zenn.svg public/wantedly.png public/wantedly_dark.png ds-bundle/`
  and ensure they're in the upload plan's writes/deletes. If skipped, the Footer card and
  any design using `<Footer/>` show broken images.
- **Header / AnimationIcon-Stopped graded by manual capture.** The compare harness can't
  auto-capture `position:fixed;height:0` (Header) or the `html.stop` class-toggled button
  (AnimationIcon Stopped) — `waitForSelector` visibility fails → `sb-error`. Both were
  verified by manually screenshotting each side at full viewport (identical). If their
  source changes, re-verify manually; the auto-compare will still report `sb-error`.
- **Brand font is CDN-fetched** (Google Fonts). Designs render BIZ UDPGothic only with
  network egress; offline, they fall back. `[RENDER_THIN]`/`[RENDER_BLANK]` warnings on
  IconButton / AnimationIcon / Header are heuristic false-positives (small icon-only or
  fixed-position renders) — confirmed rendering correctly.
- **Header/Footer/AnimationIcon are app-specific** (own nav routes, hardcoded social
  links, animation toggle) — useful as references but not generic building blocks.
- **`@kind` comments in `src/styles/global.css` are load-bearing for claude.ai/design's
  token classification** (`check_design_system`). The `--step-*` font tokens carry
  `/* @kind font */` and the `--z-index-*` tokens carry `/* @kind other */`. The converter
  passes CSS comments through to `_ds_bundle.css` verbatim (it doesn't process `@kind` —
  the app-side checker reads them), so **never strip these trailing comments**; without
  them the design panel re-flags 14 unclassified tokens. The `--text-max-width` clamp's
  `+ 14.2857vw` fragment trips a false font-family warning in the panel — ignore it, the
  token is correct.
- **`Button` is the generic action/link component.** `Button` (ui) renders `<a>` when given
  `href`, else `<button>` (discriminated union), with `startIcon`/`endIcon` (react-icons).
  The old `LinkButton` wrapper was REMOVED (it only forwarded `aria-label` + a fixed right
  arrow — no value over `Button` directly); "一覧/詳細" list links now compose `Button`
  inline (`<Button href aria-label endIcon={FiArrowRight}>`) in the app `.astro` files.
  The synced project still carried `components/ui/LinkButton/**` + `_preview/LinkButton.js`
  from the prior sync — the next driver run reports it as `removed`; let the upload delete
  those paths (don't hand-keep them).
- A `reference_drift` canary fires on every driver run after a full `sb-reference` rebuild
  (the remote anchor predates it) and clears only on upload — confirm the spot-check sheets
  match and proceed; it is not a real grade gap.
