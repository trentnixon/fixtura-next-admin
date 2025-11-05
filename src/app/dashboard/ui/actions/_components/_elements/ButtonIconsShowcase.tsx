"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Download,
  Trash2,
  Edit,
  Save,
  X,
  ArrowRight,
} from "lucide-react";
import CodeExample from "./CodeExample";

/**
 * Button Icons Showcase
 *
 * Displays examples of buttons with icons
 */
export default function ButtonIconsShowcase() {
  return (
    <SectionContainer
      title="Buttons with Icons"
      description="Buttons with icons for better visual context"
    >
      <div className="space-y-6">
        <ElementContainer
          title="Icon Before Text"
          subtitle="Icons positioned before button text"
        >
          <div className="flex flex-wrap gap-2">
            <Button variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
            <Button variant="secondary">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="accent">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button variant="primary">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="secondary">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import { Plus, Download, Trash2 } from "lucide-react";

<Button variant="primary">
  <Plus className="h-4 w-4 mr-2" />
  Add New
</Button>
<Button variant="secondary">
  <Download className="h-4 w-4 mr-2" />
  Download
</Button>
<Button variant="accent">
  <Trash2 className="h-4 w-4 mr-2" />
  Delete
</Button>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="Icon After Text"
          subtitle="Icons positioned after button text"
        >
          <div className="flex flex-wrap gap-2">
            <Button variant="primary">
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="secondary">
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="accent">
              Learn More
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<Button variant="primary">
  Continue
  <ArrowRight className="h-4 w-4 ml-2" />
</Button>
<Button variant="secondary">
  Next
  <ArrowRight className="h-4 w-4 ml-2" />
</Button>
<Button variant="accent">
  Learn More
  <ArrowRight className="h-4 w-4 ml-2" />
</Button>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="Icon-Only Buttons"
          subtitle="Buttons with icons only, no text"
        >
          <div className="flex flex-wrap gap-2">
            <Button size="icon" variant="primary">
              <Plus className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary">
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="accent">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="primary">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<Button size="icon" variant="primary">
  <Plus className="h-4 w-4" />
</Button>
<Button size="icon" variant="secondary">
  <Edit className="h-4 w-4" />
</Button>
<Button size="icon" variant="accent">
  <Trash2 className="h-4 w-4" />
</Button>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}

