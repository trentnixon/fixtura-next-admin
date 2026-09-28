"use client";

import {
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  Gauge,
  ListChecks,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { SingleFixtureDetailResponse } from "@/types/fixtureDetail";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { SnapshotMetric } from "@/app/dashboard/fixtures/_components/_utils/snapshotMetric";
import {
  breakdownCategoriesBelow,
  findWeakestBreakdown,
  formatValidationStatus,
  VALIDATION_BREAKDOWN_LABELS,
  validationProgressIndicatorClass,
} from "@/app/dashboard/fixtures/_components/_utils/fixtureValidationDisplay";
import { cn } from "@/lib/utils";

interface FixtureValidationProps {
  data: SingleFixtureDetailResponse;
}

function validationStatusBadgeVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "excellent":
    case "good":
      return "default";
    case "fair":
      return "secondary";
    case "poor":
      return "outline";
    case "critical":
      return "destructive";
    default:
      return "secondary";
  }
}

function formatGeneratedAt(iso: string): string {
  try {
    return format(new Date(iso), "PPp");
  } catch {
    return iso;
  }
}

export default function FixtureValidation({ data }: FixtureValidationProps) {
  const { validation, performance, generatedAt, fixtureId } = data.meta;
  const weakest = findWeakestBreakdown(validation.breakdown);

  const hasExplicitIssues =
    validation.missingFields.length > 0 ||
    validation.recommendations.length > 0;

  const categoryGaps = breakdownCategoriesBelow(validation.breakdown);

  const isComplete =
    !hasExplicitIssues &&
    categoryGaps.length === 0 &&
    validation.overallScore >= 80 &&
    (validation.status === "excellent" || validation.status === "good");

  return (
    <SectionContainer
      title="Validation"
      description="CMS completeness score, category breakdown, and remediation hints."
      icon={<ClipboardCheck className="h-5 w-5 text-slate-500" aria-hidden />}
      variant="compact"
      contentClassName="p-0"
    >
      <div className="overflow-hidden bg-white">
        <div className="grid overflow-hidden border-b border-slate-200 sm:grid-cols-2 lg:grid-cols-4">
          <SnapshotMetric
            title="Overall"
            value={`${validation.overallScore}%`}
            detail={formatValidationStatus(validation.status)}
            icon={<Gauge className="h-4 w-4" />}
          />
          <SnapshotMetric
            title="Focus area"
            value={`${weakest.value}%`}
            detail={weakest.label}
            icon={<AlertCircle className="h-4 w-4" />}
          />
          <SnapshotMetric
            title="Missing"
            value={String(validation.missingFields.length)}
            detail={
              validation.missingFields.length === 1
                ? "field flagged"
                : "fields flagged"
            }
            icon={<ListChecks className="h-4 w-4" />}
          />
          <SnapshotMetric
            title="Tips"
            value={String(validation.recommendations.length)}
            detail={
              validation.recommendations.length === 1
                ? "recommendation"
                : "recommendations"
            }
            icon={<Sparkles className="h-4 w-4" />}
          />
        </div>

        <div className="border-b border-slate-200 px-4 py-4 sm:px-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-slate-900">
                Overall completeness
              </span>
              <Badge
                variant={validationStatusBadgeVariant(validation.status)}
                className="capitalize"
              >
                {validation.status}
              </Badge>
              {validation.statusBased ? (
                <Badge variant="outline" className="bg-slate-50 text-slate-600">
                  Status-weighted
                </Badge>
              ) : null}
            </div>
            {isComplete ? (
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                <span className="text-sm font-medium">No open issues</span>
              </div>
            ) : null}
          </div>
          <Progress
            value={validation.overallScore}
            className="h-2.5"
            indicatorClassName={validationProgressIndicatorClass(
              validation.overallScore,
            )}
          />
          {validation.statusBased ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Categories are weighted for this fixture&apos;s match status (e.g.
              results vs upcoming).
            </p>
          ) : null}
        </div>

        <div className="border-b border-slate-200">
          <p
            className="border-b border-slate-200 bg-slate-50/80 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-600 sm:px-5"
          >
            By category
          </p>
          <ul className="divide-y divide-slate-200">
            {VALIDATION_BREAKDOWN_LABELS.map(({ key, label }) => {
              const value = validation.breakdown[key];
              return (
                <li
                  key={key}
                  className="px-4 py-3 sm:px-5"
                >
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-slate-800">{label}</span>
                    <span className="tabular-nums font-semibold text-slate-900">
                      {value}%
                    </span>
                  </div>
                  <Progress
                    value={value}
                    className="h-1.5"
                    indicatorClassName={validationProgressIndicatorClass(value)}
                  />
                </li>
              );
            })}
          </ul>
        </div>

        <ValidationRemediationSection
          missingFields={validation.missingFields}
          recommendations={validation.recommendations}
          categoryGaps={categoryGaps}
          isComplete={isComplete}
        />

        <div
          className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-slate-50/80 px-4 py-2.5 text-xs text-muted-foreground sm:px-5"
        >
          <span>
            Fixture #{fixtureId} · Generated {formatGeneratedAt(generatedAt)}
          </span>
          <span className="tabular-nums">
            API {performance.totalTimeMs}ms (fetch {performance.fetchTimeMs}ms
            · process {performance.processingTimeMs}ms)
          </span>
        </div>
      </div>
    </SectionContainer>
  );
}

function ValidationRemediationSection({
  missingFields,
  recommendations,
  categoryGaps,
  isComplete,
}: {
  missingFields: string[];
  recommendations: string[];
  categoryGaps: ReturnType<typeof breakdownCategoriesBelow>;
  isComplete: boolean;
}) {
  const showMissing = missingFields.length > 0;
  const showRecommendations = recommendations.length > 0;
  const showGaps = !showMissing && !showRecommendations && categoryGaps.length > 0;

  if (showMissing || showRecommendations) {
    return (
      <div
        className={cn(
          "grid border-t border-slate-200",
          showMissing && showRecommendations
            ? "md:grid-cols-2 md:divide-x md:divide-slate-200"
            : "grid-cols-1",
        )}
      >
        {showMissing ? (
          <ValidationIssueList
            title="Missing fields"
            items={missingFields}
            tone="amber"
          />
        ) : null}
        {showRecommendations ? (
          <ValidationIssueList
            title="Recommendations"
            items={recommendations}
            tone="sky"
          />
        ) : null}
      </div>
    );
  }

  if (showGaps) {
    return (
      <div className="border-t border-slate-200">
        <div
          className="flex items-center gap-2 border-b border-slate-200 bg-slate-50/80 px-4 py-2.5 sm:px-5"
        >
          <Sparkles className="h-4 w-4 shrink-0 text-sky-600" aria-hidden />
          <span className="text-sm font-semibold text-slate-900">
            Category gaps
          </span>
          <span className="text-xs text-muted-foreground">
            CMS listed no fields or tips — scores below 80% are shown here
          </span>
        </div>
        <ul className="divide-y divide-slate-200">
          {categoryGaps.map((gap) => (
            <li key={gap.key} className="px-4 py-3 sm:px-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-slate-900">
                  {gap.label}
                </span>
                <span className="text-sm font-semibold tabular-nums text-slate-800">
                  {gap.value}%
                </span>
              </div>
              <p className="mt-1 text-sm leading-snug text-muted-foreground">
                {gap.hint}
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 border-t border-slate-200 px-4 py-4 sm:px-5",
        isComplete ? "bg-emerald-50/60" : "bg-slate-50/80",
      )}
    >
      <CheckCircle2
        className={cn(
          "mt-0.5 h-5 w-5 shrink-0",
          isComplete ? "text-emerald-600" : "text-slate-500",
        )}
        aria-hidden
      />
      <div>
        <p className="text-sm font-medium text-slate-900">
          {isComplete
            ? "No remediation needed"
            : "No explicit issues from CMS"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {isComplete
            ? "Missing fields and recommendations are empty, and every category is at least 80%."
            : "Missing fields and recommendations are empty. Use the category breakdown above if you still want to improve completeness."}
        </p>
      </div>
    </div>
  );
}

function ValidationIssueList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "amber" | "sky";
}) {
  const headerTone = tone === "amber" ? "text-amber-900" : "text-sky-900";
  const iconTone = tone === "amber" ? "text-amber-600" : "text-sky-600";

  return (
    <div>
      <div
        className="flex items-center gap-2 border-b border-slate-200 bg-slate-50/80 px-4 py-2.5 sm:px-5"
      >
        <AlertCircle className={cn("h-4 w-4 shrink-0", iconTone)} aria-hidden />
        <span className={cn("text-sm font-semibold", headerTone)}>
          {title} ({items.length})
        </span>
      </div>
      <ul className="max-h-64 space-y-2 overflow-y-auto px-4 py-3 sm:px-5">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm leading-snug text-slate-700"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
