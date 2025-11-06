/**
 * Type definitions for Admin Account Lookup API endpoint
 * Endpoint: GET /api/account/admin/lookup
 */

/**
 * Club item in the clubs array
 */
export interface ClubItem {
  /** Club ID */
  id: number;

  /** Club name */
  name: string | null;
}

/**
 * Association item in the associations array
 */
export interface AssociationItem {
  /** Association ID */
  id: number;

  /** Association name */
  name: string | null;
}

/**
 * Logo object with media information
 */
export interface LogoItem {
  /** Logo image URL */
  url: string | null;

  /** Logo width in pixels */
  width: number | null;

  /** Logo height in pixels */
  height: number | null;
}

/**
 * Individual account item in the lookup table
 */
export interface AccountLookupItem {
  /** Account ID */
  id: number;

  /** Account owner's first name */
  FirstName: string | null;

  /** Delivery email address */
  DeliveryAddress: string | null;

  /** Sport type: "Cricket" | "AFL" | "Hockey" | "Netball" | "Basketball" */
  Sport: string | null;

  /** Whether the account is currently active */
  isActive: boolean;

  /** Whether the account setup is complete */
  isSetup: boolean;

  /** Whether the account has completed the start sequence */
  hasCompletedStartSequence: boolean;

  /** Whether the account has an active subscription order */
  hasActiveOrder: boolean;

  /** Number of days remaining on active subscription (null if no active subscription) */
  daysLeftOnSubscription: number | null;

  /** Account type: "Club" | "Association" */
  account_type: string | null;

  /** Array of clubs associated with this account */
  clubs: ClubItem[];

  /** Array of associations associated with this account */
  associations: AssociationItem[];

  /** Logo object (from first club if Club, or first association if Association) */
  logo: LogoItem | null;

  /** User email address (from user relation) */
  email: string | null;
}

/**
 * Main response type for admin account lookup
 */
export interface AdminAccountLookupResponse {
  data: AccountLookupItem[];
  meta: {
    total: number;
  };
}

/**
 * Error response interface for admin account lookup
 */
export interface AdminAccountLookupErrorResponse {
  data: null;
  error: {
    status: number;
    name: string;
    message: string;
  };
}
