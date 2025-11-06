# Development Roadmap – Charts & Data Visualization

This file tracks **progress, priorities, and recommendations** for formalizing chart components and patterns based on the data insights implementation.

---

## ✅ Completed

- [x] Basic chart folder structure and navigation
- [x] ChartContainer showcase with basic examples
- [x] Chart layout patterns showcase
- [x] ChartContainer background variant option (TKT-2025-001)
- [x] Reusable ChartCard component wrapper (TKT-2025-002)
- [x] Standardize chart formatting utilities (TKT-2025-005)
- [x] Implement chart type showcase components (TKT-2025-003)

---

## ⏳ To Do (easy → hard)

1. [ ] **Easy**: Add ChartContainer background variant option

   - Add `variant` prop to ChartContainer for darker background (`bg-slate-50`)
   - Update ChartContainer component to support `variant="default" | "elevated"`
   - (see TKT-2025-001 for details)

2. [ ] **Moderate**: Create supporting data pattern component

   - Reusable summary stats grid component
   - Support for icon, label, value, and formatting
   - Consistent spacing and styling
   - (see TKT-2025-004 for details)

3. [ ] **Complex**: Create complete chart component library

   - Reusable chart components matching data insights pattern
   - Support for all chart types with consistent API
   - Built-in supporting data display
   - Standardized ChartConfig patterns
   - (see TKT-2025-006 for details)

4. [ ] **Complex**: Documentation and examples

   - Complete showcase for all chart types
   - Usage guidelines and best practices
   - Integration examples
   - (see TKT-2025-007 for details)

---

## 💡 Recommendations

- The data insights pattern (`bg-slate-50` Card background) works well and should be standardized
- Supporting data grids above charts provide valuable context - this pattern should be reusable
- Chart configuration should follow consistent naming and color conventions
- Consider creating a `ChartCard` component that combines Card + ChartContainer + supporting data pattern
- Formatting utilities should be centralized and reusable across all chart components
- Chart types should follow consistent prop patterns for data, config, and styling

---

### Key Patterns Identified

**Chart Card Structure:**

```
Card (bg-slate-50)
  ├── CardHeader
  │   ├── Icon + Title
  │   └── Description
  └── CardContent
      ├── Summary Stats Grid (2-4 columns)
      ├── Border Separator
      └── ChartContainer
          └── Recharts Chart
```

**Supporting Data Pattern:**

- Grid layout (2-4 columns, responsive)
- Icon + label + value format
- Calculated metrics from chart data
- Color-coded values based on meaning

**Chart Configuration:**

- Consistent ChartConfig type usage
- Color definitions using HSL values
- Label definitions for tooltips and legends
