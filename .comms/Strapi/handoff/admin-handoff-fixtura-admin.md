# fixtura-admin handoff — org contact details

**From:** CMS Backend  
**To:** fixtura-admin  
**Scope:** PlayHQ org footer contact scrape — read scraped contacts in Email Listings; trigger scrapes from Data.

Contract reference: [cms-response-org-contact-details-endpoints.md](./cms-response-org-contact-details-endpoints.md).

---

## 1. Email Listings — contact APIs

### Endpoints

| Method | Path | Query |
|--------|------|--------|
| GET | `/api/club/getContactDetails` | `filters[sport][$eq]=<slug>` optional |
| GET | `/api/association/getContactDetails` | same |

- If sport is omitted, CMS defaults to **`cricket-australia`** (Strapi `Sport: Cricket`, AU + NZ orgs).
- Always **HTTP 200** with `{ data: [], meta: { total: 0 } }` when there are no rows (never 404 for empty).

### Response row (`OrgContactListingRow`)

```typescript
interface OrgContactPerson {
  name?: string | null;
  role?: string | null;
  email?: string | null;
  phone?: string | null;
}

interface OrgContactListingRow {
  id: number;
  name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null; // from contactDetails.address when scraped
  website: string | null;
  logo: string | null; // Logo.url, else PlayHQLogo.url (Strapi path)
  contacts: OrgContactPerson[]; // contactDetails.contacts
  lastOrgContactScrapeAt: string | null; // ISO from contactDetails
}
```

CMS resolves **`logo`** on each row: primary org **`Logo`**, else **`PlayHQLogo`**. Value is a Strapi media path (or absolute URL); admin resolves with `Domain.strapi` via `resolveStrapiMediaUrl`.

### UI expectations

- **Communications → Email Listings:** sport dropdown using `CLUB_SCRAPE_SPORTS` (default **Cricket** → `cricket-australia`); pass slug to both Club and Association tabs; refetch on change.
- React Query keys must include sport, e.g. `["clubContactInfo", sportSlug]`, `["associationContactInfo", sportSlug]`.
- Fetch: `params: { "filters[sport][$eq]": sportSlug }` when a sport is selected.
- **Unchanged:** `/account/admin/lookup` for Active/Inactive, user/delivery email.
- **Logos:** prefer row **`logo`** from this API (`resolveStrapiMediaUrl(row.logo, Domain.strapi)`); fall back to account logo from lookup when the org is linked and row logo is missing.
- **Optional follow-up:** table columns for `contacts[]` summary and `lastOrgContactScrapeAt`; CSV export if useful.

---

## 2. Data dashboard — scrape trigger

### Endpoint

**POST** `/api/organisation/trigger-org-contact-details-scrape`

```json
{
  "options": {
    "sport": "cricket-australia",
    "maxTargets": 25
  }
}
```

| Field | Required | Notes |
|-------|----------|--------|
| `options.sport` | yes | Same slugs as `CLUB_SCRAPE_SPORTS` |
| `options.maxTargets` | no | Omit for full walk (respecting stale filter) |

CMS always enqueues with **`contactStaleDays: 30`** (skip orgs scraped in the last 30 days). Admin UI does not expose this knob.

### UI expectations

- **Data → Org contact details** tab: sport select, optional max targets, confirm before POST.
- Local/dev only until deploy smoke is agreed; do not assume prod queue without env check.

---

## 3. Out of scope for admin

- Worker recon/data filters (`orgContactStaleDays`) — Python scraper repo; see [worker-handoff-org-contact-stale-and-recon.md](./worker-handoff-org-contact-stale-and-recon.md).
- CMS ingest/recon routes used by worker, not by admin UI directly.

---

## 4. Implementation checklist

| Item | Status |
|------|--------|
| Types + fetch + hooks with sport param | Done |
| Email Listings sport selector + both tabs | Done |
| Data tab org contact trigger | Done |
| Row `logo` + account fallback in listings UI | Done |
| Optional contacts / last-scraped columns | Done |
