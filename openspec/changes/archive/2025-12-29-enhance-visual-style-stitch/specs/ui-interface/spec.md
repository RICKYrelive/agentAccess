# enhance-visual-style-stitch - UI Interface Spec Delta

## ADDED Requirements

### Requirement: Modern Color System

The system SHALL implement a unified color system based on Slate and Blue color palettes for consistent theming across the application.

#### Scenario: Define primary color palette
- **Given** the application needs a consistent primary color
- **When** defining Tailwind theme colors
- **Then** the system SHALL use blue-500 (#3b82f6) as primary with variants:
  - primary: #3b82f6 (blue-500)
  - primary-dark: #2563eb (blue-600)
  - primary-light: #60a5fa (blue-400)
  - Including opacity variants for hover states

#### Scenario: Define neutral color palette
- **Given** the application needs consistent neutral colors
- **When** defining Tailwind theme colors
- **Then** the system SHALL use Slate color scale:
  - canvas/background: slate-50 (#f8fafc)
  - surface: white (#ffffff)
  - border: slate-200 (#e2e8f0)
  - text-main: slate-900 (#0f172a)
  - text-muted: slate-500 (#64748b)

### Requirement: Space Grotesk Display Typography

The system SHALL use Space Grotesk font family for all headings, labels, and navigation elements to enhance brand identity.

#### Scenario: Load Space Grotesk font
- **Given** the application needs a modern display font
- **When** loading fonts in index.html
- **Then** the application MUST include Google Fonts link for Space Grotesk with weights 300-700

#### Scenario: Apply display font to headings
- **Given** Space Grotesk is loaded
- **When** styling h1-h6 elements and labels
- **Then** components MUST use `font-display` class (Space Grotesk family)

#### Scenario: Maintain readable body text
- **Given** the application has body content
- **When** styling paragraphs and descriptions
- **Then** the system MUST use system fonts or Inter for optimal readability

### Requirement: Modern Border Radius System

The system SHALL implement a consistent border radius scale for rounded elements across the application.

#### Scenario: Define border radius scale
- **Given** the application needs consistent rounding
- **When** configuring Tailwind border radius
- **Then** the configuration MUST define scale: sm(4px), md(8px), lg(12px), xl(16px), 2xl(24px)

#### Scenario: Apply appropriate border radius
- **Given** different UI elements require different rounding
- **When** styling components
- **Then** developers MUST use:
  - `rounded-lg` for cards
  - `rounded-xl` for buttons
  - `rounded-2xl` for large cards
  - `rounded-full` for icon buttons and badges

### Requirement: Enhanced Shadow System

The system SHALL implement a multi-level shadow system for depth and hierarchy.

#### Scenario: Define shadow variants
- **Given** the application needs depth indicators
- **When** configuring Tailwind box shadows
- **Then** the configuration MUST define:
  - `shadow-card`: Subtle shadow for cards (0 4px 6px -1px rgba(0,0,0,0.05))
  - `shadow-floating`: Elevated elements (0 10px 15px -3px rgba(0,0,0,0.08))
  - `shadow-glow`: Primary color glow effect (0 0 15px rgba(59,130,246,0.3))

#### Scenario: Apply appropriate shadows
- **Given** different elements need different depth levels
- **When** styling components
- **Then** components MUST use:
  - `shadow-card` for standard cards
  - `shadow-floating` for dropdowns/modals
  - `shadow-glow` for primary buttons on hover

### Requirement: Smooth Transitions and Animations

The system SHALL implement consistent transition timings and subtle animations for better UX.

#### Scenario: Define transition durations
- **Given** the application needs consistent animation timing
- **When** defining CSS variables
- **Then** the styles MUST define:
  - `--transition-fast`: 150ms
  - `--transition-base`: 200ms
  - `--transition-slow`: 300ms

#### Scenario: Apply hover lift effect
- **Given** interactive elements need hover feedback
- **When** styling cards and buttons
- **Then** the component MUST apply `.hover-lift` class for translateY(-2px) on hover

#### Scenario: Apply icon scale animation
- **Given** navigation icons need subtle hover feedback
- **When** styling icon buttons
- **Then** the component MUST apply `.icon-scale` class for scale(1.1) on hover

### Requirement: Modern Button Styling

The system SHALL update all buttons to follow the new design system with consistent styling.

#### Scenario: Style primary buttons
- **Given** a primary action button
- **When** applying button styles
- **Then** the button MUST use:
  - Background: `bg-primary`
  - Text: `text-white`
  - Padding: `px-5 py-2.5`
  - Border radius: `rounded-xl`
  - Shadow: `shadow-lg shadow-primary/25`
  - Hover: `hover:bg-primary-dark hover:-translate-y-0.5`

#### Scenario: Style secondary buttons
- **Given** a secondary action button
- **When** applying button styles
- **Then** the button MUST use:
  - Background: `bg-white`
  - Border: `border border-slate-200`
  - Text: `text-slate-900`
  - Padding: `px-5 py-2.5`
  - Border radius: `rounded-xl`
  - Hover: `hover:border-primary/50 hover:text-primary`

#### Scenario: Style icon buttons
- **Given** an icon-only button
- **When** applying button styles
- **Then** the button MUST use:
  - Size: `size-10` (40px)
  - Shape: `rounded-full`
  - Border: `border border-slate-200`
  - Hover: `hover:text-primary hover:border-primary`

### Requirement: Enhanced Card Styling

The system SHALL apply consistent card styling with subtle borders and hover effects.

#### Scenario: Style standard cards
- **Given** a content card component
- **When** applying card styles
- **Then** the card MUST use:
  - Background: `bg-white`
  - Border: `border border-slate-200`
  - Border radius: `rounded-2xl`
  - Padding: `p-6`
  - Shadow: `shadow-sm`
  - Hover: `hover:border-primary/30 hover:shadow-md`

#### Scenario: Add decorative background elements
- **Given** cards need visual interest
- **When** styling statistic/feature cards
- **Then** the card MUST include large, low-opacity icon in top-right corner

### Requirement: Updated Input Field Styling

The system SHALL modernize input fields with consistent focus states and styling.

#### Scenario: Style text inputs
- **Given** a text input field
- **When** applying input styles
- **Then** the input MUST use:
  - Background: `bg-white`
  - Border: `border border-slate-200`
  - Border radius: `rounded-lg`
  - Padding: `px-4 py-2.5`
  - Focus: `focus:border-primary focus:ring-2 focus:ring-primary/10`
  - Placeholder: `placeholder:text-slate-400`

#### Scenario: Style inputs with icons
- **Given** an input with prefix/suffix icon
- **When** applying input styles
- **Then** the component MUST position icon absolutely with `left-3 top-1/2 -translate-y-1/2` and add `pl-10` to input

### Requirement: Navigation Item Styling

The system SHALL update navigation items with consistent active and hover states.

#### Scenario: Style nav items
- **Given** a sidebar or header navigation item
- **When** applying nav styles
- **Then** the nav item MUST use:
  - Base: `px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-primary`
  - Active: `bg-primary/5 text-primary font-semibold`
  - Icon: `.material-symbols-outlined` with `.group-hover:scale-110`

#### Scenario: Style active nav items
- **Given** a navigation item is active
- **When** applying active state
- **Then** the nav item MUST use filled icon variant (`.fill` class) and different background

### Requirement: Status Badge Styling

The system SHALL implement consistent status badges with appropriate colors.

#### Scenario: Style success badge
- **Given** a success status indicator
- **When** styling the badge
- **Then** the badge MUST use:
  - Background: `bg-green-100`
  - Text: `text-green-700`
  - Shape: `rounded-full`

#### Scenario: Style warning badge
- **Given** a warning status indicator
- **When** styling the badge
- **Then** the badge MUST use:
  - Background: `bg-amber-100`
  - Text: `text-amber-700`

#### Scenario: Style error badge
- **Given** an error status indicator
- **When** styling the badge
- **Then** the badge MUST use:
  - Background: `bg-red-100`
  - Text: `text-red-700`

### Requirement: Custom Scrollbar Styling

The system SHALL apply subtle, modern scrollbar styling to all scrollable areas.

#### Scenario: Style webkit scrollbars
- **Given** the application has scrollable content areas
- **When** applying scrollbar styles
- **Then** the scrollbar MUST use:
  - Width: 6px
  - Track: transparent
  - Thumb: slate-300 (#cbd5e1) with 3px border radius
  - Thumb hover: slate-400 (#94a3b8)

### Requirement: Workflow Canvas Styling

The system SHALL style the workflow canvas editor with a modern grid pattern and consistent visual hierarchy.

#### Scenario: Style canvas background
- **Given** the workflow editor needs a canvas area
- **When** applying canvas background styles
- **Then** the canvas MUST use:
  - Background color: slate-50 (#f8fafc)
  - Dot grid pattern: radial-gradient with 1.5px dots at 24px spacing
  - Dot color: slate-300 (#cbd5e1)

#### Scenario: Style workflow nodes
- **Given** the workflow editor contains draggable nodes
- **When** applying node styles
- **Then** the node MUST use:
  - Background: `bg-white`
  - Border: `border-2` with `border-slate-200` (or `border-primary` when selected)
  - Border radius: `rounded-xl`
  - Shadow: `shadow-sm` (or `shadow-lg shadow-primary/10` when selected)
  - Ring: `ring-2 ring-primary/20` when selected
  - Hover: `hover:-translate-y-0.5 hover:shadow-md`

#### Scenario: Style node type colors
- **Given** different node types need visual distinction
- **When** applying node type color schemes
- **Then** the system MUST use:
  - Start/Input: purple-100 bg, purple-600 text, purple-500 ring
  - Web Search: cyan-100 bg, cyan-600 text, cyan-500 ring
  - Data Retrieval: blue-100 bg, blue-600 text, blue-500 ring
  - Question Rewrite: indigo-100 bg, indigo-600 text, indigo-500 ring
  - Knowledge Retrieval: orange-100 bg, orange-600 text, orange-500 ring
  - LLM Call: rose-100 bg, rose-600 text, rose-500 ring
  - Data Processing: amber-100 bg, amber-600 text, amber-500 ring
  - Condition: yellow-100 bg, yellow-600 text, yellow-500 ring
  - Code Execution: emerald-100 bg, emerald-600 text, emerald-500 ring
  - Output: teal-100 bg, teal-600 text, teal-500 ring
  - End: slate-100 bg, slate-600 text, slate-500 ring

#### Scenario: Style connection points
- **Given** nodes have input/output connection points
- **When** styling connection points
- **Then** the connection point MUST use:
  - Size: 12px (w-3 h-3)
  - Shape: `rounded-full`
  - Border: `border-2 border-white`
  - Output point: `bg-primary` with hover `hover:bg-primary-dark hover:scale-125`
  - Input point: `bg-slate-400` with hover `hover:bg-slate-500 hover:scale-125`
  - Transition: `transition-all duration-150`

#### Scenario: Style connection lines
- **Given** nodes are connected by SVG path lines
- **When** drawing connection lines
- **Then** the connection MUST use:
  - Default stroke: slate-400 (#9ca3af), width 2px
  - Selected stroke: primary (#3b82f6), width 3px
  - Active (being drawn): primary with `animate-pulse`
  - Style: `stroke-dasharray="6,4"` for dashed lines
  - Line cap: `stroke-linecap="round"`
  - Line join: `stroke-linejoin="round"`
  - Transition: `transition-all duration-200`

### Requirement: Workflow Toolbar and Controls

The system SHALL provide a modern toolbar and floating controls for the workflow editor.

#### Scenario: Style workflow toolbar
- **Given** the workflow editor has a top toolbar
- **When** styling the toolbar
- **Then** the toolbar MUST use:
  - Background: `bg-white`
  - Border: `border-b border-slate-200`
  - Padding: `px-4 py-3`
  - Shadow: `shadow-sm`
  - Icon: `material-symbols-outlined` for workflow icon
  - Stats: `text-slate-500 text-sm` for node/connection counts

#### Scenario: Style floating canvas controls
- **Given** the canvas has floating zoom/pan controls
- **When** styling floating controls
- **Then** the controls MUST use:
  - Position: `absolute top-4 left-1/2 -translate-x-1/2`
  - Background: `bg-white/90 backdrop-blur-sm`
  - Border: `border border-slate-200`
  - Border radius: `rounded-lg`
  - Shadow: `shadow-lg`
  - Buttons: `p-2 rounded-lg` with hover states
  - Icon: `material-symbols-outlined text-lg`

#### Scenario: Style mini map
- **Given** the canvas has a mini map for navigation
- **When** styling the mini map
- **Then** the mini map MUST use:
  - Position: `absolute bottom-4 right-4`
  - Size: `w-48 h-36`
  - Background: `bg-white/90 backdrop-blur-sm`
  - Border: `border border-slate-200 rounded-lg`
  - Shadow: `shadow-lg`
  - Overflow: `overflow-hidden`

#### Scenario: Style node palette items
- **Given** the canvas has a draggable node palette
- **When** styling palette items
- **Then** the item MUST use:
  - Background: `bg-slate-50`
  - Border: `border border-slate-200`
  - Border radius: `rounded-xl`
  - Padding: `p-3`
  - Cursor: `cursor-move`
  - Hover: `hover:bg-white hover:border-primary/30 hover:shadow-sm`
  - Transition: `transition-all duration-200`

## MODIFIED Requirements

### Requirement: Component Visual Consistency

The system MUST ensure all UI components follow the new visual design system while maintaining existing functionality.

#### Scenario: Update existing components without breaking functionality
- **Given** existing components with current styling
- **When** applying new design tokens
- **Then** components MUST maintain all existing props, events, and behaviors while only updating CSS classes

#### Scenario: Maintain responsive behavior
- **Given** components work on different screen sizes
- **When** applying new styles
- **Then** components MUST preserve all existing responsive breakpoints and layouts

#### Scenario: Preserve accessibility features
- **Given** components have ARIA labels and keyboard navigation
- **When** updating styles
- **Then** components MUST maintain or improve accessibility compliance
