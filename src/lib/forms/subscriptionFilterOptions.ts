export type SubscriptionFilterValue = "all" | "active" | "inactive";

export type SubscriptionFilterOption = {
  value: SubscriptionFilterValue;
  label: string;
};

/** Shared options for association/club contact subscription filters. */
export function buildSubscriptionFilterOptions(
  hideAllFilter: boolean,
): SubscriptionFilterOption[] {
  const options: SubscriptionFilterOption[] = [];

  if (!hideAllFilter) {
    options.push({ value: "all", label: "All" });
  }

  options.push(
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  );

  return options;
}
