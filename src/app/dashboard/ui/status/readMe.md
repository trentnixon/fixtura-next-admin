# Folder Overview

This folder contains the Status showcase page, demonstrating status components including badges, avatars, and status indicators. These components help communicate state, status, and user information throughout the application.

## Purpose

This showcase serves as:
- **Status Component Reference**: Visual display of all status patterns
- **Usage Examples**: Code snippets showing how to use status components
- **Design System**: Demonstrates brand color integration for status
- **Accessibility**: Best practices for status indicators

## Components

### Status Components

- **Badges**: Status badges with semantic and brand color variants
  - Variants: `default`, `destructive`, `secondary`, `outline`, `primary`, `secondary`, `accent`
  - Features: Fully rounded options, brand color integration
- **Avatars**: User avatars with status indicators
  - Features: Fallback initials, status dots, size variations
- **Status Indicators**: Dots, pulsing indicators, icon indicators

### Showcase Structure

- `StatusShowcase.tsx`: Main showcase component
- `_elements/`:
  - `StatusBadgesShowcase.tsx`: Status badge examples
  - `BaseBadgeShowcase.tsx`: Base badge examples with brand colors
  - `AvatarsShowcase.tsx`: Avatar examples
  - `StatusIndicatorsShowcase.tsx`: Status indicator examples
  - `UsageGuidelinesShowcase.tsx`: Usage guidelines
  - `CodeExample.tsx`: Shared code snippet component

## Usage

### Badges

```tsx
import { Badge } from "@/components/ui/badge";

<Badge variant="primary">Primary Badge</Badge>
<Badge variant="secondary">Secondary Badge</Badge>
<Badge variant="accent">Accent Badge</Badge>
<Badge className="bg-success-500 text-white border-0">Success</Badge>
```

### Avatars

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

### Status Indicators

```tsx
<div className="relative">
  <Avatar>
    <AvatarFallback>JD</AvatarFallback>
  </Avatar>
  <span className="absolute bottom-0 right-0 h-3 w-3 bg-success-500 rounded-full border-2 border-white" />
</div>
```

## File Location

- Components: `src/components/ui/badge.tsx` and `src/components/ui/avatar.tsx`
- Showcase: `src/app/dashboard/ui/status/_components/`
- Documentation: This file

## Dependencies

- `@/components/ui/badge` - Badge component
- `@/components/ui/avatar` - Avatar component
- `@radix-ui/react-avatar` - Avatar primitives
- Tailwind brand colors for theming

## Best Practices

- Use semantic colors for status (success, error, warning)
- Use brand colors for categorization
- Ensure sufficient color contrast
- Provide text labels for status indicators
- Use consistent badge sizes

