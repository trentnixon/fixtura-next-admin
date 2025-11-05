"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import CodeExample from "./CodeExample";

/**
 * Status Indicators Showcase
 *
 * Displays status indicator examples
 */
export default function StatusIndicatorsShowcase() {
  return (
    <SectionContainer
      title="Status Indicators"
      description="Visual indicators for status and state"
    >
      <div className="space-y-6">
        <ElementContainer title="Brand Color Status Dots">
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-brandPrimary-600 rounded-full"></span>
              <span className="text-sm">Primary</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-brandSecondary-600 rounded-full"></span>
              <span className="text-sm">Secondary</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-brandAccent-600 rounded-full"></span>
              <span className="text-sm">Accent</span>
            </div>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<div className="flex items-center gap-2">
  <span className="h-2 w-2 bg-brandPrimary-600 rounded-full"></span>
  <span className="text-sm">Primary</span>
</div>
<div className="flex items-center gap-2">
  <span className="h-2 w-2 bg-brandSecondary-600 rounded-full"></span>
  <span className="text-sm">Secondary</span>
</div>
<div className="flex items-center gap-2">
  <span className="h-2 w-2 bg-brandAccent-600 rounded-full"></span>
  <span className="text-sm">Accent</span>
</div>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Status Dots (Semantic Colors)">
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-success-500 rounded-full"></span>
              <span className="text-sm">Online</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-error-500 rounded-full"></span>
              <span className="text-sm">Offline</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-warning-500 rounded-full"></span>
              <span className="text-sm">Away</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-slate-400 rounded-full"></span>
              <span className="text-sm">Idle</span>
            </div>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<div className="flex items-center gap-2">
  <span className="h-2 w-2 bg-success-500 rounded-full"></span>
  <span className="text-sm">Online</span>
</div>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Brand Color Status Dots with Pulsing Animation">
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brandPrimary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brandPrimary-600"></span>
              </span>
              <span className="text-sm">Primary</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brandSecondary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brandSecondary-600"></span>
              </span>
              <span className="text-sm">Secondary</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brandAccent-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brandAccent-600"></span>
              </span>
              <span className="text-sm">Accent</span>
            </div>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<div className="flex items-center gap-2">
  <span className="relative flex h-3 w-3">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brandPrimary-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-3 w-3 bg-brandPrimary-600"></span>
  </span>
  <span className="text-sm">Primary</span>
</div>
<div className="flex items-center gap-2">
  <span className="relative flex h-3 w-3">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brandSecondary-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-3 w-3 bg-brandSecondary-600"></span>
  </span>
  <span className="text-sm">Secondary</span>
</div>
<div className="flex items-center gap-2">
  <span className="relative flex h-3 w-3">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brandAccent-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-3 w-3 bg-brandAccent-600"></span>
  </span>
  <span className="text-sm">Accent</span>
</div>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Status Dots with Pulsing Animation (Semantic Colors)">
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-success-500"></span>
              </span>
              <span className="text-sm">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-error-500"></span>
              </span>
              <span className="text-sm">Alert</span>
            </div>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<div className="flex items-center gap-2">
  <span className="relative flex h-3 w-3">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-3 w-3 bg-success-500"></span>
  </span>
  <span className="text-sm">Active</span>
</div>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Brand Color Icon Status Indicators">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brandPrimary-600" />
              <span className="text-sm">Primary</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brandSecondary-600" />
              <span className="text-sm">Secondary</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brandAccent-600" />
              <span className="text-sm">Accent</span>
            </div>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import { CheckCircle2 } from "lucide-react";

<div className="flex items-center gap-2">
  <CheckCircle2 className="h-4 w-4 text-brandPrimary-600" />
  <span className="text-sm">Primary</span>
</div>
<div className="flex items-center gap-2">
  <CheckCircle2 className="h-4 w-4 text-brandSecondary-600" />
  <span className="text-sm">Secondary</span>
</div>
<div className="flex items-center gap-2">
  <CheckCircle2 className="h-4 w-4 text-brandAccent-600" />
  <span className="text-sm">Accent</span>
</div>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Icon Status Indicators (Semantic Colors)">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success-600" />
              <span className="text-sm">Success</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-error-600" />
              <span className="text-sm">Error</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning-600" />
              <span className="text-sm">Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-info-600" />
              <span className="text-sm">Info</span>
            </div>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

<div className="flex items-center gap-2">
  <CheckCircle2 className="h-4 w-4 text-success-600" />
  <span className="text-sm">Success</span>
</div>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}

