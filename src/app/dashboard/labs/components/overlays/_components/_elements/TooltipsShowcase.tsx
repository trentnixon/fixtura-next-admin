"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SubsectionTitle } from "@/components/type/titles";
import { Info } from "lucide-react";
import ComponentRef from "./ComponentRef";
import { OVERLAY_TOKENS } from "./overlayTokens";

/**
 * Tooltips showcase — basic and positional patterns
 */
export default function TooltipsShowcase() {
  return (
    <SectionContainer
      title="Tooltips"
      description="Contextual information tooltips"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Basic</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              TooltipProvider · TooltipTrigger
            </span>
          </div>
          <TooltipProvider>
            <div className="flex flex-wrap gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="primary">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This is a tooltip</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="primary" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Information tooltip</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
          <ComponentRef token={OVERLAY_TOKENS.tooltip.basic} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Positions</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              side: top · right · bottom · left
            </span>
          </div>
          <TooltipProvider>
            <div className="flex flex-wrap gap-4 items-center justify-center p-8">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="primary" size="sm">
                    Top
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Tooltip on top</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary" size="sm">
                    Right
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Tooltip on right</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="accent" size="sm">
                    Bottom
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Tooltip on bottom</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="primary" size="sm">
                    Left
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Tooltip on left</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
          <ComponentRef token={OVERLAY_TOKENS.tooltip.positions} />
        </div>
      </div>
    </SectionContainer>
  );
}
