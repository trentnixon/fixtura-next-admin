# Asset Management Development Tickets

## Status Summary

- ✅ **Phase 1**: Foundation & Read Operations - **Complete**
- ✅ **Phase 2**: Create & Update Architecture - **Complete**
- 🟡 **Phase 3**: The Asset Form - **Mostly Complete** (3 relation selectors remaining)
- ✅ **Phase 4**: Integration & Interaction - **Complete**
- ✅ **Phase 5**: Delete & Cleanup - **Complete**

**Overall Progress**: Core CRUD functionality is fully operational. Remaining work: 3 optional relation selectors in Phase 3 (Subscription Package, PlayHQ Endpoint, Account Types).

---

## Phase 1: Foundation & Read Operations (Core)
*Objective: Establish data structures and display the initial list of assets.*

- [x] **Define TypeScript Types**
  - [x] Create `src/types/asset.ts` mapped to Strapi schema.
  - [x] Define Relation types (AssetCategory, PlayHqEndPoint, etc.).
- [x] **Service Layer - Fetch**
  - [x] Implement `fetchAssets` in `src/lib/services/assets/fetchAssets.ts`.
  - [x] Implement `useAssets` hook in `src/hooks/assets/useAssets.ts`.
- [x] **UI - List View**
  - [x] Create `AssetTable` component with basic columns.
  - [x] Integrate `AssetTable` into `src/app/dashboard/assets/page.tsx`.
  - [x] Add basic pagination and search.

## Phase 2: Create & Update Architecture (Mutations)
*Objective: Allow users to add and modify assets.*

- [x] **Service Layer - Mutations**
  - [x] Implement `createAsset` service.
  - [x] Implement `updateAsset` service.
  - [x] Create React Query mutations (`useCreateAsset`, `useUpdateAsset`) with cache invalidation (refetch assets on success).
- [x] **Form Schema & Validation**
  - [x] Define Zod schema for Asset creation/editing.
  - [x] Handle conditional validation if necessary.

## Phase 3: The Asset Form (UI Component)
*Objective: Build the complex form capable of handling all asset fields.*

- [x] **Scaffold Form Component** (`AssetForm.tsx`)
  - [x] Setup `react-hook-form` with Zod resolver.
  - [x] Organized form into logical sections (Basic Info, Content, Technical Details, Relations).
- [x] **Implement Form Fields**
  - [x] **Basic Inputs**: Name, CompositionID, SubTitle, Filter, ArticleFormats, Icon.
  - [x] **Enums/Selects**: Sport (Cricket, AFL, etc.), ContentType (Single, Collective).
  - [x] **Text Areas**: Description, Blurb, AssetDescription, Metadata (JSON as text area for v1).
  - [x] Form validation with Zod schema for all fields.
- [x] **Implement Relation Selectors** (Partial - 2 of 5 complete)
  - [x] Create service and hooks for relation data (`fetchAssetRelations.ts`, `useAssetRelations.ts`).
  - [x] **Completed Selectors:**
    - [x] `asset_category` - Single select with live data from `/asset-categories`
    - [x] `asset_type` - Single select with live data from `/asset-types`
  - [ ] **Remaining Selectors** (Schema support exists; UI components needed):
    - [ ] `subscription_package` - Single select (needs endpoint: `/subscription-packages`)
    - [ ] `play_hq_end_point` - Single select (needs endpoint: `/play-hq-end-points`)
    - [ ] `account_types` - Multi-select (needs endpoint: `/account-types`)

## Phase 4: Integration & Interaction
*Objective: Connect the form to the UI and handle user flows.*

- [x] **Create Flow**
  - [x] Add "Create Asset" Sheet/Drawer or Modal.
  - [x] Connect `AssetForm` to `createAsset` mutation.
- [x] **Edit Flow**
  - [x] Add "Edit" action to Table Rows.
  - [x] Populate `AssetForm` with existing data.
  - [x] Connect to `updateAsset` mutation.

## Phase 5: Delete & Cleanup
*Objective: Management and safety.*

- [x] **Delete Operations**
  - [x] Implement `deleteAsset` service and hook.
  - [x] Add "Delete" action with Confirmation Dialog to table.
- [x] **Refinement**
  - [x] Standardize Table Filters (Sport, Category).
  - [x] Error handling and success notifications (Toasts).
  - [x] Empty states and Loading states polish.
