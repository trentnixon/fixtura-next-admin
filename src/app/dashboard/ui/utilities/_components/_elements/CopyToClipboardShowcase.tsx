"use client";

import { useState } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";
import CodeExample from "./CodeExample";

/**
 * Copy to Clipboard Showcase
 *
 * Displays various copy to clipboard patterns
 */
export default function CopyToClipboardShowcase() {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  return (
    <SectionContainer
      title="Copy to Clipboard"
      description="Copy text and values to clipboard with visual feedback"
    >
      <div className="space-y-6">
        <ElementContainer title="Copy Button">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-muted/50">
              <span className="text-sm font-mono">user-123-abc</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy("user-123-abc", "button-1")}
                className="h-7 w-7 p-0"
              >
                {copiedStates["button-1"] ? (
                  <Check className="h-4 w-4 text-success-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`const [copied, setCopied] = useState(false);

const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};

<Button onClick={() => handleCopy("user-123-abc")}>
  {copied ? <Check /> : <Copy />}
</Button>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Copy Input Field">
          <div className="max-w-md">
            <div className="flex gap-2">
              <Input
                readOnly
                value="https://example.com/share/abc123xyz"
                className="bg-muted/50"
              />
              <Button
                variant="primary"
                onClick={() =>
                  handleCopy("https://example.com/share/abc123xyz", "input-1")
                }
              >
                {copiedStates["input-1"] ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<div className="flex gap-2">
  <Input readOnly value="https://example.com/share/abc123xyz" />
  <Button onClick={() => handleCopy(url)}>
    {copied ? (
      <>
        <Check className="h-4 w-4 mr-2" />
        Copied!
      </>
    ) : (
      <>
        <Copy className="h-4 w-4 mr-2" />
        Copy
      </>
    )}
  </Button>
</div>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Inline Copy">
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group">
              <div>
                <span className="text-sm font-medium">API Key</span>
                <span className="text-xs text-muted-foreground ml-2 font-mono">
                  sk_live_abc123xyz789
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy("sk_live_abc123xyz789", "inline-1")}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copiedStates["inline-1"] ? (
                  <Check className="h-4 w-4 text-success-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 group">
  <div>
    <span className="text-sm font-medium">API Key</span>
    <span className="text-xs text-muted-foreground ml-2 font-mono">
      sk_live_abc123xyz789
    </span>
  </div>
  <Button
    variant="ghost"
    size="sm"
    onClick={() => handleCopy(apiKey)}
    className="opacity-0 group-hover:opacity-100"
  >
    {copied ? <Check /> : <Copy />}
  </Button>
</div>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
