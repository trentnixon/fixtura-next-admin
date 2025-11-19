"use client";

import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Globe,
  Building2,
} from "lucide-react";
import { AssociationDetail } from "@/types/associationDetail";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui-library/badges/StatusBadge";

/**
 * AssociationHeader Component
 *
 * Main association header component displaying:
 * - Association name, sport, logo
 * - Contact details (phone, email, address) - handle null
 * - Location information (address, city, state, country, coordinates) - handle null
 * - Website link - handle null
 * - Active status badge
 * - PlayHQ link (if available)
 */
interface AssociationHeaderProps {
  association: AssociationDetail;
}

export default function AssociationHeader({
  association,
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
    playHqId,
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
        locationString
      )}`
    : null;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header Section: Logo, Name, Sport, Status */}
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="relative w-20 h-20 rounded-lg border-2 bg-white p-2 shadow-sm">
                <Image
                  src={logoUrl}
                  alt={`${name} logo`}
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>
            </div>

            {/* Name, Sport, Status */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {name}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">
                    {sport}
                  </p>
                  <div className="flex items-center gap-2">
                    <StatusBadge
                      status={isActive}
                      trueLabel="Active"
                      falseLabel="Inactive"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details Section */}
          {contactDetails && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Contact Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {contactDetails.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <a
                      href={`tel:${contactDetails.phone}`}
                      className="text-gray-700 dark:text-gray-300 hover:text-primary hover:underline"
                    >
                      {contactDetails.phone}
                    </a>
                  </div>
                )}
                {contactDetails.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <a
                      href={`mailto:${contactDetails.email}`}
                      className="text-gray-700 dark:text-gray-300 hover:text-primary hover:underline"
                    >
                      {contactDetails.email}
                    </a>
                  </div>
                )}
                {contactDetails.address && (
                  <div className="flex items-center gap-2 text-sm md:col-span-2">
                    <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {contactDetails.address}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Location Section */}
          {location && (locationString || location.coordinates) && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </h3>
              <div className="space-y-2">
                {locationString && (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {locationString}
                  </p>
                )}
                {googleMapsUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4" />
                      View on Google Maps
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Links Section: Website and PlayHQ */}
          {(website?.website || href || playHqId) && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Links
              </h3>
              <div className="flex flex-wrap gap-2">
                {website?.website && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={website.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                )}
                {href && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      PlayHQ
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
