/* eslint-disable @typescript-eslint/no-explicit-any */
import { Account } from "./account";

export interface DataCollectionAttributes {
  whenWasTheLastCollection: string;
  TimeTaken: number;
  MemoryUsage: number;
  hasError: boolean;
  processingTracker: any;
  account: { data: Account }; // Add the account field
}

export interface DataCollection {
  id: number;
  attributes: DataCollectionAttributes;
}

export interface DataCollectionState {
  dataCollections: DataCollection[];
  accountDataCollections: DataCollection[];
  dataCollectionDetails: DataCollection | null;
  loading: boolean;
  error: string | null;
}
