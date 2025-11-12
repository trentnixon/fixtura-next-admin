import { CheckoutStatus } from "@/types/orderOverview";

export interface OrderDetailResponse {
  order: OrderDetail;
  relatedOrders: RelatedOrderSummary[];
}

export interface OrderDetail {
  id: number;
  name: string | null;
  currency: string | null;
  totals: {
    amount: number;
    formatted: string | null;
  };
  payment: {
    status: string | null;
    channel: "stripe" | "invoice" | null;
    method: string | null;
    methodTypes: string | null;
    orderPaid: boolean;
    stripeInvoiceId: string | null;
    hostedInvoiceUrl: string | null;
    invoicePdf: string | null;
    invoice: {
      id: string | null;
      number: string | null;
      createdAt: string | null;
      dueDate: string | null;
    };
    paymentIntent: string | null;
    checkoutSession: string | null;
  };
  status: {
    display: string;
    checkoutStatus: CheckoutStatus | null;
    Status?: boolean;
    isActive: boolean;
    isPaused: boolean;
    cancelAtPeriodEnd: boolean;
    cancelAt: string | null;
    hasExpired: boolean;
    isExpiringSoon: boolean;
    expireEmailSent: boolean;
    expiringSoonEmail: boolean;
  };
  schedule: {
    fixtureStart: string | null;
    fixtureEnd: string | null;
    startOrderAt: string | null;
    endOrderAt: string | null;
    stripeExpiresAt: string | null;
  };
  account: {
    id: number | null;
    name: string | null;
    sport: string | null;
    accountType: string | null;
    contact: {
      email: string | null;
      username: string | null;
    };
    clubs: Array<{ id: number | null; name: string | null }>;
    associations: Array<{ id: number | null; name: string | null }>;
  };
  subscriptionTier: {
    id: number | null;
    name: string | null;
    price: number;
    billingInterval: string | null;
  };
  customer: {
    id: number | null;
    name: string | null;
    email: string | null;
    stripeCustomerId: string | null;
  };
  timestamps: {
    createdAt: string;
    updatedAt: string;
    strapiCreated: string | null;
  };
}

export interface RelatedOrderSummary {
  id: number;
  name: string | null;
  totals: {
    amount: number;
    currency: string | null;
  };
  subscriptionTier: string | null;
  status: string;
  checkoutStatus: CheckoutStatus | null;
  paymentStatus: string | null;
  isActive: boolean;
  createdAt: string;
  startDate: string | null;
  endDate: string | null;
}

/**
 * Payload for creating an admin invoice order
 * Field names match the backend API expectations (camelCase)
 * Required fields must be provided; boolean fields are optional
 */
export interface AdminCreateInvoicePayload {
  // Required fields - use camelCase API field names
  accountId: number; // Account ID
  subscriptionTierId: number; // Subscription tier/product ID
  amount: number; // Invoice amount (positive number, not string)
  currency: string; // Currency code (e.g., "AUD", "USD")
  startDate: string; // Order start date (ISO date string)
  endDate: string; // Order end date (ISO date string, must be after startDate)
  dueDate: string; // Invoice due date (ISO date string, must be today or future)
  daysUntilDue: number; // Days until due (positive number)
  checkoutStatus: string; // Checkout status (e.g., "incomplete", "complete", "active", etc.)
  payment_status: string; // Payment status (e.g., "open", "paid", "unpaid", etc.)

  // Optional boolean fields
  Status?: boolean; // Order status
  isActive?: boolean; // Whether the order is active
  OrderPaid?: boolean; // Whether the order is paid
  isExpiringSoon?: boolean; // Whether the order is expiring soon
  expiringSoonEmail?: boolean; // Whether expiring soon email was sent
  hasOrderExpired?: boolean; // Whether the order has expired
  expireEmailSent?: boolean; // Whether expiration email was sent
  cancel_at_period_end?: boolean; // Whether to cancel at period end
  isPaused?: boolean; // Whether the order is paused

  // Note: The following fields are set automatically by the backend:
  // - payment_channel (always "invoice")
  // - invoice_id, invoice_number, invoice_created (generated automatically)
  // - Name (generated automatically)
}

/**
 * Response from creating an admin invoice order
 */
export interface AdminCreateInvoiceResponse {
  message: "Invoice created successfully";
  order: OrderDetail; // Same structure as GET /api/orders/admin/:id
}
