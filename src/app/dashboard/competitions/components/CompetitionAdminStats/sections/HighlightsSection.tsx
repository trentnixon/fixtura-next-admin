import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import StatCard from "@/components/ui-library/metrics/StatCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { CompetitionAdminStatsHighlight } from "@/types/competitionAdminStats";
import { formatHighlightValue } from "../helpers";

interface HighlightsSectionProps {
  highlights: CompetitionAdminStatsHighlight[];
}

export function HighlightsSection({ highlights }: HighlightsSectionProps) {
  const filteredHighlights = highlights.filter(
    (highlight) => highlight.title !== "Active Competitions"
  );

  return (
    <SectionContainer
      title="Competition Highlights"
      description="Auto-generated highlights sourced from the admin stats service."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from(
          new Map(
            filteredHighlights.map((highlight) => [
              `${highlight.title}-${highlight.competitionId ?? "na"}`,
              highlight,
            ])
          ).values()
        ).map((highlight, index) => (
          <StatCard
            key={`${highlight.title}-${
              highlight.competitionId ?? "na"
            }-${index}`}
            title={highlight.title}
            value={formatHighlightValue(highlight)}
            description={highlight.competitionName ?? undefined}
            variant="primary"
            className="h-full"
            action={
              highlight.competitionId ? (
                <Button asChild size="sm" variant="accent">
                  <Link
                    href={`/dashboard/competitions/${highlight.competitionId}`}
                  >
                    View Competition
                  </Link>
                </Button>
              ) : undefined
            }
          />
        ))}
      </div>
    </SectionContainer>
  );
}
