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
}

export interface Scheduler {
  id: number;
  Name: string;
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
}
