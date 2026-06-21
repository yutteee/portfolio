# yutteee Portfolio UI — conventions

These React components come from a personal portfolio (Astro + React). They are
**standalone** — there is no React context/provider to wrap. All theming is done
through global CSS (design tokens + a reset) that ships in `styles.css`, plus one
`<html>` class for dark mode. Load `styles.css` and the components are styled.

## Setup & theming

- **Load `styles.css`.** It `@import`s `tokens/destyle.css` (a CSS reset — components
  assume it; without it native `<button>`/`<a>`/list styles leak), the brand font
  **BIZ UDPGothic** (remote `@import`), and `_ds_bundle.css` (every `--*` token
  definition + component styles). No provider, no JS theme setup.
- **Dark mode:** add the class `dark` to the root `<html>` element
  (`document.documentElement.classList.add("dark")`). Light is the default (no class).
  The semantic `--color-*` tokens remap automatically — never hardcode hex.
- **Fonts:** `--font-family-default` is `"BIZ UDPGothic", sans-serif`, already applied
  to `html`.

## Styling idiom — CSS custom properties (design tokens)

There are **no utility classes and no CSS-in-JS**. Components carry their own styles;
you style your own layout glue with `var(--token)`. Always use the **semantic**
color tokens (theme-aware), not the raw primitives (`--color-navy`, etc.).

| Family | Tokens |
|---|---|
| Color (semantic) | `--color-background` `--color-surface` `--color-text` `--color-text-inverse` `--color-border` `--color-link` `--color-accent` |
| Font size (fluid) | `--step--2` `--step--1` `--step-0` `--step-1` … `--step-6` |
| Spacing (fluid) | `--space-4xs` `--space-3xs` `--space-2xs` `--space-xs` `--space-s` `--space-m` `--space-l` `--space-xl` `--space-2xl` `--space-3xl` (+ pairs `--space-s-m`, `--space-m-l`, `--space-l-xl`) |
| Radius | `--radius-none` `--radius-xs` `--radius-sm` `--radius-md` `--radius-lg` `--radius-xl` `--radius-infinity` |
| Line height | `--leading-tight` `--leading-snug` `--leading-relaxed` `--leading-loose` `--leading-paragraph` |
| Letter spacing | `--tracking-tight` `--tracking-normal` `--tracking-wide` `--tracking-wider` |
| Border width | `--border-width-none` `--border-width-sm` `--border-width-md` `--border-width-lg` |
| Shadow | `--shadow-elevation-2` `--shadow-elevation-4` `--shadow-elevation-8` `--shadow-elevation-12` |
| z-index | `--z-index-background` `--z-index-content` `--z-index-header` `--z-index-modal` `--z-index-toast` |
| Breakpoints | `--bp-sm` (40rem) `--bp-md` (64rem) `--bp-md-plus` |
| Misc | `--text-max-width` `--font-weight-normal` |

## Where the truth lives

- `styles.css` and its `@import` closure (`tokens/destyle.css`, `_ds_bundle.css`) —
  the authoritative token values and component CSS. Read these before styling.
- Per-component API + usage: `components/<group>/<Name>/<Name>.prompt.md` and `.d.ts`.
- Groups: **ui/** = `BlogPost` `Breadcrumb` `IconButton` `LinkButton` `PageTitle`
  `ProductItem`; **features/** = `Header` `Footer` `AnimationIcon`.
- `IconButton`'s `icon` prop takes a **react-icons** `IconType` (e.g. `FiMenu` from
  `react-icons/fi`). `Header`/`Footer`/`AnimationIcon` are app-specific (own nav,
  social links, animation toggle).

## Idiomatic build snippet

```tsx
import { IconButton } from "<this package>";
import { FiMenu } from "react-icons/fi";

export function Toolbar() {
  return (
    <div
      style={{
        display: "flex",
        gap: "var(--space-2xs)",
        padding: "var(--space-s)",
        background: "var(--color-surface)",
        border: "var(--border-width-sm) solid var(--color-border)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <IconButton label="メニュー" icon={FiMenu} handleClick={() => {}} />
    </div>
  );
}
```
