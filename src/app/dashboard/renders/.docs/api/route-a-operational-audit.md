# Route A: Operational Audit (The Master List)

## Information
- **Endpoint**: `/api/renders`
- **Purpose**: Populate the `GlobalRenderTable`.

## Request Configuration
- **Query Strategy**: Flat population with counts only.
- **Population**:
  - `scheduler.account` (fields: `FirstName`, `LastName`, `Sport`)
  - `downloads` (count only)
  - `ai_articles` (count only)
- **Sorting**: `publishedAt:desc`
- **Pagination**: Standard (e.g., 25 per page)

## Technical Rationale
This route is designed for maximum speed during high-volume auditing. By restricting the population to counts and specific fields, we ensure the master list loads quickly even with thousands of records.

## Monitoring Metrics
- **Deduction**: Identify and flag "Ghost Renders" (Complete: true, Asset Count: 0).
- **Status Visibility**: Real-time `Processing` vs `Complete` badges.
