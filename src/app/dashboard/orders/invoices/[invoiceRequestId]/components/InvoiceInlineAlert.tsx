"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type InvoiceInlineAlertSeverity = "warning" | "error";

interface InvoiceInlineAlertProps {
  severity: InvoiceInlineAlertSeverity;
  title: string;
  children?: ReactNode;
}

const severityStyles: Record<
  InvoiceInlineAlertSeverity,
  { container: string; body: string }
> = {
  warning: {
    container:
      "rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950",
    body: "mt-1 text-amber-900/90",
  },
  error: {
    container:
      "rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive",
    body: "mt-1 opacity-90",
  },
};

export default function InvoiceInlineAlert({
  severity,
  title,
  children,
}: InvoiceInlineAlertProps) {
  const styles = severityStyles[severity];

  return (
    <div className={styles.container} role="alert">
      <p className="font-medium">{title}</p>
      {children != null && children !== "" ? (
        <div className={cn(styles.body)}>{children}</div>
      ) : null}
    </div>
  );
}
