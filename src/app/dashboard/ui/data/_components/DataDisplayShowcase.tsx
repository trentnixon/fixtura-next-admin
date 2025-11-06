"use client";

import StatCardsShowcase from "./_elements/StatCardsShowcase";
import MetricGridShowcase from "./_elements/MetricGridShowcase";
import CardsShowcase from "./_elements/CardsShowcase";
import UsageGuidelinesShowcase from "./_elements/UsageGuidelinesShowcase";

/**
 * Data Display Showcase Component
 *
 * Displays card components for data display (StatCards, MetricGrid, Cards)
 */
export default function DataDisplayShowcase() {
  return (
    <>
      <StatCardsShowcase />
      <MetricGridShowcase />
      <CardsShowcase />
      <UsageGuidelinesShowcase />
    </>
  );
}
