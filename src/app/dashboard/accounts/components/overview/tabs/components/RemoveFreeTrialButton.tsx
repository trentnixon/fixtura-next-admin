"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWipeFreeTrial } from "@/hooks/free-trial/useWipeFreeTrial";

type RemoveFreeTrialButtonProps = {
  clientId: number;
};

export default function RemoveFreeTrialButton({
  clientId,
}: RemoveFreeTrialButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const wipe = useWipeFreeTrial();

  if (!Number.isInteger(clientId) || clientId <= 0) {
    return null;
  }

  const handleConfirm = async () => {
    await wipe.mutateAsync(clientId);
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          className="border-brandError-300 text-brandError-800 hover:border-brandError-700 hover:bg-brandError-700 hover:text-white"
          onClick={() => setIsDialogOpen(true)}
          disabled={wipe.isPending}
        >
          Remove free trial
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove this free trial?</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  This removes the free trial for this club or association,
                  including a trial record stored on another client of the same
                  organisation.
                </p>
                <p>
                  The no-charge trialing order is deleted. Paid orders and a
                  paid tier stay.
                </p>
                <p>
                  A free trial that is still running loses access immediately.
                  The client is not emailed.
                </p>
                <p>Older trial orders can remain in the history table.</p>
                <p>
                  A new free trial is possible only when billing already allows
                  it.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsDialogOpen(false)}
              disabled={wipe.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleConfirm}
              disabled={wipe.isPending}
            >
              Remove free trial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
