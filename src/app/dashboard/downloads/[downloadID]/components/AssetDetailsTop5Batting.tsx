"use client";

import type { Top5BattingPerformance } from "@/types/downloadAsset";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import Top5BattingList from "./Top5BattingList";

interface AssetDetailsTop5BattingProps {
  performances: Top5BattingPerformance[];
}

/**
 * AssetDetailsTop5Batting Component
 *
 * Displays CricketTop5Batting asset-specific data:
 * - Top 5 batting performances
 * - Player stats (runs, balls, strike rate, not out)
 * - Team information
 * - Grade and competition badges
 */
export default function AssetDetailsTop5Batting({
  performances,
}: AssetDetailsTop5BattingProps) {
  const performanceCount = performances.length;

  return (
    <SectionContainer
      title="Top 5 Batting"
      description={`${performanceCount} ${performanceCount === 1 ? "performance" : "performances"}`}
    >
      <Top5BattingList performances={performances} />
    </SectionContainer>
  );
}

