import { Download } from "./download";
import { GameMetaData } from "./gameMetaData";
import { Scheduler } from "./scheduler";
import { Fixture } from "./fixture";
export interface RenderResponse {
  render: RenderData;
  fixtures: Fixture[];
}

export interface RenderData {
  id: number;
  name: string;
  complete: boolean;
  processing: boolean;
  emailSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RenderAttributes {
  Name: string;
  Processing: boolean;
  Complete: boolean;
  sendEmail: boolean;
  hasTeamRosterRequest: boolean;
  hasTeamRosters: boolean;
  forceRerender: boolean;
  EmailSent: boolean;
  forceRerenderEmail: boolean;
  hasTeamRosterEmail: boolean;
  updatedAt: string;
  publishedAt: string;
  isCreatingRoster: boolean;
  downloads: {
    data: Download[];
  };
  scheduler: {
    data: Scheduler;
  };
  game_results_in_renders: {
    data: GameMetaData[];
  };
  upcoming_games_in_renders: {
    data: GameMetaData[];
  };
  grades_in_renders: {
    data: Render[];
  };
}

export interface Render {
  id: number;
  attributes: RenderAttributes;
}

export interface RenderState {
  render: Render | null;
  renders: Render[];
  loading: boolean;
  error: string | null;
}

export interface GetAccountFromRender {
  render: {
    id: number;
    Name: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    Processing: boolean;
    Complete: boolean;
  };
  scheduler: {
    id: number;
    Name: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    Time: string | null;
    isRendering: boolean;
  };
  account: {
    id: number;
    createdAt: string;
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
    hasCustomTemplate: boolean;
    include_junior_surnames: boolean;
  };
}
