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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RerenderRequestDetail,
  RerenderRequestStatus,
} from "@/types/rerender-request";
import { useMarkRerenderRequestHandled } from "@/hooks/rerender-request/useMarkRerenderRequestHandled";
import { useUpdateRerenderRequestStatus } from "@/hooks/rerender-request/useUpdateRerenderRequestStatus";
import { toast } from "sonner";
import { CheckCircle2, Loader2, DatabaseIcon } from "lucide-react";
import Link from "next/link";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { useParams } from "next/navigation";

interface RerenderRequestActionsProps {
  request: RerenderRequestDetail;
}

/**
 * Rerender Request Actions Component
 *
 * Provides action buttons for managing rerender requests.
 * Includes "Mark as Handled" button with confirmation dialog.
 */
export default function RerenderRequestActions({
  request,
}: RerenderRequestActionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutate: markHandled, isPending } = useMarkRerenderRequestHandled();
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateRerenderRequestStatus();
  const { strapiLocation } = useGlobalContext();
  const { id } = useParams();

  const handleMarkHandled = () => {
    markHandled(request.id, {
      onSuccess: () => {
        toast.success("Rerender request marked as handled");
        setIsDialogOpen(false);
      },
      onError: (error: Error) => {
        toast.error(
          error.message || "Failed to mark rerender request as handled"
        );
      },
    });
  };

  const handleButtonClick = () => {
    setIsDialogOpen(true);
  };

  const handleStatusChange = (newStatus: string) => {
    if (!newStatus || newStatus === request.status) return;

    updateStatus(
      { id: request.id, status: newStatus as RerenderRequestStatus },
      {
        onSuccess: () => {
          toast.success(`Status updated to ${newStatus}`);
        },
        onError: (error: Error) => {
          toast.error(
            error.message || "Failed to update status. Please try again."
          );
        },
      }
    );
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      {/* Left Side: Back Button */}
      <div className="flex items-center">
        <Button variant="accent" asChild>
          <Link href="/dashboard/rerender-requests">Back to Requests</Link>
        </Button>
      </div>

      {/* Right Side: Actions */}
      <div className="flex gap-2 items-center">
        {request.hasBeenHandled && (
          <div className="text-sm text-green-600 font-medium">
            This request has already been handled.
          </div>
        )}

        {/* Status Selector */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="status-select"
            className="text-sm text-muted-foreground whitespace-nowrap"
          >
            Status:
          </label>
          <Select
            value={request.status || ""}
            onValueChange={handleStatusChange}
            disabled={isUpdatingStatus}
          >
            <SelectTrigger
              id="status-select"
              className="w-[140px]"
              aria-label="Change request status"
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          {isUpdatingStatus && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        {/* Render Link */}
        {request.render && (
          <>
            <Button variant="accent" size="sm" asChild>
              <Link href={`/dashboard/renders/${request.render.id}`}>
                View Render
              </Link>
            </Button>
            {/* Render Admin CMS Link */}
            <Link
              href={`${strapiLocation.render}${request.render.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="primary" size="sm">
                <DatabaseIcon className="h-4 w-4 mr-2" />
                Render CMS
              </Button>
            </Link>
          </>
        )}

        {/* Rerender Request Admin CMS Link */}
        <Link
          href={`${strapiLocation.rerenderRequest}${id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="primary" size="sm">
            <DatabaseIcon className="h-4 w-4 mr-2" />
            Request CMS
          </Button>
        </Link>

        {!request.hasBeenHandled && (
          <>
            <Button
              onClick={handleButtonClick}
              variant="primary"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark as Handled
                </>
              )}
            </Button>

            {/* Confirmation Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Mark Request as Handled</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to mark this rerender request as
                    handled? This action will update the request status and
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-medium">Request ID:</span>{" "}
                      {request.id}
                    </p>
                    {request.account && (
                      <p>
                        <span className="font-medium">Account:</span>{" "}
                        {request.account.name || `ID: ${request.account.id}`}
                      </p>
                    )}
                    {request.render && (
                      <p>
                        <span className="font-medium">Render:</span>{" "}
                        {request.render.name || `ID: ${request.render.id}`}
                      </p>
                    )}
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
                    variant="primary"
                    onClick={handleMarkHandled}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Confirm"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
}
