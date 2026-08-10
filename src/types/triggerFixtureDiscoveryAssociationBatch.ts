/**
 * Types for POST /association/trigger-fixture-discovery-batch.
 * Queues one fixture_discovery job per eligible grade under an association.
 */

export interface TriggerFixtureDiscoveryAssociationBatchRequest {
  associationId: number;
}

export interface TriggerFixtureDiscoveryAssociationBatchSuccessResponse {
  success: true;
  associationId: number;
  sport: string;
  competitionsScanned: number;
  gradesFound: number;
  queued: number;
  skipped: number;
  queueName: "fixture_discovery";
  runId: string;
}
