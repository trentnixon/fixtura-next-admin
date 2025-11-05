"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import CodeExample from "./CodeExample";

/**
 * Base Badge Showcase
 *
 * Displays Base Badge component examples
 */
export default function BaseBadgeShowcase() {
  return (
    <SectionContainer
      title="Base Badge Component"
      description="Standard badge component from shadcn/ui with variants"
    >
      <div className="space-y-6">
        <ElementContainer title="Brand Color Badge Variants">
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="accent">Accent</Badge>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import { Badge } from "@/components/ui/badge";

<Badge variant="primary">Primary</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="accent">Accent</Badge>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="All Badge Variants">
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="default">Default</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import { Badge } from "@/components/ui/badge";

<Badge variant="primary">Primary</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="accent">Accent</Badge>
<Badge variant="default">Default</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Custom Colored Badges">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-success-500 text-white border-0">
              Success
            </Badge>
            <Badge className="bg-error-500 text-white border-0">
              Error
            </Badge>
            <Badge className="bg-warning-500 text-white border-0">
              Warning
            </Badge>
            <Badge className="bg-info-500 text-white border-0">Info</Badge>
            <Badge className="bg-purple-500 text-white border-0">
              Purple
            </Badge>
            <Badge className="bg-indigo-500 text-white border-0">
              Indigo
            </Badge>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<Badge className="bg-success-500 text-white border-0">Success</Badge>
<Badge className="bg-error-500 text-white border-0">Error</Badge>
<Badge className="bg-warning-500 text-white border-0">Warning</Badge>
<Badge className="bg-info-500 text-white border-0">Info</Badge>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Brand Color Badges with Icons">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="primary">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Primary
            </Badge>
            <Badge variant="secondary">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Secondary
            </Badge>
            <Badge variant="accent">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Accent
            </Badge>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import { CheckCircle2 } from "lucide-react";

<Badge variant="primary">
  <CheckCircle2 className="h-3 w-3 mr-1" />
  Primary
</Badge>
<Badge variant="secondary">
  <CheckCircle2 className="h-3 w-3 mr-1" />
  Secondary
</Badge>
<Badge variant="accent">
  <CheckCircle2 className="h-3 w-3 mr-1" />
  Accent
</Badge>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Badges with Icons (Semantic Colors)">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge className="bg-success-500 text-white border-0">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Verified
            </Badge>
            <Badge className="bg-error-500 text-white border-0">
              <XCircle className="h-3 w-3 mr-1" />
              Failed
            </Badge>
            <Badge className="bg-warning-500 text-white border-0">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Warning
            </Badge>
            <Badge className="bg-info-500 text-white border-0">
              <Info className="h-3 w-3 mr-1" />
              Info
            </Badge>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import { CheckCircle2, XCircle } from "lucide-react";

<Badge className="bg-success-500 text-white border-0">
  <CheckCircle2 className="h-3 w-3 mr-1" />
  Verified
</Badge>
<Badge className="bg-error-500 text-white border-0">
  <XCircle className="h-3 w-3 mr-1" />
  Failed
</Badge>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Badge Sizes">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge className="text-xs px-1.5 py-0.5">Small</Badge>
            <Badge>Default</Badge>
            <Badge className="text-sm px-3 py-1">Large</Badge>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<Badge className="text-xs px-1.5 py-0.5">Small</Badge>
<Badge>Default</Badge>
<Badge className="text-sm px-3 py-1">Large</Badge>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}

