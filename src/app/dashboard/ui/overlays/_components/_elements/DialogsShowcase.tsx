"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import CodeExample from "./CodeExample";

/**
 * Dialogs Showcase
 *
 * Displays Dialog component examples
 */
export default function DialogsShowcase() {
  return (
    <SectionContainer
      title="Dialogs"
      description="Modal dialog components for overlays and popups"
    >
      <div className="space-y-6">
        <ElementContainer title="Basic Dialog">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="primary">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="secondary">Cancel</Button>
                <Button variant="accent">Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="mt-6">
            <CodeExample
              code={`import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

<Dialog>
  <DialogTrigger asChild>
    <Button variant="primary">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="secondary">Cancel</Button>
      <Button variant="accent">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Dialog with Form">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="primary">Open Form Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when youre done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="secondary">Cancel</Button>
                <Button variant="primary">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="mt-6">
            <CodeExample
              code={`<Dialog>
  <DialogTrigger asChild>
    <Button variant="primary">Open Form Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="John Doe" />
      </div>
    </div>
    <DialogFooter>
      <Button variant="secondary">Cancel</Button>
      <Button variant="primary">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Confirmation Dialog">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="accent">Delete Item</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-brandAccent-600" />
                  Confirm Deletion
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this item? This action cannot
                  be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="secondary">Cancel</Button>
                <Button variant="accent">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="mt-6">
            <CodeExample
              code={`<Dialog>
  <DialogTrigger asChild>
    <Button variant="accent">Delete Item</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogDescription>
        Are you sure you want to delete this item?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="secondary">Cancel</Button>
      <Button variant="accent">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
