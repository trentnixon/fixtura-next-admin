# Folder Overview

This folder contains the Icons showcase page, demonstrating the complete icon library with search, filtering, color customization, and size options. The showcase provides an interactive browser for discovering and using icons throughout the application.

## Purpose

This showcase serves as:
- **Icon Library Browser**: Searchable and filterable icon collection
- **Visual Reference**: Display all available icons with customization options
- **Code Generator**: Copy icon import code directly from the showcase
- **Usage Guidelines**: Best practices for icon usage

## Components

### Icon System Features

- **Search**: Search icons by name or category
- **Category Filtering**: Filter by icon category
- **Color Customization**: Preview icons in different colors
- **Size Options**: View icons at different sizes
- **Code Copy**: Copy import code for each icon

### Showcase Structure

- `IconSystemShowcase.tsx`: Main showcase component with search and filters
- `page.tsx`: Main page with PageContainer

## Usage

### Using Icons

Icons are imported from `lucide-react`:

```tsx
import { Search, User, Settings } from "lucide-react";

<Search className="h-4 w-4" />
<User className="h-5 w-5 text-brandPrimary-600" />
```

### Icon Sizes

Use consistent icon sizes:
- `h-3 w-3` (12px) - Very small (badges, inline)
- `h-4 w-4` (16px) - Small (buttons, lists)
- `h-5 w-5` (20px) - Default (most UI elements)
- `h-6 w-6` (24px) - Large (headers, cards)

### Icon Colors

- Use brand colors for primary actions
- Use semantic colors for status indicators
- Use `text-muted-foreground` for decorative icons

## File Location

- Icon library: `lucide-react` (external package)
- Showcase: `src/app/dashboard/ui/icons/_components/`
- Documentation: This file

## Dependencies

- `lucide-react` - Icon library
- `@/components/ui/input` - Search input
- `@/components/ui/button` - Filter buttons

## Best Practices

- Use consistent icon sizes within a component
- Match icon color to context (brand colors for actions)
- Provide text labels for icon-only buttons
- Use semantic icons where appropriate

