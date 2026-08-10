"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SubsectionTitle } from "@/components/type/titles";
import ComponentRef from "./ComponentRef";
import { FORM_TOKENS } from "./formTokens";

/**
 * Switch showcase — toggle inputs for boolean settings
 */
export default function SwitchShowcase() {
  return (
    <SectionContainer
      title="Switch"
      description="Toggle switch component for boolean inputs"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Basic</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              off · on · disabled
            </span>
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
          <ComponentRef token={FORM_TOKENS.switch.basic} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Settings Row</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              label left · switch right
            </span>
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
          <ComponentRef token={FORM_TOKENS.switch.settings} />
        </div>
      </div>
    </SectionContainer>
  );
}
