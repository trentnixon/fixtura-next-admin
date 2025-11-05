"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { SubsectionTitle } from "@/components/type/titles";
import CodeExample from "./CodeExample";

/**
 * Containers Showcase
 *
 * Displays examples of PageContainer, SectionContainer, and ElementContainer
 */
export default function ContainersShowcase() {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <SubsectionTitle>PageContainer</SubsectionTitle>
        </div>
        <PageContainer
          padding="md"
          spacing="md"
          className="border border-dashed border-slate-300 rounded-md"
        >
          <div className="p-4 bg-slate-50 rounded-md">
            PageContainer provides padding and spacing without borders or
            backgrounds
          </div>
          <div className="p-4 bg-slate-50 rounded-md">
            Children are automatically spaced
          </div>
        </PageContainer>
        <div className="mt-6">
          <CodeExample
            code={`import PageContainer from "@/components/scaffolding/containers/PageContainer";

<PageContainer padding="lg" spacing="lg">
  <YourContent />
</PageContainer>`}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <SubsectionTitle>SectionContainer</SubsectionTitle>
        </div>
        <SectionContainer
          title="Example Section"
          description="Card-based container with header and content"
          variant="compact"
        >
          <p className="text-sm text-muted-foreground">
            SectionContainer is used as a child of PageContainer. It provides
            a card-based layout with border, background, and shadow.
          </p>
        </SectionContainer>
        <div className="mt-6">
          <CodeExample
            code={`import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";

<PageContainer>
  <SectionContainer
    title="Section Title"
    description="Optional description"
    variant="default" // or "compact"
  >
    <YourContent />
  </SectionContainer>
</PageContainer>`}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <SubsectionTitle>ElementContainer</SubsectionTitle>
        </div>
        <div className="space-y-4">
          <ElementContainer
            title="With Border"
            subtitle="Border and padding options"
            border
            padding="md"
            variant="light"
          >
            <p className="text-sm text-muted-foreground">
              ElementContainer with border and light variant
            </p>
          </ElementContainer>
          <ElementContainer
            title="Dark Variant"
            subtitle="Dark background variant"
            border
            padding="md"
            variant="dark"
          >
            <p className="text-sm text-muted-foreground">
              ElementContainer with dark variant
            </p>
          </ElementContainer>
          <ElementContainer
            title="No Border"
            subtitle="Padding only, no border"
            padding="md"
            variant="light"
          >
            <p className="text-sm text-muted-foreground">
              ElementContainer without border
            </p>
          </ElementContainer>
          <ElementContainer
            title="Different Padding"
            subtitle="Large padding example"
            border
            padding="lg"
            variant="light"
          >
            <p className="text-sm text-muted-foreground">
              ElementContainer with large padding
            </p>
          </ElementContainer>
        </div>
        <div className="mt-6">
          <CodeExample
            code={`import ElementContainer from "@/components/scaffolding/containers/ElementContainer";

<ElementContainer
  title="Element Title"
  subtitle="Optional description"
  variant="light" // "light" | "dark"
  border={true} // true | false
  padding="md" // "none" | "sm" | "md" | "lg" | "xl"
  margin="md" // "none" | "sm" | "md" | "lg" | "xl"
>
  <YourComponent />
</ElementContainer>`}
          />
        </div>
      </div>
    </div>
  );
}

