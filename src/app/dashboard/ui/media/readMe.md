# Folder Overview

This folder contains the Media & Content showcase page, demonstrating media components including images, videos, code blocks, and markdown renderers. Currently, most components are placeholders for future implementation.

## Purpose

This showcase serves as:
- **Media Component Reference**: Visual display of media component patterns
- **Usage Examples**: Code snippets showing how to use media components
- **Placeholder Examples**: Examples for components to be built
- **Usage Guidelines**: Best practices for media content

## Components

### Media Components

- **Images**: Image components with loading states (coming soon)
- **Videos**: Video player components (coming soon)
- **Code Blocks**: Code display with syntax highlighting (basic implementation available)
- **Markdown**: Markdown renderer and editor (coming soon)

### Showcase Structure

- `MediaShowcase.tsx`: Main showcase component
- `_elements/`:
  - `ImagesShowcase.tsx`: Image component examples (placeholder)
  - `VideosShowcase.tsx`: Video component examples (placeholder)
  - `CodeBlocksShowcase.tsx`: Code block examples (working)
  - `MarkdownShowcase.tsx`: Markdown examples (placeholder)
  - `UsageGuidelinesShowcase.tsx`: Media usage guidelines
  - `CodeExample.tsx`: Shared code snippet component

## Usage

### Code Component

The Code component is available and can be used:

```tsx
import Code from "@/components/ui-library/foundation/Code";

<Code variant="block" className="text-sm">
  {`function example() {
  return "Hello World";
}`}
</Code>

<p>Use <Code>const x = 1</Code> for inline code.</p>
```

### Planned Components

- Image gallery with lazy loading
- Responsive image components
- Video player with controls
- Markdown renderer with syntax highlighting
- Markdown editor with preview

## File Location

- Code component: `src/components/ui-library/foundation/Code.tsx`
- Showcase: `src/app/dashboard/ui/media/_components/`
- Documentation: This file

## Dependencies

- `@/components/ui-library/foundation/Code` - Code component
- Future: Image, Video, Markdown components

## Best Practices

- Always include alt text for images
- Optimize images for web performance
- Use lazy loading for images below the fold
- Provide loading states for media
- Include captions for videos
- Use appropriate formats (WebP, AVIF for modern browsers)

