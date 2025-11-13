"use client";

import type { UpcomingFixture } from "@/types/downloadAsset";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import UpcomingFixtureList from "./UpcomingFixtureList";

interface AssetDetailsUpcomingProps {
  fixtures: UpcomingFixture[];
}

/**
 * AssetDetailsUpcoming Component
 *
 * Displays CricketUpcoming asset-specific data:
 * - Upcoming cricket fixtures
 * - Date, time, teams, ground, round, grade
 * - Match type, age group, gender
 * - CMS links for each fixture
 */
export default function AssetDetailsUpcoming({
  fixtures,
}: AssetDetailsUpcomingProps) {
  const fixtureCount = fixtures.length;

  return (
    <SectionContainer
      title="Upcoming Fixtures"
      description={`${fixtureCount} ${fixtureCount === 1 ? "fixture" : "fixtures"}`}
    >
      <UpcomingFixtureList fixtures={fixtures} />
    </SectionContainer>
  );
}

