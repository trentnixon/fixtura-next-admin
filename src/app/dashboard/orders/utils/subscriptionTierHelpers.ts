import { SubscriptionTier } from "@/types/subscriptionTier";

/**
 * Transformed subscription tier for form display
 */
export interface TransformedSubscriptionTier {
  id: number;
  name: string;
  displayName: string;
  category?: string;
  isClub?: boolean;
  currency?: string;
  price?: number;
  description?: string;
  daysInPass?: number;
  priceByWeekInPass?: number;
  title?: string;
  subtitle?: string;
  fullTier: SubscriptionTier;
}

/**
 * Transforms subscription tiers from API format to form-friendly format
 * Filters to only active tiers and includes all metadata for display
 * @param subscriptionTiersData - Raw subscription tiers data from API
 * @returns Array of transformed subscription tiers
 */
export function transformSubscriptionTiers(
  subscriptionTiersData: SubscriptionTier[] | undefined
): TransformedSubscriptionTier[] {
  if (!subscriptionTiersData) {
    return [];
  }

  return subscriptionTiersData
    .filter((tier) => tier.attributes?.isActive !== false)
    .map((tier) => ({
      id: tier.id,
      name:
        tier.attributes?.Name || tier.attributes?.Title || `Tier ${tier.id}`,
      displayName: `${
        tier.attributes?.Name || tier.attributes?.Title || `Tier ${tier.id}`
      }${tier.attributes?.Category ? ` (${tier.attributes.Category})` : ""}`,
      category: tier.attributes?.Category,
      isClub: tier.attributes?.isClub,
      currency: tier.attributes?.currency,
      price: tier.attributes?.price,
      description: tier.attributes?.description,
      daysInPass: tier.attributes?.DaysInPass,
      priceByWeekInPass: tier.attributes?.PriceByWeekInPass,
      title: tier.attributes?.Title,
      subtitle: tier.attributes?.SubTitle,
      fullTier: tier,
    }));
}

/**
 * Finds a subscription tier by ID from transformed tiers
 * @param tiers - Array of transformed subscription tiers
 * @param tierId - Tier ID to find (as string)
 * @returns Found tier or undefined
 */
export function findSubscriptionTierById(
  tiers: TransformedSubscriptionTier[],
  tierId: string
): TransformedSubscriptionTier | undefined {
  if (!tierId) {
    return undefined;
  }
  return tiers.find((tier) => tier.id.toString() === tierId);
}
