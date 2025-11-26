"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Globe,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { ClubCore } from "@/types/clubAdminDetail";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui-library/badges/StatusBadge";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { useProcessClubDirect } from "@/hooks/club/useProcessClubDirect";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ClubHeaderProps {
  club: ClubCore;
}

export default function ClubHeader({ club }: ClubHeaderProps) {
  const {
    name,
    sport,
    logoUrl,
    isActive,
    contactDetails,
    location,
    website,
    href,
    parentLogo,
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
        locationString
      )}`
    : null;

  const hasContactDetails =
    contactDetails?.phone || contactDetails?.email || contactDetails?.address;
  const hasLocation = location && (locationString || location.coordinates);
  const hasLinks = website?.website || href;

  return (
    <div className="space-y-8">
      {/* Identity Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl border bg-white p-4 shadow-sm flex-shrink-0 overflow-hidden">
            <Image
              src={logoUrl}
              alt={`${name} logo`}
              fill
              className="object-contain p-2"
              unoptimized
            />
          </div>
          {parentLogo && (
            <div className="relative w-12 h-12 rounded-lg border bg-white p-2 shadow-sm flex-shrink-0 overflow-hidden hidden md:block">
              <Image
                src={parentLogo}
                alt="Parent logo"
                fill
                className="object-contain p-1"
                unoptimized
              />
            </div>
          )}
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
              trueLabel="Active Club"
              falseLabel="Inactive Club"
              variant={isActive ? "default" : "neutral"}
            />
            <ProcessDirectButton clubId={club.id} />
          </div>
        </div>
      </div>

      {/* Details Grid */}
      {(hasContactDetails || hasLocation || hasLinks) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Contact Details */}
          {hasContactDetails && (
            <ElementContainer
              title="Contact Details"
              border
              padding="md"
              className="h-full"
            >
              <div className="space-y-4">
                {contactDetails?.phone && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg shrink-0">
                      <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="space-y-1 overflow-hidden">
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Phone
                      </p>
                      <a
                        href={`tel:${contactDetails.phone}`}
                        className="block text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 hover:underline truncate"
                      >
                        {contactDetails.phone}
                      </a>
                    </div>
                  </div>
                )}

                {contactDetails?.email && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg shrink-0">
                      <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="space-y-1 overflow-hidden w-full">
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Email
                      </p>
                      <a
                        href={`mailto:${contactDetails.email}`}
                        className="block text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 hover:underline truncate"
                        title={contactDetails.email}
                      >
                        {contactDetails.email}
                      </a>
                    </div>
                  </div>
                )}

                {contactDetails?.address && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg shrink-0">
                      <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Address
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {contactDetails.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </ElementContainer>
          )}

          {/* Location */}
          {hasLocation && (
            <ElementContainer
              title="Location"
              border
              padding="md"
              className="h-full"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg shrink-0">
                    <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Address
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {locationString ?? "Not provided"}
                    </p>
                  </div>
                </div>

                {googleMapsUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    asChild
                  >
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Google Maps
                    </a>
                  </Button>
                )}
              </div>
            </ElementContainer>
          )}

          {/* Links */}
          {hasLinks && (
            <ElementContainer
              title="Quick Links"
              border
              padding="md"
              className="h-full"
            >
              <div className="space-y-3">
                {website?.website && (
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto py-3"
                    asChild
                  >
                    <a
                      href={website.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="p-1 bg-purple-50 dark:bg-purple-900/20 rounded mr-3">
                        <Globe className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex flex-col items-start overflow-hidden">
                        <span className="text-sm font-medium">Website</span>
                        <span className="text-xs text-muted-foreground font-normal truncate max-w-[180px]">
                          {website.website}
                        </span>
                      </div>
                      <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground shrink-0" />
                    </a>
                  </Button>
                )}

                {href && (
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto py-3"
                    asChild
                  >
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      <div className="p-1 bg-orange-50 dark:bg-orange-900/20 rounded mr-3">
                        <ExternalLink className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">Club Link</span>
                        <span className="text-xs text-muted-foreground font-normal">
                          View external club page
                        </span>
                      </div>
                      <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground shrink-0" />
                    </a>
                  </Button>
                )}
              </div>
            </ElementContainer>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * ProcessDirectButton Component
 *
 * Button to trigger direct club processing via the API with confirmation dialog
 */
function ProcessDirectButton({ clubId }: { clubId: number }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const processClubDirect = useProcessClubDirect();

  const handleProcessDirect = async () => {
    try {
      await processClubDirect.mutateAsync({ clubId });
      setIsDialogOpen(false); // Close dialog on success
    } catch (error) {
      // Error handling is done in the hook
      console.error("Error processing club:", error);
      // Keep dialog open on error so user can retry or cancel
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        disabled={processClubDirect.isPending}
        variant="accent"
        size="sm"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Process Direct
      </Button>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-brandAccent-600" />
              Confirm Club Processing
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to trigger direct processing for this club?
              This will queue a background job to process club data, including
              competitions, teams, and games. The job will be processed
              asynchronously.
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
              disabled={processClubDirect.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              onClick={handleProcessDirect}
              disabled={processClubDirect.isPending}
            >
              {processClubDirect.isPending ? (
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
    </>
  );
}
