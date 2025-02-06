// TODO: Add RefreshButton component
"use client";
import { Button } from "@/components/ui/button";
import { useAccountsQuery } from "@/hooks/accounts/useAccountsQuery";

export default function RefreshButton() {
  const { refetch } = useAccountsQuery();
  return (
    <Button variant="outline" onClick={() => refetch()}>
      Refresh
    </Button>
  );
}
