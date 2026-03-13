# DESIGN SYSTEM RULEBOOK
## SaaS Web App — Clean & Minimal

> ⚠️ AI AGENT INSTRUCTIONS: You MUST follow every rule in this file on every page, every component, and every update. Never override these rules unless the user explicitly says "override design system". When adding new pages or components, refer back to this file first.

---

## 1. TYPOGRAPHY

### Fonts
- **Heading Font:** `DM Sans` (weights: 400, 500, 600, 700)
- **Body Font:** `DM Sans` (same family, weight 400)
- **Monospace / Code:** `JetBrains Mono`
- **Import:** Always include this in `<head>` or global CSS:
```
https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono&display=swap
```

### Font Scale (never deviate)
| Role         | Size    | Weight | Line Height |
|--------------|---------|--------|-------------|
| H1           | 2.5rem  | 700    | 1.2         |
| H2           | 2rem    | 600    | 1.25        |
| H3           | 1.5rem  | 600    | 1.3         |
| H4           | 1.25rem | 600    | 1.4         |
| Body Large   | 1.125rem| 400    | 1.6         |
| Body Default | 1rem    | 400    | 1.6         |
| Body Small   | 0.875rem| 400    | 1.5         |
| Caption      | 0.75rem | 500    | 1.4         |
| Label/Tag    | 0.75rem | 600    | 1           |

### Rules
- ❌ NEVER change fonts between pages or components
- ❌ NEVER use font-size outside the scale above
- ❌ NEVER use bold on body text unless it's a label or UI element
- ✅ Use font-weight 500 for medium emphasis (nav links, card titles)

---

## 2. COLOR PALETTE

```css
:root {
  /* Brand */
  --color-primary:        #2563EB;   /* Blue — buttons, links, active states */
  --color-primary-hover:  #1D4ED8;   /* Darker blue on hover */
  --color-primary-light:  #EFF6FF;   /* Light blue tint for backgrounds */

  /* Neutrals */
  --color-bg:             #FFFFFF;   /* Page background */
  --color-surface:        #F8FAFC;   /* Card / panel background */
  --color-border:         #E2E8F0;   /* All borders and dividers */
  --color-text-primary:   #0F172A;   /* Main text */
  --color-text-secondary: #64748B;   /* Subtext, placeholders */
  --color-text-disabled:  #CBD5E1;   /* Disabled state text */

  /* Semantic */
  --color-success:        #16A34A;
  --color-success-bg:     #F0FDF4;
  --color-warning:        #D97706;
  --color-warning-bg:     #FFFBEB;
  --color-error:          #DC2626;
  --color-error-bg:       #FEF2F2;
  --color-info:           #0EA5E9;
  --color-info-bg:        #F0F9FF;
}
```

### Rules
- ❌ NEVER introduce new colors not listed above
- ❌ NEVER use color hex values directly in components — always use CSS variables
- ❌ NEVER use gradients on backgrounds (only allowed on the primary CTA button)
- ✅ Use `--color-surface` for cards and sidebars, NOT pure white
- ✅ Use `--color-border` for ALL dividers, card borders, input borders

---

## 3. SPACING SYSTEM

All spacing must use this 8px base grid:

| Token    | Value  | Usage                             |
|----------|--------|-----------------------------------|
| `--sp-1` | 4px    | Icon padding, tight gaps          |
| `--sp-2` | 8px    | Input padding (vertical), badges  |
| `--sp-3` | 12px   | Small component internal padding  |
| `--sp-4` | 16px   | Default padding, gap between items|
| `--sp-5` | 24px   | Section internal padding          |
| `--sp-6` | 32px   | Card padding, form spacing        |
| `--sp-7` | 48px   | Section gap                       |
| `--sp-8` | 64px   | Large section spacing             |
| `--sp-9` | 96px   | Page top/bottom padding           |

### Rules
- ❌ NEVER use arbitrary pixel values like 13px, 22px, 37px
- ✅ All margin and padding must snap to the grid above
- ✅ Default page horizontal padding: `--sp-6` (32px) on desktop, `--sp-4` (16px) on mobile

---

## 4. NAVBAR

### Structure
```
[Logo]                    [Nav Links]          [CTA Button]
Left-aligned              Center or left        Right-aligned
```

### Rules
- Height: **64px** fixed — never change
- Position: **sticky top-0**, always visible on scroll
- Background: `--color-bg` with `border-bottom: 1px solid var(--color-border)`
- Optional glass effect: `backdrop-filter: blur(8px)` on the navbar background is allowed for a modern look
- Add subtle shadow on scroll: `box-shadow: 0 1px 3px rgba(0,0,0,0.06)`
- Logo: left side, always a text logo or `<img>` — max height 32px
- Nav links: font-size `0.9rem`, weight `500`, color `--color-text-secondary`
- Active nav link: color `--color-primary`, optionally a 2px bottom border in primary
- Hover state: color `--color-text-primary`, transition 150ms
- CTA Button: right side, primary button style (see Buttons section)
- Max content width: **1280px**, centered with `margin: 0 auto`

### Mobile (< 768px)
- Collapse nav links into a hamburger menu
- Drawer slides in from right
- Overlay background: `rgba(0,0,0,0.3)`
- Close button top-right of drawer

### ❌ NEVER
- Change navbar height
- Remove the bottom border
- Use a colored/gradient navbar background
- Add more than 6 nav links

---

## 5. HEADER / PAGE HERO

Used at the top of every main page (not the navbar).

### Structure
```
[Page Title / H1]
[Subtitle — optional]
[CTA Buttons — optional]
```

### Rules
- Background: `--color-bg` or `--color-surface`
- Top padding: `--sp-9` (96px), bottom padding: `--sp-8` (64px)
- H1: centered OR left-aligned — pick one and stay consistent across all pages
- Subtitle: `--color-text-secondary`, max-width `560px`
- Max content width: **1280px**
- ❌ NEVER use a full-bleed image background in the header
- ❌ NEVER add decorative shapes or blobs behind the header text

---

## 6. FOOTER

### Structure (3 columns)
```
[Logo + Tagline]     [Links Col 1]     [Links Col 2]
[Copyright]          [Social Icons]
```

### Rules
- Background: `--color-surface` (`#F8FAFC`)
- Top border: `1px solid var(--color-border)`
- Padding: `--sp-8` top, `--sp-7` bottom
- Logo: same as navbar logo
- Link color: `--color-text-secondary`, hover: `--color-text-primary`
- Font size: `0.875rem`
- Copyright line: `caption` size, `--color-text-disabled`
- Max content width: **1280px**
- ❌ NEVER use a dark/black footer background
- ❌ NEVER add more than 3 link columns

---

## 7. BUTTONS

### Variants

```css
/* Primary */
background: var(--color-primary);
color: white;
border-radius: 8px;
padding: 10px 20px;
font-weight: 600;
font-size: 0.9rem;
transition: background 150ms;

/* Primary Hover */
background: var(--color-primary-hover);

/* Secondary / Outline */
background: transparent;
border: 1.5px solid var(--color-border);
color: var(--color-text-primary);
border-radius: 8px;
padding: 10px 20px;

/* Ghost */
background: transparent;
color: var(--color-primary);
no border;

/* Danger */
background: var(--color-error);
color: white;
```

### Sizes
| Size   | Padding     | Font Size |
|--------|-------------|-----------|
| Small  | 6px 14px    | 0.8rem    |
| Medium | 10px 20px   | 0.9rem    |
| Large  | 14px 28px   | 1rem      |

### Rules
- ❌ NEVER change border-radius (always 8px)
- ❌ NEVER use box-shadow on buttons (flat design)
- ❌ NEVER add icons inside buttons unless there's a 8px gap between icon and text
- ✅ Always include `transition: 150ms` on all interactive elements
- ✅ Disabled state: `opacity: 0.4`, `cursor: not-allowed`

---

## 8. CARDS

```css
background: var(--color-surface);
border: 1px solid var(--color-border);
border-radius: 12px;
padding: var(--sp-6); /* 32px */
```

### Rules
- ❌ NEVER use drop shadows on cards (use border instead)
- ❌ NEVER nest cards inside cards
- ✅ Hover state (if clickable): `border-color: var(--color-primary)`, transition 150ms
- ✅ Card title: H4, weight 600
- ✅ Card body text: body default, `--color-text-secondary`

---

## 9. FORM INPUTS

```css
/* Input Base */
border: 1.5px solid var(--color-border);
border-radius: 8px;
padding: 10px 14px;
font-size: 1rem;
color: var(--color-text-primary);
background: var(--color-bg);
width: 100%;

/* Focus */
border-color: var(--color-primary);
outline: 3px solid var(--color-primary-light);

/* Error */
border-color: var(--color-error);
outline: 3px solid var(--color-error-bg);
```

### Labels
- Always above the input, never floating
- Font size: `0.875rem`, weight `500`, color `--color-text-primary`
- Gap between label and input: 6px

### Rules
- ❌ NEVER use placeholder text as a label substitute
- ❌ NEVER remove focus ring (accessibility)
- ✅ Error message: below input, `0.8rem`, `--color-error`
- ✅ Helper text: below input, `0.8rem`, `--color-text-secondary`

---

## 10. LAYOUT & GRID

### Page Layout
```
[Navbar — full width, sticky]
[Page Content — max-width 1280px, centered]
[Footer — full width]
```

Use these shared layout helpers (implemented in `global.css`) across all pages:

- `app-root`: full-height flex column wrapper, page background set to `--color-bg`
- `app-main`: flex child that grows to fill space between navbar and footer
- `app-container`: centers content, with horizontal padding `var(--sp-6)` on desktop and `var(--sp-4)` on mobile

### Content Grid
- Desktop: 12-column grid, `gap: 24px`
- Tablet (768px–1024px): 8-column grid
- Mobile (<768px): 4-column grid (effectively single column)

### Sidebar Layout (Dashboard)
```
[Sidebar 240px fixed] | [Main Content — fills remaining width]
```
- Sidebar background: `--color-surface`
- Sidebar border-right: `1px solid var(--color-border)`
- Sidebar link: `0.9rem`, weight `500`, `--color-text-secondary`
- Active sidebar link: `--color-primary-light` background, `--color-primary` text

---

## 11. HERO / PAGE SECTIONS

Use these shared hero and section patterns (matched to `global.css`) for all marketing/landing pages:

- `page-hero`: top padding `--sp-9`, bottom padding `--sp-8`
- `page-hero-title`: uses H1 scale — `2.5rem`, `700`, `1.2`, `--color-text-primary`
- `page-hero-subtitle`: body-large scale — `1.125rem`, `--color-text-secondary`, `max-width: 560px`
- `section`: vertical padding `--sp-8`
- `section-tight`: vertical padding `--sp-6`
- `section-title`: H4 scale — `1.25rem`, `600`, `1.4`
- `section-eyebrow`: label scale — `0.75rem`, `500`, uppercase, increased letter-spacing
- `body-text`: body default — `1rem`, `--color-text-secondary`
- `body-text-small`: body small — `0.875rem`, `--color-text-secondary`

These utilities keep all page sections (hero, feature blocks, guides) visually consistent and should be reused instead of ad‑hoc styles.

---

## 12. BREAKPOINTS

```css
--bp-sm:  640px   /* Mobile landscape */
--bp-md:  768px   /* Tablet */
--bp-lg:  1024px  /* Small desktop */
--bp-xl:  1280px  /* Desktop */
--bp-2xl: 1536px  /* Large desktop */
```

---

## 13. BORDERS & RADIUS

| Element       | Radius |
|---------------|--------|
| Buttons       | 8px    |
| Inputs        | 8px    |
| Cards         | 12px   |
| Modals        | 16px   |
| Badges/Tags   | 99px (pill) |
| Avatars       | 50% (circle) |
| Tooltips      | 6px    |

All borders: `1px solid var(--color-border)` — never use 2px borders except on focused inputs.

---

## 14. ICONS

- Library: **Lucide Icons** (https://lucide.dev) — consistent stroke style
- Default size: **20px** in body, **16px** in compact UI, **24px** in headers
- Color: inherit from parent text color
- ❌ NEVER mix icon libraries (no mixing Heroicons + FontAwesome etc.)
- ❌ NEVER use filled icons — stroke icons only

---

## 15. ANIMATIONS & TRANSITIONS

- All hover/focus transitions: `150ms ease`
- Page element fade-in: `opacity 0 → 1`, `200ms ease`
- Modal open: `scale(0.97) → scale(1)` + fade, `200ms ease`
- Sidebar slide: `translateX(-100%) → 0`, `250ms ease`
- ❌ NEVER use animations longer than 400ms
- ❌ NEVER animate layout properties (width, height) — use transform/opacity only
- ✅ Always respect `prefers-reduced-motion` media query

---

## 16. DARK MODE (OPTIONAL)

Dark mode is supported via a `.dark` class on the root element. When enabled:

- Headings (`.component-title`) should switch to white text
- Subtitles (`.component-subtitle`) should use a neutral light gray (e.g. `#d1d5db`) while still respecting the typography scale
- Backgrounds must continue to rely on the same spacing and layout tokens; do not change component structure between light and dark mode
- All color overrides must still respect semantic intent (e.g. success/error/info colors stay semantically correct)

Do not introduce separate dark-mode-only colors; always derive dark-mode styles from the existing palette or safe neutral tints.

---

## 17. DO'S AND DON'TS SUMMARY

| ✅ DO                                         | ❌ DON'T                                      |
|----------------------------------------------|----------------------------------------------|
| Use CSS variables for all colors             | Hardcode hex values in components            |
| Keep navbar at 64px                          | Change navbar height for any reason          |
| Use DM Sans for all text                     | Introduce new fonts                          |
| Snap spacing to 8px grid                     | Use arbitrary spacing like 13px or 22px      |
| Use `--color-border` for all borders         | Use random border colors                     |
| Keep border-radius consistent per element    | Mix border-radius values                     |
| Use Lucide for all icons                     | Mix icon libraries                           |
| Light surface color for cards                | Use white cards on white backgrounds         |
| 3-column max footer                          | Add decorative footer elements               |
| Use semantic color variables for alerts      | Use raw red/green/yellow colors              |

---

*Last updated: 2026. Provide this file at the start of every AI session. Instruct the AI: "Follow DESIGN_SYSTEM.md for all UI work."*

