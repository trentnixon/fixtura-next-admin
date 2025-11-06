"use client";

import TextInputsShowcase from "./_elements/TextInputsShowcase";
import TextareaShowcase from "./_elements/TextareaShowcase";
import SelectShowcase from "./_elements/SelectShowcase";
import SwitchShowcase from "./_elements/SwitchShowcase";
import CheckboxRadioShowcase from "./_elements/CheckboxRadioShowcase";
import FormExamplesShowcase from "./_elements/FormExamplesShowcase";
import UsageGuidelinesShowcase from "./_elements/UsageGuidelinesShowcase";

/**
 * Forms Showcase Component
 *
 * Displays all form input components with examples
 */
export default function FormsShowcase() {
  return (
    <>
      <TextInputsShowcase />
      <TextareaShowcase />
      <SelectShowcase />
      <SwitchShowcase />
      <CheckboxRadioShowcase />
      <FormExamplesShowcase />
      <UsageGuidelinesShowcase />
    </>
  );
}
