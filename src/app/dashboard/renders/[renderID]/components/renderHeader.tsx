"use client";

import { ChevronDown, DatabaseIcon, ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusFlags from "./StatusFlags";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { useParams } from "next/navigation";
import Link from "next/link";
import DeleteRenderButton from "../../../accounts/components/actions/button_delete_Render";
import { useGetAccountDetailsFromRenderId } from "@/hooks/renders/useGetAccountDetailsFromRenderId";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RenderHeaderProps {
  render?: {
    Processing?: boolean;
    Complete?: boolean;
    forceRerender?: boolean;
    EmailSent?: boolean;
  } | null;
}

export default function RenderHeader({ render }: RenderHeaderProps) {
  const { Domain, strapiLocation } = useGlobalContext();
  const { contentHub } = Domain;
  const { renderID } = useParams();

  // Fetch account details for links
  const { data: accountDetails } = useGetAccountDetailsFromRenderId(
    renderID as string,
  );

  // Determine account route based on account_type
  // account_type === 1 = Club, account_type === 2 = Association
  const accountId = accountDetails?.account?.id;
  // Check if account_type exists (may not be in type definition but could be in API response)
  const accountType =
    accountDetails?.account && "account_type" in accountDetails.account
      ? (accountDetails.account as { account_type?: number }).account_type
      : undefined;
  const backToAccountUrl =
    accountId && accountType === 1
      ? `/dashboard/accounts/club/${accountId}`
      : accountId && accountType === 2
        ? `/dashboard/accounts/association/${accountId}`
        : accountId
          ? `/dashboard/accounts/club/${accountId}` // Default to club if type unknown
          : "/dashboard/accounts";

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <StatusFlags
        flags={{
          Processing: render?.Processing || false,
          Complete: render?.Complete || false,
          forceRerender: render?.forceRerender || false,
          EmailSent: render?.EmailSent || false,
        }}
      />

      <div className="flex items-center gap-2">
        {accountId && (
          <Button variant="primary" size="sm" asChild>
            <Link href={backToAccountUrl}>Back to Account</Link>
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="primary" size="sm">
              Open
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Destinations</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={`${contentHub}/${
                  accountDetails?.account?.id
                }/${accountDetails?.account?.Sport?.toLowerCase()}/${renderID}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLinkIcon className="h-4 w-4" />
                Content Hub
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`${strapiLocation.render}${renderID}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <DatabaseIcon className="h-4 w-4" />
                Strapi Render
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DeleteRenderButton />
      </div>
    </div>
  );
}
