"use client";

import { useState } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { SubsectionTitle } from "@/components/type/titles";
import Code from "@/components/ui-library/foundation/Code";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Copy, Check, Search, Mail, Link as LinkIcon, AlertCircle, CheckCircle } from "lucide-react";

/**
 * Code Example Component
 */
function CodeExample({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <Code variant="block" className="text-xs">
        {code}
      </Code>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="absolute top-2 right-2 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? (
          <>
            <Check className="h-3 w-3 mr-1" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-3 w-3 mr-1" />
            Copy
          </>
        )}
      </Button>
    </div>
  );
}

/**
 * Forms Showcase Component
 *
 * Displays all form input components with examples
 */
export default function FormsShowcase() {
  return (
    <>
      {/* Text Inputs */}
      <SectionContainer
        title="Text Inputs"
        description="Basic text input components with various types"
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Basic Input</SubsectionTitle>
              </div>
              <div className="space-y-2 max-w-md">
                <Input type="text" placeholder="Enter text..." />
                <Input type="text" placeholder="With value" defaultValue="John Doe" />
                <Input type="text" placeholder="Disabled" disabled />
              </div>
              <CodeExample code={`import { Input } from "@/components/ui/input";

<Input type="text" placeholder="Enter text..." />
<Input type="text" placeholder="With value" defaultValue="John Doe" />
<Input type="text" placeholder="Disabled" disabled />`} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Input Types</SubsectionTitle>
              </div>
              <div className="space-y-2 max-w-md">
                <Input type="email" placeholder="email@example.com" />
                <Input type="password" placeholder="Password" />
                <Input type="number" placeholder="123" />
                <Input type="tel" placeholder="+1 (555) 000-0000" />
                <Input type="url" placeholder="https://example.com" />
                <Input type="search" placeholder="Search..." />
              </div>
              <CodeExample code={`<Input type="email" placeholder="email@example.com" />
<Input type="password" placeholder="Password" />
<Input type="number" placeholder="123" />
<Input type="tel" placeholder="+1 (555) 000-0000" />
<Input type="url" placeholder="https://example.com" />
<Input type="search" placeholder="Search..." />`} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Input with Label</SubsectionTitle>
              </div>
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

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Input with Icons</SubsectionTitle>
              </div>
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
              <CodeExample code={`import { Search, Mail } from "lucide-react";

<div className="relative">
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <Input className="pl-9" placeholder="Search..." />
</div>`} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Input States</SubsectionTitle>
              </div>
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
          </div>
        </div>
      </SectionContainer>

      {/* Textarea */}
      <SectionContainer
        title="Textarea"
        description="Multi-line text input component"
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Basic Textarea</SubsectionTitle>
              </div>
              <div className="space-y-2 max-w-md">
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter your message..."
                />
                <textarea
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Larger textarea"
                  defaultValue="Some default content here..."
                />
              </div>
              <CodeExample code={`<textarea
  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
  placeholder="Enter your message..."
/>`} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Textarea with Label</SubsectionTitle>
              </div>
              <div className="space-y-2 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    id="message"
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter your message..."
                  />
                </div>
              </div>
              <CodeExample code={`<div className="space-y-2">
  <Label htmlFor="message">Message</Label>
  <textarea
    id="message"
    className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
    placeholder="Enter your message..."
  />
</div>`} />
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Select */}
      <SectionContainer
        title="Select"
        description="Dropdown select component for single selection"
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Basic Select</SubsectionTitle>
              </div>
              <div className="space-y-2 max-w-md">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                    <SelectItem value="option3">Option 3</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="option2">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                    <SelectItem value="option3">Option 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CodeExample code={`import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>`} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Select with Label</SubsectionTitle>
              </div>
              <div className="space-y-2 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select>
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <CodeExample code={`<div className="space-y-2">
  <Label htmlFor="country">Country</Label>
  <Select>
    <SelectTrigger id="country">
      <SelectValue placeholder="Select a country" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="us">United States</SelectItem>
      <SelectItem value="uk">United Kingdom</SelectItem>
    </SelectContent>
  </Select>
</div>`} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Select with Groups</SubsectionTitle>
              </div>
              <div className="space-y-2 max-w-md">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Fruits</SelectLabel>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Vegetables</SelectLabel>
                      <SelectItem value="carrot">Carrot</SelectItem>
                      <SelectItem value="broccoli">Broccoli</SelectItem>
                      <SelectItem value="spinach">Spinach</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <CodeExample code={`import {
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select";

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select a category" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Fruits</SelectLabel>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Vegetables</SelectLabel>
      <SelectItem value="carrot">Carrot</SelectItem>
      <SelectItem value="broccoli">Broccoli</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Disabled Select</SubsectionTitle>
              </div>
              <div className="space-y-2 max-w-md">
                <Select disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="Disabled select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CodeExample code={`<Select disabled>
  <SelectTrigger>
    <SelectValue placeholder="Disabled select" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
  </SelectContent>
</Select>`} />
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Switch */}
      <SectionContainer
        title="Switch"
        description="Toggle switch component for boolean inputs"
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Basic Switch</SubsectionTitle>
              </div>
              <div className="flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-2">
                  <Switch id="switch1" />
                  <Label htmlFor="switch1">Enable notifications</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="switch2" defaultChecked />
                  <Label htmlFor="switch2">Enable dark mode</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="switch3" disabled />
                  <Label htmlFor="switch3">Disabled switch</Label>
                </div>
              </div>
              <CodeExample code={`import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

<div className="flex items-center gap-2">
  <Switch id="switch1" />
  <Label htmlFor="switch1">Enable notifications</Label>
</div>
<div className="flex items-center gap-2">
  <Switch id="switch2" defaultChecked />
  <Label htmlFor="switch2">Enable dark mode</Label>
</div>`} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Switch Variants</SubsectionTitle>
              </div>
              <div className="space-y-4 max-w-md">
                <div className="flex items-center justify-between">
                  <Label>Email Notifications</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Push Notifications</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>SMS Notifications</Label>
                  <Switch disabled />
                </div>
              </div>
              <CodeExample code={`<div className="flex items-center justify-between">
  <Label>Email Notifications</Label>
  <Switch />
</div>
<div className="flex items-center justify-between">
  <Label>Push Notifications</Label>
  <Switch defaultChecked />
</div>`} />
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Checkbox & Radio (Native HTML) */}
      <SectionContainer
        title="Checkbox & Radio"
        description="Checkbox and radio button components using native HTML"
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Checkboxes</SubsectionTitle>
              </div>
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
              <CodeExample code={`<div className="flex items-center gap-2">
  <input
    type="checkbox"
    id="checkbox1"
    className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  />
  <Label htmlFor="checkbox1">Accept terms and conditions</Label>
</div>`} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Radio Buttons</SubsectionTitle>
              </div>
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
          </div>
        </div>
      </SectionContainer>

      {/* Form Examples */}
      <SectionContainer
        title="Form Examples"
        description="Complete form examples combining multiple inputs"
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Simple Form</SubsectionTitle>
              </div>
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

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Form with Validation States</SubsectionTitle>
              </div>
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
          </div>
        </div>
      </SectionContainer>

      {/* Usage Guidelines */}
      <SectionContainer
        title="Usage Guidelines"
        description="Best practices for using form components"
      >
        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Input Types</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Use appropriate input types for better UX (email, password, number, etc.)</li>
              <li>Always provide labels for accessibility</li>
              <li>Use placeholders to guide users</li>
              <li>Show validation states (error, success) with helper text</li>
              <li>Disable inputs when not applicable</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">Select Components</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Use for single selection from a list</li>
              <li>Group related options with SelectGroup and SelectLabel</li>
              <li>Use SelectSeparator to visually separate groups</li>
              <li>Always provide a placeholder when no value is selected</li>
              <li>Limit options to reasonable number (use searchable select for many options)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">Switch Components</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Use for boolean on/off settings</li>
              <li>Always pair with a label</li>
              <li>Show current state clearly</li>
              <li>Disable when setting cannot be changed</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">Checkboxes & Radio</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Use checkboxes for multiple selections</li>
              <li>Use radio buttons for single selection from a group</li>
              <li>Always group radio buttons with the same name attribute</li>
              <li>Provide clear labels for each option</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">Form Layout</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Use consistent spacing between form fields</li>
              <li>Group related fields together</li>
              <li>Use labels above inputs for better readability</li>
              <li>Provide clear submit buttons</li>
              <li>Show validation feedback immediately when possible</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">Accessibility</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Always associate labels with inputs using htmlFor/id</li>
              <li>Provide error messages that are accessible to screen readers</li>
              <li>Ensure sufficient color contrast</li>
              <li>Support keyboard navigation</li>
              <li>Use appropriate ARIA attributes when needed</li>
            </ul>
          </div>
        </div>
      </SectionContainer>
    </>
  );
}

