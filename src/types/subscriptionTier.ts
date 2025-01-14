/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SubscriptionTierAttributes {
  Name: string;
  description: string;
  price: number;
  currency: string;
  stripe_product_id: string;
  stripe_price_id: string;
  image_url: string[]; // assuming it's an array of URLs
  isActive: boolean;
  isClub: boolean;
  subscription_items: any; // assuming JSON object
  includeSponsors: boolean;
  Category: string;
  DaysInPass: number;
  PriceByWeekInPass: number;
  Title: string;
  SubTitle: string;
}

export interface SubscriptionTier {
  id: number;
  attributes: SubscriptionTierAttributes;
}
