# Folder Overview

This folder contains the Overlays showcase page, demonstrating overlay components including dialogs, sheets, tooltips, and dropdown menus. These components provide contextual interactions and information display.

## Purpose

This showcase serves as:
- **Overlay Component Reference**: Visual display of all overlay patterns
- **Usage Examples**: Code snippets showing how to use overlay components
- **Interaction Patterns**: Examples of different overlay behaviors
- **Accessibility Guidelines**: Best practices for accessible overlays

## Components

### Overlay Components

- **Dialogs**: Modal dialogs for important actions and information
- **Sheets**: Slide-out panels from screen edges
- **Tooltips**: Contextual information on hover/focus
- **Dropdown Menus**: Context menus and action menus

### Showcase Structure

- `OverlaysShowcase.tsx`: Main showcase component
- `_elements/`:
  - `DialogsShowcase.tsx`: Dialog examples
  - `SheetsShowcase.tsx`: Sheet examples
  - `TooltipsShowcase.tsx`: Tooltip examples
  - `DropdownMenusShowcase.tsx`: Dropdown menu examples
  - `ComingSoonShowcase.tsx`: Placeholder for future components
  - `UsageGuidelinesShowcase.tsx`: Overlay usage guidelines
  - `CodeExample.tsx`: Shared code snippet component

## Usage

### Dialog

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

### Tooltip

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button>Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Tooltip content</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Dropdown Menu

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Item 1</DropdownMenuItem>
    <DropdownMenuItem>Item 2</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## File Location

- Components: `src/components/ui/dialog.tsx`, `src/components/ui/sheet.tsx`, etc.
- Showcase: `src/app/dashboard/ui/overlays/_components/`
- Documentation: This file

## Dependencies

- `@/components/ui/dialog` - Dialog component
- `@/components/ui/sheet` - Sheet component
- `@/components/ui/tooltip` - Tooltip component
- `@/components/ui/dropdown-menu` - Dropdown menu component
- `@radix-ui/react-dialog` - Dialog primitives
- `@radix-ui/react-tooltip` - Tooltip primitives

## Best Practices

- Use dialogs for important actions that require user attention
- Use sheets for navigation and secondary content
- Provide keyboard navigation and escape key support
- Ensure proper focus management
- Use tooltips for additional context, not critical information
- Consider mobile touch interactions

