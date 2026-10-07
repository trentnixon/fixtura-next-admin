# Fixtura Admin

Internal admin app for Fixtura: PlayHQ data ingestion, scheduled content renders, billing, and ops monitoring for club and association sports organisations in Australia and New Zealand.

## Language

### Customers and organisations

**Client**:
A paying Fixtura customer, scoped by organisation type — either a club client or an association client. This is the entity behind `/dashboard/accounts/club` and `/dashboard/accounts/association`.
_Avoid_: Account (when speaking about paying customers), customer (when the Stripe billing identity is meant)

**Club client**:
A client whose Fixtura subscription is tied to a club-type organisation.
_Avoid_: Club (when meaning the paying customer rather than the org record)

**Association client**:
A client whose Fixtura subscription is tied to an association-type organisation.
_Avoid_: Association (when meaning the paying customer rather than the org record)

**Club**:
A sports club organisation in the PlayHQ org graph — scraped reference data. The list at `/dashboard/club` includes every club org in the system, whether or not it is a client.
_Avoid_: Club client

**Association**:
A governing-body organisation in the PlayHQ org graph — scraped reference data. The list at `/dashboard/association` includes every association org in the system, whether or not it is a client.
_Avoid_: Association client

### Billing

**Order**:
The active billing and subscription instance for a client — tier, service dates, payment state, and Stripe linkage.
_Avoid_: Subscription (as a separate entity), invoice (when meaning the billing record itself)

**Free trial**:
A no-charge trial attached to the client's club or association: a trial record and a zero-total Order with checkout status trialing. One free trial covers that club or association, even when more than one client is linked to it.
_Avoid_: Wipe, subscription, trial history

**Invoice Request**:
A staff workflow ticket for manual invoicing. It may link to an Order but is not the billing record itself. Managed in `/dashboard/orders/invoices`.
_Avoid_: Invoice, order

**Invoice**:
The payment document Stripe issues. Hosted URL, PDF, and number fields live on the Order entity.
_Avoid_: Bill, payment request, invoice request

### Content production

**Content production**:
The admin category for a client's scheduled renders — Scheduler, Render, and Download attention.
_Avoid_: Asset creation

**Scheduler**:
Recurring render schedule configuration for a client — when renders should run.
_Avoid_: Render

**Render**:
One content-generation execution for a client, producing downloads and AI articles from fixtures and results.
_Avoid_: Asset run, scheduler

**Account Asset Run**:
An on-demand orchestration pipeline: scrape results, validate fixtures, then produce downloads from assets. May precede or sit alongside a scheduled render; not synonymous with Render.
_Avoid_: Render

**Download**:
A render output file — video, image, ladder, scorecard, or other produced content.
_Avoid_: Asset (when meaning render output)

**Download attention**:
Operational triage state for a download output row: failed Creator flags, structured errors, in-progress processing, or ambiguous legacy combinations. Used in the Renders workspace (not member Content Hub).
_Avoid_: Quality control (prefer this term in product copy), failed render

**Download output failure**:
A download row marked failed by Creator (`hasError` true) or carrying non-empty structured `errorHandler` entries.
_Avoid_: Render failure, pipeline failure

**Render output integrity**:
Completeness and fixture-gap findings for a render (for example ghost render, missing expected outputs), from lineage or integrity audit. Orthogonal to per-download Creator flags.
_Avoid_: Download attention, download QC

**Render pipeline failure**:
Failure of an account asset run stage during orchestration; may exist with no download row and without `download.hasError`.
_Avoid_: Download output failure, download error

**Asset**:
A composition in `assets`: one sport, a name, and a CompositionID, plus free Metadata JSON. The rows managed at `/dashboard/assets`.
_Avoid_: Download, output, output asset, template, template style

**Template style**:
How a render looks. One template option per account, pointing at shared catalogue rows. Not managed on the current asset screens.
_Avoid_: Asset, template

**Template style preview**:
Template style applied to a cricket sample fixture so staff can see the look. It can show a draft or private catalogue row. It changes nothing on a template option or a catalogue row. Not a Download and not a Render.
_Avoid_: Design, template preview

**Theme**:
The four brand colours on an account: primary, secondary, dark, and white.
_Avoid_: Palette, template palette

**Palette**:
A token for how the theme colours are placed. Not the hex colours.
_Avoid_: Theme, brand colours

**Cricket sample fixture**:
A public cricket fixture file the preview can play, chosen by CompositionID. Not an Asset and not an Asset type.
_Avoid_: Asset type, asset

### Sports data

**Fixture**:
A scheduled or played match — scores, venue, round, status.
_Avoid_: Game, game metadata

**GameMetaData**:
Legacy CMS/API identifier for a fixture when talking to Strapi. Not product language.
_Avoid_: Fixture (in API/code comments aimed at humans)

### Season data refresh (account health)

**Season data refresh**:
Product label for the account health workflow in admin UI (Data refresh tab, run detail). Refers to the multi-step scrape/sync pipeline for a client's org data.
_Avoid_: Health job, health refresh (prefer account health run in ops docs)

**Account health run**:
A scheduled or on-demand multi-step refresh of a client's scraped org/competition data, tracked as a run row with linked step items.
_Avoid_: Health job, health refresh

**Account health item**:
One step within an account health run (e.g. association overview scrape, fixture discovery batch), with its own status and optional Bull job reference.
_Avoid_: Health task, health step

**Active account health run**:
A run whose status is pending, queued, or running — the lock that blocks a new on-demand run for the same account.
_Avoid_: Live run (acceptable in UI copy; prefer active account health run in domain docs)

**Completed limbo**:
Run status is `completed` but `finalizedAt` is null — all workflow steps finished but promotion/finalization did not complete. First recovery action: reconcile.
_Avoid_: Stuck run (too vague)

**Finalize (account health)**:
Promotion of a completed run's data into account last-known-good and transition of the run to finalized — distinct from merely marking all steps completed.
_Avoid_: Complete (`completed` is an intermediate run status; `finalized` is the successful terminal state)

**Operator abort (account health)**:
Support-initiated soft failure of an active run: run and non-terminal items become failed, audit records remain, account active-health lock clears.
_Avoid_: Cancel, reset, delete run
