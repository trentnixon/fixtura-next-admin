export interface TrialInstanceAttributes {
  startDate: string; // assuming it's a date string
  endDate: string; // assuming it's a date string
  isActive: boolean;
  club: number | null; // assuming it's a reference ID
  association: number | null; // assuming it's a reference ID
  subscription_tier: number | null; // assuming it's a reference ID
  account: number | null; // assuming it's a reference ID
}

export interface TrialInstance {
  id: number;
  attributes: TrialInstanceAttributes;
}
