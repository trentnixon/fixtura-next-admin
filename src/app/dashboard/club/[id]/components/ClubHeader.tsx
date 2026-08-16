"use client";

import { ReactNode, useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ExternalLink,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
} from "lucide-react";
import { ClubCore, ClubStatistics } from "@/types/clubAdminDetail";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui-library/badges/StatusBadge";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { useTriggerClubSingleScrape } from "@/hooks/club/useTriggerClubSingleScrape";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClientOnly } from "@/components/util/ClientOnly";

interface ClubHeaderProps {
  club: ClubCore;
  statistics: ClubStatistics;
}

export default function ClubHeader({ club, statistics }: ClubHeaderProps) {
  const {
    name,
    sport,
    logoUrl,
    isActive,
    contactDetails,
    location,
    website,
    href,
  } = club;

  const locationParts: string[] = [];
  if (location?.address) locationParts.push(location.address);
  if (location?.city) locationParts.push(location.city);
  if (location?.state) locationParts.push(location.state);
  if (location?.country) locationParts.push(location.country);
  const locationString =
    locationParts.length > 0 ? locationParts.join(", ") : null;

  const googleMapsUrl = location?.coordinates
    ? `https://www.google.com/maps/search/?api=1&query=${location.coordinates.lat},${location.coordinates.lng}`
    : locationString
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        locationString,
      )}`
      : null;

  const hasContactDetails =
    contactDetails?.phone || contactDetails?.email || contactDetails?.address;
  const hasLocation = location && (locationString || location.coordinates);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 rounded-md border bg-white p-4 md:flex-row md:items-start">
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-white p-2">
            <Image
              src={logoUrl}
              alt={`${name} logo`}
              fill
              className="object-contain p-1"
              unoptimized
            />
          </div>

        </div>

        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold text-slate-900">
                {name}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">{sport}</span>
                <StatusBadge
                  status={isActive}
                  trueLabel="Active Club"
                  falseLabel="Inactive Club"
                  variant={isActive ? "default" : "neutral"}
                />
              </div>
            </div>
            <ClientOnly
              fallback={
                <div className="flex flex-wrap items-center gap-2">
                  <div className="h-9 w-28 animate-pulse rounded-md bg-slate-100" />
                  <div className="h-9 w-36 animate-pulse rounded-md bg-slate-100" />
                </div>
              }
            >
              <ClubHeaderActions
                clubId={club.id}
                websiteUrl={website?.website ?? null}
                playHqUrl={href ?? null}
              />
            </ClientOnly>
          </div>

          <div className="grid overflow-hidden rounded-md border sm:grid-cols-2 lg:grid-cols-4">
            <MetricCell
              label="Teams"
              value={statistics.teams.total}
              helper={`${statistics.teams.acrossCompetitions} competitions`}
            />
            <MetricCell
              label="Competitions"
              value={statistics.competitions.total}
              helper={`${statistics.competitions.active} active`}
            />
            <MetricCell
              label="Associations"
              value={statistics.associations.total}
              helper={`${statistics.associations.active} active`}
            />
            <MetricCell
              label="Accounts"
              value={statistics.accounts.total}
              helper={`${statistics.accounts.active} active`}
            />
          </div>
        </div>
      </div>

      {(hasContactDetails || hasLocation) && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {hasContactDetails && (
            <ElementContainer
              title="Contact Details"
              border
              padding="none"
              className="h-full"
            >
              <div className="divide-y divide-slate-200">
                <DetailRow icon={<Phone className="h-4 w-4" />} label="Phone">
                  {contactDetails?.phone ? (
                    <a
                      href={`tel:${contactDetails.phone}`}
                      className="truncate text-sm font-medium text-slate-900 hover:text-brandPrimary-700"
                    >
                      {contactDetails.phone}
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Not provided
                    </span>
                  )}
                </DetailRow>
                <DetailRow icon={<Mail className="h-4 w-4" />} label="Email">
                  {contactDetails?.email ? (
                    <a
                      href={`mailto:${contactDetails.email}`}
                      className="truncate text-sm font-medium text-slate-900 hover:text-brandPrimary-700"
                      title={contactDetails.email}
                    >
                      {contactDetails.email}
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Not provided
                    </span>
                  )}
                </DetailRow>
                <DetailRow
                  icon={<MapPin className="h-4 w-4" />}
                  label="Address"
                >
                  <span className="text-sm font-medium text-slate-900">
                    {contactDetails?.address ?? "Not provided"}
                  </span>
                </DetailRow>
              </div>
            </ElementContainer>
          )}

          {hasLocation && (
            <ElementContainer
              title="Location"
              border
              padding="none"
              className="h-full"
            >
              <div className="divide-y divide-slate-200">
                <DetailRow
                  icon={<MapPin className="h-4 w-4" />}
                  label="Address"
                >
                  <span className="text-sm font-medium text-slate-900">
                    {locationString ?? "Not provided"}
                  </span>
                </DetailRow>
                {googleMapsUrl && (
                  <div className="flex justify-end px-4 py-3">
                    <Button variant="primary" size="sm" asChild>
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Google Maps
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </ElementContainer>
          )}
        </div>
      )}
    </div>
  );
}

function MetricCell({
  label,
  value,
  helper,
}: {
  label: string;
  value: number | string;
  helper: string;
}) {
  return (
    <div className="border-b border-r border-slate-200 px-4 py-3 last:border-r-0 sm:[&:nth-child(2n)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2n)]:border-r lg:last:border-r-0">
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <div className="mt-1 flex items-baseline justify-between gap-3">
        <p className="text-xl font-semibold text-slate-900">{value}</p>
        <p className="truncate text-xs text-muted-foreground">{helper}</p>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-slate-50 text-slate-500">
          {icon}
        </div>
        <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      </div>
      <div className="min-w-0 text-right">{children}</div>
    </div>
  );
}

interface ClubHeaderActionsProps {
  clubId: number;
  websiteUrl: string | null;
  playHqUrl: string | null;
}

function ClubHeaderActions({
  clubId,
  websiteUrl,
  playHqUrl,
}: ClubHeaderActionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const triggerScrape = useTriggerClubSingleScrape();
  const hasLinks = websiteUrl || playHqUrl;

  const handleProcessDirect = async () => {
    try {
      await triggerScrape.mutateAsync({ clubId });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error triggering club scrape:", error);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {hasLinks && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="primary" size="sm">
              <ExternalLink className="h-4 w-4" />
              Open
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Quick links</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {websiteUrl && (
              <DropdownMenuItem asChild>
                <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4" />
                  Website
                </a>
              </DropdownMenuItem>
            )}
            {playHqUrl && (
              <DropdownMenuItem asChild>
                <a href={playHqUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  View on PlayHQ
                </a>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="accent" size="sm">
            <RefreshCw className="h-4 w-4" />
            Data actions
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Queue background jobs</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={triggerScrape.isPending}
            onSelect={() => setIsDialogOpen(true)}
          >
            <RefreshCw className="h-4 w-4" />
            Scrape this club&apos;s competitions
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-brandAccent-600" />
              Scrape this club&apos;s competitions
            </DialogTitle>
            <DialogDescription>
              This will queue a background job to scrape this club&apos;s PlayHQ
              page and ingest competitions. The CMS looks up the club, resolves
              the PlayHQ URL from club.href, and enqueues to the Redis queue
              scrape:club-single. The job runs asynchronously. After about 1–3
              minutes, run org-link sync from the Data dashboard if you need
              association links updated for this club.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Club ID:</span> {clubId}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsDialogOpen(false)}
              disabled={triggerScrape.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              onClick={handleProcessDirect}
              disabled={triggerScrape.isPending}
            >
              {triggerScrape.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Queuing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Confirm Scrape
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
