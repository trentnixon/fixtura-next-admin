"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import CodeExample from "./CodeExample";

/**
 * Button States Showcase
 *
 * Displays examples of different button states
 */
export default function ButtonStatesShowcase() {
  return (
    <SectionContainer
      title="Button States"
      description="Different button states (disabled, loading, etc.)"
    >
      <div className="space-y-6">
        <ElementContainer
          title="Disabled Buttons"
          subtitle="Buttons in disabled state"
        >
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" disabled>
              Disabled Primary
            </Button>
            <Button variant="secondary" disabled>
              Disabled Secondary
            </Button>
            <Button variant="accent" disabled>
              Disabled Accent
            </Button>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<Button variant="primary" disabled>Disabled Primary</Button>
<Button variant="secondary" disabled>Disabled Secondary</Button>
<Button variant="accent" disabled>Disabled Accent</Button>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="Loading Buttons"
          subtitle="Buttons showing loading state"
        >
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" disabled>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </Button>
            <Button variant="secondary" disabled>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing
            </Button>
            <Button variant="accent" size="icon" disabled>
              <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import { Loader2 } from "lucide-react";

<Button variant="primary" disabled>
  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
  Loading...
</Button>
<Button variant="secondary" disabled>
  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
  Processing
</Button>
<Button variant="accent" size="icon" disabled>
  <Loader2 className="h-4 w-4 animate-spin" />
</Button>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="Success State"
          subtitle="Buttons showing success state"
        >
          <div className="flex flex-wrap gap-2">
            <Button
              variant="primary"
              className="bg-brandSuccess-600 hover:bg-brandSuccess-700 border-brandSuccess-600"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Success
            </Button>
            <Button
              variant="secondary"
              className="border-brandSuccess-600 text-brandSuccess-600 hover:bg-brandSuccess-50"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Saved
            </Button>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import { CheckCircle } from "lucide-react";

<Button variant="primary" className="bg-brandSuccess-600 hover:bg-brandSuccess-700 border-brandSuccess-600">
  <CheckCircle className="h-4 w-4 mr-2" />
  Success
</Button>
<Button variant="secondary" className="border-brandSuccess-600 text-brandSuccess-600 hover:bg-brandSuccess-50">
  <CheckCircle className="h-4 w-4 mr-2" />
  Saved
</Button>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
