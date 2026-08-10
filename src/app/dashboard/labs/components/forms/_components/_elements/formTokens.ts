/**
 * Canonical LLM reference tokens for the forms lab category.
 * Pattern: form.{component}.{variant}
 */
export const FORM_TOKENS = {
  input: {
    basic: "form.input.basic",
    types: "form.input.types",
    withLabel: "form.input.with-label",
    withIcons: "form.input.with-icons",
    states: "form.input.states",
  },
  textarea: {
    basic: "form.textarea.basic",
    withLabel: "form.textarea.with-label",
  },
  select: {
    basic: "form.select.basic",
    withLabel: "form.select.with-label",
    withGroups: "form.select.with-groups",
    disabled: "form.select.disabled",
  },
  checkbox: {
    default: "form.checkbox.default",
  },
  radio: {
    default: "form.radio.default",
  },
  switch: {
    basic: "form.switch.basic",
    settings: "form.switch.settings",
  },
  example: {
    simple: "form.example.simple",
    validation: "form.example.validation",
  },
} as const;
