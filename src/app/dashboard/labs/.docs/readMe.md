# Folder Overview

Admin experimentation hub at `/dashboard/labs` for components, data-fetch sandboxes, route mechanics, and feature prototypes.

## Files

- `layout.tsx`: Pass-through layout (no nested shell)
- `page.tsx`: Labs hub overview
- `_components/LabsOverview.tsx`: Hub card grid
- `components/`: Component Lab (design system showcase, moved from `dashboard/ui`)
- `data-fetch/`: Data Fetch Lab (scraper test pages)
- `routes/`: Route Lab (App Router experiments)
- `features/`: Feature Lab (prototype flows)

## Child Modules

- `./components/readMe.md`
- `./data-fetch/.docs/` (when present)

## Relations

- Parent: `../readMe.md`
- Consumed by: App sidebar Labs section
- Key dependencies: `../../../../components/`, `../../../../hooks/`
