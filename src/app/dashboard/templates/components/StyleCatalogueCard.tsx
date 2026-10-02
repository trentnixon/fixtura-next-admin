"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

export function StyleCatalogueCard({
  name,
  id,
  typeLabel,
  detail,
  published,
  locked,
  publishDisabled,
  onEdit,
  onPreview,
  onTogglePublished,
  onDelete,
  preview,
  note,
  badges,
  typeClassName,
}: {
  name: string;
  id: number;
  typeLabel: string;
  detail?: string;
  published: boolean;
  locked: boolean;
  publishDisabled: boolean;
  onEdit: () => void;
  onPreview?: () => void;
  onTogglePublished: () => void;
  onDelete: () => void;
  preview?: ReactNode;
  note?: string;
  badges?: ReactNode;
  typeClassName?: string;
}) {
  const title = name || "Untitled";
  const publishLocked = locked && published;

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      {preview ? (
        <button
          type="button"
          onClick={onPreview ?? onEdit}
          className="block h-28 w-full"
          aria-label={onPreview ? `View ${title}` : `Edit ${title}`}
        >
          {preview}
        </button>
      ) : null}
      <div className="space-y-3 p-3">
        <div className="flex items-start justify-between gap-2">
          <button type="button" onClick={onEdit} className="min-w-0 text-left">
            <div className="truncate font-medium">{title}</div>
            <div className={cn("truncate text-sm text-muted-foreground", typeClassName)}>{typeLabel}</div>
            {detail ? <div className="line-clamp-2 text-xs text-muted-foreground">{detail}</div> : null}
            {badges ? <div className="mt-2 flex flex-wrap gap-1">{badges}</div> : null}
            {note ? <div className="mt-1 text-xs text-muted-foreground">{note}</div> : null}
            <div className="text-xs text-muted-foreground">#{id}</div>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" aria-label={`Actions for ${title}`}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={locked}
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">{published ? "Published" : "Draft"}</span>
          <span title={publishLocked ? "This row stays published" : undefined}>
            <Switch
              checked={published}
              disabled={publishDisabled}
              onCheckedChange={onTogglePublished}
              aria-label={published ? `Unpublish ${title}` : `Publish ${title}`}
            />
          </span>
        </div>
      </div>
    </article>
  );
}

export function StyleCatalogueEmpty({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
