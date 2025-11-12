/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SubscriptionTierAttributes {
  Name: string;
  description?: string;
  price: number;
  currency: "AUD" | "NZD";
  stripe_product_id: string;
  stripe_price_id: string;
  image_url?: any; // media field - can be single or multiple
  isActive: boolean;
  isClub: boolean;
  subscription_items?: any; // JSON object
  includeSponsors?: boolean;
  Category?: "Club" | "Association";
  DaysInPass?: number;
  PriceByWeekInPass?: number;
  Title?: string;
  SubTitle?: string;
  subscription_packages?: any; // relation - manyToMany
  accounts?: any; // relation - oneToMany
}

export interface SubscriptionTier {
  id: number;
  attributes: SubscriptionTierAttributes;
}
