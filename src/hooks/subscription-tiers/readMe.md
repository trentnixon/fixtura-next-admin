# Folder Overview

Subscription tiers hooks for fetching available subscription tiers in React components.

## Files

- `useSubscriptionTiers.ts`: React Query hook for fetching all subscription tiers from the Strapi API

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumes: `@/lib/services/subscription-tiers/fetchSubscriptionTiers`
- Consumed by: Invoice creation forms, order management components

## Dependencies

- Internal: `@/lib/services/subscription-tiers/fetchSubscriptionTiers`
- External: `@tanstack/react-query` for data fetching and caching

## Usage

```tsx
import { useSubscriptionTiers } from "@/hooks/subscription-tiers/useSubscriptionTiers";

function MyComponent() {
  const { data, isLoading, error } = useSubscriptionTiers();

  // Transform tiers for dropdown
  const tiers = data?.data
    ?.filter((tier) => tier.attributes?.isActive !== false)
    .map((tier) => ({
      id: tier.id,
      name: tier.attributes?.Name || tier.attributes?.Title,
    }));
}
```

## Caching

- Cache key: `["subscription-tiers"]`
- Stale time: 10 minutes (subscription tiers don't change frequently)
- Retry: 3 attempts with exponential backoff
