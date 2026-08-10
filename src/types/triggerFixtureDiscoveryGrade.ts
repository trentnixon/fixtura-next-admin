/**
 * Types for POST /grade/trigger-fixture-discovery
 * CMS resolves sport and URL from the grade and enqueues fixture_discovery.
 */

export interface TriggerFixtureDiscoveryGradeRequest {
  id: number;
}

export interface TriggerFixtureDiscoveryGradeSuccessResponse {
  success: boolean;
  jobId: string;
  runId: string;
  message: string;
  queueName: string;
  gradeId: number;
}
