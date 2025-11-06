"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle } from "lucide-react";
import CodeExample from "./CodeExample";

/**
 * Form Examples Showcase
 *
 * Displays complete form examples
 */
export default function FormExamplesShowcase() {
  return (
    <SectionContainer
      title="Form Examples"
      description="Complete form examples combining multiple inputs"
    >
      <div className="space-y-6">
        <ElementContainer title="Simple Form">
          <div className="space-y-4 max-w-md p-4 border rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="form-name">Name</Label>
              <Input id="form-name" placeholder="Enter your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="form-email">Email</Label>
              <Input id="form-email" type="email" placeholder="Enter your email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="form-message">Message</Label>
              <textarea
                id="form-message"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter your message..."
              />
            </div>
            <Button>Submit</Button>
          </div>
          <div className="mt-6">
            <CodeExample code={`<div className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="form-name">Name</Label>
    <Input id="form-name" placeholder="Enter your name" />
  </div>
  <div className="space-y-2">
    <Label htmlFor="form-email">Email</Label>
    <Input id="form-email" type="email" placeholder="Enter your email" />
  </div>
  <div className="space-y-2">
    <Label htmlFor="form-message">Message</Label>
    <textarea
      id="form-message"
      className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      placeholder="Enter your message..."
    />
  </div>
  <Button>Submit</Button>
</div>`} />
          </div>
        </ElementContainer>

        <ElementContainer title="Form with Validation States">
          <div className="space-y-4 max-w-md p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="valid-field">Valid Field</Label>
              <Input
                id="valid-field"
                className="border-success-500 focus-visible:ring-success-500"
                defaultValue="Valid input"
              />
              <p className="text-xs text-success-600 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Looks good!
              </p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="error-field">Error Field</Label>
              <Input
                id="error-field"
                className="border-error-500 focus-visible:ring-error-500"
                placeholder="This field has an error"
              />
              <p className="text-xs text-error-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                This field is required
              </p>
            </div>
            <Button>Submit</Button>
          </div>
          <div className="mt-6">
            <CodeExample code={`<div className="space-y-1">
  <Label htmlFor="valid-field">Valid Field</Label>
  <Input
    id="valid-field"
    className="border-success-500 focus-visible:ring-success-500"
    defaultValue="Valid input"
  />
  <p className="text-xs text-success-600 flex items-center gap-1">
    <CheckCircle className="h-3 w-3" />
    Looks good!
  </p>
</div>`} />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}

