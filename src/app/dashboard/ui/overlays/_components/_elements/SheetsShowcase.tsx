"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
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
import CodeExample from "./CodeExample";

/**
 * Sheets Showcase
 *
 * Displays Sheet component examples
 */
export default function SheetsShowcase() {
  return (
    <SectionContainer
      title="Sheets"
      description="Slide-out panel components from all sides"
    >
      <div className="space-y-6">
        <ElementContainer title="Right Sheet (Default)">
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
          <div className="mt-6">
            <CodeExample
              code={`import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

<Sheet>
  <SheetTrigger asChild>
    <Button variant="primary">Open Sheet</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Edit Profile</SheetTitle>
      <SheetDescription>
        Make changes to your profile here.
      </SheetDescription>
    </SheetHeader>
    <div className="grid gap-4 py-4">
      {/* Content */}
    </div>
    <SheetFooter>
      <Button variant="secondary">Cancel</Button>
      <Button variant="primary">Save changes</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Sheet from Different Sides">
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
          <div className="mt-6">
            <CodeExample
              code={`<Sheet>
  <SheetTrigger asChild>
    <Button variant="primary">Open Sheet</Button>
  </SheetTrigger>
  <SheetContent side="left"> {/* left | right | top | bottom */}
    <SheetHeader>
      <SheetTitle>Sheet Title</SheetTitle>
      <SheetDescription>Sheet description</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
