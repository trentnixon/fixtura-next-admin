"use client";

import { useMemo } from "react";

import TriggerRemoveFixturesScrapeButton from "@/app/dashboard/competitions/components/TriggerRemoveFixturesScrapeButton";
import { useAssociationDetail } from "@/hooks/association/useAssociationDetail";
import { toAssociationAccountOptionFromDetail } from "@/utils/associationAccountSelection";

export interface GradeRemoveFixturesTriggerProps {
  gradeId: number;
  associationId?: number | null;
  disabled?: boolean;
  triggerMode?: "button" | "menu-item";
}

/**
 * Loads association-linked Fixtura accounts for grade-scoped remove-fixtures enqueue.
 */
export default function GradeRemoveFixturesTrigger({
  gradeId,
  associationId,
  disabled = false,
  triggerMode = "button",
}: GradeRemoveFixturesTriggerProps) {
  const { data, isLoading, isFetching } = useAssociationDetail(
    associationId ?? null,
  );

  const associationAccounts = useMemo(
    () =>
      (data?.data?.accounts ?? []).map(toAssociationAccountOptionFromDetail),
    [data?.data?.accounts],
  );

  const accountsLoading =
    Boolean(associationId && associationId > 0) && (isLoading || isFetching);

  return (
    <TriggerRemoveFixturesScrapeButton
      sourceType="grade"
      sourceId={gradeId}
      associationAccounts={associationAccounts}
      accountsLoading={accountsLoading}
      disabled={disabled || !associationId || associationId <= 0}
      triggerMode={triggerMode}
    />
  );
}
