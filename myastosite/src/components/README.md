# Component layout

Where to find (and where to add) UI and feature components.

| Path / prefix | Purpose |
|---------------|--------|
| **tiptap-ui/** | Editor toolbar controls: buttons, dropdowns, popovers (heading, list, link, color highlight, etc.). |
| **tiptap-ui-primitive/** | Low-level UI primitives used by the editor: button, card, popover, dropdown, tooltip, badge, input, separator, spacer, toolbar. |
| **tiptap-node/** | TipTap node views (blockquote, code block, heading, image, list, horizontal rule, etc.). |
| **tiptap-extension/** | TipTap extensions (e.g. node background). |
| **tiptap-icons/** | Icon components used in the editor UI. |
| **tiptap-templates/** | Editor themes / templates (e.g. simple template and data). |
| **pages/** | Page-specific sections: **home**, **about**, **tech-stack**, **millet-guide**, **comments**, **account**. Use these for content blocks that belong to a single page. |
| **blog/** | Blog-specific components (e.g. BlogEditor). |
| **LoginForm.tsx** | Shared login form (React). |

**Convention:** Editor-related code lives under the `tiptap-*` trees; page-level sections under `pages/<page-name>/`; shared UI under primitives or at the top level when they’re used across the app.
