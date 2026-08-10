"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
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
import { SubsectionTitle } from "@/components/type/titles";
import { Trash2 } from "lucide-react";
import ComponentRef from "./ComponentRef";
import { OVERLAY_TOKENS } from "./overlayTokens";

/**
 * Dialogs showcase — basic, form, and confirmation patterns
 */
export default function DialogsShowcase() {
  return (
    <SectionContainer
      title="Dialogs"
      description="Modal dialog components for overlays and popups"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Basic</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              Dialog · DialogTrigger · DialogFooter
            </span>
          </div>
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
          <ComponentRef token={OVERLAY_TOKENS.dialog.basic} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>With Form</SubsectionTitle>
            <span className="text-xs text-muted-foreground">Label · Input · save/cancel</span>
          </div>
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
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="secondary">Cancel</Button>
                <Button variant="primary">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <ComponentRef token={OVERLAY_TOKENS.dialog.form} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Confirmation</SubsectionTitle>
            <span className="text-xs text-muted-foreground">destructive · icon title</span>
          </div>
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
          <ComponentRef token={OVERLAY_TOKENS.dialog.confirmation} />
        </div>
      </div>
    </SectionContainer>
  );
}
