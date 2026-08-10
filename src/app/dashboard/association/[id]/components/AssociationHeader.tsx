"use client";

import { ReactNode, useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Globe,
  Loader2,
  Layers,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import { AssociationDetail } from "@/types/associationDetail";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui-library/badges/StatusBadge";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProcessAssociationDirect } from "@/hooks/association/useProcessAssociationDirect";
import { useTriggerGradesBatchScrape } from "@/hooks/association/useTriggerGradesBatchScrape";
import { useTriggerGradesLookupTeamsBatchScrape } from "@/hooks/association/useTriggerGradesLookupTeamsBatchScrape";
import { useTriggerFixtureDiscoveryAssociationBatch } from "@/hooks/association/useTriggerFixtureDiscoveryAssociationBatch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * AssociationHeader Component
 *
 * Main association header component displaying:
 * - Association name, sport, logo
 * - Contact details (phone, email, address)
 * - Location information
 * - Website and PlayHQ links
 */
interface AssociationHeaderProps {
  association: AssociationDetail;
  /** Association ID from the route `/dashboard/association/[id]` — used for scrape triggers */
  associationId: number;
}

export default function AssociationHeader({
  association,
  associationId,
}: AssociationHeaderProps) {
  const {
    name,
    sport,
    logoUrl,
    isActive,
    contactDetails,
    location,
    website,
    href,
  } = association;

  // Build location string
  const locationParts = [];
  if (location?.address) locationParts.push(location.address);
  if (location?.city) locationParts.push(location.city);
  if (location?.state) locationParts.push(location.state);
  if (location?.country) locationParts.push(location.country);
  const locationString =
    locationParts.length > 0 ? locationParts.join(", ") : null;

  // Google Maps URL if coordinates exist
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
    <div className="space-y-8">
      {/* Identity Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Logo */}
        <div className="relative w-32 h-32 rounded-xl border bg-white p-4 shadow-sm flex-shrink-0 overflow-hidden">
          <Image
            src={logoUrl}
            alt={`${name} logo`}
            fill
            className="object-contain p-2"
            unoptimized
          />
        </div>

        {/* Info */}
        <div className="flex-1 space-y-3 text-center md:text-left pt-2">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              {name}
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">
              {sport}
            </p>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
            <StatusBadge
              status={isActive}
              trueLabel="Active Association"
              falseLabel="Inactive Association"
              variant={isActive ? "default" : "neutral"}
            />
            <AssociationHeaderActions
              associationId={associationId}
              websiteUrl={website?.website ?? null}
              playHqUrl={href ?? null}
            />
          </div>
        </div>
      </div>

      {/* Details Grid */}
      {(hasContactDetails || hasLocation) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Details */}
          {hasContactDetails && (
            <ElementContainer
              title="Contact Details"
              border
              padding="none"
              className="h-full"
            >
              <div className="divide-y divide-slate-200">
                <DetailRow icon={<Phone className="h-4 w-4" />} label="Phone">
                  {contactDetails.phone ? (
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
                  {contactDetails.email ? (
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

                {contactDetails.address && (
                  <DetailRow
                    icon={<MapPin className="h-4 w-4" />}
                    label="Address"
                  >
                    <span className="text-sm font-medium text-slate-900">
                      {contactDetails.address}
                    </span>
                  </DetailRow>
                )}
              </div>
            </ElementContainer>
          )}

          {/* Location */}
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

interface AssociationHeaderActionsProps {
  associationId: number;
  websiteUrl: string | null;
  playHqUrl: string | null;
}

function AssociationHeaderActions({
  associationId,
  websiteUrl,
  playHqUrl,
}: AssociationHeaderActionsProps) {
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [gradesDialogOpen, setGradesDialogOpen] = useState(false);
  const [lookupTeamsDialogOpen, setLookupTeamsDialogOpen] = useState(false);
  const [fixtureDiscoveryDialogOpen, setFixtureDiscoveryDialogOpen] =
    useState(false);

  const processAssociationDirect = useProcessAssociationDirect();
  const triggerGradesBatch = useTriggerGradesBatchScrape();
  const triggerLookupTeamsBatch = useTriggerGradesLookupTeamsBatchScrape();
  const triggerFixtureDiscovery = useTriggerFixtureDiscoveryAssociationBatch();
  const hasLinks = websiteUrl || playHqUrl;

  const openDialogAfterMenuCloses = (openDialog: () => void) => {
    window.setTimeout(openDialog, 0);
  };

  const handleProcessDirect = async () => {
    try {
      await processAssociationDirect.mutateAsync({ associationId });
      setProcessDialogOpen(false);
    } catch (error) {
      console.error("Error processing association:", error);
    }
  };

  const handleGradesBatch = async () => {
    try {
      await triggerGradesBatch.mutateAsync({ associationId });
      setGradesDialogOpen(false);
    } catch {
      // Toasts handled in hook.
    }
  };

  const handleLookupTeamsBatch = async () => {
    try {
      await triggerLookupTeamsBatch.mutateAsync({ associationId });
      setLookupTeamsDialogOpen(false);
    } catch {
      // Toasts handled in hook.
    }
  };

  const handleFixtureDiscovery = async () => {
    try {
      await triggerFixtureDiscovery.mutateAsync({ associationId });
      setFixtureDiscoveryDialogOpen(false);
    } catch {
      // Toasts handled in hook.
    }
  };

  return (
    <>
      {hasLinks && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="primary" size="sm">
              <ExternalLink className="h-4 w-4" />
              Open
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
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
            disabled={processAssociationDirect.isPending}
            onSelect={() =>
              openDialogAfterMenuCloses(() => setProcessDialogOpen(true))
            }
          >
            <RefreshCw className="h-4 w-4" />
            Process Direct
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={triggerGradesBatch.isPending}
            onSelect={() =>
              openDialogAfterMenuCloses(() => setGradesDialogOpen(true))
            }
          >
            <Layers className="h-4 w-4" />
            Grades batch scrape
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={triggerLookupTeamsBatch.isPending}
            onSelect={() =>
              openDialogAfterMenuCloses(() => setLookupTeamsDialogOpen(true))
            }
          >
            <Users className="h-4 w-4" />
            Lookup teams batch
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={triggerFixtureDiscovery.isPending}
            onSelect={() =>
              openDialogAfterMenuCloses(() =>
                setFixtureDiscoveryDialogOpen(true)
              )
            }
          >
            <Search className="h-4 w-4" />
            Fixture discovery batch
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={processDialogOpen} onOpenChange={setProcessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-brandAccent-600" />
              Confirm Association Processing
            </DialogTitle>
            <DialogDescription>
              This will queue a background job to scrape the association&apos;s
              PlayHQ page and update the association overview. The job will be
              processed asynchronously.
            </DialogDescription>
          </DialogHeader>
          <AssociationDialogBody associationId={associationId} />
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setProcessDialogOpen(false)}
              disabled={processAssociationDirect.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              onClick={handleProcessDirect}
              disabled={processAssociationDirect.isPending}
            >
              {processAssociationDirect.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Confirm Process
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={gradesDialogOpen} onOpenChange={setGradesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-brandSecondary-600" />
              Confirm Grades Batch Scrape
            </DialogTitle>
            <DialogDescription>
              Queue a background job to refresh grades for every competition
              linked to this association. Work happens asynchronously and is
              separate from Process Direct.
            </DialogDescription>
          </DialogHeader>
          <AssociationDialogBody associationId={associationId} />
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setGradesDialogOpen(false)}
              disabled={triggerGradesBatch.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={handleGradesBatch}
              disabled={triggerGradesBatch.isPending}
            >
              {triggerGradesBatch.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Queuing...
                </>
              ) : (
                <>
                  <Layers className="h-4 w-4" />
                  Confirm scrape
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={lookupTeamsDialogOpen}
        onOpenChange={setLookupTeamsDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-brandSecondary-600" />
              Confirm Grades Lookup Teams Batch
            </DialogTitle>
            <DialogDescription>
              Queue a background job on{" "}
              <span className="font-mono text-xs">
                scrape:grades-lookup-teams-batch
              </span>
              . The CMS loads targets from this association context and runs the
              ladder team lookup asynchronously.
            </DialogDescription>
          </DialogHeader>
          <AssociationDialogBody associationId={associationId} />
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setLookupTeamsDialogOpen(false)}
              disabled={triggerLookupTeamsBatch.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={handleLookupTeamsBatch}
              disabled={triggerLookupTeamsBatch.isPending}
            >
              {triggerLookupTeamsBatch.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Queuing...
                </>
              ) : (
                <>
                  <Users className="h-4 w-4" />
                  Confirm scrape
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={fixtureDiscoveryDialogOpen}
        onOpenChange={setFixtureDiscoveryDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-brandSecondary-600" />
              Confirm Fixture Discovery Batch
            </DialogTitle>
            <DialogDescription>
              This will queue fixture discovery for every eligible grade under
              this association. The CMS will load the association, scan its
              competitions and grades, and enqueue one fixture_discovery job per
              grade with a usable URL. Work runs asynchronously.
            </DialogDescription>
          </DialogHeader>
          <AssociationDialogBody associationId={associationId} />
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setFixtureDiscoveryDialogOpen(false)}
              disabled={triggerFixtureDiscovery.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={handleFixtureDiscovery}
              disabled={triggerFixtureDiscovery.isPending}
            >
              {triggerFixtureDiscovery.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Queuing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Confirm discovery
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function AssociationDialogBody({ associationId }: { associationId: number }) {
  return (
    <div className="py-4">
      <div className="text-sm space-y-1">
        <p>
          <span className="font-medium">Association ID:</span> {associationId}
        </p>
      </div>
    </div>
  );
}
