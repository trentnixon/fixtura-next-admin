# Folder Overview

This folder contains TypeScript type definitions and interfaces for the Fixtura Admin application. It serves as the central repository for all data models, API response types, and component prop interfaces used throughout the application.

## Files

- `index.ts`: Main export file that re-exports all type definitions for easy importing
- `account.ts`: Account-related types including Account, AccountAttributes, AccountState, and AccountSummary interfaces
- `accountMediaLibrary.ts`: Media library types for account assets and file management
- `aiArticle.ts`: AI-generated article content types and interfaces
- `association.ts`: Sports association entity types and attributes
- `club.ts`: Club entity types and related interfaces
- `clubToCompetition.ts`: Junction table types for club-competition relationships
- `competition.ts`: Competition entity types including CompetitionAttributes and CompetitionState
- `customer.ts`: Customer-related types and interfaces
- `dataCollection.ts`: Data collection and analytics type definitions including UpdateAccountOnlyRequest and UpdateAccountOnlyResponse interfaces
- `download.ts`: Download entity types for file downloads and media assets
- `fixturaContentHubAccountDetails.ts`: Specialized account details for content hub integration
- `gameDataAFL.ts`: Australian Football League specific game data types
- `gameDataBasketball.ts`: Basketball game data types and interfaces
- `gameDataHockey.ts`: Hockey game data types and interfaces
- `gameDataNetball.ts`: Netball game data types and interfaces
- `gameMetaData.ts`: Generic game metadata types used across all sports
- `gamesInRender.ts`: Game data types specific to render operations
- `grade.ts`: Grade/division types for competitions and teams
- `gradesInRender.ts`: Grade types specific to render operations
- `order.ts`: Order and subscription management types
- `render.ts`: Render entity types including RenderAttributes, RenderState, and GetAccountFromRender
- `renderToken.ts`: Render token authentication and authorization types
- `resultCollection.ts`: Game results and statistics collection types
- `scheduler.ts`: Scheduler entity types for automated rendering and processing
- `sponsor.ts`: Sponsor and advertising related types
- `subscriptionTier.ts`: Subscription tier and pricing type definitions
- `team.ts`: Team entity types and related interfaces
- `teamsById.ts`: Team lookup and identification types
- `template.ts`: Template system types for render customization
- `theme.ts`: Theme and styling type definitions
- `trialInstance.ts`: Trial account and instance management types
- `validCompetitions.ts`: Competition validation and filtering types
- `vite-env.d.ts`: Vite environment type declarations

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: All application components, hooks, services, and pages
- Key dependencies: None (pure type definitions)

## Dependencies

- Internal: Types reference each other through imports (e.g., Account imports Order, Association, Club, etc.)
- External: TypeScript compiler, Vite environment types
- Patterns: Follows Strapi CMS data structure patterns with `id` and `attributes` separation
