import { SubscriptionTier } from '@/types/subscriptionTier';

export interface OrderAttributes {
  Name: string;
  checkout_session: string;
  stripe_expires_at: string;
  stripe_status: string;
  checkout_status: string;
  isActive: boolean;
  payment_method: string;
  stripe_invoice: string;
  total: string;
  Status: boolean;
  currency: string;
  payment_method_types: string;
  payment_status: string;
  cancel_url: string;
  strapi_created: string;
  cancel_at_period_end: boolean;
  cancel_at: number;
  Fixture_start: number;
  Fixture_end: number;
  isPaused: boolean;
  invoice_created: string;
  invoice_due_date: string;
  hosted_invoice_url: string;
  invoice_pdf: string;
  invoice_id: string;
  invoice_number: string;
  payment_intent: string;
  startOrderAt: string;
  OrderPaid: boolean;
  endOrderAt: string;
  expireEmailSent: boolean;
  hasOrderExpired: boolean;
  expiringSoonEmail: boolean;
  isExpiringSoon: boolean;
  subscription_tier: {
    data: SubscriptionTier;
  };
  // Add other attributes as needed
}

export interface Order {
  id: number;
  attributes: OrderAttributes;
}
