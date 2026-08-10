"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Label } from "@/components/ui/label";
import { SubsectionTitle } from "@/components/type/titles";
import ComponentRef from "./ComponentRef";
import { FORM_TOKENS } from "./formTokens";

const textareaClassName =
  "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

/**
 * Textarea showcase — basic and labeled multi-line inputs
 */
export default function TextareaShowcase() {
  return (
    <SectionContainer
      title="Textarea"
      description="Multi-line text input component"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Basic</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              default · with value
            </span>
          </div>
          <div className="space-y-2 max-w-md">
            <textarea
              className={textareaClassName}
              placeholder="Enter your message..."
            />
            <textarea
              className={`${textareaClassName} min-h-[120px]`}
              placeholder="Larger textarea"
              defaultValue="Some default content here..."
            />
          </div>
          <ComponentRef token={FORM_TOKENS.textarea.basic} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>With Label</SubsectionTitle>
            <span className="text-xs text-muted-foreground">Label + textarea</span>
          </div>
          <div className="space-y-2 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                className={`${textareaClassName} min-h-[100px]`}
                placeholder="Enter your message..."
              />
            </div>
          </div>
          <ComponentRef token={FORM_TOKENS.textarea.withLabel} />
        </div>
      </div>
    </SectionContainer>
  );
}
