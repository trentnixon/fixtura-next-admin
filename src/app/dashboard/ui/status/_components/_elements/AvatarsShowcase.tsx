"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import CodeExample from "./CodeExample";

/**
 * Avatars Showcase
 *
 * Displays Avatar component examples
 */
export default function AvatarsShowcase() {
  return (
    <SectionContainer
      title="Avatars"
      description="User avatar components with fallbacks"
    >
      <div className="space-y-6">
        <ElementContainer title="Basic Avatars">
          <div className="flex flex-wrap gap-4 items-center">
            <Avatar>
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="@shadcn"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
<Avatar>
  <AvatarFallback>JD</AvatarFallback>
</Avatar>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Avatar Sizes">
          <div className="flex flex-wrap gap-4 items-center">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">SM</AvatarFallback>
            </Avatar>
            <Avatar className="h-10 w-10">
              <AvatarFallback>MD</AvatarFallback>
            </Avatar>
            <Avatar className="h-12 w-12">
              <AvatarFallback className="text-base">LG</AvatarFallback>
            </Avatar>
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">XL</AvatarFallback>
            </Avatar>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<Avatar className="h-8 w-8">
  <AvatarFallback className="text-xs">SM</AvatarFallback>
</Avatar>
<Avatar className="h-10 w-10">
  <AvatarFallback>MD</AvatarFallback>
</Avatar>
<Avatar className="h-12 w-12">
  <AvatarFallback className="text-base">LG</AvatarFallback>
</Avatar>
<Avatar className="h-16 w-16">
  <AvatarFallback className="text-lg">XL</AvatarFallback>
</Avatar>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Avatar with Brand Color Status Indicator">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-brandPrimary-600 border-2 border-white rounded-full"></span>
            </div>
            <div className="relative">
              <Avatar>
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-brandSecondary-600 border-2 border-white rounded-full"></span>
            </div>
            <div className="relative">
              <Avatar>
                <AvatarFallback>CD</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-brandAccent-600 border-2 border-white rounded-full"></span>
            </div>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<div className="relative">
  <Avatar>
    <AvatarFallback>JD</AvatarFallback>
  </Avatar>
  <span className="absolute bottom-0 right-0 h-3 w-3 bg-brandPrimary-600 border-2 border-white rounded-full"></span>
</div>
<div className="relative">
  <Avatar>
    <AvatarFallback>AB</AvatarFallback>
  </Avatar>
  <span className="absolute bottom-0 right-0 h-3 w-3 bg-brandSecondary-600 border-2 border-white rounded-full"></span>
</div>
<div className="relative">
  <Avatar>
    <AvatarFallback>CD</AvatarFallback>
  </Avatar>
  <span className="absolute bottom-0 right-0 h-3 w-3 bg-brandAccent-600 border-2 border-white rounded-full"></span>
</div>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Avatar with Status Indicator (Semantic Colors)">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-success-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="relative">
              <Avatar>
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-error-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="relative">
              <Avatar>
                <AvatarFallback>CD</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-warning-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="relative">
              <Avatar>
                <AvatarFallback>EF</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-slate-400 border-2 border-white rounded-full"></span>
            </div>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<div className="relative">
  <Avatar>
    <AvatarFallback>JD</AvatarFallback>
  </Avatar>
  <span className="absolute bottom-0 right-0 h-3 w-3 bg-success-500 border-2 border-white rounded-full"></span>
</div>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}

