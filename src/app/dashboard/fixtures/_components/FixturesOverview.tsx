"use client";

import { useState } from "react";
import { FixturesStats } from "./FixturesStats";
import { AssociationSelector } from "./AssociationSelector";
import { AssociationFixturesTable } from "./AssociationFixturesTable";
import { FixturesTimeline } from "./FixturesTimeline";
import { FixturesDistributions } from "./FixturesDistributions";
import { TopEntities } from "./TopEntities";

/**
 * FixturesOverview Component
 *
 * Main container for the fixtures page.
 * Shows statistics and allows users to select an association to view its fixtures.
 */
export default function FixturesOverview() {
  const [selectedAssociation, setSelectedAssociation] = useState<number | null>(
    null
  );

  return (
    <div className="space-y-6">
      <FixturesStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FixturesTimeline />
        </div>
        <div>
          <TopEntities />
        </div>
      </div>

      <FixturesDistributions />

      {selectedAssociation === null ? (
        <AssociationSelector
          onSelect={(associationId) => setSelectedAssociation(associationId)}
        />
      ) : (
        <AssociationFixturesTable
          associationId={selectedAssociation}
          onBack={() => setSelectedAssociation(null)}
        />
      )}
    </div>
  );
}
