import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InvoiceFormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Compact section inside InvoiceFormWorkspace — no nested card chrome.
 */
export default function InvoiceFormSection({
  title,
  description,
  children,
  className,
}: InvoiceFormSectionProps) {
  return (
    <section
      className={cn(
        "space-y-4 border-b border-slate-200 pb-6 last:border-b-0 last:pb-0",
        className
      )}
    >
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}
