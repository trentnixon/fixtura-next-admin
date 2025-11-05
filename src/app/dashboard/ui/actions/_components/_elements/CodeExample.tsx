"use client";

import { useState } from "react";
import Code from "@/components/ui-library/foundation/Code";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

/**
 * Code Example Component
 * Shows code snippet with copy functionality
 */
export default function CodeExample({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <Code variant="block" className="text-xs">
        {code}
      </Code>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="absolute top-2 right-2 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? (
          <>
            <Check className="h-3 w-3 mr-1" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-3 w-3 mr-1" />
            Copy
          </>
        )}
      </Button>
    </div>
  );
}

