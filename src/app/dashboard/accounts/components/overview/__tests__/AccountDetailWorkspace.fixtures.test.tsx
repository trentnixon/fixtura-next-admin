import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { addDays, format, startOfDay, subDays } from "date-fns";
import { GlobalProvider } from "@/components/providers/GlobalContext";
import type { fixturaContentHubAccountDetails } from "@/types/fixturaContentHubAccountDetails";
import type { CompetitionClubDrilldownResponse } from "@/types/competitionClubDrilldown";
import type { FixtureDetailsResponse, FixtureSummary } from "@/types/fixtureInsights";
import AccountDetailWorkspace from "../AccountDetailWorkspace";

const fixtureState = vi.hoisted(() => ({
  refetch: vi.fn(),
  current: {
    data: undefined as FixtureDetailsResponse | undefined,
    isLoading: false,
    error: null as Error | null,
    refetch: vi.fn(),
  },
}));

const fixtureCalls = vi.hoisted(() => ({
  filters: [] as Array<{ association?: number } | undefined>,
}));

const drilldownCalls = vi.hoisted(() => ({
  ids: [] as Array<number | undefined>,
}));

const drilldownState = vi.hoisted(() => ({
  refetch: vi.fn(),
  current: {
    data: undefined as CompetitionClubDrilldownResponse | undefined,
    isLoading: false,
    error: null as Error | null,
    refetch: vi.fn(),
  },
}));

const gradeCalls = vi.hoisted(() => ({
  filters: [] as Array<{ grade?: number; association?: number } | undefined>,
}));

vi.mock("@/hooks/competitions/useCompetitionClubDrilldown", () => ({
  useCompetitionClubDrilldown: (clubId?: number) => {
    drilldownCalls.ids.push(clubId);
    return drilldownState.current;
  },
}));

vi.mock("@/lib/services/fixtures/fetchFixtureDetails", () => ({
  fetchFixtureDetails: (filters?: { grade?: number; association?: number }) => {
    gradeCalls.filters.push(filters);
    return Promise.resolve(fixtureState.current.data);
  },
}));
vi.mock("@/hooks/fixtures/useFixtureDetails", () => ({
  useFixtureDetails: (filters?: { association?: number }) => {
    fixtureCalls.filters.push(filters);
    return fixtureState.current;
  },
}));

vi.mock("@/hooks/analytics/useAccountAnalytics", () => ({
  useAccountAnalytics: () => ({
    data: undefined,
    isLoading: false,
    error: null,
  }),
}));

vi.mock("@/hooks/account-health/useAccountHealthAccountStatus", () => ({
  useAccountHealthAccountStatus: () => ({
    data: undefined,
    isLoading: false,
    isError: false,
  }),
}));

vi.mock("@/hooks/scheduler/useSchedulerQuery", () => ({
  useSchedulerQuery: () => ({
    data: undefined,
    isLoading: false,
    isError: false,
  }),
}));

vi.mock("@/hooks/scheduler/useSchedulerUpdate", () => ({
  useSchedulerUpdate: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

const today = startOfDay(new Date());
const todayIso = format(today, "yyyy-MM-dd");
const yesterdayIso = format(subDays(today, 1), "yyyy-MM-dd");
const tomorrowIso = format(addDays(today, 1), "yyyy-MM-dd");

function client(
  accountType: number,
  organisationId = 2771,
): fixturaContentHubAccountDetails {
  return {
    id: 42,
    FirstName: "Pat",
    LastName: null,
    DeliveryAddress: "",
    isActive: true,
    isSetup: true,
    isRightsHolder: false,
    isPermissionGiven: true,
    group_assets_by: false,
    include_junior_surnames: false,
    isUpdating: false,
    Sport: "cricket",
    scheduler: {
      id: 0,
      Name: "Weekly",
      updatedAt: "",
      publishedAt: "",
      Time: null,
      isRendering: false,
      Queued: false,
    },
    account_type: accountType,
    accountOrganisationDetails: {
      id: organisationId,
      Name: "Metro",
      href: "",
      ParentLogo: "",
      Sport: "cricket",
    },
    render_token: { id: 1, token: "token", expiration: "", updatedAt: "" },
    template: "ladder",
    theme: { primary: "#000", secondary: "#111", dark: "#222", white: "#fff" },
    renders: [],
    rollup: {
      totalRenders: 0,
      totalProcessingRenders: 0,
      totalCompleteRenders: 0,
      totalEmailsSent: 0,
      totalTeamRosterRequests: 0,
      totalTeamRosters: 0,
      totalTeamRosterEmails: 0,
      totalForceRerenders: 0,
      totalForceRerenderEmails: 0,
      totalGameResults: 0,
      totalUpcomingGames: 0,
      totalGrades: 0,
      totalDownloads: 0,
      totalAiArticles: 0,
    },
    metricsOverTime: {
      totalRenders: 0,
      totalCompleteRenders: 0,
      totalDownloads: 0,
      totalEmailsSent: 0,
      totalGameResults: 0,
      totalUpcomingGames: 0,
      totalGrades: 0,
      totalAiArticles: 0,
      GameResultsArr: [],
      UpcomingGamesArr: [],
      GradesArr: [],
      AiArticlesArr: [],
      DownloadsArr: [],
    },
    metricsAsPercentageOfCost: {
      valuePerRender: 0,
      totalCostByAccount: 0,
      totalDigitalAssets: 0,
      percentageCompleteRenders: 0,
      percentageProcessingRenders: 0,
      percentageGameResults: 0,
      percentageDownloads: 0,
      percentageAiArticles: 0,
      averageCostPerDigitalAsset: 0,
      averageCostOverTime: [],
    },
  };
}

function fixture(
  overrides: Partial<FixtureSummary> & Pick<FixtureSummary, "id">,
): FixtureSummary {
  return {
    date: "2026-02-01",
    round: "Round 1",
    status: "upcoming",
    type: "One Day",
    teams: { home: "Reds", away: "Blues" },
    grade: { id: 1, name: "Premier" },
    competition: { id: 8, name: "Summer Cup" },
    association: { id: 2771, name: "Metro" },
    ...overrides,
  };
}

function response(fixtures: FixtureSummary[]): FixtureDetailsResponse {
  return {
    data: {
      fixtures,
      filters: { association: 2771 },
      meta: {
        total: fixtures.length,
        dateRange: { start: "2026-01-01", end: "2026-03-31" },
      },
    },
  };
}

function clubRecord(id: number, name: string) {
  return {
    id,
    name,
    sport: "cricket",
    playHqId: null,
    competitionUrl: null,
    logo: null,
    playHqLogo: null,
    hasFixturaAccount: true,
    accounts: [],
    source: "team" as const,
  };
}

function clubDrilldown(): CompetitionClubDrilldownResponse {
  return {
    club: {
      id: 2771,
      name: "Metro Club",
      sport: "cricket",
      playHqId: null,
      hasFixturaAccount: true,
      accounts: [],
      association: null,
    },
    summary: {
      competitionCount: 1,
      activeCompetitions: 1,
      inactiveCompetitions: 0,
    },
    competitions: [
      {
        id: 5,
        name: "Summer Cup",
        season: null,
        status: "active",
        isActive: true,
        timeframe: { start: null, end: null },
        counts: { gradeCount: 1, teamCount: 2, clubCount: 2 },
        clubs: [],
        grades: [
          {
            id: 9,
            name: "Premier",
            gender: null,
            ageGroup: null,
            gradeCode: null,
            teamCount: 2,
            teamsWithFixturaAccount: 1,
            teamsWithoutFixturaAccount: 1,
            accountCoveragePercent: 50,
            clubsRepresented: 2,
            teams: [
              {
                id: 1,
                name: "Reds",
                gender: null,
                ageGroup: null,
                grades: [{ id: 9, name: "Premier" }],
                club: clubRecord(2771, "Metro Club"),
              },
              {
                id: 2,
                name: "Golds",
                gender: null,
                ageGroup: null,
                grades: [{ id: 9, name: "Premier" }],
                club: clubRecord(99, "Other Club"),
              },
            ],
          },
        ],
      },
    ],
  };
}

function renderWorkspace(account: fixturaContentHubAccountDetails) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <GlobalProvider>
        <AccountDetailWorkspace accountData={account} accountID="42" />
      </GlobalProvider>
    </QueryClientProvider>,
  );
}

async function openFixtures() {
  const user = userEvent.setup();
  await user.click(screen.getByRole("tab", { name: "Fixtures" }));
  return user;
}

describe("association client fixtures tab", () => {
  beforeEach(() => {
    fixtureState.refetch.mockReset();
    fixtureCalls.filters = [];
    drilldownCalls.ids = [];
    gradeCalls.filters = [];
    drilldownState.current = {
      data: undefined,
      isLoading: false,
      error: null,
      refetch: drilldownState.refetch,
    };
    fixtureState.current = {
      data: response([]),
      isLoading: false,
      error: null,
      refetch: fixtureState.refetch,
    };
  });

  it("shows fixtures for a club client without requesting them until the tab opens", () => {
    renderWorkspace(client(1));

    expect(screen.getByRole("tab", { name: "Fixtures" })).toBeInTheDocument();
    expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
    for (const label of ["Financial", "Renders", "Data refresh", "Competitions", "Grades"]) {
      expect(screen.getByRole("tab", { name: label })).toBeInTheDocument();
    }
    expect(screen.getByRole("tab", { name: "Financial" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(fixtureCalls.filters).toEqual([]);
    expect(drilldownCalls.ids).toEqual([]);
  });

  it("lists only fixtures played by this club's teams", async () => {
    drilldownState.current = {
      ...drilldownState.current,
      data: clubDrilldown(),
    };
    fixtureState.current = {
      ...fixtureState.current,
      data: response([
        fixture({
          id: 1,
          teams: { home: "Reds", away: "Blues" },
          grade: { id: 9, name: "Premier" },
        }),
        fixture({
          id: 2,
          teams: { home: "Golds", away: "Whites" },
          grade: { id: 9, name: "Premier" },
        }),
      ]),
    };
    renderWorkspace(client(1));
    await openFixtures();

    expect(await screen.findByText("Reds vs Blues")).toBeInTheDocument();
    expect(screen.queryByText("Golds vs Whites")).not.toBeInTheDocument();
    expect(screen.queryByText("No fixtures found for this association.")).not.toBeInTheDocument();
    expect(fixtureCalls.filters).toEqual([]);
    expect(gradeCalls.filters).toContainEqual({ grade: 9 });
    expect(drilldownCalls.ids).toContain(2771);
  });

  it("keeps Financial first and requests the association id only after Fixtures is opened", async () => {
    fixtureState.current = {
      ...fixtureState.current,
      refetch: fixtureState.refetch,
      data: response([
        fixture({ id: 11, teams: { home: "Reds", away: "Blues" } }),
      ]),
    };
    renderWorkspace(client(2));

    expect(screen.getByRole("tab", { name: "Financial" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(fixtureCalls.filters).toEqual([]);

    await openFixtures();

    expect(fixtureCalls.filters.at(-1)).toEqual({ association: 2771 });
    expect(fixtureCalls.filters.every((filters) => filters?.association === 2771)).toBe(
      true,
    );
  });

  it("lists the association window earliest first, with undated fixtures last", async () => {
    fixtureState.current = {
      ...fixtureState.current,
      refetch: fixtureState.refetch,
      data: response([
        fixture({
          id: 2,
          date: "2026-03-02",
          teams: { home: "Blues", away: "Golds" },
          grade: { id: 2, name: "Under 12" },
          round: "Round 2",
          status: "finished",
          type: "T20",
        }),
        fixture({
          id: 1,
          date: "2026-01-15",
          teams: { home: "Reds", away: "Greens" },
          grade: { id: 1, name: "Premier" },
          round: { text: "Round 1" },
          status: "upcoming",
        }),
        fixture({
          id: 3,
          date: null,
          teams: { home: null, away: "Whites" },
          grade: null,
          competition: null,
          round: null,
          status: null,
          type: null,
        }),
      ]),
    };
    renderWorkspace(client(2, 2771));
    await openFixtures();

    expect(
      screen.getByText("3 fixtures from Jan 1, 2026 to Mar 31, 2026"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /back to associations/i })).not.toBeInTheDocument();

    const text = screen.getByRole("table").textContent ?? "";
    const premier = text.indexOf("Premier");
    const under12 = text.indexOf("Under 12");
    const uncategorized = text.indexOf("Uncategorized");
    expect(premier).toBeGreaterThanOrEqual(0);
    expect(under12).toBeGreaterThan(premier);
    expect(uncategorized).toBeGreaterThan(under12);
    expect(text.indexOf("Reds vs Greens")).toBeLessThan(text.indexOf("Blues vs Golds"));
    expect(text.indexOf("Blues vs Golds")).toBeLessThan(text.indexOf("TBD vs Whites"));
    expect(screen.getByText("Jan 15, 2026")).toBeInTheDocument();
    expect(screen.getAllByText("N/A").length).toBeGreaterThan(0);
    expect(screen.getByText("Round 1")).toBeInTheDocument();
    expect(screen.getAllByText("Summer Cup").length).toBeGreaterThan(0);
    expect(screen.getByText("Competition unknown")).toBeInTheDocument();
    expect(screen.getByText("One Day")).toBeInTheDocument();
    expect(screen.getByText("Scheduled")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "View" })[0]).toHaveAttribute(
      "href",
      "/dashboard/fixtures/1",
    );

    await userEvent.click(screen.getByRole("button", { name: "Date" }));
    const reversed = screen.getByRole("table").textContent ?? "";
    expect(reversed.indexOf("Blues vs Golds")).toBeLessThan(reversed.indexOf("Reds vs Greens"));
    expect(reversed.indexOf("Reds vs Greens")).toBeLessThan(reversed.indexOf("TBD vs Whites"));
  });

  it("cycles a header from ascending to descending and then back to CMS order", async () => {
    fixtureState.current = {
      ...fixtureState.current,
      refetch: fixtureState.refetch,
      data: response([
        fixture({
          id: 20,
          date: "2026-03-02",
          round: "Round 1",
          teams: { home: "Blues", away: "Golds" },
        }),
        fixture({
          id: 10,
          date: "2026-01-15",
          round: "Round 2",
          teams: { home: "Reds", away: "Greens" },
        }),
      ]),
    };
    renderWorkspace(client(2));
    const user = await openFixtures();

    const round = screen.getByRole("button", { name: "Round" });
    await user.click(round);
    let text = screen.getByRole("table").textContent ?? "";
    expect(text.indexOf("Blues vs Golds")).toBeLessThan(text.indexOf("Reds vs Greens"));

    await user.click(round);
    text = screen.getByRole("table").textContent ?? "";
    expect(text.indexOf("Reds vs Greens")).toBeLessThan(text.indexOf("Blues vs Golds"));

    await user.click(round);
    text = screen.getByRole("table").textContent ?? "";
    expect(text.indexOf("Blues vs Golds")).toBeLessThan(text.indexOf("Reds vs Greens"));
  });

  it("filters by team, grade, and when without changing the grade counts", async () => {
    fixtureState.current = {
      ...fixtureState.current,
      refetch: fixtureState.refetch,
      data: response([
        fixture({
          id: 1,
          date: yesterdayIso,
          teams: { home: "Reds", away: "Greens" },
          grade: { id: 1, name: "Premier" },
        }),
        fixture({
          id: 2,
          date: todayIso,
          teams: { home: "Blues", away: "Reds" },
          grade: { id: 1, name: "Premier" },
        }),
        fixture({
          id: 3,
          date: tomorrowIso,
          teams: { home: "Golds", away: "Whites" },
          grade: { id: 2, name: "Under 12" },
        }),
        fixture({
          id: 4,
          date: null,
          teams: { home: "Ghosts", away: "Shadows" },
          grade: { id: 2, name: "Under 12" },
        }),
      ]),
    };
    renderWorkspace(client(2));
    const user = await openFixtures();

    await user.click(screen.getByRole("combobox", { name: "Grade" }));
    expect(screen.getByRole("option", { name: "All grades (4)" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Premier (2)" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Under 12 (2)" })).toBeInTheDocument();
    await user.click(screen.getByRole("option", { name: "Under 12 (2)" }));

    await user.click(screen.getByRole("combobox", { name: "When" }));
    await user.click(screen.getByRole("option", { name: "Upcoming" }));

    expect(screen.getByText("Golds vs Whites")).toBeInTheDocument();
    expect(screen.queryByText("Blues vs Reds")).not.toBeInTheDocument();
    expect(screen.queryByText("Ghosts vs Shadows")).not.toBeInTheDocument();

    await user.click(screen.getByRole("combobox", { name: "Grade" }));
    expect(screen.getByRole("option", { name: "Premier (2)" })).toBeInTheDocument();
    await user.keyboard("{Escape}");

    await user.clear(screen.getByPlaceholderText("Search by team name..."));
    await user.type(screen.getByPlaceholderText("Search by team name..."), "reds");
    expect(screen.getByText(/No fixtures found for Under 12/)).toBeInTheDocument();

    await user.click(screen.getByRole("combobox", { name: "Grade" }));
    await user.click(screen.getByRole("option", { name: "All grades (4)" }));
    await user.click(screen.getByRole("combobox", { name: "When" }));
    await user.click(screen.getByRole("option", { name: "Past" }));
    expect(screen.getByText("Reds vs Greens")).toBeInTheDocument();

    await user.click(screen.getByRole("combobox", { name: "When" }));
    await user.click(screen.getByRole("option", { name: "Today" }));
    expect(screen.getByText("Blues vs Reds")).toBeInTheDocument();
  });

  it("shows a loading state, then an error that can be retried", async () => {
    fixtureState.current = {
      data: undefined,
      isLoading: true,
      error: null,
      refetch: fixtureState.refetch,
    };
    const { rerender } = renderWorkspace(client(2));
    await openFixtures();

    expect(screen.getByText("Loading fixture data...")).toBeInTheDocument();
    expect(screen.queryByText(/No fixtures found/)).not.toBeInTheDocument();

    fixtureState.current = {
      data: undefined,
      isLoading: false,
      error: new Error("fixtures down"),
      refetch: fixtureState.refetch,
    };
    rerender(
      <QueryClientProvider
        client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
      >
        <GlobalProvider>
          <AccountDetailWorkspace accountData={client(2)} accountID="42" />
        </GlobalProvider>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Failed to load fixtures")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(fixtureState.refetch).toHaveBeenCalledTimes(1);
  });

  it("says when the association window is empty", async () => {
    fixtureState.current = {
      ...fixtureState.current,
      refetch: fixtureState.refetch,
      data: response([]),
    };
    renderWorkspace(client(2));
    await openFixtures();

    expect(screen.getByText("No fixtures found for this association.")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Search by team name...")).not.toBeInTheDocument();
  });

  it("does not request fixtures when the association id is missing", async () => {
    const account = client(2);
    Reflect.deleteProperty(account.accountOrganisationDetails, "id");
    renderWorkspace(account);
    await openFixtures();

    expect(
      screen.getByText("Account organization details are missing. Cannot load fixtures."),
    ).toBeInTheDocument();
    expect(fixtureCalls.filters).toEqual([]);
  });
});
