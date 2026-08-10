/**
 * Types for fixtura-scraper-artifact (debug screenshots from failed scrapes).
 * GET /api/fixtura-scraper-artifacts
 *
 * @see .comms/admin-implementation-guide-2026-03.md
 */

export interface ScraperArtifactFile {
  id: number | null;
  name: string | null;
  url: string | null;
  mime: string | null;
}

export interface ScraperArtifact {
  id: number;
  jobId: string | null;
  bullJobId: string | null;
  runId: string | null;
  fixtureKey: string | null;
  artifactType: string | null;
  contentType: string | null;
  file: ScraperArtifactFile | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface FetchScraperArtifactsParams {
  jobId: string;
}

export interface ScraperArtifactsResponse {
  data: ScraperArtifact[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
