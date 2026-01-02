import { Render } from "@/types/render";

export interface SchedulerAttributes {
  Name: string;
  Time: string;
  isRendering: boolean;
  Queued: boolean;
  isActive: boolean;
  updatedAt: string;
  createdAt: string;
  renders: { data: Render[] };
  days_of_the_week: {
    data: {
      attributes: {
        Name: string;
      };
    };
  };
  account?: {
    data: {
      id: number;
      attributes: {
        FirstName: string;
        LastName: string | null;
        Sport: string;
        account_type?: { data: { attributes: { Name: string } } };
      };
    };
  };
}

export interface Scheduler {
  id: number;
  Name: string;
  accountName?: string;
  accountType?: string;
  accountId?: number;
  organizationName?: string;
  schedulerName?: string;
  attributes: SchedulerAttributes;
}

export interface SchedulerState {
  scheduler: Scheduler | null;
  schedulers: Scheduler[];
  loading: boolean;
  error: string | null;
}

export interface SchedulerRollup {
  numberOfSchedulers: number;
  numberOfSchedulersRendering: number;
  ListOfSchedulersRenderingWithIDS: Scheduler[];
  numberOfSchedulersQueued: number;
  ListOfSchedulersQueuedWithIDS: Scheduler[];
  DaysOfTheWeekGroupedByCount: {
    [key: string]: number;
  };
  // NEW FIELDS:
  yesterdaySuccessCount: number;
  yesterdayFailureCount: number;
  avgRenderTimeMinutes: number;
}

// new type getTodaysRenders
export interface TodaysRenders {
  schedulerId: number;
  schedulerName: string;
  scheduledTime: string;
  isRendering: boolean;
  accountId: number;
  accountName: string;
  accountSport: string;
  accountType: string;
  queued: boolean;
  render: {
    renderId: number;
    renderName: string;
    processing: boolean;
    complete: boolean;
    emailSent: boolean;
    startedAt: string;
    updatedAt: string;
    // NEW Phase 2 Fields
    failureReason: string | null;
    queueWaitTimeSeconds: number | null;
  } | null;
}

// new type getYesterdaysRenders
export interface YesterdaysRenders {
  schedulerId: number;
  schedulerName: string;
  scheduledTime: string;
  accountId: number;
  accountName: string;
  accountType: string;
  accountSport: string;
  render: {
    renderId: number;
    complete: boolean;
    processing: boolean;
    emailSent: boolean;
    startedAt: string;
    completedAt: string | null;
    // NEW Phase 2 Fields
    failureReason: string | null;
    queueWaitTimeSeconds: number | null;
  };
}

export interface HealthHistory {
  date: string;
  success: number;
  failed: number;
  avgDuration: number;
  totalVolume: number;
}
