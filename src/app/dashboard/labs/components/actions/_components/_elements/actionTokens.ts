/**
 * Canonical LLM reference tokens for the actions lab category.
 * Pattern: action.{component}.{variant}
 */
export const ACTION_TOKENS = {
  button: {
    brand: "action.button.brand",
    all: "action.button.all",
    useCases: "action.button.use-cases",
    sizes: "action.button.sizes",
    sizesByVariant: "action.button.sizes-by-variant",
    iconBefore: "action.button.icon-before",
    iconAfter: "action.button.icon-after",
    iconOnly: "action.button.icon-only",
    disabled: "action.button.disabled",
    loading: "action.button.loading",
    success: "action.button.success",
    groupHorizontal: "action.button.group-horizontal",
    groupActive: "action.button.group-active",
    groupIcon: "action.button.group-icon",
    fullWidth: "action.button.full-width",
    fullWidthIcons: "action.button.full-width-icons",
  },
} as const;
