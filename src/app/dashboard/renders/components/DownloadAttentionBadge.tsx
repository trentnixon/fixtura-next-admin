import { Badge } from "@/components/ui/badge";
import {
  downloadAttentionLabel,
  type DownloadAttentionBucket,
} from "@/lib/downloads/downloadAttention";
import { downloadStatusLabel } from "@/lib/downloads/downloadStatusTimeline";
import { cn } from "@/lib/utils";

const BUCKET_CLASS: Record<DownloadAttentionBucket, string> = {
  failed: "border-red-200 bg-red-50 text-red-800",
  in_progress: "border-amber-200 bg-amber-50 text-amber-900",
  ok: "border-emerald-200 bg-emerald-50 text-emerald-800",
  unknown: "border-slate-200 bg-slate-100 text-slate-700",
};

export function DownloadAttentionBadge({
  bucket,
  className,
  labelMode = "attention",
}: {
  bucket: DownloadAttentionBucket;
  className?: string;
  labelMode?: "attention" | "status";
}) {
  const label =
    labelMode === "status"
      ? downloadStatusLabel(bucket)
      : downloadAttentionLabel(bucket);

  return (
    <Badge
      variant="outline"
      className={cn("capitalize", BUCKET_CLASS[bucket], className)}
    >
      {label}
    </Badge>
  );
}
