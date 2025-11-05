"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CodeExample from "./CodeExample";

/**
 * Button Sizes Showcase
 *
 * Displays examples of different button sizes
 */
export default function ButtonSizesShowcase() {
  return (
    <SectionContainer
      title="Button Sizes"
      description="Different button sizes for various contexts"
    >
      <div className="space-y-6">
        <ElementContainer
          title="All Sizes"
          subtitle="Available button size options"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="primary" size="default">
              Default
            </Button>
            <Button variant="primary" size="lg">
              Large
            </Button>
            <Button variant="primary" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<Button variant="primary" size="sm">Small</Button>
<Button variant="primary" size="default">Default</Button>
<Button variant="primary" size="lg">Large</Button>
<Button variant="primary" size="icon">
  <Plus className="h-4 w-4" />
</Button>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="Size Variations by Variant"
          subtitle="Different sizes applied to various button variants"
        >
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="primary" size="sm">
                Small Primary
              </Button>
              <Button variant="primary" size="default">
                Default Primary
              </Button>
              <Button variant="primary" size="lg">
                Large Primary
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="secondary" size="sm">
                Small Secondary
              </Button>
              <Button variant="secondary" size="default">
                Default Secondary
              </Button>
              <Button variant="secondary" size="lg">
                Large Secondary
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="accent" size="sm">
                Small Accent
              </Button>
              <Button variant="accent" size="default">
                Default Accent
              </Button>
              <Button variant="accent" size="lg">
                Large Accent
              </Button>
            </div>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<Button variant="primary" size="sm">Small Primary</Button>
<Button variant="primary" size="default">Default Primary</Button>
<Button variant="primary" size="lg">Large Primary</Button>
<Button variant="secondary" size="sm">Small Secondary</Button>
<Button variant="secondary" size="default">Default Secondary</Button>
<Button variant="secondary" size="lg">Large Secondary</Button>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
