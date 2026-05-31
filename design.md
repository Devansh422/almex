# Design System — Industrial Professional Website

> Base color: `#506472` — Steel Slate  
> Aesthetic: Minimal · Sharp · Authoritative · Precision-engineered

---

## 1. Color Palette

All colors are derived from the brand base `#506472`.

### Primary Scale

| Token | Hex | Usage |
|---|---|---|
| `--color-brand` | `#506472` | Primary brand, CTA buttons, active states |
| `--color-brand-dark` | `#3a4a56` | Hover states, pressed buttons |
| `--color-brand-darker` | `#263038` | Deep accents, footer background |
| `--color-brand-light` | `#6e8494` | Secondary UI elements, icons |
| `--color-brand-pale` | `#a8bdc8` | Borders, dividers, disabled states |
| `--color-brand-ghost` | `#e4eaed` | Subtle backgrounds, table stripes |
| `--color-brand-mist` | `#f2f5f7` | Page background tint, card fills |

### Neutral Scale

| Token | Hex | Usage |
|---|---|---|
| `--color-black` | `#0d1214` | Primary text, headings |
| `--color-ink` | `#1e2a30` | Body text |
| `--color-charcoal` | `#3d4f58` | Secondary text, captions |
| `--color-steel` | `#7a9098` | Placeholder text, metadata |
| `--color-silver` | `#c4d0d6` | Horizontal rules, input borders |
| `--color-cloud` | `#e8eef1` | Card backgrounds |
| `--color-white` | `#ffffff` | Page base, navbar background |

### Semantic / Accent

| Token | Hex | Usage |
|---|---|---|
| `--color-accent` | `#b87d4b` | Warm copper — highlight, badge, stat callout |
| `--color-success` | `#3a6b52` | Confirmations, status indicators |
| `--color-warning` | `#8a6a2a` | Alerts, caution states |
| `--color-error` | `#7a3030` | Errors, destructive actions |

### Dark Mode Overrides

| Token | Value |
|---|---|
| `--color-bg` | `#0d1214` |
| `--color-surface` | `#1a2530` |
| `--color-surface-raised` | `#1e2f3a` |
| `--color-text-primary` | `#e8eef1` |
| `--color-text-secondary` | `#a8bdc8` |
| `--color-border` | `#2a3c48` |

---

## 2. Typography

Font family: **Helvetica Neue** with fallback stack.

```css
--font-primary: "Helvetica Neue", Helvetica, "Arial", sans-serif;
--font-mono: "IBM Plex Mono", "Courier New", monospace;
```

### Type Scale

| Token | Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| `--text-display` | `72px` | `1.0` | `700` | Hero headline |
| `--text-h1` | `48px` | `1.05` | `700` | Page titles |
| `--text-h2` | `36px` | `1.1` | `600` | Section headings |
| `--text-h3` | `24px` | `1.2` | `600` | Sub-section headings |
| `--text-h4` | `18px` | `1.3` | `600` | Card titles, labels |
| `--text-body-lg` | `17px` | `1.6` | `400` | Lead paragraphs |
| `--text-body` | `15px` | `1.65` | `400` | Default body text |
| `--text-small` | `13px` | `1.5` | `400` | Captions, metadata |
| `--text-label` | `11px` | `1.4` | `600` | Tags, eyebrows, badges |

### Letter Spacing

```css
--tracking-tight:   -0.03em;   /* Display, H1 */
--tracking-normal:  -0.01em;   /* H2, H3, body */
--tracking-wide:     0.08em;   /* Labels, uppercase tags */
--tracking-widest:   0.15em;   /* Eyebrow text, section markers */
```

### Rules
- Headings always use `text-transform: uppercase` for H3 and below when used as section labels
- Eyebrow labels (small caps above headings) use `--text-label` + `--tracking-widest` + `--color-brand`
- No italic usage in primary UI. Italic reserved strictly for quotes/testimonials
- Body text max-width: `68ch`

---

## 3. Spacing System

Base unit: `8px`. All spacing is a multiple of this unit.

```css
--space-1:   4px
--space-2:   8px
--space-3:   12px
--space-4:   16px
--space-5:   24px
--space-6:   32px
--space-7:   48px
--space-8:   64px
--space-9:   96px
--space-10:  128px
--space-11:  192px
--space-12:  256px
```

### Section Padding
- Section vertical padding: `--space-10` (128px) desktop / `--space-8` (64px) mobile
- Content horizontal margin: `max-width: 1280px; margin: 0 auto; padding: 0 --space-8`
- Mobile horizontal padding: `--space-5` (24px)

---

## 4. Border & Radius

Sharp corners are a core design principle. **No rounded corners on primary UI elements.**

```css
--radius-none:  0px;      /* Default — all cards, buttons, inputs */
--radius-sm:    2px;      /* Subtle softening only — tooltips, tags */
--radius-pill:  999px;    /* Badge/pill only when semantically appropriate */

--border-thin:   1px solid var(--color-silver);
--border-medium: 2px solid var(--color-brand-pale);
--border-strong: 2px solid var(--color-brand);
--border-heavy:  3px solid var(--color-brand);
```

**Rules:**
- Buttons: `border-radius: 0`
- Cards: `border-radius: 0`
- Input fields: `border-radius: 0`
- Modal dialogs: `border-radius: 0`
- The only acceptable radius is `--radius-sm` (2px) on tag/badge components

---

## 5. Elevation & Shadow

Minimal shadow use. Shadows communicate elevation, never decoration.

```css
--shadow-none:    none;
--shadow-sm:      0 1px 3px rgba(13, 18, 20, 0.08);
--shadow-md:      0 4px 12px rgba(13, 18, 20, 0.10);
--shadow-lg:      0 12px 32px rgba(13, 18, 20, 0.14);
--shadow-navbar:  0 1px 0 var(--color-silver);
```

**Rules:**
- Cards default: `--shadow-none` — use border instead: `--border-thin`
- Cards on hover: elevate to `--shadow-md`
- Floating navbar: `--shadow-navbar` (single 1px bottom line, not drop shadow)
- Modals: `--shadow-lg`
- No colored shadows

---

## 6. Navbar

The navbar floats over the page content.

```
Position:     fixed, top: 0, left: 0, right: 0
Height:       64px
Background:   rgba(255, 255, 255, 0.92) + backdrop-filter: blur(12px)
Border:       border-bottom: 1px solid var(--color-silver)
Z-index:      1000
Padding:      0 var(--space-8)
```

**Dark mode navbar:** `background: rgba(13, 18, 20, 0.92)` + same blur

**Logo:** Left-aligned, brand mark + wordmark in `--color-black`, Helvetica Neue 700  
**Nav links:** `--text-label` size, `--tracking-wide`, uppercase, `--color-charcoal` default, `--color-brand` active/hover  
**CTA button:** Filled `--color-brand`, white text, `0` border-radius, `--space-4 --space-6` padding, `--text-label`, uppercase  
**Scroll behavior:** Navbar transparent at page top, gains `background + border` on scroll (JS-triggered `.scrolled` class)

---

## 7. Grid & Layout

```css
--grid-cols:      12;
--grid-gutter:    var(--space-6);    /* 32px */
--grid-margin:    var(--space-8);    /* 64px */
--max-width:      1280px;
--content-width:  900px;             /* For centered editorial content */
```

### Column Usage Patterns
| Layout | Columns |
|---|---|
| Full bleed hero | 12 / 12 |
| Two-column content | 6 / 6 |
| Text + image | 5 / 7 or 7 / 5 |
| Three cards | 4 / 4 / 4 |
| Centered text block | col 3–10 (8 cols) |
| Stat row | 3 / 3 / 3 / 3 |

---

## 8. Component Rules

### Buttons

```
Primary:    bg --color-brand, text white, border none, radius 0
Secondary:  bg transparent, text --color-brand, border 1.5px --color-brand, radius 0
Ghost:      bg transparent, text --color-ink, border 1px --color-silver, radius 0

Height:     44px (default), 36px (small), 52px (large)
Padding:    0 var(--space-6)
Font:       --text-label, --tracking-wide, uppercase, weight 600

Hover primary:   bg --color-brand-dark
Hover secondary: bg --color-brand-ghost
Active:     translate: 0, 1px (subtle press)
Disabled:   opacity 0.4, cursor not-allowed
```

### Input Fields

```
Height:      44px
Border:      1px solid var(--color-silver)
Border-focus: 1.5px solid var(--color-brand)
Radius:      0
Padding:     0 var(--space-4)
Font:        --text-body, --color-ink
Background:  white (light) / --color-surface (dark)
Label:       --text-label, --tracking-wide, uppercase, above field, --space-2 gap
```

### Cards

```
Background:   white
Border:       1px solid var(--color-silver)
Radius:       0
Padding:      var(--space-6)
Hover:        border-color: var(--color-brand-light), shadow: --shadow-md
Transition:   border-color 150ms ease, box-shadow 150ms ease
```

### Dividers / Horizontal Rules

```css
border: none;
border-top: 1px solid var(--color-silver);
margin: var(--space-7) 0;
```

Accent divider (under section headings):
```css
width: 40px;
height: 2px;
background: var(--color-brand);
margin-top: var(--space-3);
```

### Tags / Badges

```
Font:         --text-label, --tracking-wide, uppercase
Padding:      var(--space-1) var(--space-3)
Border:       1px solid current-color
Radius:       2px (only exception to sharp-corner rule)
Colors:       brand / neutral / accent variants
```

---

## 9. Motion & Transitions

Minimal animation. Every motion must serve communication, not decoration.

```css
--duration-fast:    100ms;
--duration-base:    150ms;
--duration-slow:    250ms;
--duration-enter:   350ms;

--ease-standard:    cubic-bezier(0.4, 0, 0.2, 1);
--ease-enter:       cubic-bezier(0.0, 0, 0.2, 1);
--ease-exit:        cubic-bezier(0.4, 0, 1, 1);
```

**Allowed animations:**
- Button hover: color/background — `--duration-base`
- Card hover: border, shadow — `--duration-base`
- Navbar: background on scroll — `--duration-slow`
- Page section reveal: `opacity 0 → 1` + `translateY(16px → 0)` on scroll entry — `--duration-enter`
- Dropdown menus: `opacity + translateY(-4px → 0)` — `--duration-slow`

**Prohibited:**
- Bounce, spring, or elastic easing
- Rotation or scale transforms on UI elements
- Animated backgrounds or gradients
- Parallax effects

---

## 10. Imagery & Visual Tone

- Photography: Desaturated or muted tones. No bright lifestyle imagery
- Apply CSS filter on images: `filter: saturate(0.85) contrast(1.05)`
- Image aspect ratios: `16:9` (wide), `4:3` (standard), `1:1` (square grid)
- No stock photo clichés (handshakes, lightbulbs, etc.)
- Prefer: industrial environments, precision machinery, architecture, technical detail shots
- Icon style: Monoline, 1.5px stroke, `--color-brand` or `--color-charcoal`, NO fills
- Icon size grid: `16px`, `20px`, `24px`, `32px`

---

## 11. Accessibility

- Minimum contrast ratio: **4.5:1** for body text, **3:1** for large text/UI
- Focus rings: `outline: 2px solid var(--color-brand); outline-offset: 2px`
- No focus style removal — customize, never remove
- All interactive elements minimum touch target: `44×44px`
- Form labels always visible (no placeholder-as-label)
- Color never the sole carrier of information

---

## 12. CSS Custom Properties — Master Reference

```css
:root {
  /* Brand */
  --color-brand:          #506472;
  --color-brand-dark:     #3a4a56;
  --color-brand-darker:   #263038;
  --color-brand-light:    #6e8494;
  --color-brand-pale:     #a8bdc8;
  --color-brand-ghost:    #e4eaed;
  --color-brand-mist:     #f2f5f7;

  /* Neutrals */
  --color-black:          #0d1214;
  --color-ink:            #1e2a30;
  --color-charcoal:       #3d4f58;
  --color-steel:          #7a9098;
  --color-silver:         #c4d0d6;
  --color-cloud:          #e8eef1;
  --color-white:          #ffffff;

  /* Semantic */
  --color-accent:         #b87d4b;
  --color-success:        #3a6b52;
  --color-warning:        #8a6a2a;
  --color-error:          #7a3030;

  /* Typography */
  --font-primary:         "Helvetica Neue", Helvetica, Arial, sans-serif;
  --font-mono:            "IBM Plex Mono", "Courier New", monospace;

  --text-display:         72px;
  --text-h1:              48px;
  --text-h2:              36px;
  --text-h3:              24px;
  --text-h4:              18px;
  --text-body-lg:         17px;
  --text-body:            15px;
  --text-small:           13px;
  --text-label:           11px;

  --tracking-tight:       -0.03em;
  --tracking-normal:      -0.01em;
  --tracking-wide:         0.08em;
  --tracking-widest:       0.15em;

  /* Spacing */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  24px;
  --space-6:  32px;
  --space-7:  48px;
  --space-8:  64px;
  --space-9:  96px;
  --space-10: 128px;
  --space-11: 192px;
  --space-12: 256px;

  /* Borders */
  --radius-none: 0px;
  --radius-sm:   2px;
  --radius-pill: 999px;

  --border-thin:   1px solid var(--color-silver);
  --border-medium: 2px solid var(--color-brand-pale);
  --border-strong: 2px solid var(--color-brand);
  --border-heavy:  3px solid var(--color-brand);

  /* Shadows */
  --shadow-none: none;
  --shadow-sm:   0 1px 3px rgba(13, 18, 20, 0.08);
  --shadow-md:   0 4px 12px rgba(13, 18, 20, 0.10);
  --shadow-lg:   0 12px 32px rgba(13, 18, 20, 0.14);
  --shadow-navbar: 0 1px 0 var(--color-silver);

  /* Motion */
  --duration-fast:   100ms;
  --duration-base:   150ms;
  --duration-slow:   250ms;
  --duration-enter:  350ms;
  --ease-standard:   cubic-bezier(0.4, 0, 0.2, 1);
  --ease-enter:      cubic-bezier(0.0, 0, 0.2, 1);
  --ease-exit:       cubic-bezier(0.4, 0, 1, 1);

  /* Layout */
  --max-width:      1280px;
  --content-width:  900px;
  --grid-gutter:    32px;
  --navbar-height:  64px;
}
```

---

## 13. Design Principles (Non-Negotiable)

1. **Sharp over soft** — Zero border-radius on all primary UI. Sharpness signals precision.
2. **Restraint in color** — `--color-brand` is used purposefully. Never decoratively.
3. **Helvetica is the voice** — No mixing decorative or serif fonts in UI. Mono only for code.
4. **Even spacing everywhere** — Every spacing decision maps to the 8px scale. No arbitrary values.
5. **Borders over shadows** — Use `1px` borders to define surfaces. Shadows only for floating layers.
6. **Uppercase labels only** — Section markers and button text uppercase. Body and headings: mixed case.
7. **One accent, used sparingly** — `--color-accent` (#b87d4b copper) max once per viewport.
8. **Whitespace is structure** — Generous vertical space between sections communicates hierarchy.
9. **No gradients in UI** — Flat colors only. Gradients permitted only in hero photography overlays.
10. **Motion serves clarity** — If removing an animation doesn't hurt comprehension, remove it.