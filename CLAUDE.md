# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Portfolio site for yutteee, built with Astro + React. Deployed at https://yutteee.pages.dev

## Tech Stack

- **Framework**: Astro 4 with MDX, React integration, sitemap, and icon support
- **Styling**: Custom CSS with `destyle.css` and `the-new-css-reset`
- **Animations**: GSAP
- **Icons**: `astro-icon` with Iconify icon sets
- **OGP Images**: Satori + `@resvg/resvg-js` + Sharp
- **Components**: React (interactive islands)
- **Package Manager**: pnpm (required — do not use npm or yarn)
- **Linter/Formatter**: Biome
- **Testing**: Vitest (unit) + Storybook (visual/component)
- **Component Development**: Storybook + Chromatic

## Common Commands

```bash
# Development server (also copies images)
pnpm dev

# Production build (type-check + build)
pnpm build

# Lint and format check
pnpm check

# Run all tests (unit + storybook)
pnpm test

# Run unit tests only
pnpm test:unit

# Run storybook visual tests only
pnpm test:storybook

# Storybook dev server
pnpm storybook

# Generate component boilerplate via plop
pnpm plop
```

## Source Structure

```
src/
  components/    # Shared Astro components
  content/       # Content collections (posts, etc.)
  data/          # Static data (history, products, external blogs)
  features/      # Feature-level components (Header, Footer, etc.)
  layouts/       # Astro page layouts
  marp-themes/   # Marp presentation themes
  pages/         # Astro pages and API routes
  styles/        # Global CSS
  ui/            # Primitive UI components
  utils/         # Utility functions
```

## Code Style

Biome is used for linting and formatting (configured in `biome.json`):
- 2-space indentation
- Recommended lint rules enabled
- Run `pnpm check` before committing

## Testing Notes

- Unit tests are in `src/**/*.test.tsx` and run with jsdom environment
- Storybook tests use the vitest storybook config
- Some Header theme-persistence tests are currently failing (pre-existing, unrelated to session setup)

## Session Start Hook

A session-start hook is configured at `.claude/hooks/session-start.sh` that:
- Only runs in remote (Claude Code on the web) environments
- Sets git author identity
- Installs dependencies via `pnpm install` (async)

Hook is registered in `.claude/settings.json`.
