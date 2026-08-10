"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubsectionTitle } from "@/components/type/titles";
import ComponentRef from "./ComponentRef";
import { OVERLAY_TOKENS } from "./overlayTokens";

/**
 * Sheets showcase — default right panel and multi-side variants
 */
export default function SheetsShowcase() {
  return (
    <SectionContainer
      title="Sheets"
      description="Slide-out panel components from all sides"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Right (Default)</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              Sheet · SheetContent · SheetFooter
            </span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="primary">Open Right Sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit Profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when youre done.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="sheet-name">Name</Label>
                  <Input id="sheet-name" placeholder="John Doe" />
                </div>
              </div>
              <SheetFooter>
                <Button variant="secondary">Cancel</Button>
                <Button variant="primary">Save changes</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          <ComponentRef token={OVERLAY_TOKENS.sheet.right} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>All Sides</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              side: left · right · top · bottom
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="primary" size="sm">
                  Left
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Left Sheet</SheetTitle>
                  <SheetDescription>
                    This sheet opens from the left side.
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary" size="sm">
                  Right
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Right Sheet</SheetTitle>
                  <SheetDescription>
                    This sheet opens from the right side.
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="accent" size="sm">
                  Top
                </Button>
              </SheetTrigger>
              <SheetContent side="top">
                <SheetHeader>
                  <SheetTitle>Top Sheet</SheetTitle>
                  <SheetDescription>
                    This sheet opens from the top.
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="primary" size="sm">
                  Bottom
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom">
                <SheetHeader>
                  <SheetTitle>Bottom Sheet</SheetTitle>
                  <SheetDescription>
                    This sheet opens from the bottom.
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
          <ComponentRef token={OVERLAY_TOKENS.sheet.sides} />
        </div>
      </div>
    </SectionContainer>
  );
}
