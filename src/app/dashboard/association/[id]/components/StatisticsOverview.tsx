"use client";
import {
  Trophy,
  Users,
  Building2,
  Target,
  CreditCard,
  TestTube,
} from "lucide-react";
import { AssociationStatistics } from "@/types/associationDetail";
import StatCard from "@/components/ui-library/metrics/StatCard";
import {} from "@/components/ui/table";

/**
 * StatisticsOverview Component
 *
 * Main statistics overview card displaying:
 * - Competition statistics (total, active, upcoming, completed, byStatus breakdown)
 * - Grade statistics (total, withTeams, withoutTeams)
 * - Club statistics (total, active, withCompetitions)
 * - Team statistics (total, acrossCompetitions, acrossGrades)
 * - Account statistics (total, active, withOrders)
 * - Trial status indicator (if applicable)
 */
interface StatisticsOverviewProps {
  statistics: AssociationStatistics;
}

export default function StatisticsOverview({
  statistics,
}: StatisticsOverviewProps) {
  const { competitions, grades, clubs, teams, accounts, trial } = statistics;

  return (
    <div className="space-y-6">
      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="Competitions"
          value={competitions.total}
          icon={<Trophy className="h-5 w-5" />}
          description={`${competitions.active} active`}
          variant="primary"
        />
        <StatCard
          title="Grades"
          value={grades.total}
          icon={<Target className="h-5 w-5" />}
          description={`${grades.withTeams} with teams`}
          variant="secondary"
        />
        <StatCard
          title="Clubs"
          value={clubs.total}
          icon={<Building2 className="h-5 w-5" />}
          description={`${clubs.active} active`}
          variant="accent"
        />
        <StatCard
          title="Teams"
          value={teams.total}
          icon={<Users className="h-5 w-5" />}
          description={`${teams.acrossCompetitions} in competitions`}
          variant="primary"
        />
        <StatCard
          title="Accounts"
          value={accounts.total}
          icon={<CreditCard className="h-5 w-5" />}
          description={`${accounts.active} active`}
          variant="secondary"
        />
        {trial && (
          <StatCard
            title="Trial"
            value={trial.hasTrial ? "Yes" : "No"}
            icon={<TestTube className="h-5 w-5" />}
            description={
              trial.isActive !== null
                ? trial.isActive
                  ? "Active"
                  : "Inactive"
                : "Unknown"
            }
            variant="accent"
          />
        )}
      </div>
    </div>
  );
}
