# Folder Overview

This folder contains the Actions & Controls showcase page, demonstrating button components and their various configurations. The showcase provides interactive examples, code snippets, and usage guidelines for all button variants, sizes, states, and patterns.

## Purpose

This showcase serves as:
- **Component Documentation**: Visual reference for all button variants and configurations
- **Usage Examples**: Code snippets showing how to use buttons in different contexts
- **Design System Reference**: Demonstrates the brand color system and button styling patterns
- **Interactive Testing**: Live examples for testing button behavior and appearance

## Structure

```
actions/
├── page.tsx                          # Main showcase page
├── _components/
│   ├── ButtonShowcase.tsx           # Main showcase component that composes all sub-showcases
│   └── _elements/
│       ├── ButtonVariantsShowcase.tsx    # Brand color variants (primary, secondary, accent)
│       ├── ButtonSizesShowcase.tsx       # Size variations (sm, default, lg, icon)
│       ├── ButtonIconsShowcase.tsx       # Buttons with icons (before, after, icon-only)
│       ├── ButtonStatesShowcase.tsx      # Button states (disabled, loading, success)
│       ├── ButtonGroupsShowcase.tsx      # Grouped buttons examples
│       ├── ButtonFullWidthShowcase.tsx   # Full-width button examples
│       ├── ButtonUsageGuidelinesShowcase.tsx  # Usage guidelines and best practices
│       └── CodeExample.tsx                # Shared code snippet component
```

## Button Component

The Button component is located at `src/components/ui/button.tsx` and is built using:
- **Radix UI Slot**: For composition patterns (`asChild` prop)
- **Class Variance Authority (CVA)**: For variant management
- **Tailwind CSS**: For styling with brand colors

### Component Definition

```tsx
import { Button } from "@/components/ui/button";

<Button variant="primary" size="default">Click Me</Button>
```

## Button Variants

The showcase focuses on three brand color variants, all styled with outline-style borders and full rounded corners:

### Primary Variant (`variant="primary"`)
- **Color**: Slate (`brandPrimary-600`)
- **Style**: Outline with border, transparent background, fills on hover
- **Use Case**: Main brand color for primary actions and main CTAs
- **Styling**: `rounded-full border border-brandPrimary-600 bg-background text-brandPrimary-600 hover:bg-brandPrimary-600 hover:text-white`

### Secondary Variant (`variant="secondary"`)
- **Color**: Blue (`brandSecondary-600`)
- **Style**: Outline with border, transparent background, fills on hover
- **Use Case**: Secondary brand color for supporting actions
- **Styling**: `rounded-full border border-brandSecondary-600 bg-background text-brandSecondary-600 hover:bg-brandSecondary-600 hover:text-white`

### Accent Variant (`variant="accent"`)
- **Color**: Orange (`brandAccent-600`)
- **Style**: Outline with border, transparent background, fills on hover
- **Use Case**: Accent brand color for highlights and emphasis
- **Styling**: `rounded-full border border-brandAccent-600 bg-background text-brandAccent-600 hover:bg-brandAccent-600 hover:text-white`

## Button Sizes

All variants support four size options:

- **Small** (`size="sm"`): `h-8 px-3 text-xs` - Compact spaces, dense interfaces
- **Default** (`size="default"`): `h-9 px-4 py-2` - Standard use cases
- **Large** (`size="lg"`): `h-10 px-8` - Primary CTAs, hero sections
- **Icon** (`size="icon"`): `h-9 w-9` - Icon-only buttons, toolbars

## Button Features

### Icons
- **Icon Before Text**: Icons positioned before button text with `mr-2` spacing
- **Icon After Text**: Icons positioned after button text with `ml-2` spacing
- **Icon-Only**: Buttons with only icons (use `size="icon"`)

### States
- **Default**: Normal interactive state
- **Disabled**: Uses `disabled` prop, shows reduced opacity
- **Loading**: Disabled state with spinner icon (`Loader2` from lucide-react)
- **Success**: Custom styling with success colors (can use `brandSuccess-600`)

### Patterns
- **Button Groups**: Horizontal groups of related buttons
- **Full Width**: Buttons spanning full container width (`className="w-full"`)
- **Grouped Actions**: Buttons grouped together for related actions

## Usage Examples

### Basic Usage

```tsx
import { Button } from "@/components/ui/button";

// Primary button
<Button variant="primary">Primary Action</Button>

// Secondary button
<Button variant="secondary">Secondary Action</Button>

// Accent button
<Button variant="accent">Highlight Action</Button>
```

### With Icons

```tsx
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight } from "lucide-react";

// Icon before text
<Button variant="primary">
  <Plus className="h-4 w-4 mr-2" />
  Add New
</Button>

// Icon after text
<Button variant="secondary">
  Continue
  <ArrowRight className="h-4 w-4 ml-2" />
</Button>

// Icon-only button
<Button variant="accent" size="icon">
  <Plus className="h-4 w-4" />
</Button>
```

### Different Sizes

```tsx
<Button variant="primary" size="sm">Small</Button>
<Button variant="primary" size="default">Default</Button>
<Button variant="primary" size="lg">Large</Button>
```

### Button States

```tsx
// Disabled
<Button variant="primary" disabled>Disabled</Button>

// Loading
<Button variant="primary" disabled>
  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
  Loading...
</Button>
```

### Button Groups

```tsx
<div className="flex gap-0 border rounded-md overflow-hidden">
  <Button variant="primary" className="rounded-none border-0 border-r">
    Edit
  </Button>
  <Button variant="secondary" className="rounded-none border-0 border-r">
    Export
  </Button>
  <Button variant="accent" className="rounded-none border-0">
    Delete
  </Button>
</div>
```

### Full Width Buttons

```tsx
<Button variant="primary" className="w-full">
  Full Width Button
</Button>
```

## Showcase Components

Each showcase component demonstrates a specific aspect of buttons:

1. **ButtonVariantsShowcase**: Shows all three brand color variants
2. **ButtonSizesShowcase**: Demonstrates size variations across all variants
3. **ButtonIconsShowcase**: Examples of icons with buttons (before, after, icon-only)
4. **ButtonStatesShowcase**: Disabled, loading, and success states
5. **ButtonGroupsShowcase**: Horizontal button groups and grouped actions
6. **ButtonFullWidthShowcase**: Full-width button examples
7. **ButtonUsageGuidelinesShowcase**: Best practices and usage guidelines

## Container Structure

The showcase uses a consistent container hierarchy:

- **PageContainer**: Top-level wrapper (`page.tsx`)
- **SectionContainer**: Groups related examples (`_elements` components)
- **ElementContainer**: Wraps individual examples with optional title/subtitle
- **CodeExample**: Shared component for displaying code snippets with copy functionality

## Relations

- **Parent folder**: [../readMe.md](../readMe.md)
- **Button Component**: `../../../../components/ui/button.tsx`
- **Container Components**: `../../../../components/scaffolding/containers/`
- **Typography Components**: `../../../../components/type/titles.tsx`
- **Brand Colors**: Defined in `tailwind.config.ts` (`brandPrimary`, `brandSecondary`, `brandAccent`)

## Dependencies

- **Internal**:
  - `@/components/ui/button`: Button component
  - `@/components/scaffolding/containers`: PageContainer, SectionContainer, ElementContainer
  - `@/components/type/titles`: Typography components for titles
- **External**:
  - `lucide-react`: Icon library for button icons
  - `class-variance-authority`: Variant management
  - `@radix-ui/react-slot`: Composition pattern support

## Best Practices

1. **Variant Selection**: Use `primary` for main actions, `secondary` for supporting actions, `accent` for highlights
2. **Size Consistency**: Use `default` size for most cases, `sm` for dense interfaces, `lg` for hero sections
3. **Icons**: Always add spacing (`mr-2` or `ml-2`) between icons and text
4. **States**: Provide clear feedback for user actions (disabled, loading, success)
5. **Accessibility**: Always provide descriptive button labels, use `aria-label` for icon-only buttons
6. **Grouping**: Group related actions together visually

## Design System Integration

Buttons are integrated with the brand color system:
- **Primary**: Uses `brandPrimary-600` (slate)
- **Secondary**: Uses `brandSecondary-600` (blue)
- **Accent**: Uses `brandAccent-600` (orange)

All variants use the same outline-style pattern with full rounded corners (`rounded-full`) for visual consistency.

