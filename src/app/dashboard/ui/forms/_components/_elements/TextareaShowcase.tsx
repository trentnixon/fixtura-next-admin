"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Label } from "@/components/ui/label";
import CodeExample from "./CodeExample";

/**
 * Textarea Showcase
 *
 * Displays textarea component examples
 */
export default function TextareaShowcase() {
  return (
    <SectionContainer
      title="Textarea"
      description="Multi-line text input component"
    >
      <div className="space-y-6">
        <ElementContainer title="Basic Textarea">
          <div className="space-y-2 max-w-md">
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter your message..."
            />
            <textarea
              className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Larger textarea"
              defaultValue="Some default content here..."
            />
          </div>
          <div className="mt-6">
            <CodeExample code={`<textarea
  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
  placeholder="Enter your message..."
/>`} />
          </div>
        </ElementContainer>

        <ElementContainer title="Textarea with Label">
          <div className="space-y-2 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter your message..."
              />
            </div>
          </div>
          <div className="mt-6">
            <CodeExample code={`<div className="space-y-2">
  <Label htmlFor="message">Message</Label>
  <textarea
    id="message"
    className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
    placeholder="Enter your message..."
  />
</div>`} />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}

