# Folder Overview

This folder contains the Tables showcase page, demonstrating table components with various features including pagination, search, filtering, and sorting. The showcase provides comprehensive examples for displaying structured data in tables.

## Purpose

This showcase serves as:
- **Table Component Reference**: Visual display of all table patterns
- **Usage Examples**: Code snippets showing how to build tables
- **Advanced Patterns**: Examples with search, filtering, sorting, pagination
- **Best Practices**: Guidelines for table design and accessibility

## Components

### Table Components

- **Basic Tables**: Standard table structure with headers, body, footer
- **Table with Caption**: Tables with descriptive captions
- **Table with Footer**: Tables with footer rows for totals/summaries
- **Table with Pagination**: Tables with reusable pagination component
- **Advanced Tables**: Tables with search, filtering, sorting, and pagination

### Showcase Structure

- `TablesShowcase.tsx`: Main showcase component
- `_elements/`:
  - `CodeExample.tsx`: Shared code snippet component

## Usage

### Basic Table

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Table with Pagination

```tsx
import {
  Pagination,
  PaginationPrevious,
  PaginationNext,
  PaginationPages,
  PaginationInfo,
} from "@/components/ui/pagination";

// Use with pagination state and data slicing
```

### Advanced Table Features

The showcase includes complete examples of:
- Search functionality
- Role and status filtering
- Column sorting with visual indicators
- Integrated pagination
- Results count display

## File Location

- Components: `src/components/ui/table.tsx` and `src/components/ui/pagination.tsx`
- Showcase: `src/app/dashboard/ui/tables/_components/`
- Documentation: This file

## Dependencies

- `@/components/ui/table` - Table components
- `@/components/ui/pagination` - Pagination components
- `@/components/ui/input` - Search input
- `@/components/ui/select` - Filter dropdowns
- `@/components/ui/button` - Action buttons
- `@/components/ui/badge` - Status badges

## Best Practices

- Always include TableHeader for accessibility
- Use TableFooter for totals and summaries
- Use TableCaption for table descriptions
- Consider pagination for large datasets
- Provide search and filtering for complex data
- Ensure proper keyboard navigation
- Use semantic HTML table elements

