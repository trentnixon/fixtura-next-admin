"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Button } from "@/components/ui/button";
import { SubsectionTitle } from "@/components/type/titles";
import { Edit, Download, Trash2 } from "lucide-react";
import ComponentRef from "./ComponentRef";
import { ACTION_TOKENS } from "./actionTokens";

/**
 * Button groups showcase — horizontal, active, and icon group patterns
 */
export default function ButtonGroupsShowcase() {
  return (
    <SectionContainer
      title="Button Groups"
      description="Grouped buttons for related actions"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Horizontal</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              rounded-none · border-r
            </span>
          </div>
          <div className="flex gap-0 border rounded-md overflow-hidden w-fit">
            <Button variant="primary" className="rounded-none border-0 border-r">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="secondary" className="rounded-none border-0 border-r">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="accent" className="rounded-none border-0">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
          <ComponentRef token={ACTION_TOKENS.button.groupHorizontal} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>With Active State</SubsectionTitle>
            <span className="text-xs text-muted-foreground">variant as selection</span>
          </div>
          <div className="flex gap-0 border rounded-md overflow-hidden w-fit">
            <Button variant="primary" className="rounded-none border-0 border-r">
              View
            </Button>
            <Button variant="secondary" className="rounded-none border-0 border-r">
              Edit
            </Button>
            <Button variant="accent" className="rounded-none border-0">
              Delete
            </Button>
          </div>
          <ComponentRef token={ACTION_TOKENS.button.groupActive} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Icon Group</SubsectionTitle>
            <span className="text-xs text-muted-foreground">size="icon" · gap-1</span>
          </div>
          <div className="flex gap-1">
            <Button size="icon" variant="primary">
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary">
              <Download className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="accent">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <ComponentRef token={ACTION_TOKENS.button.groupIcon} />
        </div>
      </div>
    </SectionContainer>
  );
}
