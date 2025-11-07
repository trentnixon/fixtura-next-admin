# Folder Overview

This folder handles contact form submissions from the CMS. Displays and manages all contact form submissions in a table format with status tracking, seen/acknowledged indicators, and proper error handling.

## Files

- `page.tsx`: Contact forms dashboard page with data fetching and state management
- `components/ContactFormTable.tsx`: Table component for displaying contact form submissions
- `Tickets.md`: Development tickets and task tracking for contact form mailbox feature

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: Dashboard navigation
- Key dependencies: `src/hooks/contact-form/` for data fetching, `src/lib/services/contact-form/` for API calls

## Dependencies

- Internal:
  - `src/hooks/contact-form/useContactFormSubmissions.ts`: React Query hook for fetching submissions
  - `src/lib/services/contact-form/fetchContactFormSubmissions.ts`: API service function
  - `src/types/contact-form.ts`: TypeScript type definitions
  - `src/components/ui-library/states/`: Loading, error, and empty state components
  - `src/components/ui/table.tsx`: Table UI components
- External: Strapi CMS API for contact form submissions (`/api/contact-form/admin/all`)
