/**
 * Rerender Request Types
 *
 * TypeScript type definitions for Rerender Request Admin API endpoints.
 * Based on the API documentation in ADMIN_ROUTES.md
 */

// ============================================================================
// BASE TYPES
// ============================================================================

/**
 * Rerender request status enum
 */
export type RerenderRequestStatus =
  | "Pending"
  | "Processing"
  | "Completed"
  | "Rejected";

/**
 * Account information in rerender request detail view
 */
export interface RerenderRequestAccount {
  id: number;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  email: string | null;
}

/**
 * Render information in rerender request detail view
 */
export interface RerenderRequestRender {
  id: number;
  name: string | null;
  complete: boolean;
  processing: boolean;
}

/**
 * Individual rerender request (list view response)
 */
export interface RerenderRequest {
  id: number;
  accountId: number;
  accountName: string | null;
  renderId: number;
  renderName: string | null;
  reason: string | null;
  userEmail: string | null;
  additionalNotes: string | null;
  status: RerenderRequestStatus | null;
  hasBeenHandled: boolean;
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
}

/**
 * Individual rerender request with full details (detail view response)
 */
export interface RerenderRequestDetail {
  id: number;
  account: RerenderRequestAccount | null;
  render: RerenderRequestRender | null;
  reason: string | null;
  userEmail: string | null;
  additionalNotes: string | null;
  status: RerenderRequestStatus | null;
  hasBeenHandled: boolean;
  userMeta: Record<string, unknown> | null;
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * API response wrapper for rerender requests list
 */
export interface RerenderRequestAdminResponse {
  data: RerenderRequest[];
  meta: {
    total: number;
  };
}

/**
 * API response wrapper for single rerender request detail
 */
export interface RerenderRequestDetailResponse {
  data: RerenderRequestDetail;
}

/**
 * Response from mark handled endpoint
 */
export interface MarkHandledResponse {
  success: boolean;
  data: {
    id: number;
    hasBeenHandled: boolean;
    updatedAt: string; // ISO datetime string
  };
}

// ============================================================================
// ERROR TYPES
// ============================================================================

/**
 * Error response structure
 */
export interface RerenderRequestErrorResponse {
  error: {
    message: string;
    code: string;
  };
}

