"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui-library/states/ErrorState";
import LoadingState from "@/components/ui-library/states/LoadingState";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, cn } from "@/lib/utils";
import type { ContactFormSubmission } from "@/types/contact-form";

interface ContactFormAttentionListProps {
  items: ContactFormSubmission[];
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void;
}

function attentionLabel(submission: ContactFormSubmission): string {
  if (!submission.hasSeen && !submission.Acknowledged) return "New";
  if (!submission.hasSeen) return "Unseen";
  return "Unacknowledged";
}

function attentionBadgeClass(submission: ContactFormSubmission): string {
  if (!submission.hasSeen && !submission.Acknowledged) {
    return "border-rose-300 bg-rose-50 text-rose-900";
  }
  if (!submission.hasSeen) {
    return "border-amber-300 bg-amber-50 text-amber-900";
  }
  return "border-orange-300 bg-orange-50 text-orange-900";
}

export function ContactFormAttentionList({
  items,
  isLoading,
  error,
  onRetry,
}: ContactFormAttentionListProps) {
  if (isLoading) {
    return (
      <LoadingState variant="skeleton">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </LoadingState>
    );
  }

  if (error) {
    return (
      <ErrorState
        variant="default"
        title="Could not load contact submissions"
        error={error}
        onRetry={onRetry}
      />
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-muted-foreground">
        No unseen or unacknowledged submissions.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200">
      {items.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-1 gap-2 border-b border-slate-200 px-3 py-2.5 last:border-b-0 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-3"
        >
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-slate-900">
              {item.subject ?? "No subject"}
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
              <span className="truncate">{item.name ?? "Unknown"}</span>
              {item.email ? (
                <>
                  <span className="text-muted-foreground/60">·</span>
                  <span className="truncate">{item.email}</span>
                </>
              ) : null}
              {item.timestamp ? (
                <>
                  <span className="text-muted-foreground/60">·</span>
                  <span>{formatDate(item.timestamp)}</span>
                </>
              ) : null}
            </div>
          </div>

          <Badge
            variant="outline"
            className={cn("w-fit shrink-0", attentionBadgeClass(item))}
          >
            {attentionLabel(item)}
          </Badge>

          <Button variant="primary" size="sm" asChild className="w-fit shrink-0">
            <Link href="/dashboard/contact">
              Inbox
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      ))}
    </div>
  );
}
