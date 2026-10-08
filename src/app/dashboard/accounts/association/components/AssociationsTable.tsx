"use client";

import { useAccountsQuery } from "@/hooks/accounts/useAccountsQuery";
import { AccountTable } from "@/components/modules/tables/AccountTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssociationSnapshotCoverage from "./AssociationSnapshotCoverage";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  sectionTabListClass,
  sectionTabTriggerClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import { AlertTriangle, CheckCircle2, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const ASSOCIATION_TABS = [
  { value: "snapshot", label: "Association Snapshot", icon: LayoutDashboard },
  { value: "active", label: "Active", icon: CheckCircle2 },
  { value: "inactive", label: "Inactive", icon: AlertTriangle },
] as const;

export default function DisplayAssociationsTable() {
  const { data, isLoading, isError, error, refetch } = useAccountsQuery();

  if (isLoading) {
    return <LoadingState variant="default" />;
  }

  if (isError) {
    return (
      <ErrorState
        error={
          error instanceof Error
            ? error
            : new Error("Failed to load associations")
        }
        onRetry={refetch}
        variant="default"
      />
    );
  }

  const { active: activeAssociations, inactive: inactiveAssociations } =
    data!.associations;
  const allAssociations = [...activeAssociations, ...inactiveAssociations];

  return (
    <Tabs defaultValue="snapshot" className="space-y-4">
      <TabsList variant="primary" className={cn(sectionTabListClass, "mb-4")}>
        {ASSOCIATION_TABS.map(({ value, label, icon: Icon }) => (
          <TabsTrigger
            key={value}
            value={value}
            variant="section"
            className={sectionTabTriggerClass}
          >
            <Icon className="h-4 w-4 shrink-0 text-current" aria-hidden />
            {value === "active"
              ? `${label} (${activeAssociations.length})`
              : value === "inactive"
                ? `${label} (${inactiveAssociations.length})`
                : label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="snapshot">
        <SectionContainer
          title="Association Snapshot"
          description="Fixtura accounts first, then the wider association directory."
        >
          <AssociationSnapshotCoverage accounts={allAssociations} />
        </SectionContainer>
      </TabsContent>

      <TabsContent value="active">
        <SectionContainer
          title="Active Association Accounts"
          description="Association accounts with current subscriptions, last data sync, and last render."
        >
          <AccountTable
            accounts={activeAssociations}
            emptyMessage="No associations with active subscriptions available."
            showFleetOpsColumn
          />
        </SectionContainer>
      </TabsContent>

      <TabsContent value="inactive">
        <SectionContainer
          title="Inactive Association Accounts"
          description="Association accounts without an active subscription, with last data sync and last render."
        >
          <AccountTable
            accounts={inactiveAssociations}
            emptyMessage="No associations with inactive subscriptions available."
            showFleetOpsColumn
          />
        </SectionContainer>
      </TabsContent>

    </Tabs>
  );
}
