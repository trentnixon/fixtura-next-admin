"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SubsectionTitle } from "@/components/type/titles";
import { User } from "lucide-react";
import ComponentRef from "./ComponentRef";
import { STATUS_TOKENS } from "./statusTokens";

/**
 * Avatar showcase — images, fallbacks, sizes, and status indicators
 */
export default function AvatarsShowcase() {
  return (
    <SectionContainer
      title="Avatars"
      description="User avatar components with fallbacks"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Basic</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              image · initials · icon
            </span>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
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
          <ComponentRef token={STATUS_TOKENS.avatar.basic} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Sizes</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              sm · md · lg · xl
            </span>
          </div>
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
          <ComponentRef token={STATUS_TOKENS.avatar.sizes} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Brand Status</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              corner dot indicator
            </span>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-brandPrimary-600 border-2 border-white rounded-full" />
            </div>
            <div className="relative">
              <Avatar>
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-brandSecondary-600 border-2 border-white rounded-full" />
            </div>
            <div className="relative">
              <Avatar>
                <AvatarFallback>CD</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-brandAccent-600 border-2 border-white rounded-full" />
            </div>
          </div>
          <ComponentRef token={STATUS_TOKENS.avatar.brandStatus} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Semantic Status</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              online · offline · away · idle
            </span>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-success-500 border-2 border-white rounded-full" />
            </div>
            <div className="relative">
              <Avatar>
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-error-500 border-2 border-white rounded-full" />
            </div>
            <div className="relative">
              <Avatar>
                <AvatarFallback>CD</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-warning-500 border-2 border-white rounded-full" />
            </div>
            <div className="relative">
              <Avatar>
                <AvatarFallback>EF</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-slate-400 border-2 border-white rounded-full" />
            </div>
          </div>
          <ComponentRef token={STATUS_TOKENS.avatar.semanticStatus} />
        </div>
      </div>
    </SectionContainer>
  );
}
