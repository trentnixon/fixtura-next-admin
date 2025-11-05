# Navigation Components

Reusable navigation components for page and content navigation with brand color variants and consistent styling.

## Components

### Pagination

Complete pagination system with state management and smart page number handling.

#### `Pagination`

Main wrapper component that manages pagination state via context.

**Props:**
- `currentPage: number` - Current active page (1-indexed)
- `totalPages: number` - Total number of pages
- `onPageChange: (page: number) => void` - Callback when page changes
- `variant?: "default" | "primary" | "secondary" | "accent"` - Container variant (default: "default")
- `className?: string` - Additional CSS classes
- `showPages?: number` - Number of page buttons to show (default: 5)

**Usage:**
```tsx
import { Pagination, PaginationPrevious, PaginationNext, PaginationPages } from "@/components/ui/pagination";

const [currentPage, setCurrentPage] = useState(1);
const totalPages = 10;

<Pagination variant="primary" currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}>
  <div className="flex items-center gap-2">
    <PaginationPrevious />
    <PaginationPages />
    <PaginationNext />
  </div>
</Pagination>
```

#### `PaginationPrevious`

Previous page button component. Automatically disabled when on first page.

**Props:**
- `showLabel?: boolean` - Show "Previous" text label (default: true)
- All standard button HTML attributes

**Usage:**
```tsx
<PaginationPrevious />
// Icon only
<PaginationPrevious showLabel={false} />
```

#### `PaginationNext`

Next page button component. Automatically disabled when on last page.

**Props:**
- `showLabel?: boolean` - Show "Next" text label (default: true)
- All standard button HTML attributes

**Usage:**
```tsx
<PaginationNext />
// Icon only
<PaginationNext showLabel={false} />
```

#### `PaginationPages`

Smart page number buttons component with automatic ellipsis handling.

**Props:**
- `showPages?: number` - Maximum number of page buttons to show (default: 5)
- `className?: string` - Additional CSS classes

**Features:**
- Automatically shows ellipsis when there are many pages
- Always shows first and last page
- Highlights current page
- Fully rounded buttons

**Usage:**
```tsx
<PaginationPages />
// Show more pages
<PaginationPages showPages={7} />
```

#### `PaginationPage`

Individual page number button component.

**Props:**
- `page: number` - Page number to display
- All standard button HTML attributes

**Usage:**
```tsx
<PaginationPage page={1} />
```

#### `PaginationEllipsis`

Ellipsis separator component for pagination.

**Usage:**
```tsx
<PaginationEllipsis />
```

#### `PaginationInfo`

Page information text component with multiple formats.

**Props:**
- `format?: "short" | "long"` - Format style (default: "short")
  - `"short"`: "Page 1 of 10"
  - `"long"`: "Showing 1-10 of 100 results" (requires `totalItems`)
- `totalItems?: number` - Total number of items (required for "long" format)
- `itemsPerPage?: number` - Items per page (default: 10)

**Usage:**
```tsx
// Short format
<PaginationInfo />

// Long format
<PaginationInfo format="long" totalItems={100} itemsPerPage={10} />
```

#### `PaginationContainer`

Low-level container component for custom pagination layouts. Use `Pagination` for most cases.

**Props:**
- `variant?: "default" | "primary" | "secondary" | "accent"` - Container variant
- All standard div HTML attributes

## Variants

All pagination components support brand color variants:

- **default**: Standard muted background
- **primary**: Brand primary color (`brandPrimary-50` background with `brandPrimary-200` border)
- **secondary**: Brand secondary color (`brandSecondary-50` background with `brandSecondary-200` border)
- **accent**: Brand accent color (`brandAccent-50` background with `brandAccent-200` border)

## Styling

- **Container**: Fully rounded (`rounded-full`) with padding (`p-2`)
- **Buttons**: Fully rounded (`rounded-full`) outline style
- **Active State**: Current page button uses `default` variant
- **Disabled State**: Previous/Next buttons automatically disabled at boundaries

## Examples

### Basic Pagination

```tsx
<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}>
  <div className="flex items-center gap-2">
    <PaginationPrevious />
    <PaginationPages />
    <PaginationNext />
  </div>
</Pagination>
```

### Compact Pagination

```tsx
<Pagination variant="primary" currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}>
  <div className="flex items-center gap-2">
    <PaginationPrevious showLabel={false} />
    <PaginationInfo />
    <PaginationNext showLabel={false} />
  </div>
</Pagination>
```

### Pagination with Custom Info

```tsx
<div className="flex items-center justify-between">
  <div className="text-sm text-muted-foreground">
    Showing 1-10 of 100 results
  </div>
  <Pagination variant="secondary" currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}>
    <div className="flex items-center gap-2">
      <PaginationPrevious />
      <span className="text-sm font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <PaginationNext />
    </div>
  </Pagination>
</div>
```

## Tabs

Tab navigation components with brand color variants.

### `Tabs`

Root component for tab navigation (Radix UI primitive).

### `TabsList`

Tab list container with variant support.

**Props:**
- `variant?: "default" | "primary" | "secondary" | "accent"` - Container variant (default: "default")
- All standard div HTML attributes

**Variants:**
- **default**: `bg-muted`
- **primary**: `bg-brandPrimary-50 border border-brandPrimary-200`
- **secondary**: `bg-brandSecondary-50 border border-brandSecondary-200`
- **accent**: `bg-brandAccent-50 border border-brandAccent-200`

**Styling:**
- Fully rounded (`rounded-full`)
- Padding (`p-2`)

### `TabsTrigger`

Individual tab button. Stays white with rounded-full styling.

**Props:**
- Standard Radix UI TabsTrigger props
- Automatically styled with `rounded-full`

### `TabsContent`

Tab content container.

**Usage:**
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

<Tabs defaultValue="tab1">
  <TabsList variant="primary">
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

## File Location

- Components: `src/components/ui/pagination.tsx` and `src/components/ui/tabs.tsx`
- Showcase: `src/app/dashboard/ui/navigation/_components/_elements/`
- Documentation: This file

## Dependencies

- `@/components/ui/button` - Button component for pagination buttons
- `lucide-react` - Icons (ChevronLeft, ChevronRight)
- `class-variance-authority` - Variant management
- `@radix-ui/react-tabs` - Tab primitives

