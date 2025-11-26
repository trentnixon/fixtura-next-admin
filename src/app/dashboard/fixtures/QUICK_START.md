# Fixture Insights Integration - Quick Start Guide

## 🎯 Goal

Replace dummy fixture data with real API data from the CMS, enabling association-based fixture browsing with a table-driven interface.

## 📋 Implementation Order

### 1️⃣ Foundation (Do First)
```bash
# Create type definitions
src/types/fixtureInsights.ts

# Create services
src/lib/services/fixtures/fetchFixtureInsights.ts
src/lib/services/fixtures/fetchFixtureDetails.ts

# Create hooks
src/hooks/fixtures/useFixtureInsights.ts
src/hooks/fixtures/useFixtureDetails.ts
```

### 2️⃣ UI Components (Do Second)
```bash
# New components for association selection
src/app/dashboard/fixtures/_components/AssociationSelector.tsx
src/app/dashboard/fixtures/_components/AssociationFixturesTable.tsx

# Update existing components
src/app/dashboard/fixtures/_components/FixturesStats.tsx
src/app/dashboard/fixtures/_components/FixturesOverview.tsx
```

### 3️⃣ Detail Page (Do Last)
```bash
# Update fixture detail page
src/app/dashboard/fixtures/_components/FixtureDetail.tsx
```

## 🔗 API Endpoints

| Endpoint | Purpose | Cache Time |
|----------|---------|------------|
| `/api/game-meta-data/admin/insights` | Overview + summaries | 5 min |
| `/api/game-meta-data/admin/fixtures?association=X` | Filtered fixtures | 2 min |

## 🎨 User Flow

```
1. User lands on /dashboard/fixtures
   ↓
2. See statistics overview (from insights endpoint)
   ↓
3. See table of associations with fixture counts
   ↓
4. Click "Select" on an association
   ↓
5. See table of fixtures for that association
   ↓
6. Click "View Details" on a fixture
   ↓
7. See fixture detail page with games
```

## 📦 Key Files to Reference

**Pattern Examples:**
- Service: `src/lib/services/association/fetchAssociationInsights.ts`
- Hook: `src/hooks/association/useAssociationInsights.ts`
- Types: `src/types/associationInsights.ts`

**API Documentation:**
- Handover: `./handOverNotes.md`
- Full Ticket: `./IMPLEMENTATION_TICKET.md`

## ⚡ Quick Commands

```bash
# Start dev server
npm run dev

# Type check
npm run type-check

# Build
npm run build
```

## 🚀 Start Here

1. Read `IMPLEMENTATION_TICKET.md` for full details
2. Start with Phase 1 (Types)
3. Move to Phase 2 (Services)
4. Then Phase 3 (Hooks)
5. Finally Phase 4 (UI Integration)

## 📊 Component Architecture

```
FixturesOverview (Main Container)
├── FixturesStats (Overview metrics)
├── AssociationSelector (Table of associations)
│   └── On select → setSelectedAssociation(id)
└── AssociationFixturesTable (Fixtures for selected association)
    └── useFixtureDetails({ association: id })
```

## ✅ Success Metrics

- [ ] No more dummy data
- [ ] Association selection works
- [ ] Fixtures table loads real data
- [ ] Statistics show real numbers
- [ ] Detail page shows real fixture info
- [ ] Loading states work
- [ ] Error states work
- [ ] Caching works (no unnecessary API calls)

---

**Next Step**: Open `IMPLEMENTATION_TICKET.md` and start with Phase 1! 🎉
