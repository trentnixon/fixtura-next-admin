"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import CodeExample from "./CodeExample";

/**
 * Switch Showcase
 *
 * Displays switch component examples
 */
export default function SwitchShowcase() {
  return (
    <SectionContainer
      title="Switch"
      description="Toggle switch component for boolean inputs"
    >
      <div className="space-y-6">
        <ElementContainer title="Basic Switch">
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
          <div className="mt-6">
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
        </ElementContainer>

        <ElementContainer title="Switch Variants">
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
          <div className="mt-6">
            <CodeExample code={`<div className="flex items-center justify-between">
  <Label>Email Notifications</Label>
  <Switch />
</div>
<div className="flex items-center justify-between">
  <Label>Push Notifications</Label>
  <Switch defaultChecked />
</div>`} />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}

