# Folder Overview

This folder contains typography and text styling components that provide consistent text hierarchy and styling throughout the Fixtura Admin application. These components establish the visual typography system and ensure consistent text presentation.

## Files

- `titles.tsx`: Comprehensive typography components including Title, PageTitle, Subtitle, SectionTitle, SubsectionTitle, H1-H4, Label, and ByLine with consistent styling and JSDoc documentation
- `type.tsx`: Additional type-related components and text styling utilities
- `types.ts`: Shared TypeScript types and interfaces for typography components (TypographyProps, PolymorphicTypographyProps, TextVariant, TextWeight, HeadingLevel)

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: All components and pages throughout the application
- Key dependencies: `../../lib/utils.ts` for utility functions

## Dependencies

- Internal:
  - `../../lib/utils.ts`: Utility functions (cn for class merging)
- External:
  - `react`: React component library
  - `tailwind-merge`: Tailwind CSS class merging utility

## Patterns

- **Typography Hierarchy**: Consistent text sizing and styling hierarchy
- **Class Merging**: Uses cn utility for conditional and merged CSS classes
- **Type Safety**: Strong TypeScript integration with proper prop interfaces
- **Composition**: Components accept children and className props for flexibility
- **Consistent Styling**: Standardized color scheme and font weights
- **Responsive Design**: Typography scales appropriately across screen sizes
