# SiliconBrains — Design Implementation Notes

Source of truth: `DESIGN.md` (provided). This file maps it to code.

## CSS variables (`apps/web/styles/tokens.css`)
```css
:root {
  --color-background: #051F20;
  --color-surface: #001718;
  --color-surface-container-low: #0B2B26;
  --color-surface-container: #092324;
  --color-surface-container-high: #163832;
  --color-surface-container-highest: #235347;
  --color-on-surface: #DFF3E3;
  --color-on-surface-variant: #8EB69B;
  --color-outline: rgba(142, 182, 155, 0.16);
  --color-primary: #A9D2B6;
  --color-on-primary: #051F20;
  --color-primary-container: #8EB69B;
  --color-secondary: #9FD1C1;
  --color-error: #FFB4AB;
  --font-display: 'Plus Jakarta Sans', sans-serif;
  --radius-sm: 0.25rem;
  --radius-DEFAULT: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-full: 9999px;
}
```

## Tailwind theme extension
- Extend `colors` with the tokens above (`surface`, `surface-container`, `on-surface`, `primary`, etc.)
- Extend `fontFamily.display` = Plus Jakarta Sans (load via `next/font/google`)
- Extend `borderRadius` with the `rounded-*` scale from DESIGN.md
- Container max-width `1440px`, gutter `24px`/`16px` per breakpoint (desktop/tablet/mobile) as custom screens

## Typography scale → Tailwind classes
Map each DESIGN.md typography token (`display-xl`, `headline-lg`, `body-md`, `label-sm`, etc.) to a Tailwind utility class combo (font-size/line-height/tracking/weight) defined once in `tailwind.config.ts`, so components use `className="text-headline-lg"` rather than inline styles.

## Component build order (Phase 2)
1. Navbar (floating glass shell, blur, active-pill nav item)
2. Button (primary / secondary-outline / ghost — exact hover glow per DESIGN.md)
3. Card (base + interactive hover states)
4. Badge/Chip (default + active variant)
5. Input/Textarea/Checkbox (Contact form)
6. StatBlock (the "2+ / 100% / 0 / 48hr" style number+label blocks used on every page)
7. Accordion (FAQ)
8. ComparisonTable ("Why Discerning Teams Choose Us")
9. Footer

## Elevation & motion
- Cards: `-2px` translateY on hover, border brightens to `rgba(142,182,155,0.32)`
- Buttons: hover glow `box-shadow: 0 0 20px rgba(142,182,155,0.3)` (primary)
- No harsh drop shadows — use the tinted ambient shadow formulas from DESIGN.md exactly

## Assets
- Logo (eagle mark + wordmark) — export as SVG for navbar/footer use, provided PNG (`screen.png`) as source
- Screenshots (`*_Page.png`) are the pixel reference for each page's layout at desktop width
