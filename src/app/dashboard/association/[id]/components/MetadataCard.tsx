"use client";

import { Metadata } from "@/types/associationDetail";

/**
 * MetadataCard Component
 *
 * Performance and data summary (optional, collapsible):
 * - Generated At timestamp
 * - Data Points Summary (competitions, grades, clubs, teams, accounts)
 * - Performance Metrics (fetchTimeMs, calculationTimeMs, totalTimeMs)
 */
interface MetadataCardProps {
  metadata: Metadata;
}

export default function MetadataCard({
  metadata: _metadata,
}: MetadataCardProps) {
  return (
    <div>
      <h2>MetadataCard Component</h2>
      <p>Generated At: {_metadata.generatedAt}</p>
      {/* TODO: Implement metadata UI with performance metrics */}
    </div>
  );
}
