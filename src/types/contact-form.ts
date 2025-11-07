/**
 * Contact Form Types
 *
 * TypeScript type definitions for Contact Form Admin API endpoints.
 * Based on the API documentation for /api/contact-form/admin/all
 */

// ============================================================================
// BASE TYPES
// ============================================================================

/**
 * Contact form submission status enum
 */
export type ContactFormStatus = "New" | "Read" | "Resolved";

/**
 * Individual contact form submission
 */
export interface ContactFormSubmission {
  id: number;
  name: string | null;
  email: string | null;
  subject: string | null;
  text: string | null;
  timestamp: string | null; // ISO datetime string
  status: ContactFormStatus | null;
  ip: string | null;
  userAgent: string | null;
  hasSeen: boolean;
  Acknowledged: boolean;
}

/**
 * API response wrapper for contact form submissions
 */
export interface ContactFormAdminResponse {
  data: ContactFormSubmission[];
  meta: {
    total: number;
  };
}

/**
 * Error response structure
 */
export interface ContactFormErrorResponse {
  statusCode: number;
  error: string;
  message: string;
}

// ============================================================================
// MARK AS READ TYPES
// ============================================================================

/**
 * Request body for marking contact form as read
 */
export interface MarkAsReadRequest {
  hasSeen?: boolean;
  Acknowledged?: boolean;
}

/**
 * Response from mark as read endpoint
 */
export interface MarkAsReadResponse {
  data: {
    id: number;
    hasSeen: boolean;
    Acknowledged: boolean;
  };
}

/**
 * Error response structure for mark as read
 */
export interface MarkAsReadErrorResponse {
  statusCode: number;
  error: string;
  message: string;
}
