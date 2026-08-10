"use client";

import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTriggerFixtureDiscoveryGrade } from "@/hooks/grades/useTriggerFixtureDiscoveryGrade";

interface TriggerFixtureDiscoveryButtonProps {
  gradeId: number;
  disabled?: boolean;
  triggerMode?: "button" | "menu-item";
}

export default function TriggerFixtureDiscoveryButton({
  gradeId,
  disabled = false,
  triggerMode = "button",
}: TriggerFixtureDiscoveryButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const triggerDiscovery = useTriggerFixtureDiscoveryGrade();

  const handleConfirm = async () => {
    try {
      await triggerDiscovery.mutateAsync({ id: gradeId });
      setIsDialogOpen(false);
    } catch {
      // Toasts handled in hook; keep dialog open on error
    }
  };

  const isPending = triggerDiscovery.isPending;
  const triggerDisabled = disabled || isPending || gradeId <= 0;
  const openDialogAfterMenuCloses = () => {
    window.setTimeout(() => setIsDialogOpen(true), 0);
  };

  return (
    <>
      {triggerMode === "menu-item" ? (
        <DropdownMenuItem
          disabled={triggerDisabled}
          onSelect={openDialogAfterMenuCloses}
        >
          <Search className="h-4 w-4" />
          Discover fixtures
        </DropdownMenuItem>
      ) : (
        <Button
          onClick={() => setIsDialogOpen(true)}
          disabled={triggerDisabled}
          variant="accent"
          size="sm"
        >
          <Search className="h-4 w-4 mr-2" />
          Discover fixtures
        </Button>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-brandAccent-600" />
              Confirm Fixture Discovery
            </DialogTitle>
            <DialogDescription>
              This will queue a background job to discover fixtures for this
              grade. The CMS resolves the grade&apos;s sport and PlayHQ URL,
              then enqueues the job to the fixture_discovery queue. The job runs
              asynchronously.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Grade ID:</span> {gradeId}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsDialogOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              onClick={handleConfirm}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Queuing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Confirm Discovery
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
