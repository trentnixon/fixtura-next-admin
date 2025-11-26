### Overview

This is an **admin-only, read-only, single-club detail endpoint** designed for the admin UI to deeply inspect one club, its associations, teams, competitions, accounts, and timelines.

- **Stack**: Next.js + TanStack Query (React Query)
- **HTTP Method**: `GET`
- **Route**: `GET /api/club/admin/:id`
- **Resource**: **single club**, identified by numeric `id`
- **Auth**: Currently `auth: false` at Strapi level; intended to be admin-only behind your own admin frontend auth.

---

### 1. Endpoint Details

- **URL (local)**: `http://localhost:1337/api/club/admin/:id`
- **Method**: `GET`
- **Path Param**:
  - `:id` – required, **numeric** club ID
    - 400 if non-numeric
    - 404 if not found

**Examples:**

- Valid club:
  `GET http://localhost:1337/api/club/admin/28444`
- Invalid ID (400):
  `GET http://localhost:1337/api/club/admin/abc`
- Non-existent club (404):
  `GET http://localhost:1337/api/club/admin/9999999`

No query params or request body are expected for this route.

---

### 2. Response Envelope

The endpoint follows Strapi’s standard envelope:

```ts
interface ClubAdminDetailResponse {
  data: ClubAdminDetailPayload | null;
  meta?: unknown; // currently unused by this route, core data is under data
}
```

If the club is not found:

```ts
interface ErrorResponse {
  data: null;
  error: {
    status: number;      // e.g. 404, 400, 500
    name: string;        // e.g. "NotFoundError", "BadRequestError", "InternalServerError"
    message: string;     // human-readable message
    details?: unknown;   // optional
  };
}
```

---

### 3. Data Shape (Core Types)

#### 3.1 Root Payload

```ts
interface ClubAdminDetailPayload {
  club: ClubCore;
  statistics: ClubStatistics;
  associations: ClubAssociationDetail[];
  teams: ClubTeamDetail[];
  competitions: ClubCompetitionDetail[];
  accounts: ClubAccountSummary[];
  insights: ClubInsights;
  meta: ClubDetailMeta;
}
```

---

#### 3.2 Core Club Data

```ts
interface ClubCore {
  id: number;
  name: string;
  sport: "Cricket" | "AFL" | "Hockey" | "Netball" | "Basketball" | "Unknown";
  href: string | null;
  logoUrl: string; // Logo.url || PlayHQLogo.url || default Fixtura logo
  playHqId: string | null;
  parentLogo: string | null;
  contactDetails: {
    phone: string | null;
    email: string | null;
    address: string | null;
  } | null;
  location: {
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    coordinates: { lat: number; lng: number } | null;
  } | null;
  website: {
    website: string | null;
    domain: string | null;
  } | null;
  isActive: boolean;              // based on publishedAt
  hasPlayhqLogoStored: boolean;
  createdAt: string;              // ISO
  updatedAt: string;              // ISO
  updateRelationalLookup: string | null; // ISO
  updateLogo: string | null;            // ISO
}
```

---

#### 3.3 Statistics

```ts
interface ClubStatistics {
  associations: {
    total: number;
    active: number;
    bySport: Record<string, number>;
  };
  teams: {
    total: number;
    acrossCompetitions: number;
    acrossGrades: number;
    bySport: Record<string, number>;
  };
  competitions: {
    total: number;
    active: number;
    upcoming: number;
    completed: number;
    byStatus: Record<string, number>;
    byAssociation: Record<number, number>; // associationId -> competitionCount
  };
  grades: {
    total: number;       // unique grades across competitions
    withTeams: number;
    withoutTeams: number;
  };
  accounts: {
    total: number;
    active: number;
    withOrders: number;
  };
  trial: {
    hasTrial: boolean;
    isActive: boolean | null;
  } | null;
}
```

---

#### 3.4 Associations (for this club)

```ts
interface ClubAssociationDetail {
  id: number;
  name: string;
  sport: string;
  href: string | null;
  logoUrl: string | null;
  playHqId: string | null;
  competitionCount: number; // competitions this club plays in under this association
  teamCount: number;        // teams for this club under this association
  isActive: boolean;
}
```

---

#### 3.5 Teams

```ts
interface ClubTeamDetail {
  id: number;
  name: string;
  competition: {
    id: number;
    name: string;
    association: {
      id: number;
      name: string;
    } | null;
    startDate: string | null; // ISO
    endDate: string | null;   // ISO
    status: string | null;
  } | null;
  grade: {
    id: number;
    name: string;
    gender: string | null;
    ageGroup: string | null;
  } | null;
  // optional: all grades if the team is in multiple
  grades: {
    id: number;
    name: string;
    gender: string | null;
    ageGroup: string | null;
  }[] | null;
  isActive: boolean;
}
```

---

#### 3.6 Competitions

```ts
type ParticipationMethod = "club_to_competition" | "team" | "both" | "unknown";

interface ClubCompetitionDetail {
  id: number;
  name: string;
  season: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string | null;
  isActive: boolean;
  url: string | null;
  association: {
    id: number;
    name: string;
    sport: string;
  } | null;
  gradeCount: number;             // grades in this competition
  teamCount: number;              // teams from this club in this competition
  timeline: {
    status: "upcoming" | "in_progress" | "completed" | "unknown";
    daysTotal: number | null;
    daysElapsed: number | null;
    daysRemaining: number | null;
    progressPercent: number | null;
  };
  participationMethod: ParticipationMethod;
  competitionUrl: string | null;  // from club_to_competitions.competitionUrl if present
}
```

---

#### 3.7 Accounts

```ts
interface ClubAccountSummary {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  accountType: {
    id: number;
    name: string;
  } | null;
  subscriptionTier: {
    id: number;
    name: string;
  } | null;
  isActive: boolean;
  isSetup: boolean;
  hasActiveOrder: boolean;
}
```

---

#### 3.8 Insights (Charts / Timelines)

```ts
interface ClubInsights {
  competitionTimeline: {
    date: string;       // YYYY-MM-DD
    competitions: number; // active competitions on this date
    starting: number;     // starting that date
    ending: number;       // ending that date
  }[];

  activityPatterns: {
    byMonth: {
      month: string;         // YYYY-MM
      competitionsStarted: number;
      competitionsEnded: number;
      competitionsActive: number;
    }[];
    bySeason: {
      season: string;
      competitionCount: number;
      averageDuration: number; // days
    }[];
    byAssociation: {
      associationId: number;
      associationName: string;
      competitionCount: number;
      averageDuration: number; // days
    }[];
  };

  growthTrends: {
    competitionsOverTime: {
      year: number;
      count: number;
    }[];
    teamsOverTime: {
      year: number;
      count: number;
    }[];
  };

  competitionStartDates: {
    upcoming: {
      competitionId: number;
      competitionName: string;
      startDate: string;
      daysUntilStart: number;
      association: {
        id: number;
        name: string;
      } | null;
    }[];
    recent: {
      competitionId: number;
      competitionName: string;
      startDate: string;
      daysSinceStart: number;
      association: {
        id: number;
        name: string;
      } | null;
    }[];
    byMonth: Record<string, number>; // "YYYY-MM" -> count
  };
}
```

---

#### 3.9 Meta

```ts
interface ClubDetailMeta {
  generatedAt: string; // ISO
  dataPoints: {
    associations: number;
    competitions: number;
    grades: number;
    teams: number;
    accounts: number;
  };
  performance: {
    fetchTimeMs: number;
    calculationTimeMs: number;
    totalTimeMs: number;
  };
}
```

---

### 4. TanStack Query Usage (Frontend)

**Base URL** (local dev):

```ts
const STRAPI_BASE_URL = "http://localhost:1337";
```

**Fetcher:**

```ts
async function fetchClubAdminDetail(clubId: number): Promise<ClubAdminDetailResponse> {
  const res = await fetch(`${STRAPI_BASE_URL}/api/club/admin/${clubId}`);

  const json = await res.json();

  if (!res.ok) {
    // standardize error surface for React Query
    throw {
      status: json?.error?.status ?? res.status,
      message: json?.error?.message ?? "Failed to fetch club admin detail",
      raw: json,
    };
  }

  return json;
}
```

**Hook (TanStack Query):**

```ts
import { useQuery } from "@tanstack/react-query";

export function useAdminClubDetail(clubId: number | null) {
  return useQuery({
    queryKey: ["adminClubDetail", clubId],
    queryFn: () => {
      if (!clubId) throw new Error("clubId is required");
      return fetchClubAdminDetail(clubId);
    },
    enabled: clubId != null,
  });
}
```

**UI usage:**

- `data?.data.club` → core club header card (name, logo, sport, website)
- `data?.data.statistics` → summary stats cards
- `data?.data.associations` → side panel / table of associations
- `data?.data.teams` → teams table
- `data?.data.competitions` → competitions table + timeline charts
- `data?.data.accounts` → linked accounts table
- `data?.data.insights` → chart components (timeline, growth trends, activity patterns)

---

### 5. Error Handling Expectations (FE)

- **400** – invalid ID (non-numeric): show validation error in UI.
- **404** – club not found: show “Club not found” state.
- **500** – internal error: show generic error and prompt to retry; logs will be available from Strapi.

The endpoint is deliberately **read-only** and **bundled**: FE should treat it as **“load everything for this club’s admin detail page in one request”**, and then fan that data out into sections/tabs (overview, associations, teams, competitions, accounts, insights).