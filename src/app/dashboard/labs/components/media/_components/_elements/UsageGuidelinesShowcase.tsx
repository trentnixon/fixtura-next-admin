"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";

/**
 * Usage Guidelines Showcase
 *
 * Displays usage guidelines for media components
 */
export default function UsageGuidelinesShowcase() {
  return (
    <SectionContainer
      title="Usage Guidelines"
      description="Best practices for using media components"
    >
      <div className="space-y-4 text-sm text-muted-foreground">
        <div>
          <h4 className="font-semibold text-foreground mb-2">Images</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              Use appropriate image formats (WebP, AVIF for modern browsers)
            </li>
            <li>Always include alt text for accessibility</li>
            <li>Optimize images for web performance</li>
            <li>Use lazy loading for images below the fold</li>
            <li>Provide loading states for better UX</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">Videos</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Provide multiple video formats for browser compatibility</li>
            <li>Include captions and transcripts for accessibility</li>
            <li>Use autoplay sparingly and only with muted audio</li>
            <li>Consider bandwidth and provide quality options</li>
            <li>Include video thumbnails for better UX</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">Code Blocks</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use syntax highlighting for better readability</li>
            <li>Provide copy functionality for code snippets</li>
            <li>Use appropriate language tags for syntax highlighting</li>
            <li>Keep code blocks concise and focused</li>
            <li>Provide line numbers for longer code examples</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">Markdown</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use markdown for user-generated content</li>
            <li>Sanitize markdown to prevent XSS attacks</li>
            <li>Provide preview functionality for editors</li>
            <li>
              Support common markdown features (tables, code blocks, etc.)
            </li>
            <li>Use consistent styling across markdown content</li>
          </ul>
        </div>
      </div>
    </SectionContainer>
  );
}
