"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import Code from "@/components/ui-library/foundation/Code";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { Code2 } from "lucide-react";
import CodeExample from "./CodeExample";

/**
 * Code Blocks Showcase
 *
 * Displays Code Block component examples
 */
export default function CodeBlocksShowcase() {
  return (
    <SectionContainer
      title="Code Blocks"
      description="Code display components with syntax highlighting"
    >
      <div className="space-y-6">
        <ElementContainer title="Basic Code Block">
          <Code variant="block" className="text-sm">
            {`function greet(name: string) {
  return \`Hello, \${name}!\`;
}

const message = greet("World");
console.log(message);`}
          </Code>
          <div className="mt-6">
            <CodeExample
              code={`import Code from "@/components/ui-library/foundation/Code";

<Code variant="block" className="text-sm">
  {\`function greet(name: string) {
  return \\\`Hello, \\\${name}!\\\`;
}\`}
</Code>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Inline Code">
          <p className="text-sm">
            Use <Code>const x = 1</Code> for inline code snippets.
          </p>
          <div className="mt-6">
            <CodeExample
              code={`import Code from "@/components/ui-library/foundation/Code";

<p>
  Use <Code>const x = 1</Code> for inline code snippets.
</p>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Coming Soon">
          <EmptyState
            title="Advanced Code Blocks"
            description="Syntax highlighting, code copying, and code editor components will be available here."
            icon={<Code2 className="h-12 w-12 text-muted-foreground" />}
            variant="card"
          />
          <div className="mt-6">
            <CodeExample
              code={`// Advanced code components coming soon
// Planned features:
// - SyntaxHighlighter component
// - CodeBlock with copy functionality
// - CodeEditor component
// - Language-specific syntax highlighting`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
