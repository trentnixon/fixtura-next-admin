"use client";

import { useState } from "react";
import CreatePage from "@/components/scaffolding/containers/createPage";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ClubEmails from "@/app/dashboard/accounts/club/components/clubEmails";
import AssociationEmails from "@/app/dashboard/accounts/association/components/associationEmails";
import {
  CLUB_SCRAPE_SPORTS,
  type ClubScrapeSportSlug,
} from "@/constants/clubScrapeSportSlugs";

export default function EmailListingsPage() {
  const [sportSlug, setSportSlug] = useState<ClubScrapeSportSlug>(
    "cricket-australia",
  );

  return (
    <CreatePage>
      <CreatePageTitle
        title="Email Listings"
        byLine="Global view of all club and association contact emails"
      />

      <div className="mt-6 max-w-xs space-y-2">
        <Label htmlFor="email-listings-sport">Sport</Label>
        <Select
          value={sportSlug}
          onValueChange={(value) => setSportSlug(value as ClubScrapeSportSlug)}
        >
          <SelectTrigger id="email-listings-sport">
            <SelectValue placeholder="Select sport" />
          </SelectTrigger>
          <SelectContent>
            {CLUB_SCRAPE_SPORTS.map((row) => (
              <SelectItem key={row.slug} value={row.slug}>
                {row.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="clubs" className="mt-6">
        <TabsList variant="secondary" className="mb-4">
          <TabsTrigger value="clubs">Club Contacts</TabsTrigger>
          <TabsTrigger value="associations">Association Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="clubs">
          <ClubEmails initialFilter="all" sportSlug={sportSlug} />
        </TabsContent>

        <TabsContent value="associations">
          <AssociationEmails initialFilter="all" sportSlug={sportSlug} />
        </TabsContent>
      </Tabs>
    </CreatePage>
  );
}
