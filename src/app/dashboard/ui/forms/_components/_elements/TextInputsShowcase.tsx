"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Mail, Link as LinkIcon, AlertCircle, CheckCircle } from "lucide-react";
import CodeExample from "./CodeExample";

/**
 * Text Inputs Showcase
 *
 * Displays text input component examples
 */
export default function TextInputsShowcase() {
  return (
    <SectionContainer
      title="Text Inputs"
      description="Basic text input components with various types"
    >
      <div className="space-y-6">
        <ElementContainer title="Basic Input">
          <div className="space-y-2 max-w-md">
            <Input type="text" placeholder="Enter text..." />
            <Input type="text" placeholder="With value" defaultValue="John Doe" />
            <Input type="text" placeholder="Disabled" disabled />
          </div>
          <div className="mt-6">
            <CodeExample code={`import { Input } from "@/components/ui/input";

<Input type="text" placeholder="Enter text..." />
<Input type="text" placeholder="With value" defaultValue="John Doe" />
<Input type="text" placeholder="Disabled" disabled />`} />
          </div>
        </ElementContainer>

        <ElementContainer title="Input Types">
          <div className="space-y-2 max-w-md">
            <Input type="email" placeholder="email@example.com" />
            <Input type="password" placeholder="Password" />
            <Input type="number" placeholder="123" />
            <Input type="tel" placeholder="+1 (555) 000-0000" />
            <Input type="url" placeholder="https://example.com" />
            <Input type="search" placeholder="Search..." />
          </div>
          <div className="mt-6">
            <CodeExample code={`<Input type="email" placeholder="email@example.com" />
<Input type="password" placeholder="Password" />
<Input type="number" placeholder="123" />
<Input type="tel" placeholder="+1 (555) 000-0000" />
<Input type="url" placeholder="https://example.com" />
<Input type="search" placeholder="Search..." />`} />
          </div>
        </ElementContainer>

        <ElementContainer title="Input with Label">
          <div className="space-y-2 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Enter your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
          </div>
          <div className="mt-6">
            <CodeExample code={`import { Label } from "@/components/ui/label";

<div className="space-y-2">
  <Label htmlFor="name">Name</Label>
  <Input id="name" placeholder="Enter your name" />
</div>
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter your email" />
</div>`} />
          </div>
        </ElementContainer>

        <ElementContainer title="Input with Icons">
          <div className="space-y-2 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search..." />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" type="email" placeholder="Email" />
            </div>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" type="url" placeholder="URL" />
            </div>
          </div>
          <div className="mt-6">
            <CodeExample code={`import { Search, Mail } from "lucide-react";

<div className="relative">
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <Input className="pl-9" placeholder="Search..." />
</div>`} />
          </div>
        </ElementContainer>

        <ElementContainer title="Input States">
          <div className="space-y-2 max-w-md">
            <div className="space-y-1">
              <Label htmlFor="error-input">Error State</Label>
              <Input
                id="error-input"
                className="border-error-500 focus-visible:ring-error-500"
                placeholder="This field has an error"
              />
              <p className="text-xs text-error-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                This field is required
              </p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="success-input">Success State</Label>
              <Input
                id="success-input"
                className="border-success-500 focus-visible:ring-success-500"
                placeholder="This field is valid"
                defaultValue="Valid input"
              />
              <p className="text-xs text-success-600 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Looks good!
              </p>
            </div>
          </div>
          <div className="mt-6">
            <CodeExample code={`<div className="space-y-1">
  <Label htmlFor="error-input">Error State</Label>
  <Input
    id="error-input"
    className="border-error-500 focus-visible:ring-error-500"
    placeholder="This field has an error"
  />
  <p className="text-xs text-error-600 flex items-center gap-1">
    <AlertCircle className="h-3 w-3" />
    This field is required
  </p>
</div>`} />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}

