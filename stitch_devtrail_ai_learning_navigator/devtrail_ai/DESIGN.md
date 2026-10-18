---
name: DevTrail AI
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464555'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#684000'
  on-tertiary: '#ffffff'
  tertiary-container: '#885500'
  on-tertiary-container: '#ffd4a4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 20px
  label-code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system embodies a modern, high-craft developer education environment tailored for learners navigating structured web engineering curricula. It communicates engineering rigor, structural clarity, and encouraging momentum.

### Brand Personality & Target Audience
- **Target Audience:** From motivated career switchers to experienced engineers filling gaps, targeting users who value structured mastery over passive video consumption.
- **Tone & Mood:** Methodical, focused, empowering, and lucid. Interfaces prioritize reducing cognitive overload while conveying computational depth.
- **Design Style:** Modern Technical Minimalism infused with subtle tactile feedback. The aesthetic pairs balanced whitespace and structural grid alignment with crisp borders, translucent telemetry overlays, and precise code-oriented ergonomics. Visual graph-based roadmaps, diagnostic milestones, and interactive terminals sit naturally on light, slate-tinted surfaces.

## Colors

The palette balances clinical precision with purposeful semantic cues, optimized for extended reading sessions and interactive coding environments.

### Palette Architecture
- **Primary (`#4f46e5` - Electric Indigo):** Drives primary actions, active interactive roadmap nodes, execution triggers, and focus highlights. Use `#4338ca` for hover states and `#eef2ff` for subtle tinted active containers.
- **Secondary (`#0d9488` - Crisp Teal):** Reserved for validation, completed curriculum tracks, mastered competencies, and successful test telemetry. Accessible surface tint is `#f0fdfa`.
- **Tertiary (`#f59e0b` - Warning Amber):** Denotes in-progress nodes, diagnostic bottlenecks, attention alerts, and recommended prerequisite bridges.
- **Neutral (`#0f172a` - Deep Navy Slate):** Primary text and high-contrast structural icons. Secondary muted text uses `#64748b` (Slate 500), subtle borders use `#e2e8f0` (Slate 200), and card canvas defaults to `#ffffff` over a base canvas of `#f8fafc` (Slate 50).

### Semantic Rules
- Terminal and code execution consoles retain dark navy backgrounds (`#090d16`) with high-contrast foreground syntax tokens to establish clear sandbox boundaries.
- Interactive states must maintain at least a 4.5:1 contrast ratio against their respective light containers.

## Typography

The typography system relies on three complementary typefaces:
- **Plus Jakarta Sans** delivers warmth, structure, and geometric clarity across section titles, dashboard headings, and module titles.
- **Inter** ensures distraction-free readability across dense instructional texts, architectural breakdowns, and interactive prompts.
- **JetBrains Mono** powers syntax blocks, terminal interactions, test assertions, time-complexity tags, and telemetry metrics.

### Hierarchy & Rules
- Headings use negative letter spacing (`-0.01em` to `-0.02em`) to maintain tightness in editorial and dashboard contexts.
- Code snippets inside prose must inherit `label-code-md` styling within subtle light slate badges (`#f1f5f9`).
- Category trackers, module indices, and roadmap chapter letters (e.g., "CHAPTER A") require `label-caps` in uppercase styling with Slate 500 coloring.

## Layout & Spacing

The layout model uses a responsive 12-column grid system paired with strict 8pt base spacing increments for components.

### Grid Breakpoints & Reflow
- **Desktop (>= 1280px):** 12 columns, 32px (`margin`), 24px (`gutter`). Allows three-column split views: Navigation Graph / Lesson Studio / Live Laboratory Console.
- **Tablet (768px - 1279px):** 8 columns, 24px margins, 16px gutters. Laboratory consoles dock into bottom sheets or collapsible tabs beside lesson content.
- **Mobile (< 768px):** 4 columns, 16px (`margin-sm`), 16px (`gutter-sm`). Linearized roadmap journey with horizontal panning milestone rails and stacked code outputs.

### Layout Philosophy
Roadmap graphs flow top-to-bottom or left-to-right along anchored spine vectors. Lesson frames maintain an optimal reading line length of 65–75 characters before splitting into accompanying interactive telemetry and terminal columns.

## Elevation & Depth

Visual depth is achieved through low-contrast slate outlines combined with soft, daylight-inspired neutral shadows. Elements remain lightweight and tactile without harsh physical drop-offs.

### Depth Hierarchy
- **Level 0 (Canvas Base):** Background layer at `#f8fafc`. Flat, non-elevated.
- **Level 1 (Card & Section Containers):** Pure white `#ffffff` surface, bounded by a 1px border of `#e2e8f0`, supported by a subtle shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`.
- **Level 2 (Active Milestone Nodes & Hovered Modules):** Lifted surface with border `#cbd5e1`, supported by `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
- **Level 3 (Diagnostic Drawers, Modals & Floating Toolbars):** Elevated overlay at `#ffffff` with `0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.
- **Code Consoles:** Inset dark surfaces (`#090d16`) with an interior edge ring (`inset 0 0 0 1px rgba(255, 255, 255, 0.08)`) to maintain distinct terminal boundaries against the light canvas.

## Shapes

The design system adopts a balanced roundedness configuration (`roundedness: 2`, 8px default radius). This provides a modern, approachable feel while preserving the architectural discipline expected of developer tooling.

### Radii Application
- **Standard UI Elements (`0.5rem` / 8px):** Buttons, text fields, node status badges, tab triggers, and algorithm control toggles.
- **Surfaces & Cards (`1rem` / 16px):** Lesson cards, laboratory containers, telemetry summary panels, and modal shells.
- **Milestone Nodes (`9999px` / Full Pill):** Progress indicator tags, roadmap chapter step markers, and status indicators.

## Components

### Buttons
- **Primary:** Background `#4f46e5`, foreground `#ffffff`, border radius `0.5rem`, padding `0.5rem 1rem`. Hover state transitions to `#4338ca` with active depression transform (`scale(0.99)`).
- **Secondary / Outline:** Background `#ffffff`, border `1px solid #e2e8f0`, text `#0f172a`. Hover state applies `#f8fafc` background and `#cbd5e1` border.
- **Ghost:** Background transparent, text `#64748b`. Hover state applies `#f1f5f9` and text `#0f172a`.
- **Execution / Action:** Background `#0d9488`, foreground `#ffffff` for "Run Tests" or "Commit Capstone".

### Interactive Roadmap Nodes (A-to-G Chapters)
- Nodes present a circular or rounded rectangular card containing chapter letter badge (`label-caps`), module title, and completion pill.
- **Completed:** Teal ring (`#0d9488`), surface `#f0fdfa`, checkmark icon.
- **In-Progress:** Indigo ring (`#4f46e5`), soft glow, pulsing progression bead.
- **Diagnostic / Prerequisite Alert:** Amber border (`#f59e0b`), surface `#fffbeb`.

### Chips & Telemetry Tags
- **Completed Chip:** Background `#f0fdfa`, text `#0f766e`, border `1px solid #ccfbf1`.
- **Prerequisite Chip:** Background `#fffbeb`, text `#b45309`, border `1px solid #fef3c7`.
- **Syntax / Code Tag:** Background `#f1f5f9`, text `#0f172a`, font family `JetBrains Mono`.

### Form Controls & Code Inputs
- **Input Fields:** Background `#ffffff`, border `1px solid #cbd5e1`, text `#0f172a`. Focus state applies an Indigo outline ring (`0 0 0 3px rgba(79, 70, 229, 0.15)`) with border `#4f46e5`.
- **Checkboxes & Radios:** 18px dimensions, 4px corner radius for checkboxes, full circle for radios. Active checkmark and fill render in `#4f46e5`.

### Algorithm Laboratory Console
- Monospace output frame featuring an embedded header bar containing tab controls, execution time stats (e.g., `42ms`), and memory consumption flags.
- Syntax highlighting uses accessible tokens calibrated against `#090d16`.