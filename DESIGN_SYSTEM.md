# OptiMac Pro - Design System Specification
## Premium macOS System Utility

**Version:** 1.0.0  
**Last Updated:** May 14, 2026  
**Status:** Production-Ready

---

## Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Animations & Transitions](#animations--transitions)
7. [Accessibility](#accessibility)
8. [UI Patterns](#ui-patterns)

---

## Design Philosophy

**Aesthetic Direction:** Precision macOS System Utility

OptiMac Pro combines technical depth with premium visual design. Every element serves a purpose:

- **Dark Premium UI**: Deep navy backgrounds with subtle gradients
- **Electric Accents**: Cyan-to-purple gradients create visual hierarchy
- **Glassmorphism**: Subtle frosted glass effects for depth without clutter
- **Technical Typography**: JetBrains Mono for metrics and logs
- **Precision Engineering**: Every pixel intentional, every interaction purposeful

### Design Principles
1. **Clarity**: System metrics must be immediately readable
2. **Hierarchy**: Important data is prominent, secondary info recedes
3. **Efficiency**: One-click actions for common optimization tasks
4. **Trustworthiness**: Real-time data builds confidence in system health
5. **macOS Native**: Respect system conventions while adding personality

---

## Color Palette

### Primary Colors
| Name | Hex | Usage | CSS Variable |
|------|-----|-------|--------------|
| Deep Navy | `#0a0e27` | Background | `--color-bg-primary` |
| Dark Blue | `#0f1428` | Secondary BG | `--color-bg-secondary` |
| Navy Card | `#1a1f35` | Elevated Surfaces | `--color-bg-elevated` |
| Electric Blue | `#0066ff` | Primary Actions | `--color-accent-blue` |
| Cyan | `#00d9ff` | Highlights | `--color-accent-cyan` |
| Purple | `#7c3aed` | Gradients | `--color-accent-purple` |
| Orange | `#ffa500` | Warnings | `--color-accent-orange` |

### Semantic Colors
| Name | Hex | Usage |
|------|-----|-------|
| Success | `#00d084` | Positive states, healthy system |
| Warning | `#ffa500` | Caution, needs attention |
| Danger | `#ff4757` | Critical, immediate action needed |
| Info | `#0099ff` | Information, system status |

### Neutral Scale### Gradients---

## Typography

### Font Stack
```css
/* Sans Serif (UI) */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Monospace (Data/Logs) */
font-family: 'JetBrains Mono', Menlo, monospace;

/* Display (Titles) */
font-family: 'SF Pro Display', -apple-system, sans-serif;
```

### Type Scale
| Size | px | Line Height | Letter Spacing | Weight | Usage |
|------|----|----|---|---|---|
| h1 | 32 | 40 | -1px | 700 | Page titles |
| h2 | 24 | 32 | -0.5px | 700 | Section headers |
| h3 | 18 | 28 | 0px | 600 | Card titles |
| h4 | 16 | 24 | 0px | 600 | Subsection titles |
| h5 | 14 | 20 | -0.1px | 600 | Labels |
| h6 | 12 | 16 | -0.3px | 600 | Captions |
| body | 14 | 20 | -0.1px | 400 | Body text |
| small | 12 | 16 | -0.3px | 400 | Secondary text |
| code | 12 | 16 | 0px | 400 | Monospace data |

### Font Weights
- **100** thin
- **200** extralight
- **300** light
- **400** normal (default)
- **500** medium
- **600** semibold
- **700** bold

---

## Spacing & Layout

### Spacing Scale### Grid System
- **Base Unit**: 8px
- **Column Gap**: 24px
- **Row Gap**: 24px
- **Sidebar Width**: 224px (collapsed: 80px)
- **Header Height**: 80px
- **Main Content**: Full width minus sidebar

### Breakpoints---

## Components

### 1. Sidebar Navigation
**Purpose**: Primary navigation for app sections  
**States**: Default, Collapsed, Hover, Active**Navigation Items**:
- Dashboard (Home icon)
- Overview (BarChart icon)
- Performance (Gauge icon)
- Processes (Cpu icon)
- Startup Items (Zap icon)
- Services (Shield icon)
- One Click Optimize (Zap icon)
- Junk Cleaner (Trash icon)
- Memory Optimizer (Cpu icon)
- Disk Optimizer (HardDrive icon)
- Network Optimizer (Wifi icon)
- System Monitor (Gauge icon)
- App Manager (Layers icon)
- File Shredder (FileShredder icon)
- Battery Health (Battery icon)
- Preferences (Cog icon)
- Themes (Palette icon) - NEW badge

### 2. Header/Top Bar
**Purpose**: Clock, search, system info, controls  
**Position**: Fixed top, spans right of sidebar**Elements**:
- Search input with CMD+K shortcut
- Digital clock (HH:MM:SS AM/PM)
- Date display (Day, Month DD, YYYY)
- macOS version + device name
- Notification bell with badge
- Theme toggle (Sun/Moon)
- Refresh button
- Settings button

### 3. System Health Ring
**Purpose**: Visual health indicator with metric display  
**Diameter**: 224px**Status Colors**:
- Excellent: Cyan → Purple gradient
- Good: Blue → Purple gradient
- Warning: Orange → Red gradient
- Critical: Red → Orange gradient

**Button**: "One Click Optimize" 
- Gradient: blue-purple
- Padding: 12px 24px
- Hover: scale 105%

### 4. Stat Cards
**Purpose**: Real-time metric display with sparklines  
**Grid**: 3 columns, auto rows**Components**:
- **Header**: Icon (32px gradient badge) + Title + Subtitle
- **Value**: 32px font, monospace, bold
- **Unit**: 14px, secondary
- **Sparkline**: SVG path, 100px × 40px, gradient fill
- **Footer**: Usage bar with percentage

**Sparkline Details**:### 5. Network Activity Chart
**Purpose**: Real-time multi-line activity graph  
**Height**: 280px minimum**Data Series** (4 lines):
| Series | Color | Gradient | Shadow |
|--------|-------|----------|--------|
| CPU | #0099ff | blue gradient | drop-shadow(0 0 4px) |
| Memory | #a855f7 | purple gradient | drop-shadow(0 0 4px) |
| Disk | #ffa500 | orange gradient | drop-shadow(0 0 4px) |
| Network | #00d084 | green gradient | drop-shadow(0 0 4px) |

### 6. Top Processes Table
**Purpose**: List running processes by resource usage  
**Height**: Auto-scroll### 7. Quick Actions Panel
**Purpose**: One-click optimization shortcuts  
**Width**: 100%**Actions**:
1. Clean Junk Files (Trash, Cyan)
2. Free Up Memory (Zap, Purple)
3. Optimize Storage (HardDrive, Orange)
4. Run Diagnostics (Stethoscope, Green)

### 8. Anomalies & Suggestions
**Purpose**: System alerts and improvement recommendations  
**Layout**: 2-column grid**Anomaly Card**:**Suggestion Card**:---

## Animations & Transitions

### Timing Functions
```css
ease-smooth: cubic-bezier(0.4, 0, 0.2, 1)  /* 200ms default */
ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)  /* 300ms bouncy */
```

### Duration Scale### Keyframe Animations
```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 217, 255, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(0, 217, 255, 0); }
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
```

### Component Animations
| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Stat Cards | Hover scale + shadow | 200ms | ease-smooth |
| Active Nav Item | Gradient fade-in | 200ms | ease-smooth |
| Health Ring | Stroke dash-offset | 2s | ease-spring |
| Charts | Line draw + glow | 300ms | ease-smooth |
| Buttons | Scale on click | 150ms | ease-smooth |
| Modals | Fade + scale | 300ms | ease-spring |
| Notifications | Pulse glow | 2s | infinite |

---

## Accessibility

### Focus States
```css
:focus-visible {
  outline: 2px solid var(--color-accent-blue);
  outline-offset: 2px;
}
```

### Color Contrast
- Text on bg: WCAG AAA (≥7:1)
- Interactive elements: WCAG AA (≥4.5:1)
- Icons: Sized ≥18px for readability

### Keyboard Navigation
- Tab order: Logical left-to-right, top-to-bottom
- Escape key: Close modals/popovers
- Enter/Space: Activate buttons
- Arrow keys: Navigate within lists/tabs

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Screen Reader Support
- Semantic HTML: `<button>`, `<nav>`, `<main>`, `<section>`
- ARIA labels for icons: `aria-label="Refresh"`
- Status updates: `aria-live="polite"` for real-time data
- Form labels: Associated with inputs

---

## UI Patterns

### Loading State### Empty State### Error State### Success State### Disabled State---

## File Structure---

## CSS Variables Reference

```css
/* Colors */
--color-bg-primary: #0a0e27;
--color-bg-secondary: #0f1428;
--color-bg-tertiary: #131829;
--color-bg-elevated: #1a1f35;
--color-text-primary: #e5e7eb;
--color-text-secondary: #9ca3af;
--color-text-tertiary: #6b7280;
--color-accent-cyan: #00d9ff;
--color-accent-purple: #7c3aed;
--color-accent-blue: #0066ff;
--color-success: #00d084;
--color-warning: #ffa500;
--color-danger: #ff4757;

/* Shadows */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-glass: 0 8px 32px 0 rgba(31, 38, 135, 0.37);

/* Fonts */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', Menlo, monospace;

/* Spacing */
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 24px;

/* Radius */
--radius-md: 8px;
--radius-lg: 12px;

/* Transitions */
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | May 14, 2026 | Initial release - Production ready |

---

**Design System Created with ❤️ for OptiMac Pro**
