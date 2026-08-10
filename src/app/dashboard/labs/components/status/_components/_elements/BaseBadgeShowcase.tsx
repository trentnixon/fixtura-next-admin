"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Badge } from "@/components/ui/badge";
import { SubsectionTitle } from "@/components/type/titles";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import ComponentRef from "./ComponentRef";
import { STATUS_TOKENS } from "./statusTokens";

/**
 * Base Badge showcase — shadcn/ui badge variants and patterns
 */
export default function BaseBadgeShowcase() {
  return (
    <SectionContainer
      title="Base Badge"
      description="Standard badge component from shadcn/ui with variants"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Brand</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              primary · secondary · accent
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="accent">Accent</Badge>
          </div>
          <ComponentRef token={STATUS_TOKENS.badge.brand} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>All Variants</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              default · destructive · outline
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="default">Default</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
          <ComponentRef token={STATUS_TOKENS.badge.variants} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Semantic Colors</SubsectionTitle>
            <span className="text-xs text-muted-foreground">custom className</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-success-500 text-white border-0">Success</Badge>
            <Badge className="bg-error-500 text-white border-0">Error</Badge>
            <Badge className="bg-warning-500 text-white border-0">Warning</Badge>
            <Badge className="bg-info-500 text-white border-0">Info</Badge>
            <Badge className="bg-purple-500 text-white border-0">Purple</Badge>
            <Badge className="bg-indigo-500 text-white border-0">Indigo</Badge>
          </div>
          <ComponentRef token={STATUS_TOKENS.badge.semantic} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Brand with Icons</SubsectionTitle>
            <span className="text-xs text-muted-foreground">leading icon</span>
          </div>
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
          <ComponentRef token={STATUS_TOKENS.badge.brandWithIcons} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Semantic with Icons</SubsectionTitle>
            <span className="text-xs text-muted-foreground">status icons</span>
          </div>
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
          <ComponentRef token={STATUS_TOKENS.badge.semanticWithIcons} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Sizes</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              small · default · large
            </span>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Badge className="text-xs px-1.5 py-0.5">Small</Badge>
            <Badge>Default</Badge>
            <Badge className="text-sm px-3 py-1">Large</Badge>
          </div>
          <ComponentRef token={STATUS_TOKENS.badge.sizes} />
        </div>
      </div>
    </SectionContainer>
  );
}
