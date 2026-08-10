"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComponentRefProps {
  token: string;
  note?: string;
}

/**
 * Displays a canonical reference token with copy-to-clipboard (component + feature labs).
 */
export default function ComponentRef({ token, note }: ComponentRefProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2">
      <div className="min-w-0 flex-1">
        <span className="font-mono text-sm text-foreground">{token}</span>
        {note ? (
          <span className="ml-2 text-xs text-muted-foreground">({note})</span>
        ) : null}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="h-7 shrink-0 px-2"
        aria-label={`Copy ${token}`}
      >
        {copied ? (
          <Check className="h-4 w-4 text-success-600" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
