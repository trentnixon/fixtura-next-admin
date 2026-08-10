"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Button } from "@/components/ui/button";
import { SubsectionTitle } from "@/components/type/titles";
import {
  Plus,
  Download,
  Trash2,
  Edit,
  Save,
  X,
  ArrowRight,
} from "lucide-react";
import ComponentRef from "./ComponentRef";
import { ACTION_TOKENS } from "./actionTokens";

/**
 * Button icons showcase — before, after, and icon-only patterns
 */
export default function ButtonIconsShowcase() {
  return (
    <SectionContainer
      title="Buttons with Icons"
      description="Buttons with icons for better visual context"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Icon Before Text</SubsectionTitle>
            <span className="text-xs text-muted-foreground">mr-2 spacing</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
            <Button variant="secondary">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="accent">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button variant="primary">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="secondary">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
          <ComponentRef token={ACTION_TOKENS.button.iconBefore} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Icon After Text</SubsectionTitle>
            <span className="text-xs text-muted-foreground">ml-2 spacing</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary">
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="secondary">
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="accent">
              Learn More
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <ComponentRef token={ACTION_TOKENS.button.iconAfter} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Icon Only</SubsectionTitle>
            <span className="text-xs text-muted-foreground">size="icon"</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="icon" variant="primary">
              <Plus className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary">
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="accent">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="primary">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ComponentRef token={ACTION_TOKENS.button.iconOnly} />
        </div>
      </div>
    </SectionContainer>
  );
}
