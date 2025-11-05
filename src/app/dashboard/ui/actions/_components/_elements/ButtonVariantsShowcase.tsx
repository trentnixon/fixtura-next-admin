"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Button } from "@/components/ui/button";
import CodeExample from "./CodeExample";

/**
 * Button Variants Showcase
 *
 * Displays examples of different button variants
 */
export default function ButtonVariantsShowcase() {
  return (
    <SectionContainer
      title="Button Variants"
      description="Different button styles for various use cases"
    >
      <div className="space-y-6">
        <ElementContainer
          title="Brand Color Variants"
          subtitle="Primary, Secondary, and Accent brand colors"
        >
          <div className="flex flex-wrap gap-2">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="accent">Accent</Button>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import { Button } from "@/components/ui/button";

<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="accent">Accent</Button>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="All Variants"
          subtitle="Complete set of available button variants"
        >
          <div className="flex flex-wrap gap-2">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="accent">Accent</Button>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import { Button } from "@/components/ui/button";

<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="accent">Accent</Button>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="Use Cases"
          subtitle="Examples of when to use each variant"
        >
          <div className="flex flex-wrap gap-2">
            <Button variant="primary">Primary Action</Button>
            <Button variant="secondary">Secondary Action</Button>
            <Button variant="accent">Highlight Action</Button>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="accent">Highlight Action</Button>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
