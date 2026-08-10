/**
 * Canonical LLM reference tokens for the feedback lab category.
 * Pattern: feedback.{component}.{variant}
 */
export const FEEDBACK_TOKENS = {
  loading: {
    default: "feedback.loading.default",
    minimal: "feedback.loading.minimal",
    skeleton: "feedback.loading.skeleton",
  },
  error: {
    default: "feedback.error.default",
    card: "feedback.error.card",
    minimal: "feedback.error.minimal",
    withObject: "feedback.error.with-object",
  },
  empty: {
    default: "feedback.empty.default",
    card: "feedback.empty.card",
    minimal: "feedback.empty.minimal",
    customIcon: "feedback.empty.custom-icon",
    customAction: "feedback.empty.custom-action",
  },
  toast: {
    basic: "feedback.toast.basic",
    withDescription: "feedback.toast.with-description",
    withAction: "feedback.toast.with-action",
    customDuration: "feedback.toast.custom-duration",
    promise: "feedback.toast.promise",
  },
} as const;
