# Folder Overview

Subscription tiers service for fetching available subscription tiers from the Strapi API.

## Files

- `fetchSubscriptionTiers.ts`: Fetches all subscription tiers from GET /api/subscription-tiers

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: `@/hooks/subscription-tiers/useSubscriptionTiers`
- Key dependencies: `@/types/subscriptionTier`

## Dependencies

- Internal: `@/lib/axios` for HTTP client, `@/types/subscriptionTier` for type definitions
- External: Strapi CMS backend API endpoint `/api/subscription-tiers`

## Usage

The service fetches all subscription tiers from the Strapi API. The response includes:
- Tier ID
- Tier attributes (Name, Title, price, currency, isActive, isClub, etc.)

The hook `useSubscriptionTiers` provides a React Query wrapper with caching and error handling.

