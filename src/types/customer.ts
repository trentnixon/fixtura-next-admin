export interface CustomerAttributes {
  stripe_customer_id: string;
  stripe_created: string;
  stripe_invoice_prefix: string;
}

export interface Customer {
  id: number;
  attributes: CustomerAttributes;
}

export interface CustomerState {
  customers: Customer[];
  accountCustomers: Customer[];
  customerDetails: Customer | null;
  loading: boolean;
  error: string | null;
}
