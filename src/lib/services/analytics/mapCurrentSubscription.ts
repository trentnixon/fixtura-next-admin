import type { RawCurrentSubscription } from "@/types/analytics";

export function mapCurrentSubscription(raw: RawCurrentSubscription | null | undefined) {
  if (!raw?.tier || !raw.status || !raw.startDate || !raw.endDate) {
    return null;
  }

  if (raw.tier === "None" || raw.status === "No active subscription") {
    return null;
  }

  return {
    tier: raw.tier,
    status: raw.status,
    startDate: raw.startDate,
    endDate: raw.endDate,
    isActive: raw.status === "Active",
    autoRenew: !raw.cancelAtPeriodEnd,
  };
}
