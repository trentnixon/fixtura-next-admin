"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RerenderRequestDetail as RerenderRequestDetailType } from "@/types/rerender-request";
import { formatDate } from "@/lib/utils";
import {
  MessageSquare,
  ExternalLink,
} from "lucide-react";

interface RerenderRequestDetailProps {
  request: RerenderRequestDetailType;
}

/**
 * Rerender Request Detail Component
 *
 * Displays complete information about a rerender request including
 * account details, render details, reason, user email, notes, and status.
 */
export default function RerenderRequestDetail({
  request,
}: RerenderRequestDetailProps) {
  const getStatusBadgeVariant = (
    status: string | null
  ): "default" | "secondary" | "destructive" | "outline" => {
    if (!status) return "outline";

    const normalized = status.toLowerCase();

    if (normalized === "pending") {
      return "default";
    }
    if (normalized === "processing") {
      return "secondary";
    }
    if (normalized === "completed") {
      return "default";
    }
    if (normalized === "rejected") {
      return "destructive";
    }

    return "outline";
  };

  const getStatusBadgeClassName = (status: string | null): string => {
    if (!status) return "";

    const normalized = status.toLowerCase();

    if (normalized === "pending") {
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
    if (normalized === "processing") {
      return "bg-blue-100 text-blue-800 border-blue-200";
    }
    if (normalized === "completed") {
      return "bg-green-100 text-green-800 border-green-200";
    }
    if (normalized === "rejected") {
      return "bg-red-100 text-red-800 border-red-200";
    }

    return "";
  };

  // Calculate row spans for categories
  const requestDetailsRowCount = 3; // Reason, User Email, Created
  const accountRowCount = request.account
    ? (request.account.firstName && request.account.lastName ? 3 : 2)
    : 0;
  const renderRowCount = request.render ? 3 : 0;

  // Determine account type for routing (default to association if name contains "Association", otherwise club)
  const getAccountType = (accountName: string | null): "association" | "club" => {
    if (!accountName) return "club";
    return accountName.toLowerCase().includes("association") ? "association" : "club";
  };

  return (
    <div className="space-y-6">
      {/* Status and Handled Row */}
      <div className="flex justify-end items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Badge
            variant={getStatusBadgeVariant(request.status)}
            className={getStatusBadgeClassName(request.status)}
          >
            {request.status || "Unknown"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Handled:</span>
          <Badge
            variant={request.hasBeenHandled ? "default" : "outline"}
            className={
              request.hasBeenHandled
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-gray-100 text-gray-800 border-gray-200"
            }
          >
            {request.hasBeenHandled ? "Handled" : "Pending"}
          </Badge>
        </div>
      </div>

      {/* Details Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Category</TableHead>
              <TableHead className="w-[200px]">Field</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Request Details */}
            <TableRow>
              <TableCell
                rowSpan={requestDetailsRowCount}
                className="font-medium align-top"
              >
                Request Details
              </TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>{request.reason || "—"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>User Email</TableCell>
              <TableCell>
                {request.userEmail ? (
                  <a
                    href={`mailto:${request.userEmail}`}
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    {request.userEmail}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  "—"
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Created</TableCell>
              <TableCell>
                {request.createdAt ? formatDate(request.createdAt) : "—"}
              </TableCell>
            </TableRow>

            {/* Account Information */}
            {request.account && (
              <>
                <TableRow>
                  <TableCell
                    rowSpan={accountRowCount}
                    className="font-medium align-top"
                  >
                    Account Information
                  </TableCell>
                  <TableCell>Account Name</TableCell>
                  <TableCell className="font-semibold">
                    {request.account.name ? (
                      <Link
                        href={`/dashboard/accounts/${getAccountType(request.account.name)}/${request.account.id}`}
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        {request.account.name}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>
                {request.account.firstName && request.account.lastName && (
                  <TableRow>
                    <TableCell>Contact Name</TableCell>
                    <TableCell>
                      {request.account.firstName} {request.account.lastName}
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell>Contact Email</TableCell>
                  <TableCell>
                    {request.account.email ? (
                      <a
                        href={`mailto:${request.account.email}`}
                        className="text-primary hover:underline inline-flex items-center gap-1 break-all"
                      >
                        {request.account.email}
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>
              </>
            )}

            {/* Render Information */}
            {request.render && (
              <>
                <TableRow>
                  <TableCell
                    rowSpan={renderRowCount}
                    className="font-medium align-top"
                  >
                    Render Information
                  </TableCell>
                  <TableCell>Render Name</TableCell>
                  <TableCell className="font-semibold">
                    {request.render.name ? (
                      <Link
                        href={`/dashboard/renders/${request.render.id}`}
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        {request.render.name}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Complete</TableCell>
                  <TableCell>
                    <Badge
                      variant={request.render.complete ? "default" : "outline"}
                      className={
                        request.render.complete
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-gray-100 text-gray-800 border-gray-200"
                      }
                    >
                      {request.render.complete ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Processing</TableCell>
                  <TableCell>
                    <Badge
                      variant={request.render.processing ? "secondary" : "outline"}
                      className={
                        request.render.processing
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : "bg-gray-100 text-gray-800 border-gray-200"
                      }
                    >
                      {request.render.processing ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Additional Notes - Keep as Card */}
      {request.additionalNotes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Additional Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border bg-muted/50 p-4">
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {request.additionalNotes}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

