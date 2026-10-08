"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, DatabaseIcon } from "lucide-react";

import { useAccountQuery } from "@/hooks/accounts/useAccountQuery";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchInput } from "@/app/dashboard/fixtures/_components/_utils/SearchInput";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui-library";
import { useCompetitionAssociationDrilldown } from "@/hooks/competitions/useCompetitionAssociationDrilldown";
import { useCompetitionClubDrilldown } from "@/hooks/competitions/useCompetitionClubDrilldown";
import { cn } from "@/lib/utils";
import {
  AccountDrilldownCompetition,
  AccountGradeFilters,
  AccountGradeRow,
  emptyGradeFilters,
  filterGradeRows,
  gradeFilterChoices,
  groupGradeRows,
  hasActiveGradeFilters,
  isGradeStatusFilter,
  toGradeRows,
} from "./accountGradeRows";

function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "-";
  }

  return value.toLocaleString();
}

function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "-";
  }

  return `${value.toFixed(0)}%`;
}

export default function GradesTab() {
  const accountIdParam = useParams().accountID;
  const accountID = typeof accountIdParam === "string" ? accountIdParam : "";
  const { strapiLocation } = useGlobalContext();

  const {
    data: accountData,
    isLoading: isAccountLoading,
    isError: isAccountError,
    error: accountError,
  } = useAccountQuery(accountID);

  const organizationId = accountData?.data?.accountOrganisationDetails?.id;
  const accountType = accountData?.data?.account_type;
  const isClubAccount = accountType === 1;
  const isAssociationAccount = accountType !== 1;

  const {
    data: associationDrilldown,
    isLoading: isAssociationLoading,
    isError: isAssociationError,
    error: associationError,
  } = useCompetitionAssociationDrilldown(
    isAssociationAccount ? organizationId : undefined,
  );

  const {
    data: clubDrilldown,
    isLoading: isClubLoading,
    isError: isClubError,
    error: clubError,
  } = useCompetitionClubDrilldown(isClubAccount ? organizationId : undefined);

  const isLoading =
    isAccountLoading ||
    (isAssociationAccount && isAssociationLoading) ||
    (isClubAccount && isClubLoading);

  if (isLoading) {
    return <LoadingState variant="skeleton" />;
  }

  if (isAccountError) {
    return (
      <ErrorState
        variant="card"
        error={accountError}
        title="Error fetching account details"
      />
    );
  }

  if (!organizationId || accountType === undefined) {
    return (
      <SectionContainer title="Grades" variant="compact">
        <EmptyState
          variant="minimal"
          description="Account organization details are missing. Cannot load grades."
        />
      </SectionContainer>
    );
  }

  if (isAssociationAccount) {
    if (isAssociationError) {
      return (
        <SectionContainer title="Grades" variant="compact">
          <ErrorState
            variant="card"
            error={associationError}
            title="Error fetching association grades"
          />
        </SectionContainer>
      );
    }

    if (!associationDrilldown) {
      return (
        <SectionContainer title="Grades" variant="compact">
          <EmptyState
            variant="minimal"
            description="No association data found."
          />
        </SectionContainer>
      );
    }

    return (
      <GradesPanel
        label={associationDrilldown.association.name}
        competitions={associationDrilldown.competitions}
        gradeCmsBase={strapiLocation?.grade}
      />
    );
  }

  if (isClubError) {
    return (
      <SectionContainer title="Grades" variant="compact">
        <ErrorState
          variant="card"
          error={clubError}
          title="Error fetching club grades"
        />
      </SectionContainer>
    );
  }

  if (!clubDrilldown) {
    return (
      <SectionContainer title="Grades" variant="compact">
        <EmptyState
          variant="minimal"
          description="No club competition data found."
        />
      </SectionContainer>
    );
  }

  return (
    <GradesPanel
      label={clubDrilldown.club.name}
      competitions={clubDrilldown.competitions}
      gradeCmsBase={strapiLocation?.grade}
    />
  );
}

function GradesPanel({
  label,
  competitions,
  gradeCmsBase,
}: {
  label: string;
  competitions: AccountDrilldownCompetition[];
  gradeCmsBase?: string;
}) {
  const [filters, setFilters] = useState<AccountGradeFilters>(emptyGradeFilters);
  const rows = useMemo(() => toGradeRows(competitions), [competitions]);
  const choices = useMemo(() => gradeFilterChoices(rows), [rows]);
  const filteredRows = useMemo(
    () => filterGradeRows(rows, filters),
    [rows, filters],
  );
  const groups = useMemo(() => groupGradeRows(filteredRows), [filteredRows]);
  const competitionCount = choices.competitions.length;
  const activeGradeCount = rows.filter((row) => row.competition.isActive).length;
  const filtersActive = hasActiveGradeFilters(filters);
  const title = filtersActive
    ? `Grades (${filteredRows.length} of ${rows.length})`
    : `Grades (${rows.length})`;

  return (
    <SectionContainer title={title} variant="compact">
      <div className="space-y-4">
        <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white lg:grid-cols-[1.4fr_repeat(2,minmax(120px,0.5fr))]">
          <div className="border-b border-slate-200 px-4 py-3 lg:border-b-0 lg:border-r">
            <p className="truncate text-sm font-medium text-slate-900">
              {label}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Across this account&apos;s competitions
            </p>
          </div>
          <SummaryMetric label="Competitions" value={competitionCount} />
          <SummaryMetric label="Active grades" value={activeGradeCount} />
        </div>

        {rows.length ? (
          <>
            <GradeFilters
              filters={filters}
              choices={choices}
              onChange={setFilters}
            />
            {groups.length ? (
              <GradesTable groups={groups} gradeCmsBase={gradeCmsBase} />
            ) : (
              <EmptyState
                variant="minimal"
                description="No grades match these filters."
              />
            )}
          </>
        ) : (
          <EmptyState
            variant="minimal"
            description="No grades found for this account."
          />
        )}
      </div>
    </SectionContainer>
  );
}

function GradeFilters({
  filters,
  choices,
  onChange,
}: {
  filters: AccountGradeFilters;
  choices: ReturnType<typeof gradeFilterChoices>;
  onChange: (filters: AccountGradeFilters) => void;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-2 lg:flex-row lg:flex-wrap lg:items-center">
      <SearchInput
        value={filters.search}
        onChange={(search) => onChange({ ...filters, search })}
        placeholder="Search grade, code, or competition..."
        className="min-w-[220px] flex-1"
      />
      <FilterSelect
        id="grade-competition-filter"
        ariaLabel="Competition"
        value={filters.competitionId}
        onChange={(competitionId) => onChange({ ...filters, competitionId })}
        widthClass="w-[220px]"
        options={[
          { value: "all", label: `All competitions (${choices.competitions.length})` },
          ...choices.competitions.map((competition) => ({
            value: competition.id,
            label: `${competition.name} (${competition.count})`,
          })),
        ]}
      />
      <FilterSelect
        id="grade-status-filter"
        ariaLabel="Status"
        value={filters.status}
        onChange={(status) => {
          if (isGradeStatusFilter(status)) {
            onChange({ ...filters, status });
          }
        }}
        options={[
          { value: "all", label: "All statuses" },
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ]}
      />
      {hasActiveGradeFilters(filters) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange(emptyGradeFilters)}
        >
          Clear
        </Button>
      )}
    </div>
  );
}

function FilterSelect({
  id,
  ariaLabel,
  value,
  onChange,
  options,
  widthClass = "w-[160px]",
}: {
  id: string;
  ariaLabel: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  widthClass?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        id={id}
        aria-label={ariaLabel}
        className={cn(
          "h-9 shrink-0 rounded-full border-transparent bg-white shadow-none",
          widthClass,
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function SummaryMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-b border-slate-200 px-4 py-3 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0">
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold leading-none text-slate-900">
        {value}
      </p>
    </div>
  );
}

const GRADE_COLUMN_COUNT = 5;

function GradesTable({
  groups,
  gradeCmsBase,
}: {
  groups: ReturnType<typeof groupGradeRows>;
  gradeCmsBase?: string;
}) {
  return (
    <Table className="min-w-[860px]">
      <TableHeader>
        <TableRow className="bg-slate-50 hover:bg-slate-50">
          <TableHead className="min-w-[240px]">Grade</TableHead>
          <TableHead className="text-right">Teams</TableHead>
          <TableHead className="text-right">Clubs</TableHead>
          <TableHead className="min-w-[180px]">Coverage</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {groups.map((group) => (
          <CompetitionGradeGroup
            key={group.competition.id}
            group={group}
            gradeCmsBase={gradeCmsBase}
          />
        ))}
      </TableBody>
    </Table>
  );
}

function CompetitionGradeGroup({
  group,
  gradeCmsBase,
}: {
  group: ReturnType<typeof groupGradeRows>[number];
  gradeCmsBase?: string;
}) {
  const gradeLabel = group.rows.length === 1 ? "grade" : "grades";

  return (
    <>
      <TableRow className="bg-slate-100 hover:bg-slate-100">
        <TableCell colSpan={GRADE_COLUMN_COUNT} className="py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <Link
                href={`/dashboard/competitions/${group.competition.id}`}
                className="truncate text-sm font-medium text-slate-900 hover:underline"
              >
                {group.competition.name}
              </Link>
              <span className="text-xs text-muted-foreground">
                {group.competition.season ??
                  `Competition #${group.competition.id}`}
              </span>
              <Badge
                variant="outline"
                className={`rounded-full ${
                  group.competition.isActive
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-slate-50 text-slate-600"
                }`}
              >
                {group.competition.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <Badge
              variant="outline"
              className="rounded-full border-slate-200 bg-white text-slate-700"
            >
              {group.rows.length} {gradeLabel}
            </Badge>
          </div>
        </TableCell>
      </TableRow>
      {group.rows.map((row) => (
        <GradeDataRow
          key={row.key}
          row={row}
          gradeCmsBase={gradeCmsBase}
        />
      ))}
    </>
  );
}

function GradeDataRow({
  row,
  gradeCmsBase,
}: {
  row: AccountGradeRow;
  gradeCmsBase?: string;
}) {
  const totalTeams =
    row.grade.teamsWithoutFixturaAccount + row.grade.teamsWithFixturaAccount;
  const coveragePercent = row.grade.accountCoveragePercent ?? 0;

  return (
    <TableRow>
      <TableCell>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">
            {row.grade.name}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {row.grade.gradeCode ?? `Grade #${row.grade.id}`}
          </p>
        </div>
      </TableCell>
      <TableCell className="text-right font-medium text-slate-900">
        {formatNumber(row.grade.teamCount)}
      </TableCell>
      <TableCell className="text-right">
        {formatNumber(row.grade.clubsRepresented)}
      </TableCell>
      <TableCell>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-slate-900">
              {formatPercent(row.grade.accountCoveragePercent)}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatNumber(row.grade.teamsWithFixturaAccount)} /{" "}
              {formatNumber(totalTeams)}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brandPrimary-500"
              style={{
                width: `${Math.min(Math.max(coveragePercent, 0), 100)}%`,
              }}
            />
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button variant="primary" size="sm" asChild>
            <Link href={`/dashboard/grades/${row.grade.id}`}>
              View
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          {gradeCmsBase && (
            <Button variant="secondary" size="sm" asChild>
              <a
                href={`${gradeCmsBase}${row.grade.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                CMS
                <DatabaseIcon className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
