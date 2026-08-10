# Folder Overview

Feature Lab prototypes full UI flows before promoting them to production dashboard routes. Structure mirrors the Component Lab: sidebar navigation, overview landing page, and one folder per feature.

## Structure

- `layout.tsx` — sidebar layout via `_components/Navigation.tsx`
- `page.tsx` — overview with feature cards
- `page-title/` — first feature: page title variations
- `_components/` — shared feature lab UI (navigation, overview)

## Reference tokens

- Feature tokens: `feature.{feature}.{variant}` (see `page-title/_components/featureTokens.ts`)
- Type primitives: `type.{component}.{variant}` (see component lab `typeTokens.ts`)
- Shared copy UI: `labs/_components/ComponentRef.tsx`

## Features

| Route | Token prefix | Description |
| ----- | ------------ | ----------- |
| `/dashboard/labs/features/page-title` | `feature.page-title.*` | CreatePageTitle patterns and type compositions |

## Relations

- Parent: `/dashboard/labs`
- Type primitives: `/dashboard/labs/components/type`
