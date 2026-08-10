"use client";

import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface InvoiceUrlActionsProps {
  url: string;
  label: string;
}

export default function InvoiceUrlActions({
  url,
  label,
}: InvoiceUrlActionsProps) {
  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(trimmed);
      toast.success(`${label} copied`);
    } catch {
      toast.error(`Could not copy ${label.toLowerCase()}`);
    }
  }

  return (
    <div className="flex shrink-0 gap-1">
      <Button variant="outline" size="sm" asChild>
        <a
          href={trimmed}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${label}`}
        >
          <ExternalLink className="h-4 w-4" />
          Open
        </a>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => void handleCopy()}
        aria-label={`Copy ${label}`}
      >
        <Copy className="h-4 w-4" />
        Copy
      </Button>
    </div>
  );
}
