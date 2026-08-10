"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import Code from "@/components/ui-library/foundation/Code";
import { Palette, Sparkles, Zap } from "lucide-react";

/**
 * Brand Colors Showcase
 *
 * Displays overview cards for brand colors (Primary, Secondary, Accent)
 */
export default function BrandColorsShowcase() {
  return (
    <SectionContainer
      title="Brand Colors"
      description="Primary, secondary, and accent colors for brand identity"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 border rounded-md bg-slate-50">
          <div className="flex items-center gap-2 mb-3">
            <Palette className="h-5 w-5 text-brandPrimary-600" />
            <span className="font-semibold">Primary</span>
          </div>
          <div className="space-y-2">
            <div className="h-12 bg-brandPrimary-500 rounded"></div>
            <Code className="text-xs">bg-brandPrimary-500</Code>
            <p className="text-xs text-muted-foreground mt-2">
              Main brand color for primary actions, buttons, and key highlights
            </p>
          </div>
        </div>

        <div className="p-4 border rounded-md bg-slate-50">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-brandSecondary-600" />
            <span className="font-semibold">Secondary</span>
          </div>
          <div className="space-y-2">
            <div className="h-12 bg-brandSecondary-500 rounded"></div>
            <Code className="text-xs">bg-brandSecondary-500</Code>
            <p className="text-xs text-muted-foreground mt-2">
              Supporting brand color for secondary actions and complementary
              elements
            </p>
          </div>
        </div>

        <div className="p-4 border rounded-md bg-slate-50">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-5 w-5 text-brandAccent-600" />
            <span className="font-semibold">Accent</span>
          </div>
          <div className="space-y-2">
            <div className="h-12 bg-brandAccent-500 rounded"></div>
            <Code className="text-xs">bg-brandAccent-500</Code>
            <p className="text-xs text-muted-foreground mt-2">
              Accent color for highlights, call-to-actions, and emphasis
            </p>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
