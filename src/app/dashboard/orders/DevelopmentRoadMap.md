# Development Roadmap – Orders Workspace

## ✅ Completed

- [x] Placeholder orders dashboard scaffolded
- [x] Admin orders overview wired to CMS endpoint with metrics, timeline, and table
- [x] Admin invoice creation endpoint integration (server action, types, hook)
- [x] Invoice creation UI component implemented (see TKT-2025-025)
- [x] Order edit form with status and payment fields
- [x] Status boolean field added to order edit form
- [x] Form logic refactored into shared utilities (see TKT-2025-025)
- [x] Reusable form component library created (see TKT-2025-026)
- [x] CreateInvoiceForm and OrderEditForm refactored to use component library
- [x] Comprehensive documentation completed (component library, order detail, invoice creation)
- [x] Testing completed for all components and forms

## ⏳ To Do (easy → hard)

1. [ ] Fix Status, Checkout, and Active column labels and values in orders overview table (see TKT-2025-027)

## 🔮 Later Development / Upgrades

1. [ ] Validate data with finance stakeholders and confirm stats accuracy
2. [ ] Expand filters (account, tier) and add CSV export workflow
3. [ ] Integrate auth guard once admin authentication module is delivered

## 💡 Recommendations

- Coordinate with finance team for data sources and status definitions
- Mirror the UX patterns from analytics and budget sections where possible
- Verify Status boolean field behavior matches backend expectations
- Consider adding CSV export functionality for bulk order management
- Plan authentication integration once admin auth module is available
