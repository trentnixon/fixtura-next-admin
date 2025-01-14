/* eslint-disable @typescript-eslint/no-explicit-any */
import { Order } from "./order";
import { Association } from "./association";
import { Club } from "./club";
import { RenderToken } from "./renderToken";
import { Template } from "./template";
import { Theme } from "./theme";
import { TrialInstance } from "./trialInstance";
import { SubscriptionTier } from "./subscriptionTier";
import { Render } from "@/types/render";

export interface AccountAttributes {
  updatedAt: string;
  publishedAt: string;
  isActive: boolean;
  FirstName: string;
  LastName: string | null;
  DeliveryAddress: string;
  isSetup: boolean;
  isUpdating: boolean;
  hasCompletedStartSequence: boolean;
  isRightsHolder: boolean;
  isPermissionGiven: boolean;
  group_assets_by: boolean;
  Sport: string;
  hasCustomTemplate: string | null;
  scheduler: any;
  orders: { data: Order[] } | null;
  associations: { data: Association[] } | null;
  clubs: { data: Club[] } | null;
  account_type: { data: { attributes: { Name: string } } } | null;
  render_token: { data: RenderToken } | null;
  template: { data: Template } | null;
  theme: { data: Theme } | null;
  trial_instance: { data: TrialInstance } | null;
  renders: { data: Render[] } | null;
  subscription_tier: { data: SubscriptionTier } | null;
  sponsors: { data: SubscriptionTier } | null;
  include_junior_surnames: boolean;
}

export interface Account {
  id: number;
  attributes: AccountAttributes;
}

export interface AccountState {
  accounts: Account[];
  accountDetails: Account | null;
  selectedAccount: AccountAttributes | null;
  loading: boolean;
  error: string | null;
}
