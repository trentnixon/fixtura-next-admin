"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import Code from "@/components/ui-library/foundation/Code";
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

/**
 * Semantic Colors Showcase
 *
 * Displays overview cards for semantic colors
 */
export default function SemanticColorsShowcase() {
  return (
    <SectionContainer
      title="Semantic Colors"
      description="Color tokens for UI states and actions"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 border rounded-md bg-slate-50">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-5 w-5 text-brandSuccess-600" />
            <span className="font-semibold">Success</span>
          </div>
          <div className="space-y-2">
            <div className="h-12 bg-brandSuccess-500 rounded"></div>
            <Code className="text-xs">bg-brandSuccess-500</Code>
            <p className="text-xs text-muted-foreground mt-2">
              Use for success messages, completed states, positive actions
            </p>
          </div>
        </div>

        <div className="p-4 border rounded-md bg-slate-50">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-5 w-5 text-brandError-600" />
            <span className="font-semibold">Error</span>
          </div>
          <div className="space-y-2">
            <div className="h-12 bg-brandError-500 rounded"></div>
            <Code className="text-xs">bg-brandError-500</Code>
            <p className="text-xs text-muted-foreground mt-2">
              Use for errors, destructive actions, validation failures
            </p>
          </div>
        </div>

        <div className="p-4 border rounded-md bg-slate-50">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-brandWarning-600" />
            <span className="font-semibold">Warning</span>
          </div>
          <div className="space-y-2">
            <div className="h-12 bg-brandWarning-500 rounded"></div>
            <Code className="text-xs">bg-brandWarning-500</Code>
            <p className="text-xs text-muted-foreground mt-2">
              Use for warnings, cautions, important notices
            </p>
          </div>
        </div>

        <div className="p-4 border rounded-md bg-slate-50">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-5 w-5 text-brandInfo-600" />
            <span className="font-semibold">Info</span>
          </div>
          <div className="space-y-2">
            <div className="h-12 bg-brandInfo-500 rounded"></div>
            <Code className="text-xs">bg-brandInfo-500</Code>
            <p className="text-xs text-muted-foreground mt-2">
              Use for informational messages, tooltips, help text
            </p>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
