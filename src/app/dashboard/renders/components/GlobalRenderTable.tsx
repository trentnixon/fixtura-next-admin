"use client";

import { useState } from "react";
import Link from "next/link";
import { useRenderAudit } from "@/hooks/renders/useRenderAudit";
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
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { RenderAuditItem } from "@/types/render";
import { formatDate } from "@/utils/chart-formatters";

function RenderStatusBadges({ render }: { render: RenderAuditItem }) {
  return (
    <div className="flex flex-wrap justify-end gap-1">
      {render.Processing && (
        <Badge variant="outline" className="bg-blue-50 text-blue-800 text-xs">
          Processing
        </Badge>
      )}
      {render.Complete && (
        <Badge
          variant="outline"
          className="bg-emerald-50 text-emerald-800 text-xs"
        >
          Complete
        </Badge>
      )}
      {render.EmailSent && (
        <Badge variant="outline" className="bg-slate-50 text-xs">
          Email sent
        </Badge>
      )}
      {render.isGhostRender && (
        <Badge variant="outline" className="bg-amber-50 text-amber-900 text-xs">
          Ghost
        </Badge>
      )}
      {!render.Processing && !render.Complete && !render.isGhostRender && (
        <Badge variant="outline" className="text-xs text-muted-foreground">
          Incomplete
        </Badge>
      )}
    </div>
  );
}

export function GlobalRenderTable() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useRenderAudit(page);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState error={error} />;

  const renders = data?.data ?? [];
  const pagination = data?.pagination;
  const pageSize = pagination?.pageSize ?? 25;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead>Render</TableHead>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="w-24 text-right">Downloads</TableHead>
              <TableHead className="w-24 text-right">Articles</TableHead>
              <TableHead className="w-24 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {renders.map((render) => (
              <TableRow
                key={render.renderId}
                className="transition-colors hover:bg-slate-50/70"
              >
                <TableCell className="py-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-slate-900">
                      {render.renderName || "Unnamed render"}
                    </span>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-mono">#{render.renderId}</span>
                      <span>
                        {formatDate(render.publishedAt || render.createdAt)}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-slate-900">
                        {render.account?.accountName || "Unknown account"}
                      </span>
                      {render.account?.accountType && (
                        <Badge
                          variant="outline"
                          className="bg-slate-50 text-xs"
                        >
                          {render.account.accountType}
                        </Badge>
                      )}
                    </div>
                    {render.account?.accountSport && (
                      <span className="text-xs text-muted-foreground">
                        {render.account.accountSport}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <RenderStatusBadges render={render} />
                </TableCell>
                <TableCell className="text-right font-mono text-sm text-slate-700">
                  {render.downloadsCount}
                </TableCell>
                <TableCell className="text-right font-mono text-sm text-slate-700">
                  {render.aiArticlesCount}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="primary" size="sm" asChild>
                    <Link href={`/dashboard/renders/${render.renderId}`}>
                      View
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {renders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8">
                  <EmptyState
                    variant="minimal"
                    title="No renders found"
                    description="Recent render records will appear here once the CMS returns audit data."
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.pageCount > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="text-xs text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-slate-700">
              {(page - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-slate-700">
              {Math.min(page * pageSize, pagination.total)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-700">
              {pagination.total}
            </span>{" "}
            renders
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
              Page {page} of {pagination.pageCount}
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(Math.min(pagination.pageCount, page + 1))}
              disabled={page === pagination.pageCount}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
