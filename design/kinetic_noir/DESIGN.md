---
name: Kinetic Noir
colors:
  surface: '#1e0f12'
  surface-dim: '#1e0f12'
  surface-bright: '#473438'
  surface-container-lowest: '#180a0d'
  surface-container-low: '#27171a'
  surface-container: '#2b1b1e'
  surface-container-high: '#362529'
  surface-container-highest: '#423033'
  on-surface: '#f8dbe0'
  on-surface-variant: '#e2bdc3'
  inverse-surface: '#f8dbe0'
  inverse-on-surface: '#3d2c2f'
  outline: '#a9888e'
  outline-variant: '#5a4045'
  surface-tint: '#ffb1c1'
  primary: '#ffb1c1'
  on-primary: '#66002a'
  primary-container: '#ff4c86'
  on-primary-container: '#590024'
  inverse-primary: '#bb0054'
  secondary: '#f9abff'
  on-secondary: '#570066'
  secondary-container: '#86039c'
  on-secondary-container: '#f7a0ff'
  tertiary: '#5ce069'
  on-tertiary: '#00390d'
  tertiary-container: '#0fa739'
  on-tertiary-container: '#00320a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffd9df'
  primary-fixed-dim: '#ffb1c1'
  on-primary-fixed: '#3f0018'
  on-primary-fixed-variant: '#8f003f'
  secondary-fixed: '#ffd6fe'
  secondary-fixed-dim: '#f9abff'
  on-secondary-fixed: '#35003f'
  on-secondary-fixed-variant: '#7b008f'
  tertiary-fixed: '#79fe82'
  tertiary-fixed-dim: '#5ce069'
  on-tertiary-fixed: '#002105'
  on-tertiary-fixed-variant: '#005317'
  background: '#1e0f12'
  on-background: '#f8dbe0'
  surface-variant: '#423033'
typography:
  display:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Geist
    fontSize: 10px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 16px
  gutter: 12px
  touch-target-min: 44px
---

## Brand & Style
The design system is engineered for a high-performance, professional mobile video editing environment. It adopts a **Sleek Modernism** aesthetic, characterized by an immersive pure-black environment that allows content—the video footage—to remain the absolute focal point.

The personality is precise, cinematic, and authoritative. By utilizing high-contrast typography against an "OLED-ready" background, the UI recedes into the hardware, creating a seamless canvas for creativity. The emotional response is one of professional empowerment and technical sophistication, favoring efficiency and focus over decorative clutter.

## Colors
This design system utilizes a high-contrast dark palette optimized for professional editing.

- **Background:** Pure black (#000000) is mandatory for the main workspace to ensure zero light leakage on OLED screens and maximum focus on the viewport.
- **Primary Accent:** A vibrant pink-to-purple gradient is reserved for high-impact actions, brand moments, and active states.
- **Surfaces:** Use a subtle tier of dark grays (#121212, #1E1E1E) to define toolbars and panels, ensuring they are distinguishable from the background without breaking the immersive dark feel.
- **Status Bar:** Icons and text must remain pure white (#FFFFFF) for legibility.

## Typography
The typographic scale emphasizes hierarchy and technical clarity. 

- **Headlines:** Use **Hanken Grotesk** in Bold or Extra Bold weights. This provides a modern, impactful look that feels premium and structural.
- **Body & Technical Info:** Use **Geist**. Its monospaced-adjacent proportions make it ideal for timecodes, frame rates, and tool labels where precision and legibility are paramount.
- **Contrast:** Maintain high contrast by using pure white for primary text and mid-gray for metadata and secondary descriptions.

## Layout & Spacing
The layout follows a **Fluid Immersive** model. Since the application lacks a traditional navigation bar, it utilizes the full verticality of the screen.

- **The Editor Canvas:** Occupies the top 40-50% of the screen, pinned to the top.
- **The Timeline:** Centered vertically in the lower half, utilizing horizontal scrolling.
- **Tool Ribbons:** Floating or bottom-aligned panels that appear contextually.
- **Spacing Rhythm:** Based on a 4px grid. Standard margins are 16px to ensure content doesn't hit the screen edges, while tool groupings use tighter 8px spacing to maximize screen real estate.

## Elevation & Depth
Depth is achieved through **Tonal Layering** and **Glassmorphism**, rather than traditional shadows which can get lost in a pure black UI.

- **Level 0:** The pure black background (#000000).
- **Level 1:** Floating panels and tool containers use a slightly elevated dark gray (#121212) with a 1px subtle border (#222222).
- **Overlays:** Modals and temporary menus use a high-density background blur (Backdrop Filter) with a 60% opacity fill of #0A0A0A to maintain context while ensuring legibility.
- **Interaction:** Active tools should glow subtly with the primary gradient rather than rising in height.

## Shapes
The shape language is **Refined and Precise**. 

- **Primary Elements:** Buttons, tool icons, and timeline clips use a 0.5rem (8px) radius, providing a modern look that isn't overly "bubbly."
- **Secondary Elements:** Checkboxes and small utility toggles use a 0.25rem (4px) radius to emphasize their technical nature.
- **Visual Continuity:** All clips in the editing timeline must share the same corner radius as the primary UI buttons to create a cohesive aesthetic.

## Components
- **Primary Buttons:** Features the #FF4081 to #9C27B0 gradient. Text is centered, bold, and white.
- **Timeline Clips:** Solid dark gray blocks with a 1px border. Active clips are outlined with the primary gradient.
- **Playhead:** A vertical line using the primary gradient, topped with a rounded-triangle handle.
- **Input Fields:** Minimalist style. No background fill, just a bottom border of #333333 that turns into the primary gradient on focus.
- **Chips/Filters:** Pill-shaped with a dark gray stroke (#333333). When selected, they fill with the primary gradient.
- **Iconography:** Line-art style with a consistent 2px stroke width, always in white or secondary gray.
- **Bottom Tool Sheet:** A gesture-invoked panel that slides from the bottom, utilizing high-blur glassmorphism.