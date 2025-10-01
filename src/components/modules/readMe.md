# Folder Overview

This folder contains business logic components that combine multiple UI elements to create specific functionality for the Fixtura Admin application. These components handle complex data operations, visualization, and user interactions that go beyond basic UI primitives.

## Files

- `charts/BarChartComponent.tsx`: Reusable bar chart component with Recharts integration, customizable styling, and data visualization capabilities
- `tables/AccountTable.tsx`: Comprehensive account data table with search functionality, filtering, navigation, and interactive features

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: Dashboard pages and other business logic components
- Key dependencies: `../ui/` for base components, `../../hooks/` for data fetching, `../../types/` for type definitions

## Dependencies

- Internal:
  - `../ui/`: Base UI components (Card, Table, Button, Input)
  - `../type/`: Typography components (SectionTitle)
  - `../../hooks/`: Custom React hooks for data fetching
  - `../../types/`: TypeScript interfaces and type definitions
  - `../../lib/utils.ts`: Utility functions
- External:
  - `recharts`: Chart library for data visualization
  - `lucide-react`: Icon library for UI elements
  - `next/navigation`: Next.js routing for navigation

## Patterns

- **Data Integration**: Components integrate with custom hooks for server state management
- **Interactive Features**: Search, filtering, and navigation capabilities
- **Responsive Design**: Components adapt to different screen sizes
- **Type Safety**: Strong TypeScript integration with proper prop interfaces
- **Composition**: Components are built using composition patterns with reusable UI elements
