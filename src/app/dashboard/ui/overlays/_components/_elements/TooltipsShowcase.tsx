"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import CodeExample from "./CodeExample";

/**
 * Tooltips Showcase
 *
 * Displays Tooltip component examples
 */
export default function TooltipsShowcase() {
  return (
    <SectionContainer
      title="Tooltips"
      description="Contextual information tooltips"
    >
      <div className="space-y-6">
        <ElementContainer title="Basic Tooltip">
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
          <div className="mt-6">
            <CodeExample
              code={`import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="primary">Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>This is a tooltip</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Tooltip Positions">
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
          <div className="mt-6">
            <CodeExample
              code={`<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="primary">Hover me</Button>
    </TooltipTrigger>
    <TooltipContent side="top"> {/* top | right | bottom | left */}
      <p>Tooltip on top</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
