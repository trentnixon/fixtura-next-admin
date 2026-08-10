/**
 * Canonical LLM reference tokens for the type lab category.
 * Pattern: type.{component}.{variant}
 */
export const TYPE_TOKENS = {
  title: {
    page: "type.title.page",
    h1: "type.title.h1",
    subtitle: "type.title.subtitle",
    h2: "type.title.h2",
    section: "type.title.section",
    h3: "type.title.h3",
    subsection: "type.title.subsection",
    h4: "type.title.h4",
    label: "type.title.label",
    byline: "type.title.byline",
  },
  text: {
    lead: "type.text.lead",
    body: "type.text.body",
    small: "type.text.small",
    tiny: "type.text.tiny",
    muted: "type.text.muted",
    bodyNormal: "type.text.body.normal",
    bodyMedium: "type.text.body.medium",
    bodySemibold: "type.text.body.semibold",
    bodyBold: "type.text.body.bold",
  },
  code: {
    inline: "type.code.inline",
    block: "type.code.block",
  },
  link: {
    default: "type.link.default",
    muted: "type.link.muted",
    destructive: "type.link.destructive",
    sizeSmall: "type.link.size.small",
    sizeLarge: "type.link.size.large",
  },
  paragraph: {
    default: "type.paragraph.default",
    small: "type.paragraph.small",
    large: "type.paragraph.large",
  },
  blockquote: {
    default: "type.blockquote.default",
    author: "type.blockquote.author",
  },
} as const;
