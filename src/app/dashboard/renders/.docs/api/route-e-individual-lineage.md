# Route E: Individual Lineage (Deep Audit)

## Information
- **Endpoint**: `/api/renders/:id`
- **Purpose**: Full "DNA" audit of a single render.

## Request Configuration
- **Query Strategy**: Complete relational expansion.
- **Population**:
  - `scheduler` -> `account`
  - `downloads` (complete attributes)
  - `ai_articles` (complete attributes)
  - `game_results_in_renders`
  - `upcoming_games_in_renders`
  - `grades_in_renders` (populating `grade` and `team`)

## Custom Logic: Data Integrity Check
- **Parameter**: `?checkIntegrity=true`
- **Function**: Compares the expected fixtures from the scheduler against the actual objects written to the render's relations.

## Technical Rationale
This is a high-cost request reserved for deep technical troubleshooting. It allows an admin to see exactly what went into a render to resolve data disputes (e.g., "Why did my game miss its video?").
