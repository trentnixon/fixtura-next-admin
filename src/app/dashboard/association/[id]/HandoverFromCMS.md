# Association Admin Detail API - Frontend Handover

## Overview

This document outlines the new Association Admin Detail endpoint for the frontend team. This endpoint provides comprehensive detailed information about a single association by ID, including all core association data, relational data (competitions, clubs, grades, accounts), detailed statistics, and formatted responses for all related entities.

---

## Endpoint Details

### Route

```
GET /api/association/admin/:id
```

### Base URL

- **Development**: `http://localhost:1337/api/association/admin/:id`
- **Production**: `{API_BASE_URL}/api/association/admin/:id`

### Path Parameters

- **`id`** (required): Numeric association identifier

**Example**:

```
GET /api/association/admin/2935
```

**Validation**: Returns `400 Bad Request` if ID is not numeric. Returns `404 Not Found` if association does not exist.

### Authentication

Currently: `auth: false` (TODO: Add proper admin authentication)

---

## Response Structure

### Success Response (200 OK)

```typescript
{
  data: {
    association: AssociationDetail;
    statistics: AssociationStatistics;
    competitions: CompetitionDetail[];
    clubs: ClubDetail[];
    accounts: AccountDetail[];
    insights: InsightsData; // Currently empty object - Phase 8 deferred
    meta: Metadata;
  }
}
```

### Error Responses

- **400 Bad Request**: Invalid association ID (non-numeric)

  ```json
  {
    "error": {
      "status": 400,
      "message": "Invalid association ID. Must be a number"
    }
  }
  ```

- **404 Not Found**: Association not found

  ```json
  {
    "error": {
      "status": 404,
      "message": "Association with ID 2935 not found"
    }
  }
  ```

- **500 Internal Server Error**: Server error during processing

  ```json
  {
    "error": {
      "status": 500,
      "message": "Failed to fetch association detail"
    }
  }
  ```

---

## TypeScript Type Definitions

```typescript
// Main Response Type
export interface AssociationDetailResponse {
  data: {
    association: AssociationDetail;
    statistics: AssociationStatistics;
    competitions: CompetitionDetail[];
    clubs: ClubDetail[];
    accounts: AccountDetail[];
    insights: InsightsData;
    meta: Metadata;
  };
}

// Core Association Data
export interface AssociationDetail {
  id: number;
  name: string;
  sport: string;
  href: string | null;
  logoUrl: string; // Logo.url || PlayHQLogo.url || default logo
  playHqId: string | null;
  contactDetails: ContactDetails | null;
  location: Location | null;
  website: Website | null;
  isActive: boolean; // based on publishedAt
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface ContactDetails {
  phone: string | null;
  email: string | null;
  address: string | null;
}

export interface Location {
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  coordinates: Coordinates | null;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Website {
  website: string | null;
  domain: string | null;
}

// Statistics
export interface AssociationStatistics {
  competitions: CompetitionStatistics;
  grades: GradeStatistics;
  clubs: ClubStatistics;
  teams: TeamStatistics;
  accounts: AccountStatistics;
  trial: TrialStatus | null;
}

export interface CompetitionStatistics {
  total: number;
  active: number;
  upcoming: number;
  completed: number;
  byStatus: Record<string, number>; // Dynamic status keys
}

export interface GradeStatistics {
  total: number;
  withTeams: number;
  withoutTeams: number;
}

export interface ClubStatistics {
  total: number;
  active: number; // based on publishedAt
  withCompetitions: number;
}

export interface TeamStatistics {
  total: number;
  acrossCompetitions: number;
  acrossGrades: number;
}

export interface AccountStatistics {
  total: number;
  active: number;
  withOrders: number;
}

export interface TrialStatus {
  hasTrial: boolean;
  isActive: boolean | null;
}

// Competition Detail
export interface CompetitionDetail {
  id: number;
  name: string;
  season: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string | null;
  isActive: boolean;
  url: string | null;
  gradeCount: number;
  teamCount: number;
  clubCount: number; // unique clubs across grades/teams
  timeline: CompetitionTimeline;
  grades: GradeDetail[];
  clubs: CompetitionClubDetail[];
}

export interface CompetitionTimeline {
  status: "upcoming" | "in_progress" | "completed" | "unknown";
  daysTotal: number | null;
  daysElapsed: number | null;
  daysRemaining: number | null;
  progressPercent: number | null; // 0-100
}

export interface GradeDetail {
  id: number;
  name: string;
  gender: string | null;
  ageGroup: string | null;
  teamCount: number;
}

export interface CompetitionClubDetail {
  id: number;
  name: string;
  logoUrl: string | null; // Logo.url || PlayHQLogo.url || default logo
  teamCount: number; // teams in this competition
}

// Club Detail
export interface ClubDetail {
  id: number;
  name: string;
  sport: string;
  href: string | null;
  logoUrl: string | null; // Logo.url || PlayHQLogo.url || default logo
  playHqId: string | null;
  competitionCount: number; // competitions this club participates in (for this association)
  teamCount: number; // total teams across all competitions (for this association)
  isActive: boolean;
}

// Account Detail
export interface AccountDetail {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  accountType: AccountType | null;
  subscriptionTier: SubscriptionTier | null;
  isActive: boolean;
  isSetup: boolean;
  hasActiveOrder: boolean;
}

export interface AccountType {
  id: number;
  name: string;
}

export interface SubscriptionTier {
  id: number;
  name: string;
}

// Insights (Phase 8 - Currently empty, can be added as enhancement)
export interface InsightsData {
  competitionTimeline?: CompetitionTimelineEntry[];
  activityPatterns?: {
    byMonth?: MonthActivity[];
    bySeason?: SeasonActivity[];
  };
  growthTrends?: {
    competitionsOverTime?: YearCount[];
    clubsOverTime?: YearCount[];
  };
}

export interface CompetitionTimelineEntry {
  date: string; // ISO date
  competitions: number; // active competitions on this date
  starting: number; // competitions starting on this date
  ending: number; // competitions ending on this date
}

export interface MonthActivity {
  month: string; // YYYY-MM
  competitionsStarted: number;
  competitionsEnded: number;
  competitionsActive: number;
}

export interface SeasonActivity {
  season: string;
  competitionCount: number;
  averageDuration: number;
}

export interface YearCount {
  year: number;
  count: number;
}

// Metadata
export interface Metadata {
  generatedAt: string; // ISO timestamp
  dataPoints: {
    competitions: number;
    grades: number;
    clubs: number;
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

## Implementation Guide

### Service Layer Pattern

Following the service-based pattern with TanStack Query, create:

1. **Service Function** (`services/association/detail.ts` or similar):

   ```typescript
   import { AssociationDetailResponse } from "@/types/association";

   export async function getAssociationDetail(
     id: number
   ): Promise<AssociationDetailResponse> {
     const response = await fetch(`/api/association/admin/${id}`);

     if (!response.ok) {
       if (response.status === 404) {
         throw new Error(`Association with ID ${id} not found`);
       }
       throw new Error(
         `Failed to fetch association detail: ${response.statusText}`
       );
     }

     return response.json();
   }
   ```

2. **TanStack Query Hook** (`hooks/association/useAssociationDetail.ts` or similar):

   ```typescript
   import { useQuery } from "@tanstack/react-query";
   import { getAssociationDetail } from "@/services/association/detail";
   import { AssociationDetailResponse } from "@/types/association";

   export function useAssociationDetail(id: number | null) {
     return useQuery<AssociationDetailResponse>({
       queryKey: ["association-detail", id],
       queryFn: () => getAssociationDetail(id!),
       enabled: id !== null && id > 0,
       staleTime: 5 * 60 * 1000, // 5 minutes
       gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
     });
   }
   ```

3. **Component Usage**:

   ```typescript
   import { useAssociationDetail } from "@/hooks/association/useAssociationDetail";

   export function AssociationDetailPage({ associationId }: { associationId: number }) {
     const { data, isLoading, error } = useAssociationDetail(associationId);

     if (isLoading) return <LoadingSpinner />;
     if (error) return <ErrorMessage error={error} />;
     if (!data) return null;

     const { association, statistics, competitions, clubs, accounts } = data.data;

     return (
       <div>
         <AssociationHeader association={association} />
         <StatisticsOverview statistics={statistics} />
         <CompetitionsList competitions={competitions} />
         <ClubsList clubs={clubs} />
         <AccountsList accounts={accounts} />
       </div>
     );
   }
   ```

---

## Response Examples

### Example 1: Full Response

```json
{
  "data": {
    "association": {
      "id": 2935,
      "name": "Cricket Gold Coast Ltd",
      "sport": "Cricket",
      "href": "https://www.playhq.com/cricket-australia/org/cricket-gold-coast-ltd/fc8990ea",
      "logoUrl": "https://fixtura.s3.ap-southeast-2.amazonaws.com/Default_ICON_171b58a21b.png",
      "playHqId": "fc8990ea",
      "contactDetails": {
        "phone": "0415 084 077",
        "email": "seniorcoordinator@cricketgoldcoast.com.au",
        "address": null
      },
      "location": {
        "address": "Cheltenham Oval, Gold Coast, QLD 4226, Australia",
        "city": null,
        "state": null,
        "country": null,
        "coordinates": null
      },
      "website": {
        "website": "https://cricketgoldcoast.com.au/",
        "domain": "cricketgoldcoast.com.au"
      },
      "isActive": true,
      "createdAt": "2025-04-07T09:55:46.544Z",
      "updatedAt": "2025-10-20T05:10:02.648Z"
    },
    "statistics": {
      "competitions": {
        "total": 3,
        "active": 3,
        "upcoming": 0,
        "completed": 0,
        "byStatus": {
          "Active": 3
        }
      },
      "grades": {
        "total": 28,
        "withTeams": 28,
        "withoutTeams": 0
      },
      "clubs": {
        "total": 8,
        "active": 8,
        "withCompetitions": 8
      },
      "teams": {
        "total": 308,
        "acrossCompetitions": 308,
        "acrossGrades": 308
      },
      "accounts": {
        "total": 1,
        "active": 1,
        "withOrders": 0
      },
      "trial": null
    },
    "competitions": [
      {
        "id": 13440,
        "name": "Cricket Gold Coast Senior Competition",
        "season": "Summer 2025/26",
        "startDate": "01 Sep 2025",
        "endDate": "05 Apr 2026",
        "status": "Active",
        "isActive": true,
        "url": "https://www.playhq.com/cricket-australia/org/cricket-gold-coast-ltd/cricket-gold-coast-senior-competition-summer-202526/37a5923e",
        "gradeCount": 11,
        "teamCount": 128,
        "clubCount": 20,
        "timeline": {
          "status": "in_progress",
          "daysTotal": 216,
          "daysElapsed": 79,
          "daysRemaining": 137,
          "progressPercent": 37
        },
        "grades": [
          {
            "id": 53102,
            "name": "All Ballsports T20 2025",
            "gender": "Mixed",
            "ageGroup": "Senior",
            "teamCount": 12
          }
        ],
        "clubs": [
          {
            "id": 29060,
            "name": "Alberton Ormeau Cricket Club",
            "logoUrl": "https://fixtura.s3.ap-southeast-2.amazonaws.com/logo_c89e75b12f.jpg",
            "teamCount": 8
          }
        ]
      }
    ],
    "clubs": [
      {
        "id": 30477,
        "name": "Coomera Hope Island Cricket Club",
        "sport": "Cricket",
        "href": "https://www.playhq.com/cricket-australia/org/coomera-hope-island-cricket-club/e4b49fbd",
        "logoUrl": "https://fixtura.s3.ap-southeast-2.amazonaws.com/logo_a29fb5d6e1.jpg",
        "playHqId": "e4b49fbd",
        "competitionCount": 3,
        "teamCount": 35,
        "isActive": true
      }
    ],
    "accounts": [
      {
        "id": 430,
        "firstName": "RBCC",
        "lastName": null,
        "email": "rbcc@fixtura.com.au",
        "accountType": {
          "id": 1,
          "name": "Unknown"
        },
        "subscriptionTier": null,
        "isActive": true,
        "isSetup": true,
        "hasActiveOrder": false
      }
    ],
    "insights": {},
    "meta": {
      "generatedAt": "2025-11-19T01:00:55.443Z",
      "dataPoints": {
        "competitions": 3,
        "grades": 28,
        "clubs": 8,
        "teams": 308,
        "accounts": 1
      },
      "performance": {
        "fetchTimeMs": 173,
        "calculationTimeMs": 0,
        "totalTimeMs": 174
      }
    }
  }
}
```

---

## Key Points for Frontend Implementation

### 1. Response Size

- The response can be large (100-500KB) depending on the number of competitions, clubs, and grades
- Consider lazy loading or virtualization for long lists (competitions, clubs arrays)
- Competitions are sorted by timeline status (upcoming → in_progress → completed → unknown), then by start date
- Clubs are sorted by team count (descending), then alphabetically by name
- Accounts are sorted by lastName, firstName, then creation date

### 2. Timeline Data

- Competition `timeline.status` values: `"upcoming"`, `"in_progress"`, `"completed"`, `"unknown"`
- `progressPercent` is a value from 0-100 (can be null)
- `daysElapsed` and `daysRemaining` can be null if dates are invalid
- Use timeline data to display progress bars, status badges, and countdown timers

### 3. Null Handling

- `contactDetails`, `location`, `website` can be `null` if not available
- `coordinates` within `location` can be `null` if not available
- `trial` can be `null` if no trial instance exists
- Date fields (`startDate`, `endDate`) can be `null` if not set
- All string fields in nested objects can be `null`

### 4. Logo URLs

- `logoUrl` fields always return a string (never null)
- Fallback logic: `Logo.url` → `PlayHQLogo.url` → default logo
- Default logo: `https://fixtura.s3.ap-southeast-2.amazonaws.com/Default_ICON_171b58a21b.png`
- Use for displaying association, club, and competition club logos

### 5. Performance

- Response includes performance metrics in `meta.performance`
- Typical response time: 150-300ms depending on data size
- Consider caching with TanStack Query (suggested `staleTime: 5 minutes`)
- Fetch time vs calculation time breakdown available in metadata

### 6. Data Relationships

- `competitions` array contains full competition details with nested `grades` and `clubs`
- `clubs` array contains consolidated club data across all competitions
- `accounts` array contains accounts associated with this association
- Statistics provide aggregated counts and distributions

### 7. Sorting

- **Competitions**: Sorted by timeline status (upcoming → in_progress → completed → unknown), then by start date (earliest first)
- **Clubs**: Sorted by team count (descending), then alphabetically by name
- **Accounts**: Sorted by lastName (ascending), then firstName (ascending), then creation date (newest first)
- **Grades** (within competitions): In original order from database
- **Clubs** (within competitions): In order collected (may contain duplicates if club appears in multiple sources)

### 8. Insights Field

- `insights` object is currently empty (`{}`)
- Phase 8 (Chart/Timeline Insights) was deferred as optional enhancement
- Structure is defined in types for future implementation
- Can be safely ignored for now

---

## Testing Recommendations

1. **Test with valid association ID**: Verify all data sections are populated
2. **Test with invalid ID**: Verify 400 error for non-numeric, 404 for non-existent
3. **Test with minimal data**: Test association with no competitions/clubs/accounts
4. **Test logo fallbacks**: Verify default logo appears when no Logo/PlayHQLogo exists
5. **Test timeline calculations**: Verify progress percentages and status values
6. **Test null handling**: Verify UI handles null values gracefully (contactDetails, location, etc.)
7. **Test performance**: Monitor response times with associations that have many relations

---

## Notes

- The endpoint is currently read-only (no mutations)
- Authentication will be added in the future (currently `auth: false`)
- All numeric values are properly typed (numbers, not strings)
- Duration values are in days (for `daysTotal`, `daysElapsed`, `daysRemaining`)
- Date strings are in ISO format or original format from database
- The `insights` field is reserved for future Phase 8 implementation

---

## Questions or Issues?

If you encounter any issues or need clarification, please refer to:

- Backend implementation: `src/api/association/controllers/handlers/admin/AssociationDetailHandler.js`
- Route definition: `src/api/association/routes/custom-association.js`
- Controller: `src/api/association/controllers/association.js`
- Ticket: `src/api/association/Tickets.md` (TKT-2025-002)

