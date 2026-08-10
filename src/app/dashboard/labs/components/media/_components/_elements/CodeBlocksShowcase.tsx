"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import Code from "@/components/ui-library/foundation/Code";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { SubsectionTitle } from "@/components/type/titles";
import { Code2 } from "lucide-react";
import ComponentRef from "./ComponentRef";
import { MEDIA_TOKENS } from "./mediaTokens";

/**
 * Code blocks showcase — block, inline, and advanced placeholder patterns
 */
export default function CodeBlocksShowcase() {
  return (
    <SectionContainer
      title="Code Blocks"
      description="Code display components with syntax highlighting"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Block</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              {`Code · variant="block"`}
            </span>
          </div>
          <Code variant="block" className="text-sm">
            {`function greet(name: string) {
  return \`Hello, \${name}!\`;
}

const message = greet("World");
console.log(message);`}
          </Code>
          <ComponentRef token={MEDIA_TOKENS.code.block} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Inline</SubsectionTitle>
            <span className="text-xs text-muted-foreground">Code · default variant</span>
          </div>
          <p className="text-sm">
            Use <Code>const x = 1</Code> for inline code snippets.
          </p>
          <ComponentRef token={MEDIA_TOKENS.code.inline} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Advanced (Coming Soon)</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              syntax highlight · copy · editor
            </span>
          </div>
          <EmptyState
            title="Advanced Code Blocks"
            description="Syntax highlighting, code copying, and code editor components will be available here."
            icon={<Code2 className="h-12 w-12 text-muted-foreground" />}
            variant="card"
          />
          <ComponentRef token={MEDIA_TOKENS.code.advanced} />
        </div>
      </div>
    </SectionContainer>
  );
}
