"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Label } from "@/components/ui/label";
import { SubsectionTitle } from "@/components/type/titles";
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
import ComponentRef from "./ComponentRef";
import { FORM_TOKENS } from "./formTokens";

/**
 * Select showcase — basic, labeled, grouped, and disabled dropdowns
 */
export default function SelectShowcase() {
  return (
    <SectionContainer
      title="Select"
      description="Dropdown select component for single selection"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Basic</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              placeholder · default value
            </span>
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
          <ComponentRef token={FORM_TOKENS.select.basic} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>With Label</SubsectionTitle>
            <span className="text-xs text-muted-foreground">Label + Select</span>
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
          <ComponentRef token={FORM_TOKENS.select.withLabel} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>With Groups</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              SelectGroup · separator
            </span>
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
          <ComponentRef token={FORM_TOKENS.select.withGroups} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Disabled</SubsectionTitle>
            <span className="text-xs text-muted-foreground">disabled prop</span>
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
          <ComponentRef token={FORM_TOKENS.select.disabled} />
        </div>
      </div>
    </SectionContainer>
  );
}
