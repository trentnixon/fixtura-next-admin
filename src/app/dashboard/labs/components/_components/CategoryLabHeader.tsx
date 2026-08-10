"use client";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import ComponentRef from "@/app/dashboard/labs/_components/ComponentRef";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import {
  LAB_GUIDE_PATH,
  getCategoryById,
  type LabCategory,
} from "./categories";

export interface CategoryLabHeaderProps {
  categoryId: string;
  /** Override registry title */
  title?: string;
  /** Override registry description (byLine) */
  byLine?: string;
  /** Extra context below byLine */
  byLineBottom?: string;
}

export default function CategoryLabHeader({
  categoryId,
  title,
  byLine,
  byLineBottom,
}: CategoryLabHeaderProps) {
  const category = getCategoryById(categoryId);

  if (!category) {
    return (
      <CreatePageTitle
        title={title ?? "Category"}
        byLine={byLine ?? "Unknown category"}
      />
    );
  }

  const guideHref = category.guideSectionAnchor
    ? `${LAB_GUIDE_PATH}#${category.guideSectionAnchor}`
    : `${LAB_GUIDE_PATH}#category-selection`;

  return (
    <div className="space-y-4">
      <CreatePageTitle
        title={title ?? category.label}
        byLine={byLine ?? category.description}
        byLineBottom={
          byLineBottom ??
          (category.guideUseWhen
            ? category.guideUseWhen
            : `Route: ${category.path}`)
        }
      />
      <CategoryLabMeta category={category} guideHref={guideHref} />
    </div>
  );
}

function CategoryLabMeta({
  category,
  guideHref,
}: {
  category: LabCategory;
  guideHref: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href={guideHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <BookOpen className="h-4 w-4" />
          See LLM guide
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        {category.tokenFileHint ? (
          <span className="font-mono text-xs text-muted-foreground">
            {category.tokenFileHint}
          </span>
        ) : null}
      </div>
      {category.keyTokens && category.keyTokens.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Key tokens
          </p>
          <div className="space-y-2">
            {category.keyTokens.map((token) => (
              <ComponentRef key={token} token={token} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
