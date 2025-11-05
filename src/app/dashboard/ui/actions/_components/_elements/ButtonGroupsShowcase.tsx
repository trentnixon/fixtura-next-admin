"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Button } from "@/components/ui/button";
import { Edit, Download, Trash2 } from "lucide-react";
import CodeExample from "./CodeExample";

/**
 * Button Groups Showcase
 *
 * Displays examples of grouped buttons
 */
export default function ButtonGroupsShowcase() {
  return (
    <SectionContainer
      title="Button Groups"
      description="Grouped buttons for related actions"
    >
      <div className="space-y-6">
        <ElementContainer
          title="Horizontal Button Group"
          subtitle="Buttons grouped together horizontally"
        >
          <div className="flex gap-0 border rounded-md overflow-hidden w-fit">
            <Button
              variant="primary"
              className="rounded-none border-0 border-r"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="secondary"
              className="rounded-none border-0 border-r"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="accent" className="rounded-none border-0">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<div className="flex gap-0 border rounded-md overflow-hidden">
  <Button variant="primary" className="rounded-none border-0 border-r">
    <Edit className="h-4 w-4 mr-2" />
    Edit
  </Button>
  <Button variant="secondary" className="rounded-none border-0 border-r">
    <Download className="h-4 w-4 mr-2" />
    Export
  </Button>
  <Button variant="accent" className="rounded-none border-0">
    <Trash2 className="h-4 w-4 mr-2" />
    Delete
  </Button>
</div>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="Button Group with Active State"
          subtitle="Button group showing active/selected state"
        >
          <div className="flex gap-0 border rounded-md overflow-hidden w-fit">
            <Button
              variant="primary"
              className="rounded-none border-0 border-r"
            >
              View
            </Button>
            <Button
              variant="secondary"
              className="rounded-none border-0 border-r"
            >
              Edit
            </Button>
            <Button variant="accent" className="rounded-none border-0">
              Delete
            </Button>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<div className="flex gap-0 border rounded-md overflow-hidden">
  <Button variant="primary" className="rounded-none border-0 border-r">
    View
  </Button>
  <Button variant="secondary" className="rounded-none border-0 border-r">
    Edit
  </Button>
  <Button variant="accent" className="rounded-none border-0">
    Delete
  </Button>
</div>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="Icon Button Group"
          subtitle="Group of icon-only buttons"
        >
          <div className="flex gap-1">
            <Button size="icon" variant="primary">
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary">
              <Download className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="accent">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<div className="flex gap-1">
  <Button size="icon" variant="primary">
    <Edit className="h-4 w-4" />
  </Button>
  <Button size="icon" variant="secondary">
    <Download className="h-4 w-4" />
  </Button>
  <Button size="icon" variant="accent">
    <Trash2 className="h-4 w-4" />
  </Button>
</div>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
