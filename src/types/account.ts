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

/*
export interface AccountSummary {
  data: {
    Totals: {
      count: number;
      uniqueSports: string[];
      sportsCount: { [key: string]: number };
      accountTypesCount: { [key: string]: number };
      sportsPerAccountTypeCount: { [key: string]: { [key: string]: number } };
      trialInstanceStatus: {
        active: number;
        expired: number;
      };
      activeOrderCount: number;
      activeFreeTierCount: number;
      inactiveFreeTierCount: number;
      isSetupCount: {
        true: number;
        false: number;
      };
      mediaLibraryUsage: {
        id: number;
        mediaLibraryCount: number;
      }[];
      longevityAndRetention: {
        id: number;
        createdAt: string;
        updatedAt: string;
        deliveryAddress: string;
      }[];
    };
    BarChartData: {
      accountTypesBarChart: { name: string; value: number }[];
      sportsCountBarChart: { name: string; value: number }[];
      engagementMetricsBarChart: { metric: string; count: number }[];
      schedulingDayCountBarChart: { day: string; value: number }[];
      isSetupBarChart: { name: string; value: number }[];
      trialInstanceBarChart: { name: string; value: number }[];
    };
    AdditionalMetrics: {
      activeOrderCount: number;
      activeFreeTierCount: number;
      inactiveFreeTierCount: number;
      isSetupCount: {
        true: number;
        false: number;
      };
      trialInstanceStatus: {
        active: number;
        expired: number;
      };
    };
  };
}



*/

export interface AccountSummary {
  Totals: {
    count: number;
    uniqueSports: string[];
    sportsCount: { [key: string]: number };
    accountTypesCount: { [key: string]: number };
    sportsPerAccountTypeCount: {
      [key: string]: { [key: string]: number };
    };

    trialInstanceStatus: {
      active: number;
      expired: number;
    };
    activeOrderCount: number;
    activeFreeTierCount: number;
    inactiveFreeTierCount: number;
    isSetupCount: {
      true: number;
      false: number;
    };
    mediaLibraryUsage: {
      id: number;
      mediaLibraryCount: number;
    }[];
    longevityAndRetention: {
      id: number;
      createdAt: string;
      updatedAt: string;
      deliveryAddress: string;
    }[];
  };
  BarChartData: {
    accountTypesBarChart: { name: string; value: number }[];
    sportsCountBarChart: { name: string; value: number }[];
    engagementMetricsBarChart: { metric: string; count: number }[];
    schedulingDayCountBarChart: { day: string; value: number }[];
  };
  AdditionalMetrics: {
    activeOrderCount: number;
    activeFreeTierCount: number;
    inactiveFreeTierCount: number;
    isSetupCount: {
      true: number;
      false: number;
    };
    trialInstanceStatus: {
      active: number;
      expired: number;
    };
  };
}
