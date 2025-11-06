# Folder Overview

This folder contains the Utilities showcase page, demonstrating utility components including copy to clipboard, time formatting, currency formatting, number formatting, and search components. These utilities provide common functionality for data display and user interactions.

## Purpose

This showcase serves as:
- **Utility Reference**: Visual display of all utility patterns
- **Usage Examples**: Code snippets showing how to use utilities
- **Implementation Guide**: Complete code examples for utility functions
- **Best Practices**: Guidelines for using utilities effectively

## Components

### Utility Components

- **Copy to Clipboard**: Copy functionality with visual feedback
  - Copy buttons, inline copy, copy input fields
- **Time Formatting**: Relative time, formatted dates, time display
  - "Time ago" calculations, locale-aware date formatting
- **Currency Formatting**: Currency display with locale support
  - Multiple currency formats, amount variations
- **Number Formatting**: Large numbers, percentages, file sizes
  - Compact notation, percentage formatting, file size conversion
- **Search Components**: Search inputs with filters and results
  - Basic search, search with button, live results

### Showcase Structure

- `UtilitiesShowcase.tsx`: Main showcase component
- `_elements/`:
  - `CopyToClipboardShowcase.tsx`: Copy functionality examples
  - `TimeFormattingShowcase.tsx`: Time formatting examples
  - `CurrencyFormattingShowcase.tsx`: Currency formatting examples
  - `NumberFormattingShowcase.tsx`: Number formatting examples
  - `SearchComponentsShowcase.tsx`: Search component examples
  - `UsageGuidelinesShowcase.tsx`: Usage guidelines
  - `CodeExample.tsx`: Shared code snippet component

## Usage

### Copy to Clipboard

```tsx
const [copied, setCopied] = useState(false);

const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};

<Button onClick={() => handleCopy("text to copy")}>
  {copied ? <Check /> : <Copy />}
</Button>
```

### Time Formatting

```tsx
const formatRelativeTime = (date: Date): string => {
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  // ... calculation logic
  return "2 hours ago";
};

<span>{formatRelativeTime(date)}</span>
```

### Currency Formatting

```tsx
const formatCurrency = (amount: number, currency: string = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

<span>{formatCurrency(1234.56, "USD")}</span>
```

## File Location

- Showcase: `src/app/dashboard/ui/utilities/_components/`
- Documentation: This file

## Dependencies

- `navigator.clipboard` - Browser clipboard API
- `Intl.NumberFormat` - JavaScript internationalization
- `@/components/ui/input` - Search input
- `@/components/ui/button` - Copy buttons
- `lucide-react` - Icons

## Best Practices

- Always provide visual feedback for copy actions
- Use locale-aware formatting for dates and currency
- Consider user&apos;s timezone for time display
- Debounce search input for performance
- Handle errors gracefully (clipboard API may fail)
- Use consistent formatting across similar data types

