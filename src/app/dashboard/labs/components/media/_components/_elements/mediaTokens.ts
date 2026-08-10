/**
 * Canonical LLM reference tokens for the media lab category.
 * Pattern: media.{component}.{variant}
 */
export const MEDIA_TOKENS = {
  image: {
    comingSoon: "media.image.coming-soon",
  },
  video: {
    comingSoon: "media.video.coming-soon",
  },
  code: {
    block: "media.code.block",
    inline: "media.code.inline",
    advanced: "media.code.advanced",
  },
  markdown: {
    comingSoon: "media.markdown.coming-soon",
  },
} as const;
