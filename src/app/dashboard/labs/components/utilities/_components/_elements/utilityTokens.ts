/**
 * Canonical LLM reference tokens for the utilities lab category.
 * Pattern: utility.{component}.{variant}
 */
export const UTILITY_TOKENS = {
  copy: {
    button: "utility.copy.button",
    input: "utility.copy.input",
    inline: "utility.copy.inline",
  },
  time: {
    relative: "utility.time.relative",
    dates: "utility.time.dates",
    clock: "utility.time.clock",
  },
  currency: {
    formats: "utility.currency.formats",
    variations: "utility.currency.variations",
  },
  number: {
    large: "utility.number.large",
    compact: "utility.number.compact",
    percentage: "utility.number.percentage",
    fileSize: "utility.number.file-size",
  },
  search: {
    basic: "utility.search.basic",
    withButton: "utility.search.with-button",
  },
} as const;
