# Folder Overview

This folder contains the Colors showcase page, demonstrating the complete color system including semantic colors, brand colors, and additional Tailwind palettes. The showcase provides visual swatches, usage examples, and guidelines for color usage throughout the application.

## Purpose

This showcase serves as:
- **Color System Reference**: Visual display of all available colors and palettes
- **Usage Guidelines**: Best practices for when and how to use each color
- **Design System**: Demonstrates the brand color system (primary, secondary, accent)
- **Accessibility**: Shows color contrast and semantic color usage

## Components

### Color System Structure

- **Semantic Colors**: Success, Error, Warning, Info (with 50-950 scales)
- **Brand Colors**: Primary, Secondary, Accent (with 50-950 scales)
- **Additional Palettes**: Standard Tailwind color palettes

### Showcase Components

The showcase is organized into:
- `ColorSystemShowcase.tsx`: Main showcase component
- `_elements/`:
  - `ColorSwatch.tsx`: Individual color swatch display
  - `ColorPalette.tsx`: Complete palette display
  - `SemanticColorsShowcase.tsx`: Semantic color examples
  - `SemanticPalettesShowcase.tsx`: Full semantic palettes
  - `BrandColorsShowcase.tsx`: Brand color examples
  - `BrandPalettesShowcase.tsx`: Full brand palettes
  - `AdditionalPalettesShowcase.tsx`: Other Tailwind palettes
  - `UsageGuidelinesShowcase.tsx`: Color usage guidelines

## Usage

### Brand Colors

Use brand colors for:
- Primary actions and highlights: `brandPrimary-600`
- Secondary features: `brandSecondary-600`
- Accent elements: `brandAccent-600`
- Backgrounds: `brandPrimary-50`, `brandSecondary-50`, etc.

### Semantic Colors

Use semantic colors for:
- Success states: `brandSuccess-500`
- Error states: `brandError-500`
- Warning states: `brandWarning-500`
- Info states: `brandInfo-500`

## File Location

- Color definitions: `tailwind.config.ts`
- Showcase: `src/app/dashboard/ui/colors/_components/`
- Documentation: This file

## Dependencies

- `tailwind.config.ts` - Color definitions
- `@/components/scaffolding/containers` - Container components

