"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { P } from "@/components/type/type";
import { H4 } from "@/components/type/titles";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useUpdateAccountOnly } from "@/hooks/accounts/useUpdateAccountOnly";
import { UpdateAccountOnlyRequest } from "@/types/dataCollection";
import { RefreshCw, AlertCircle } from "lucide-react";
import {
  parseAccountSyncError,
  showErrorNotification,
  showSuccessNotification,
} from "../utils/errorHandlers";

interface AccountSyncButtonProps {
  accountId: number;
  accountType: "CLUB" | "ASSOCIATION";
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "destructive"
    | "secondary"
    | "link"
    | "primary"
    | "accent";
}

/**
 * AccountSyncButton Component
 *
 * Handles account metadata synchronization with confirmation dialog,
 * error handling, and loading states.
 */
export default function AccountSyncButton({
  accountId,
  accountType,
  variant = "outline",
}: AccountSyncButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorState, setErrorState] = useState<{
    title: string;
    message: string;
    type: "error" | "warning" | "info";
  } | null>(null);

  // Use the mutation hook
  const { mutate, isPending } = useUpdateAccountOnly();

  const handleSync = () => {
    // Clear any previous errors
    setErrorState(null);

    const requestData: UpdateAccountOnlyRequest = {
      accountId,
      accountType,
    };

    mutate(requestData, {
      onSuccess: (data) => {
        console.log("Account update queued successfully:", data);
        showSuccessNotification(data.message);
        setIsDialogOpen(false);
      },
      onError: (error: Error) => {
        console.error("Failed to queue account update:", error);

        // Parse error for user-friendly message
        const parsedError = parseAccountSyncError(error);
        setErrorState(parsedError);

        // Show error notification
        showErrorNotification(
          parsedError.title,
          parsedError.message,
          parsedError.type
        );

        // Don't close dialog on error so user can see the error message
        // Dialog will close when user clicks cancel or outside
      },
    });
  };

  const handleButtonClick = () => {
    setErrorState(null); // Clear errors when opening dialog
    setIsDialogOpen(true);
  };

  return (
    <>
      <Button
        variant={variant}
        onClick={handleButtonClick}
        disabled={isPending}
        className={isPending ? "opacity-50 cursor-not-allowed" : ""}
      >
        {isPending ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Syncing...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Account
          </>
        )}
      </Button>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Account Sync</DialogTitle>
            <DialogDescription>
              Queue a background job to update account metadata
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <P>
                Are you sure you want to sync account metadata for{" "}
                <strong>Account ID {accountId}</strong> ({accountType})?
              </P>
              <P className="text-sm text-muted-foreground">
                This will queue a background job to update account information.
                The process may take a few moments to complete.
              </P>
            </div>

            {/* Error Display */}
            {errorState && (
              <div
                className={`rounded-lg p-4 border ${
                  errorState.type === "error"
                    ? "bg-red-50 border-red-200"
                    : errorState.type === "warning"
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <AlertCircle
                    className={`h-5 w-5 mt-0.5 ${
                      errorState.type === "error"
                        ? "text-red-600"
                        : errorState.type === "warning"
                        ? "text-yellow-600"
                        : "text-blue-600"
                    }`}
                  />
                  <div className="flex-1">
                    <H4 className="text-sm mb-1">{errorState.title}</H4>
                    <P className="text-sm">{errorState.message}</P>
                  </div>
                </div>
              </div>
            )}

            {/* Success Display (if needed) */}
            {isPending && (
              <div className="rounded-lg p-4 bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
                  <P className="text-sm text-blue-800">
                    Queuing account update job...
                  </P>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="destructive"
              className="rounded-full"
              onClick={() => {
                setErrorState(null);
                setIsDialogOpen(false);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant={variant}
              onClick={handleSync}
              disabled={isPending}
              className={isPending ? "opacity-50 cursor-not-allowed" : ""}
            >
              {isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                "Confirm Sync"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
