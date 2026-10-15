"use client";

import { useState } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { SubsectionTitle } from "@/components/type/titles";
import ComponentRef from "./ComponentRef";
import { FORM_TOKENS } from "./formTokens";

/**
 * Date picker showcase — popover calendar for a single date.
 */
export default function DatePickerShowcase() {
  const [date, setDate] = useState("");

  return (
    <SectionContainer
      title="Date Picker"
      description="Single date selection from a calendar popover"
    >
      <div>
        <div className="mb-2 flex items-center justify-between">
          <SubsectionTitle>Basic</SubsectionTitle>
          <span className="text-xs text-muted-foreground">
            popover · calendar
          </span>
        </div>
        <div className="max-w-xs space-y-2">
          <Label htmlFor="lab-date-picker">Date</Label>
          <DatePicker
            id="lab-date-picker"
            value={date}
            onChange={setDate}
          />
        </div>
        <ComponentRef token={FORM_TOKENS.datePicker.basic} />
      </div>
    </SectionContainer>
  );
}
