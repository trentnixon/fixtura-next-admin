"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import StatusBadge from "@/components/ui-library/badges/StatusBadge";
import { SubsectionTitle } from "@/components/type/titles";
import ComponentRef from "./ComponentRef";
import { STATUS_TOKENS } from "./statusTokens";

/**
 * StatusBadge showcase — boolean status with automatic color coding
 */
export default function StatusBadgesShowcase() {
  return (
    <SectionContainer
      title="Status Badges"
      description="Boolean status badges with automatic color coding"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Basic</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              true · false · with/without label
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={true} label="Active" />
            <StatusBadge status={false} label="Active" />
            <StatusBadge status={true} />
            <StatusBadge status={false} />
          </div>
          <ComponentRef token={STATUS_TOKENS.statusBadge.basic} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Custom Labels</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              trueLabel · falseLabel
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge
              status={true}
              trueLabel="Is Setup"
              falseLabel="Not Setup"
            />
            <StatusBadge
              status={false}
              trueLabel="Is Active"
              falseLabel="Not Active"
            />
            <StatusBadge
              status={true}
              trueLabel="Updating"
              falseLabel="Idle"
              variant="warning"
            />
          </div>
          <ComponentRef token={STATUS_TOKENS.statusBadge.customLabels} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Variants</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              default · warning · error · info · neutral
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={true} variant="default" trueLabel="Success" />
            <StatusBadge status={true} variant="warning" trueLabel="Warning" />
            <StatusBadge status={true} variant="error" trueLabel="Error" />
            <StatusBadge status={true} variant="info" trueLabel="Info" />
            <StatusBadge status={true} variant="neutral" trueLabel="Neutral" />
          </div>
          <ComponentRef token={STATUS_TOKENS.statusBadge.variants} />
        </div>
      </div>
    </SectionContainer>
  );
}
