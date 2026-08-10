"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubsectionTitle } from "@/components/type/titles";
import {
  Search,
  Mail,
  Link as LinkIcon,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import ComponentRef from "./ComponentRef";
import { FORM_TOKENS } from "./formTokens";

/**
 * Text input showcase — basic, typed, labeled, icon, and state patterns
 */
export default function TextInputsShowcase() {
  return (
    <SectionContainer
      title="Text Inputs"
      description="Basic text input components with various types"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Basic</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              default · value · disabled
            </span>
          </div>
          <div className="space-y-2 max-w-md">
            <Input type="text" placeholder="Enter text..." />
            <Input type="text" placeholder="With value" defaultValue="John Doe" />
            <Input type="text" placeholder="Disabled" disabled />
          </div>
          <ComponentRef token={FORM_TOKENS.input.basic} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Input Types</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              email · password · number · tel · url · search
            </span>
          </div>
          <div className="space-y-2 max-w-md">
            <Input type="email" placeholder="email@example.com" />
            <Input type="password" placeholder="Password" />
            <Input type="number" placeholder="123" />
            <Input type="tel" placeholder="+1 (555) 000-0000" />
            <Input type="url" placeholder="https://example.com" />
            <Input type="search" placeholder="Search..." />
          </div>
          <ComponentRef token={FORM_TOKENS.input.types} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>With Label</SubsectionTitle>
            <span className="text-xs text-muted-foreground">Label + Input</span>
          </div>
          <div className="space-y-2 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Enter your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
          </div>
          <ComponentRef token={FORM_TOKENS.input.withLabel} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>With Icons</SubsectionTitle>
            <span className="text-xs text-muted-foreground">leading icon</span>
          </div>
          <div className="space-y-2 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search..." />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" type="email" placeholder="Email" />
            </div>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" type="url" placeholder="URL" />
            </div>
          </div>
          <ComponentRef token={FORM_TOKENS.input.withIcons} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Validation States</SubsectionTitle>
            <span className="text-xs text-muted-foreground">error · success</span>
          </div>
          <div className="space-y-2 max-w-md">
            <div className="space-y-1">
              <Label htmlFor="error-input">Error State</Label>
              <Input
                id="error-input"
                className="border-error-500 focus-visible:ring-error-500"
                placeholder="This field has an error"
              />
              <p className="text-xs text-error-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                This field is required
              </p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="success-input">Success State</Label>
              <Input
                id="success-input"
                className="border-success-500 focus-visible:ring-success-500"
                placeholder="This field is valid"
                defaultValue="Valid input"
              />
              <p className="text-xs text-success-600 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Looks good!
              </p>
            </div>
          </div>
          <ComponentRef token={FORM_TOKENS.input.states} />
        </div>
      </div>
    </SectionContainer>
  );
}
