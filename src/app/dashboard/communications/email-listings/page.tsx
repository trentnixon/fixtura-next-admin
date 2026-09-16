"use client";

import { useState } from "react";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ClubEmails from "@/app/dashboard/accounts/club/components/clubEmails";
import AssociationEmails from "@/app/dashboard/accounts/association/components/associationEmails";
import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import {
  CLUB_SCRAPE_SPORTS,
  type ClubScrapeSportSlug,
} from "@/constants/clubScrapeSportSlugs";
import {
  sectionTabListClass,
  sectionTabTriggerClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import { Building2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const EMAIL_LISTING_TABS = [
  { value: "clubs", label: "Club contacts", icon: Mail },
  { value: "associations", label: "Association contacts", icon: Building2 },
] as const;

export default function EmailListingsPage() {
  const [sportSlug, setSportSlug] = useState<ClubScrapeSportSlug>(
    "cricket-australia",
  );

  return (
    <>
      <CreatePageTitle
        title="Email Listings"
        byLine="Global view of club and association contact emails"
        byLineBottom="Filter by sport, subscription status, and scraped PlayHQ footer contacts"
      >
        <DashboardLinkButton href="/dashboard/data" trailingIcon="arrow">
          Data / scraping
        </DashboardLinkButton>
      </CreatePageTitle>

      <PageContainer padding="xs" spacing="lg">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-full border border-slate-200 bg-slate-50/60 px-4 py-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Org contacts are scoped by PlayHQ sport slug (CMS default: Cricket).
            </p>
            <Select
              value={sportSlug}
              onValueChange={(value) =>
                setSportSlug(value as ClubScrapeSportSlug)
              }
            >
              <SelectTrigger
                id="email-listings-sport"
                className="w-full rounded-full bg-white sm:w-[200px]"
              >
                <SelectValue placeholder="Sport" />
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

          <Tabs defaultValue="clubs" className="space-y-4">
            <TabsList
              variant="primary"
              className={cn(sectionTabListClass, "mb-4")}
            >
              {EMAIL_LISTING_TABS.map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  variant="section"
                  className={sectionTabTriggerClass}
                >
                  <Icon className="h-4 w-4 shrink-0 text-current" aria-hidden />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="clubs">
              <ClubEmails embedded initialFilter="all" sportSlug={sportSlug} />
            </TabsContent>

            <TabsContent value="associations">
              <AssociationEmails
                embedded
                initialFilter="all"
                sportSlug={sportSlug}
              />
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    </>
  );
}
