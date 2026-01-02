# Route D: Resource Leaders (The Leaderboards)

## Information
- **Endpoint**: `/api/renders/account-distribution` (Proposed Custom)
- **Purpose**: Identify larger accounts and global asset type distribution.

## Response Structure
Returns the Top 10 Accounts (by volume) and the total global counts for each asset category (`video`, `image`, `content`).

## Technical Rationale
Helps administrators identify "Heavy Hitters"—accounts that consume the most system resources. It also provides a global view of the product mix (Asset Type Distribution).

## Insights
- **Account Value**: Which accounts are getting the most ROI from the system.
- **Resource Allocation**: Differentiating load between Clubs vs Associations.
