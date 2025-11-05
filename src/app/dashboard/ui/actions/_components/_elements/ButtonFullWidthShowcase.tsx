"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import CodeExample from "./CodeExample";

/**
 * Button Full Width Showcase
 *
 * Displays examples of full-width buttons
 */
export default function ButtonFullWidthShowcase() {
  return (
    <SectionContainer
      title="Full Width Buttons"
      description="Buttons that span full width of container"
    >
      <div className="space-y-6">
        <ElementContainer
          title="Full Width Examples"
          subtitle="Buttons spanning full container width"
        >
          <div className="space-y-2 max-w-md">
            <Button variant="primary" className="w-full">
              Full Width Primary
            </Button>
            <Button variant="secondary" className="w-full">
              Full Width Secondary
            </Button>
            <Button variant="accent" className="w-full">
              Full Width Accent
            </Button>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<Button variant="primary" className="w-full">
  Full Width Primary
</Button>
<Button variant="secondary" className="w-full">
  Full Width Secondary
</Button>
<Button variant="accent" className="w-full">
  Full Width Accent
</Button>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="Full Width with Icons"
          subtitle="Full-width buttons with icons"
        >
          <div className="space-y-2 max-w-md">
            <Button variant="primary" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add New Item
            </Button>
            <Button variant="secondary" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
            <Button variant="accent" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create Account
            </Button>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<Button variant="primary" className="w-full">
  <Plus className="h-4 w-4 mr-2" />
  Add New Item
</Button>
<Button variant="secondary" className="w-full">
  <Download className="h-4 w-4 mr-2" />
  Download All
</Button>
<Button variant="accent" className="w-full">
  <Plus className="h-4 w-4 mr-2" />
  Create Account
</Button>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
