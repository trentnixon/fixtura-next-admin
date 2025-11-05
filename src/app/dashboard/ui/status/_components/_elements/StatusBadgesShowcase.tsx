"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import StatusBadge from "@/components/ui-library/badges/StatusBadge";
import CodeExample from "./CodeExample";

/**
 * Status Badges Showcase
 *
 * Displays StatusBadge component examples
 */
export default function StatusBadgesShowcase() {
  return (
    <SectionContainer
      title="Status Badges"
      description="Boolean status badges with automatic color coding"
    >
      <div className="space-y-6">
        <ElementContainer title="Basic StatusBadge">
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={true} label="Active" />
            <StatusBadge status={false} label="Active" />
            <StatusBadge status={true} />
            <StatusBadge status={false} />
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import StatusBadge from "@/components/ui-library/badges/StatusBadge";

<StatusBadge status={isActive} label="Active" />
<StatusBadge status={isActive} />`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Custom Labels">
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
          <div className="mt-6">
            <CodeExample
              code={`<StatusBadge
  status={isSetup}
  trueLabel="Is Setup"
  falseLabel="Not Setup"
/>
<StatusBadge
  status={isUpdating}
  trueLabel="Updating"
  falseLabel="Idle"
  variant="warning"
/>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Variant Options">
          <div className="flex flex-wrap gap-2">
            <StatusBadge
              status={true}
              variant="default"
              trueLabel="Success"
            />
            <StatusBadge
              status={true}
              variant="warning"
              trueLabel="Warning"
            />
            <StatusBadge status={true} variant="error" trueLabel="Error" />
            <StatusBadge status={true} variant="info" trueLabel="Info" />
            <StatusBadge
              status={true}
              variant="neutral"
              trueLabel="Neutral"
            />
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<StatusBadge status={true} variant="default" trueLabel="Success" />
<StatusBadge status={true} variant="warning" trueLabel="Warning" />
<StatusBadge status={true} variant="error" trueLabel="Error" />
<StatusBadge status={true} variant="info" trueLabel="Info" />
<StatusBadge status={true} variant="neutral" trueLabel="Neutral" />`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}

