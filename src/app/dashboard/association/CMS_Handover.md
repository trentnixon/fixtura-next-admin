# Association Admin Insights API - Frontend Handover

## Overview

This document outlines the new Association Admin Insights endpoint for the frontend team. This endpoint provides comprehensive analytics about associations, including overview statistics, grade/club distributions, competition insights, and detailed per-association metrics.

---

## Endpoint Details

### Route

```
GET /api/association/admin/insights
```

### Base URL

- **Development**: `http://localhost:1337/api/association/admin/insights`
- **Production**: `{API_BASE_URL}/api/association/admin/insights`

### Authentication

Currently: `auth: false` (TODO: Add proper admin authentication)

---

## Query Parameters

### Sport Filter (Optional)

Filter results by sport type.

**Parameter**: `sport`

**Valid Values**:

- `Cricket`
- `AFL`
- `Hockey`
- `Netball`
- `Basketball`

**Example**:

```
GET /api/association/admin/insights?sport=Cricket
```

**Validation**: Returns `400 Bad Request` if an invalid sport value is provided.

---

## Response Structure

### Success Response (200 OK)

```typescript
{
  data: {
    overview: OverviewAnalytics;
    gradesAndClubs: GradesAndClubsAnalytics;
    competitions: CompetitionAnalytics;
    associations: AssociationDetail[];
    meta: Metadata;
  }
}
```

### Error Responses

- **400 Bad Request**: Invalid sport filter value

  ```json
  {
    "error": {
      "status": 400,
      "message": "Invalid sport filter. Valid values are: Cricket, AFL, Hockey, Netball, Basketball"
    }
  }
  ```

- **500 Internal Server Error**: Server error during processing
  ```json
  {
    "error": {
      "status": 500,
      "message": "Failed to fetch association insights"
    }
  }
  ```

---

## TypeScript Type Definitions

```typescript
// Main Response Type
export interface AssociationInsightsResponse {
  data: {
    overview: OverviewAnalytics;
    gradesAndClubs: GradesAndClubsAnalytics;
    competitions: CompetitionAnalytics;
    associations: AssociationDetail[];
    meta: Metadata;
  };
}

// Overview Analytics
export interface OverviewAnalytics {
  totalAssociations: number;
  activeAssociations: number;
  inactiveAssociations: number;
  associationsWithAccounts: number;
  associationsWithoutAccounts: number;
  sportDistribution: SportDistribution | null; // null when filtering by sport
  associationsByAccountCount: AccountCountDistribution;
}

export interface SportDistribution {
  Cricket: number;
  AFL: number;
  Hockey: number;
  Netball: number;
  Basketball: number;
}

export interface AccountCountDistribution {
  zero: number;
  one: number;
  twoToFive: number;
  sixPlus: number;
}

// Grades & Clubs Analytics
export interface GradesAndClubsAnalytics {
  totalGrades: number;
  totalClubs: number;
  averageGradesPerAssociation: number;
  averageClubsPerAssociation: number;
  gradeDistribution: GradeDistribution;
  clubDistribution: ClubDistribution;
}

export interface GradeDistribution {
  zero: number;
  oneToFive: number;
  sixToTen: number;
  elevenPlus: number;
}

export interface ClubDistribution {
  zero: number;
  oneToFive: number;
  sixToTen: number;
  elevenToTwenty: number;
  twentyOnePlus: number;
}

// Competition Analytics
export interface CompetitionAnalytics {
  totalCompetitions: number;
  activeCompetitions: number;
  inactiveCompetitions: number;
  competitionsByStatus: Record<string, number>; // Dynamic status keys
  competitionSizeDistribution: CompetitionSizeDistribution;
  competitionGradeDistribution: CompetitionGradeDistribution;
  datePatterns: DatePatterns;
}

export interface CompetitionSizeDistribution {
  small: number; // 1-5 teams
  medium: number; // 6-20 teams
  large: number; // 21-50 teams
  xlarge: number; // 51+ teams
}

export interface CompetitionGradeDistribution {
  single: number; // 1 grade
  few: number; // 2-5 grades
  many: number; // 6-10 grades
  extensive: number; // 11+ grades
}

export interface DatePatterns {
  competitionsStartingThisMonth: number;
  competitionsEndingThisMonth: number;
  competitionsStartingNextMonth: number;
  competitionsEndingNextMonth: number;
  averageCompetitionDurationDays: number;
  earliestStartDate: string | null;
  latestEndDate: string | null;
}

// Association Detail (Consolidated per-association metrics)
export interface AssociationDetail {
  id: number;
  name: string;
  gradeCount: number;
  clubCount: number;
  competitionCount: number;
  activeCompetitionCount: number;
  competitionTeams: number;
  competitionGrades: number;
  averageTeamsPerCompetition: number;
  averageGradesPerCompetition: number;
  sport?: string; // Only present when NOT filtering by sport
}

// Metadata
export interface Metadata {
  generatedAt: string; // ISO timestamp
  filters: {
    sport: string | null;
  };
  dataPoints: {
    associations: number;
    competitions: number;
    grades: number;
    clubs: number;
    teams: number;
  };
  performance: {
    fetchTimeMs: number;
    calculationTimeMs: number;
    totalTimeMs: number;
    breakdown: {
      fetchPercentage: number;
      calculationPercentage: number;
    };
  };
}
```

---

## Implementation Guide

### Service Layer Pattern

Following the service-based pattern with TanStack Query, create:

1. **Service Function** (`services/association/insights.ts` or similar):

   ```typescript
   import { AssociationInsightsResponse } from "@/types/association";

   export async function getAssociationInsights(
     sport?: string
   ): Promise<AssociationInsightsResponse> {
     const params = new URLSearchParams();
     if (sport) {
       params.append("sport", sport);
     }

     const url = `/api/association/admin/insights${
       params.toString() ? `?${params.toString()}` : ""
     }`;

     const response = await fetch(url);

     if (!response.ok) {
       throw new Error(
         `Failed to fetch association insights: ${response.statusText}`
       );
     }

     return response.json();
   }
   ```

2. **TanStack Query Hook** (`hooks/association/useAssociationInsights.ts` or similar):

   ```typescript
   import { useQuery } from "@tanstack/react-query";
   import { getAssociationInsights } from "@/services/association/insights";
   import { AssociationInsightsResponse } from "@/types/association";

   export function useAssociationInsights(sport?: string) {
     return useQuery<AssociationInsightsResponse>({
       queryKey: ["association-insights", sport],
       queryFn: () => getAssociationInsights(sport),
       staleTime: 5 * 60 * 1000, // 5 minutes
       gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
     });
   }
   ```

3. **Component Usage**:

   ```typescript
   import { useAssociationInsights } from "@/hooks/association/useAssociationInsights";

   export function AssociationInsightsDashboard() {
     const [selectedSport, setSelectedSport] = useState<string | undefined>();
     const { data, isLoading, error } = useAssociationInsights(selectedSport);

     if (isLoading) return <LoadingSpinner />;
     if (error) return <ErrorMessage error={error} />;
     if (!data) return null;

     return (
       <div>
         <SportFilter value={selectedSport} onChange={setSelectedSport} />
         <OverviewStats data={data.data.overview} />
         <GradesAndClubsStats data={data.data.gradesAndClubs} />
         <CompetitionStats data={data.data.competitions} />
         <AssociationsTable data={data.data.associations} />
       </div>
     );
   }
   ```

---

## Response Examples

### Example 1: All Sports (No Filter)

```json
{
  "data": {
    "overview": {
      "totalAssociations": 2049,
      "activeAssociations": 2049,
      "inactiveAssociations": 0,
      "associationsWithAccounts": 13,
      "associationsWithoutAccounts": 2036,
      "sportDistribution": {
        "Cricket": 658,
        "AFL": 713,
        "Hockey": 32,
        "Netball": 312,
        "Basketball": 334
      },
      "associationsByAccountCount": {
        "zero": 2036,
        "one": 9,
        "twoToFive": 4,
        "sixPlus": 0
      }
    },
    "gradesAndClubs": {
      "totalGrades": 15592,
      "totalClubs": 20689,
      "averageGradesPerAssociation": 7.61,
      "averageClubsPerAssociation": 10.1,
      "gradeDistribution": {
        "zero": 500,
        "oneToFive": 800,
        "sixToTen": 500,
        "elevenPlus": 249
      },
      "clubDistribution": {
        "zero": 300,
        "oneToFive": 1000,
        "sixToTen": 500,
        "elevenToTwenty": 200,
        "twentyOnePlus": 49
      }
    },
    "competitions": {
      "totalCompetitions": 2428,
      "activeCompetitions": 1800,
      "inactiveCompetitions": 628,
      "competitionsByStatus": {
        "Final": 500,
        "IN PROGRESS": 1300,
        "Upcoming": 628
      },
      "competitionSizeDistribution": {
        "small": 800,
        "medium": 1200,
        "large": 400,
        "xlarge": 28
      },
      "competitionGradeDistribution": {
        "single": 500,
        "few": 1200,
        "many": 600,
        "extensive": 128
      },
      "datePatterns": {
        "competitionsStartingThisMonth": 50,
        "competitionsEndingThisMonth": 75,
        "competitionsStartingNextMonth": 100,
        "competitionsEndingNextMonth": 120,
        "averageCompetitionDurationDays": 120.5,
        "earliestStartDate": "2024-01-01",
        "latestEndDate": "2024-12-31"
      }
    },
    "associations": [
      {
        "id": 123,
        "name": "Cricket Victoria",
        "gradeCount": 45,
        "clubCount": 120,
        "competitionCount": 12,
        "activeCompetitionCount": 10,
        "competitionTeams": 180,
        "competitionGrades": 48,
        "averageTeamsPerCompetition": 15,
        "averageGradesPerCompetition": 4,
        "sport": "Cricket"
      }
      // ... more associations
    ],
    "meta": {
      "generatedAt": "2025-01-27T10:00:00.000Z",
      "filters": {
        "sport": null
      },
      "dataPoints": {
        "associations": 2049,
        "competitions": 2428,
        "grades": 15592,
        "clubs": 20689,
        "teams": 2374
      },
      "performance": {
        "fetchTimeMs": 897,
        "calculationTimeMs": 14,
        "totalTimeMs": 912,
        "breakdown": {
          "fetchPercentage": 98,
          "calculationPercentage": 2
        }
      }
    }
  }
}
```

### Example 2: Filtered by Sport

```json
{
  "data": {
    "overview": {
      "totalAssociations": 658,
      "activeAssociations": 658,
      "inactiveAssociations": 0,
      "associationsWithAccounts": 5,
      "associationsWithoutAccounts": 653,
      "sportDistribution": null,
      "associationsByAccountCount": {
        "zero": 653,
        "one": 3,
        "twoToFive": 2,
        "sixPlus": 0
      }
    },
    // ... rest of response (filtered to Cricket only)
    "associations": [
      {
        "id": 123,
        "name": "Cricket Victoria",
        "gradeCount": 45,
        "clubCount": 120,
        "competitionCount": 12,
        "activeCompetitionCount": 10,
        "competitionTeams": 180,
        "competitionGrades": 48,
        "averageTeamsPerCompetition": 15,
        "averageGradesPerCompetition": 4
        // Note: "sport" field is omitted when filtering
      }
    ],
    "meta": {
      "generatedAt": "2025-01-27T10:00:00.000Z",
      "filters": {
        "sport": "Cricket"
      }
      // ... rest of meta
    }
  }
}
```

---

## Key Points for Frontend Implementation

### 1. Response Size

- The response can be large (~600-700KB) when fetching all associations
- Consider implementing pagination or lazy loading for the `associations` array if needed
- The `associations` array is sorted by competition count (descending), then grade count

### 2. Filtering Behavior

- When `sport` filter is applied:
  - `sportDistribution` in overview will be `null`
  - `sport` field is omitted from association objects
  - All data (associations, competitions, grades, clubs) is filtered at the database level

### 3. Performance

- Response includes performance metrics in `meta.performance`
- Typical response time: 500-1500ms depending on data size
- Consider caching with TanStack Query (suggested `staleTime: 5 minutes`)

### 4. Data Relationships

- `associations` array contains consolidated metrics from:
  - Grade/club counts (from `gradesAndClubs` calculations)
  - Competition metrics (from `competitions` calculations)
- All association IDs in the array correspond to associations in the filtered dataset

### 5. Null Handling

- `sportDistribution` can be `null` when filtering
- Date fields in `datePatterns` can be `null` if no valid dates exist
- Always check for null values before rendering

---

## Testing Recommendations

1. **Test without filter**: Verify all sports are included
2. **Test with each sport filter**: Verify filtering works correctly
3. **Test invalid sport**: Verify 400 error is returned
4. **Test empty results**: Handle cases where filtered results are empty
5. **Test loading states**: Handle the ~1 second response time gracefully
6. **Test error states**: Handle network errors and 500 responses

---

## Notes

- The endpoint is currently read-only (no mutations)
- Authentication will be added in the future (currently `auth: false`)
- The response structure is optimized to reduce duplication (single `associations` array instead of multiple per-section arrays)
- All numeric values are properly typed (numbers, not strings)
- Duration values are in days (for `averageCompetitionDurationDays`)
- Date strings are in ISO format or original format from database

---

## Questions or Issues?

If you encounter any issues or need clarification, please refer to:

- Backend implementation: `src/api/association/controllers/handlers/admin/AssociationInsightsHandler.js`
- Route definition: `src/api/association/routes/custom-association.js`
- Controller: `src/api/association/controllers/association.js`
