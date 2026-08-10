"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Label } from "@/components/ui/label";
import { SubsectionTitle } from "@/components/type/titles";
import ComponentRef from "./ComponentRef";
import { FORM_TOKENS } from "./formTokens";

const checkboxClassName =
  "h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const radioClassName =
  "h-4 w-4 border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

/**
 * Checkbox and radio showcase — native HTML input patterns
 */
export default function CheckboxRadioShowcase() {
  return (
    <SectionContainer
      title="Checkbox & Radio"
      description="Checkbox and radio button components using native HTML"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Checkbox</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              default · checked · disabled
            </span>
          </div>
          <div className="space-y-3 max-w-md">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="checkbox1"
                className={checkboxClassName}
              />
              <Label htmlFor="checkbox1">Accept terms and conditions</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="checkbox2"
                defaultChecked
                className={checkboxClassName}
              />
              <Label htmlFor="checkbox2">Subscribe to newsletter</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="checkbox3"
                disabled
                className={checkboxClassName}
              />
              <Label htmlFor="checkbox3">Disabled checkbox</Label>
            </div>
          </div>
          <ComponentRef token={FORM_TOKENS.checkbox.default} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Radio</SubsectionTitle>
            <span className="text-xs text-muted-foreground">single select group</span>
          </div>
          <div className="space-y-3 max-w-md">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="radio1"
                name="option"
                value="option1"
                className={radioClassName}
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
                className={radioClassName}
              />
              <Label htmlFor="radio2">Option 2</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="radio3"
                name="option"
                value="option3"
                className={radioClassName}
              />
              <Label htmlFor="radio3">Option 3</Label>
            </div>
          </div>
          <ComponentRef token={FORM_TOKENS.radio.default} />
        </div>
      </div>
    </SectionContainer>
  );
}
