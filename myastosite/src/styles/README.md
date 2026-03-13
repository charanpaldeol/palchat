# Styles directory notes

This directory now follows the shared design system defined in:

- `DESIGN_SYSTEM.md`
- `src/styles/global.css`

All colors, spacing, typography, and layout primitives must come from the design tokens and utilities defined there.

## Global styles

- `global.css` is the **single source of truth** for:
  - CSS variables for colors, spacing, and breakpoints
  - Global layout primitives (`app-root`, `app-main`, `app-container`)
  - Shared UI primitives (navbar, footer, buttons, cards, inputs, alerts, typography helpers)

## Deprecated: components.css

- `components.css` previously described a separate component styling system.
- It is now intentionally empty and **should not be imported** in new code.
- AI agents and contributors should:
  - Avoid adding new styles to `components.css`
  - Prefer updating or extending semantic classes in `global.css`
  - Use page and section components for layout instead of new style entrypoints

## Guidance for AI agents

- When styling or restructuring a page:
  - Keep navbar, footer, and global layout untouched unless explicitly asked.
  - Reuse existing tokens and helpers from `global.css`.
  - If you need a new reusable pattern (e.g. a section variant), add a semantic class in `global.css` rather than creating a new stylesheet.
