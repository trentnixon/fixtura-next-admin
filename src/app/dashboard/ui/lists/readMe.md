# Folder Overview

This folder contains the Lists showcase page, demonstrating various list patterns including basic lists, interactive checklists, avatar lists, action lists, timeline lists, and expandable lists. The showcase provides creative and practical examples for displaying structured data in list formats.

## Purpose

This showcase serves as:
- **List Pattern Reference**: Visual display of various list patterns
- **Usage Examples**: Code snippets showing how to build different list types
- **Interactive Examples**: Working examples of interactive lists
- **Design Patterns**: Creative ways to display list data

## Components

### List Patterns

- **Basic Lists**: Unordered and ordered lists, description lists, lists with main item and byline
- **Interactive Checklist**: Task lists with checkboxes
- **Avatar List**: User lists with avatars and badges
- **Action List**: Lists with action buttons and dropdowns
- **Timeline List**: Vertical timeline with connecting lines
- **Rich Description List**: Enhanced description lists with icons and badges
- **Notification List**: Lists with read/unread states
- **Expandable List**: Collapsible list sections

### Showcase Structure

- `ListsShowcase.tsx`: Main showcase component
- `_elements/`:
  - `CodeExample.tsx`: Shared code snippet component

## Usage

### Basic List

```tsx
<ul className="list-disc list-inside space-y-2">
  <li>First item</li>
  <li>Second item</li>
</ul>
```

### List with Main Item and Byline

```tsx
<ul className="space-y-3">
  <li className="flex flex-col gap-1">
    <span className="font-medium text-sm">Main Item</span>
    <span className="text-xs text-muted-foreground">Supporting byline</span>
  </li>
</ul>
```

### Interactive Checklist

```tsx
const [checkedItems, setCheckedItems] = useState([]);

<ul className="space-y-2">
  {tasks.map((task) => (
    <li
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer"
      onClick={() => toggleCheck(task.id)}
    >
      {checkedItems.includes(task.id) ? (
        <CheckCircle2 className="h-5 w-5 text-brandPrimary-600" />
      ) : (
        <Circle className="h-5 w-5 text-muted-foreground" />
      )}
      <span>{task.label}</span>
    </li>
  ))}
</ul>
```

## File Location

- Showcase: `src/app/dashboard/ui/lists/_components/`
- Documentation: This file

## Dependencies

- `@/components/ui/avatar` - Avatar component
- `@/components/ui/badge` - Badge component
- `@/components/ui/button` - Button component
- `@/components/ui/dropdown-menu` - Dropdown menu component
- `lucide-react` - Icons

## Best Practices

- Use semantic HTML (`ul`, `ol`, `li`, `dl`, `dt`, `dd`)
- Add keyboard navigation for interactive lists
- Include ARIA labels for screen readers
- Ensure sufficient color contrast
- Provide focus indicators for clickable items

