"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
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
 * Status indicator showcase — dots, pulse, and icon patterns
 */
export default function StatusIndicatorsShowcase() {
  return (
    <SectionContainer
      title="Status Indicators"
      description="Visual indicators for status and state"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Brand Dots</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              primary · secondary · accent
            </span>
          </div>
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-brandPrimary-600 rounded-full" />
              <span className="text-sm">Primary</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-brandSecondary-600 rounded-full" />
              <span className="text-sm">Secondary</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-brandAccent-600 rounded-full" />
              <span className="text-sm">Accent</span>
            </div>
          </div>
          <ComponentRef token={STATUS_TOKENS.indicator.brandDots} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Semantic Dots</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              success · error · warning · idle
            </span>
          </div>
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-success-500 rounded-full" />
              <span className="text-sm">Online</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-error-500 rounded-full" />
              <span className="text-sm">Offline</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-warning-500 rounded-full" />
              <span className="text-sm">Away</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-slate-400 rounded-full" />
              <span className="text-sm">Idle</span>
            </div>
          </div>
          <ComponentRef token={STATUS_TOKENS.indicator.semanticDots} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Brand Pulse</SubsectionTitle>
            <span className="text-xs text-muted-foreground">animate-ping</span>
          </div>
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brandPrimary-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brandPrimary-600" />
              </span>
              <span className="text-sm">Primary</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brandSecondary-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brandSecondary-600" />
              </span>
              <span className="text-sm">Secondary</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brandAccent-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brandAccent-600" />
              </span>
              <span className="text-sm">Accent</span>
            </div>
          </div>
          <ComponentRef token={STATUS_TOKENS.indicator.brandPulse} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Semantic Pulse</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              active · alert
            </span>
          </div>
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-success-500" />
              </span>
              <span className="text-sm">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-error-500" />
              </span>
              <span className="text-sm">Alert</span>
            </div>
          </div>
          <ComponentRef token={STATUS_TOKENS.indicator.semanticPulse} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Brand Icons</SubsectionTitle>
            <span className="text-xs text-muted-foreground">CheckCircle2</span>
          </div>
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
          <ComponentRef token={STATUS_TOKENS.indicator.brandIcons} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Semantic Icons</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              success · error · warning · info
            </span>
          </div>
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
          <ComponentRef token={STATUS_TOKENS.indicator.semanticIcons} />
        </div>
      </div>
    </SectionContainer>
  );
}
