# Integration Example: Adding Stats & Charts to Clubs Table

## Example: Enhanced ClubsTable.tsx

Here's how to integrate the new `AccountStats` component and enhanced subscription badges:

```typescript
"use client";

import { useAccountsQuery } from "@/hooks/accounts/useAccountsQuery";
import { AccountTable } from "@/components/modules/tables/AccountTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountStats from "@/app/dashboard/accounts/components/AccountStats";
import ClubEmails from "./clubEmails";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";

export default function DisplayClubsTable() {
  const { data, isLoading, isError, error, refetch } = useAccountsQuery();

  if (isLoading) {
    return <LoadingState variant="default" />;
  }

  if (isError) {
    return (
      <ErrorState
        error={
          error instanceof Error ? error : new Error("Failed to load clubs")
        }
        onRetry={refetch}
        variant="default"
      />
    );
  }

  const { active: activeClubs, inactive: inactiveClubs } = data!.clubs;
  const allClubs = [...activeClubs, ...inactiveClubs];

  return (
    <>
      {/* Stats Cards & Charts */}
      <SectionContainer
        title="Club Statistics"
        description="Overview of club accounts and subscription status"
      >
        <AccountStats accounts={allClubs} title="Club Accounts" />
      </SectionContainer>

      {/* Active Accounts Table */}
      <Tabs defaultValue="active">
        <TabsList variant="secondary" className="mb-4">
          <TabsTrigger value="active">
            Active Subscriptions ({activeClubs.length})
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Inactive Subscriptions ({inactiveClubs.length})
          </TabsTrigger>
        </TabsList>

        <SectionContainer
          title="Club Accounts"
          description="View, manage, and search all club accounts"
        >
          <TabsContent value="active">
            <AccountTable
              accounts={activeClubs}
              emptyMessage="No clubs with active subscriptions available."
            />
          </TabsContent>
          <TabsContent value="inactive">
            <AccountTable
              accounts={inactiveClubs}
              emptyMessage="No clubs with inactive subscriptions available."
            />
          </TabsContent>
          <TabsContent value="all">
            <ClubEmails />
          </TabsContent>
        </SectionContainer>
      </Tabs>
    </>
  );
}
```

## Example: Using SubscriptionBadge in AccountTable

Update the subscription cell in `AccountTable.tsx`:

```typescript
import { SubscriptionBadge } from "@/components/modules/tables/SubscriptionBadge";

// In the table body, replace the subscription cell:
<TableCell>
  <SubscriptionBadge
    hasActiveOrder={account.hasActiveOrder}
    daysLeftOnSubscription={account.daysLeftOnSubscription}
  />
</TableCell>;
```

## Quick Start Checklist

- [ ] Import `AccountStats` component
- [ ] Add stats section above the table tabs
- [ ] Pass all accounts (active + inactive) to `AccountStats`
- [ ] Import `SubscriptionBadge` component
- [ ] Replace subscription cell content with `SubscriptionBadge`
- [ ] Test with different subscription statuses
- [ ] Verify charts render correctly
- [ ] Check responsive design on mobile

## Notes

- Stats are calculated client-side from existing data (no extra API calls)
- Charts use `recharts` library (already in project)
- All components follow existing design patterns
- Stats update automatically when accounts data changes
