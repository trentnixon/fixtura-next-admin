/**
 * Canonical LLM reference tokens for the overlays lab category.
 * Pattern: overlay.{component}.{variant}
 */
export const OVERLAY_TOKENS = {
  dialog: {
    basic: "overlay.dialog.basic",
    form: "overlay.dialog.form",
    confirmation: "overlay.dialog.confirmation",
  },
  sheet: {
    right: "overlay.sheet.right",
    sides: "overlay.sheet.sides",
  },
  tooltip: {
    basic: "overlay.tooltip.basic",
    positions: "overlay.tooltip.positions",
  },
  dropdown: {
    basic: "overlay.dropdown.basic",
    icons: "overlay.dropdown.icons",
    submenu: "overlay.dropdown.submenu",
    checkboxes: "overlay.dropdown.checkboxes",
    radio: "overlay.dropdown.radio",
  },
} as const;
