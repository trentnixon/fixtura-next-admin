# CMS handoff: free-trial wipe

**Date:** 2026-10-07
**From:** CMS (Strapi) Backend
**To:** fixtura-admin
**Status:** Route is live. Support View does not get this action.

Restart Strapi after pulling this. No new permission checkbox. The route is open the same way as account lookup (`auth: false`) and the handler requires the admin bearer.

```http
POST /api/account/:accountId/admin/free-trial/wipe
Authorization: Bearer <admin token>
```

No body. No reason is stored.

## Response

```json
{ "data": { "outcome": "wiped" } }
```

| HTTP | `outcome` | Meaning |
| --- | --- | --- |
| 200 | `wiped` | Free-trial records were removed. Start-trial is unchanged and can run again when billing allows it. |
| 200 | `already_clear` | There was nothing to remove. |
| 409 | `organisation_unavailable` | The club or association could not be identified. Nothing was deleted. |

A trial that is still running loses access immediately. The customer is not emailed. Paid orders are not deleted. A currently paid, cancelled, payment-failed, or invoicing account can still be wiped, and start-trial will keep refusing until that other state clears.
