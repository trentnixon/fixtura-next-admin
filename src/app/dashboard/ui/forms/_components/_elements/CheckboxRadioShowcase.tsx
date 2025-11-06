"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Label } from "@/components/ui/label";
import CodeExample from "./CodeExample";

/**
 * Checkbox & Radio Showcase
 *
 * Displays checkbox and radio button examples
 */
export default function CheckboxRadioShowcase() {
  return (
    <SectionContainer
      title="Checkbox & Radio"
      description="Checkbox and radio button components using native HTML"
    >
      <div className="space-y-6">
        <ElementContainer title="Checkboxes">
          <div className="space-y-3 max-w-md">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="checkbox1"
                className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Label htmlFor="checkbox1">Accept terms and conditions</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="checkbox2"
                defaultChecked
                className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Label htmlFor="checkbox2">Subscribe to newsletter</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="checkbox3"
                disabled
                className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Label htmlFor="checkbox3">Disabled checkbox</Label>
            </div>
          </div>
          <div className="mt-6">
            <CodeExample code={`<div className="flex items-center gap-2">
  <input
    type="checkbox"
    id="checkbox1"
    className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  />
  <Label htmlFor="checkbox1">Accept terms and conditions</Label>
</div>`} />
          </div>
        </ElementContainer>

        <ElementContainer title="Radio Buttons">
          <div className="space-y-3 max-w-md">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="radio1"
                name="option"
                value="option1"
                className="h-4 w-4 border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Label htmlFor="radio1">Option 1</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="radio2"
                name="option"
                value="option2"
                defaultChecked
                className="h-4 w-4 border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Label htmlFor="radio2">Option 2</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="radio3"
                name="option"
                value="option3"
                className="h-4 w-4 border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Label htmlFor="radio3">Option 3</Label>
            </div>
          </div>
          <div className="mt-6">
            <CodeExample code={`<div className="flex items-center gap-2">
  <input
    type="radio"
    id="radio1"
    name="option"
    value="option1"
    className="h-4 w-4 border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  />
  <Label htmlFor="radio1">Option 1</Label>
</div>
<div className="flex items-center gap-2">
  <input
    type="radio"
    id="radio2"
    name="option"
    value="option2"
    defaultChecked
    className="h-4 w-4 border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  />
  <Label htmlFor="radio2">Option 2</Label>
</div>`} />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}

