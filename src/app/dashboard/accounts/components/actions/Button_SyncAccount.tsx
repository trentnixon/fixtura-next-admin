"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { P } from "@/components/type/type";
//import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
//import { useSyncAccountCompetitions } from "@/hooks/useSyncAccountCompetitions"; // Example custom hook

export default function Button_SyncAccount({
  syncCompetitionsID,
}: {
  syncCompetitionsID: number;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  //const { mutate: syncCompetitions, isLoading } = useSyncAccountCompetitions();
  const isLoading = false;
  const handleConfirm = () => {
    /*  syncCompetitions(undefined, {
      onSuccess: () => {
        console.log("Sync completed successfully!");
        setIsDialogOpen(false); // Close the modal
      },
      onError: (error) => {
        console.error("Failed to sync competitions:", error);
        setIsDialogOpen(false); // Close the modal
      },
    }); */
  };

  return (
    <>
      {/* Button to open the confirmation modal */}
      <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
        <P>Sync Account {syncCompetitionsID}</P>
      </Button>

      {/* Confirmation Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Sync</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to sync the competitions? This action may take
            some time and cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={isLoading}>
              {isLoading ? "Syncing..." : "Confirm Sync"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
