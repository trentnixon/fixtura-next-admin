"use client";

import { useRenderDistribution } from "@/hooks/renders/useRenderDistribution";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Users,
  Video,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import { formatNumber } from "@/utils/chart-formatters";

export function RenderResourceLeaders() {
  const { data, isLoading, isError, error } = useRenderDistribution();

  if (isLoading) return <LoadingState message="Fetching leaderboards..." />;
  if (isError) return <ErrorState error={error} title="Distribution Error" />;
  if (!data) return null;

  const totalAssets =
    data.assetDistribution.video +
    data.assetDistribution.image +
    data.assetDistribution.content;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <SectionContainer
          title="Account Leaderboard"
          description="Top accounts by render count (last 12 months)."
        >
          {data.topAccounts.length === 0 ? (
            <EmptyState
              variant="default"
              title="No leaderboard data"
              description="No renders were recorded in the last 12 months for the leaderboard."
            />
          ) : (
            <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="w-[64px] text-center">Rank</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Sport</TableHead>
                    <TableHead className="text-right">Renders</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.topAccounts.map((account, index) => (
                    <TableRow
                      key={account.accountId}
                      className="transition-colors hover:bg-slate-50/70"
                    >
                      <TableCell className="text-center text-xs font-medium text-slate-500">
                        {index === 0 ? (
                          <Trophy className="mx-auto h-4 w-4 text-amber-500" />
                        ) : (
                          index + 1
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-slate-900">
                          {account.accountName || "Unknown Account"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Account ID {account.accountId}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-slate-50 capitalize"
                        >
                          {account.accountType?.toLowerCase() || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {account.accountSport || "General"}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-medium text-slate-900">
                        {formatNumber(account.renderCount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </SectionContainer>
      </div>

      <div className="lg:col-span-1">
        <SectionContainer
          title="Global Asset Mix"
          description="Cumulative downloads and articles (all time)."
        >
          <div className="space-y-4">
            <AssetStatItem
              label="Videos"
              value={data.assetDistribution.video}
              total={totalAssets}
              icon={<Video className="h-4 w-4 text-red-500" />}
              colorClass="bg-red-500"
            />
            <AssetStatItem
              label="Images"
              value={data.assetDistribution.image}
              total={totalAssets}
              icon={<ImageIcon className="h-4 w-4 text-blue-500" />}
              colorClass="bg-blue-500"
            />
            <AssetStatItem
              label="AI Articles"
              value={data.assetDistribution.content}
              total={totalAssets}
              icon={<FileText className="h-4 w-4 text-emerald-500" />}
              colorClass="bg-emerald-500"
            />

            <div className="mt-4 border-t border-slate-100 pt-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase text-muted-foreground">
                    Global Cumulative
                  </p>
                  <p className="text-xl font-semibold text-slate-900">
                    {formatNumber(totalAssets)}
                  </p>
                </div>
                <Users className="h-6 w-6 text-slate-300" />
              </div>
            </div>
          </div>
        </SectionContainer>
      </div>
    </div>
  );
}

function AssetStatItem({
  label,
  value,
  total,
  icon,
  colorClass,
}: {
  label: string;
  value: number;
  total: number;
  icon: React.ReactNode;
  colorClass: string;
}) {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-slate-50">
            {icon}
          </div>
          <span className="text-sm font-medium text-slate-700">{label}</span>
        </div>
        <div className="text-right">
          <span className="block text-sm font-semibold text-slate-900">
            {formatNumber(value)}
          </span>
          <span className="text-[10px] font-semibold uppercase text-muted-foreground">
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
