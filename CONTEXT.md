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

**Invoice Request**:
A staff workflow ticket for manual invoicing. It may link to an Order but is not the billing record itself. Managed in `/dashboard/orders/invoices`.
_Avoid_: Invoice, order

**Invoice**:
The payment document Stripe issues. Hosted URL, PDF, and number fields live on the Order entity.
_Avoid_: Bill, payment request, invoice request

### Content production

**Scheduler**:
Recurring render schedule configuration for a client — when renders should run.
_Avoid_: Render

**Render**:
One content-generation execution for a client, producing downloads and AI articles from fixtures and results.
_Avoid_: Asset run, scheduler

**Account Asset Run**:
An on-demand orchestration pipeline: scrape results, validate fixtures, then produce downloads from templates. May precede or sit alongside a scheduled render; not synonymous with Render.
_Avoid_: Render

**Download**:
A render output file — video, image, ladder, scorecard, or other produced content.
_Avoid_: Asset (when meaning render output)

**Asset**:
A CMS-managed template or content definition — the entities managed at `/dashboard/assets`. Not a render output.
_Avoid_: Download, output

### Sports data

**Fixture**:
A scheduled or played match — scores, venue, round, status.
_Avoid_: Game, game metadata

**GameMetaData**:
Legacy CMS/API identifier for a fixture when talking to Strapi. Not product language.
_Avoid_: Fixture (in API/code comments aimed at humans)
