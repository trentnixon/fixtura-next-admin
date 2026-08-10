import type { ReactNode } from "react";

interface InvoiceFormWorkspaceProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer: ReactNode;
  aside?: ReactNode;
}

/**
 * Invoice editor form workspace — container.pattern.form-workspace
 */
export default function InvoiceFormWorkspace({
  title,
  description,
  children,
  footer,
  aside,
}: InvoiceFormWorkspaceProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-4 py-3">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {aside ? (
        <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">{children}</div>
          <aside className="h-fit rounded-md border border-slate-200 bg-slate-50 p-3 lg:sticky lg:top-4">
            {aside}
          </aside>
        </div>
      ) : (
        <div className="space-y-6 p-4">{children}</div>
      )}

      <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        {footer}
      </div>
    </div>
  );
}
