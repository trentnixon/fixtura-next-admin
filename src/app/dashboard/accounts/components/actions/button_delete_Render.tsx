"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDeleteRenderMutation } from "@/hooks/renders/useDeleteRender";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAccountQuery } from "@/hooks/accounts/useAccountQuery";

export default function DeleteRenderButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { renderID, accountID } = useParams(); // Ensure these parameters exist in the route
  const basePath = pathname.split("/").slice(0, 4).join("/");

  const { mutate: deleteRender, isPending } = useDeleteRenderMutation(
    renderID as string
  );
  const { refetch } = useAccountQuery(accountID as string);

  const handleDeleteRender = () => {
    if (!renderID) {
      console.error("Render ID is missing.");
      return;
    }

    deleteRender(renderID as string, {
      onSuccess: async () => {
        console.log(`Render ${renderID} deleted successfully.`);
        await refetch();
        // Optionally redirect or refresh the page
        router.push(`${basePath}/${accountID}`); // Replace with the desired path
      },
      onError: (error) => {
        console.error("Failed to delete render:", error);
      },
    });

    setIsDialogOpen(false); // Close the modal
  };

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        variant="accent"
        disabled={isPending} // Disable button while deleting
      >
        {isPending ? "Deleting..." : "Delete Render"}
      </Button>

      {/* Confirmation Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this render? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteRender}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
