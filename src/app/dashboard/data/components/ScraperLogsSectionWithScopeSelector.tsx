"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Database,
  Network,
  Search,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CLUB_SCRAPE_SPORTS } from "@/constants/clubScrapeSportSlugs";
import type { ClubScrapeSportSlug } from "@/constants/clubScrapeSportSlugs";
import { triggerAssociationToCompetitionScrape } from "@/lib/services/data-collection/triggerAssociationToCompetitionScrape";
import { triggerClientsListScrape } from "@/lib/services/data-collection/triggerClientsListScrape";
import { triggerClubActiveCheckScrape } from "@/lib/services/data-collection/triggerClubActiveCheckScrape";
import { triggerClubToCompetitionScrape } from "@/lib/services/data-collection/triggerClubToCompetitionScrape";
import { triggerGradesCompsScrape } from "@/lib/services/data-collection/triggerGradesCompsScrape";
import { triggerGradesLookupTeamsScrape } from "@/lib/services/data-collection/triggerGradesLookupTeamsScrape";
import { ScraperLogsSection } from "./ScraperLogsSection";

const ALL_SCOPES_VALUE = "all" as const;

const SCOPES = [
  { value: ALL_SCOPES_VALUE, label: "All Scopes", icon: Database },
  { value: "clients_list" as const, label: "Clients List", icon: Users },
  {
    value: "association_to_competition" as const,
    label: "Association to Competition",
    icon: Network,
  },
  {
    value: "club_to_competition" as const,
    label: "Club to Competition",
    icon: Building2,
  },
  {
    value: "grades_comps" as const,
    label: "Grades to Competition",
    icon: Trophy,
  },
  {
    value: "grades_lookup_teams" as const,
    label: "Grades Lookup Teams",
    icon: Search,
  },
  {
    value: "club_active_check" as const,
    label: "Club Active Check",
    icon: ShieldCheck,
  },
] as const;

const SCOPE_CONFIG = {
  [ALL_SCOPES_VALUE]: {
    hasTrigger: false as const,
    title: "All scraper jobs",
    description: "Cross-scope scraper activity, charts, and job logs",
    dialogTitle: "",
    dialogDescription: "",
    buttonLabel: "",
  },
  clients_list: {
    hasTrigger: true as const,
    title: "Clients list scraper",
    description: "Club and association discovery jobs from PlayHQ",
    dialogTitle: "Confirm Clients List Scrape",
    dialogDescription:
      "This will enqueue a job to scrape clubs and associations from PlayHQ using all targets from the scraper config. The job runs asynchronously. Continue?",
    buttonLabel: "Trigger Clients List Scrape",
  },
  association_to_competition: {
    hasTrigger: true as const,
    title: "Association to competition scraper",
    description: "Association competition mapping jobs and logs",
    dialogTitle: "Confirm Association to Competition Scrape",
    dialogDescription:
      "This will enqueue a job to scrape association-to-competition mappings from PlayHQ, including single-association scrapes. The job runs asynchronously. Continue?",
    buttonLabel: "Trigger Association Overview Scrape",
  },
  club_to_competition: {
    hasTrigger: true as const,
    title: "Club to competition scraper",
    description: "Club competition mapping jobs and logs",
    dialogTitle: "Confirm Club to Competition Scrape",
    dialogDescription:
      "This will enqueue a job to scrape club competitions from PlayHQ. The job runs asynchronously. Continue?",
    buttonLabel: "Trigger Club to Competition Scrape",
  },
  grades_comps: {
    hasTrigger: true as const,
    title: "Grades to competition scraper",
    description: "Competition grade discovery jobs and logs",
    dialogTitle: "Confirm Grades to Competition Scrape",
    dialogDescription:
      "This will enqueue a job to scrape grades for all competitions from PlayHQ. The job runs asynchronously. Continue?",
    buttonLabel: "Trigger Grades to Competition Scrape",
  },
  grades_lookup_teams: {
    hasTrigger: true as const,
    title: "Grades lookup teams scraper",
    description: "Ladder lookup and team discovery jobs",
    dialogTitle: "Confirm Grades Lookup Teams Scrape",
    dialogDescription:
      "This will enqueue a job to scrape PlayHQ ladder pages for teams across all grades. The job runs asynchronously. Continue?",
    buttonLabel: "Trigger Grades Lookup Teams Scrape",
  },
  club_active_check: {
    hasTrigger: true as const,
    title: "Club active check scraper",
    description: "Inactive organisation checks and related ingest jobs",
    dialogTitle: "Confirm Club Active Check",
    dialogDescription:
      "This will enqueue a run that checks active clubs from recon data against PlayHQ inactive organisation messaging. The job runs asynchronously. Continue?",
    buttonLabel: "Trigger Club Active Check",
  },
} as const;

type ScraperScope =
  | typeof ALL_SCOPES_VALUE
  | "clients_list"
  | "association_to_competition"
  | "club_to_competition"
  | "grades_comps"
  | "grades_lookup_teams"
  | "club_active_check";

type TriggerableScope = Exclude<ScraperScope, typeof ALL_SCOPES_VALUE>;

function isClubScrapeSportScope(
  scope: TriggerableScope | null,
): scope is "club_to_competition" | "club_active_check" {
  return scope === "club_to_competition" || scope === "club_active_check";
}

export function ScraperLogsSectionWithScopeSelector() {
  const [scope, setScope] = useState<ScraperScope>(ALL_SCOPES_VALUE);
  const [dialogOpenFor, setDialogOpenFor] = useState<TriggerableScope | null>(
    null,
  );
  const [sportSlugForDialog, setSportSlugForDialog] = useState<string | null>(
    null,
  );
  const [loadingFor, setLoadingFor] = useState<TriggerableScope | null>(null);
  const queryClient = useQueryClient();

  const handleConfirm = async () => {
    if (!dialogOpenFor) return;

    setLoadingFor(dialogOpenFor);

    try {
      let result: { jobId: number; queueName: string; message: string };

      switch (dialogOpenFor) {
        case "club_to_competition":
          result = await triggerClubToCompetitionScrape(
            sportSlugForDialog === null
              ? {}
              : {
                  targets: [],
                  options: {
                    sport: sportSlugForDialog as ClubScrapeSportSlug,
                  },
                },
          );
          break;
        case "grades_comps":
          result = await triggerGradesCompsScrape({});
          break;
        case "grades_lookup_teams":
          result = await triggerGradesLookupTeamsScrape({});
          break;
        case "clients_list":
          result = await triggerClientsListScrape({});
          break;
        case "club_active_check":
          result = await triggerClubActiveCheckScrape(
            sportSlugForDialog === null
              ? {}
              : {
                  targets: [],
                  options: {
                    sport: sportSlugForDialog as ClubScrapeSportSlug,
                  },
                },
          );
          break;
        case "association_to_competition":
          result = await triggerAssociationToCompetitionScrape({});
          break;
      }

      toast.success(`Job ${result.jobId} queued to ${result.queueName}`, {
        description: result.message,
      });
      setDialogOpenFor(null);
      queryClient.invalidateQueries({ queryKey: ["scraperLogs"] });
      queryClient.invalidateQueries({ queryKey: ["scraperLog"] });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to trigger scrape",
      );
    } finally {
      setLoadingFor(null);
    }
  };

  return (
    <>
      <Tabs
        value={scope}
        onValueChange={(value) => setScope(value as ScraperScope)}
        className="w-full"
      >
        <TabsList
          variant="primary"
          className="mb-4 flex h-auto flex-wrap justify-start gap-1"
        >
          {SCOPES.map((item) => {
            const Icon = item.icon;

            return (
              <TabsTrigger key={item.value} value={item.value} className="gap-2">
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {item.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {SCOPES.map((item) => {
          const Icon = item.icon;
          const config = SCOPE_CONFIG[item.value];

          return (
            <TabsContent key={item.value} value={item.value}>
              <SectionContainer
                title={config.title}
                description={config.description}
                icon={<Icon className="h-5 w-5 text-brandPrimary-500" />}
                variant="compact"
                action={
                  config.hasTrigger ? (
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={() => {
                        setSportSlugForDialog(null);
                        setDialogOpenFor(item.value as TriggerableScope);
                      }}
                      disabled={!!loadingFor}
                    >
                      {loadingFor === item.value
                        ? "Queuing..."
                        : config.buttonLabel}
                    </Button>
                  ) : null
                }
              >
                <ScraperLogsSection
                  scope={
                    item.value === ALL_SCOPES_VALUE
                      ? undefined
                      : (item.value as Exclude<
                          ScraperScope,
                          typeof ALL_SCOPES_VALUE
                        >)
                  }
                />
              </SectionContainer>
            </TabsContent>
          );
        })}
      </Tabs>

      <Dialog
        open={!!dialogOpenFor}
        onOpenChange={(open) => {
          if (!open) {
            setDialogOpenFor(null);
            setSportSlugForDialog(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogOpenFor && SCOPE_CONFIG[dialogOpenFor].dialogTitle}
            </DialogTitle>
            <DialogDescription>
              {dialogOpenFor && SCOPE_CONFIG[dialogOpenFor].dialogDescription}
            </DialogDescription>
          </DialogHeader>

          {dialogOpenFor && isClubScrapeSportScope(dialogOpenFor) && (
            <div className="space-y-2">
              <Label htmlFor="club-scrape-sport">Sport (optional)</Label>
              <Select
                value={sportSlugForDialog ?? undefined}
                onValueChange={(value) => setSportSlugForDialog(value)}
              >
                <SelectTrigger id="club-scrape-sport" className="w-full">
                  <SelectValue placeholder="Full run (no sport filter)" />
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
          )}

          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                setDialogOpenFor(null);
                setSportSlugForDialog(null);
              }}
              disabled={!!loadingFor}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={!!loadingFor}
            >
              {loadingFor ? "Queuing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
