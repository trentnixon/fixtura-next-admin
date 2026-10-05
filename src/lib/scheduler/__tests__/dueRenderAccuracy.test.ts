import { describe, expect, it } from "vitest";
import {
  dueRenderAccuracyMeta,
  dueRenderAttentionRows,
  dueRendersByDay,
  formatSydneyRangeLabel,
  lastSydneyDays,
  scoreDueRenders,
  sydneyCalendarDate,
  sydneyDatesInRange,
  type DueRenderAttentionSlot,
  type DueRenderSlot,
} from "@/lib/scheduler/dueRenderAccuracy";

const NOW = Date.parse("2026-10-05T12:00:00+11:00");
const PAST = "2026-10-05T09:00:00+11:00";
const FUTURE = "2026-10-05T18:00:00+11:00";

function slot(overrides: Partial<DueRenderSlot> = {}): DueRenderSlot {
  return {
    dueAt: PAST,
    isRendering: false,
    queued: false,
    render: null,
    ...overrides,
  };
}

function complete(): DueRenderSlot["render"] {
  return { complete: true, processing: false };
}

describe("scoreDueRenders", () => {
  it("reports nothing due when the list is empty", () => {
    expect(scoreDueRenders([], NOW)).toEqual({ kind: "none" });
  });

  it("leaves slots that have not come up out of the percentage", () => {
    expect(scoreDueRenders([slot({ dueAt: FUTURE })], NOW)).toEqual({
      kind: "upcoming",
      upcoming: 1,
    });
  });

  it("divides finished renders by slots whose time has passed", () => {
    const score = scoreDueRenders(
      [
        slot({ render: complete() }),
        slot({ render: complete() }),
        slot(),
        slot({ dueAt: FUTURE, render: complete() }),
      ],
      NOW,
    );

    expect(score).toMatchObject({
      kind: "scored",
      percent: 67,
      processed: 2,
      due: 3,
      missed: 1,
      upcoming: 1,
    });
  });

  it("counts a render that is still running as in progress", () => {
    const score = scoreDueRenders(
      [
        slot({
          isRendering: true,
          render: { complete: false, processing: true },
        }),
        slot({ queued: true }),
      ],
      NOW,
    );

    expect(score).toMatchObject({
      kind: "scored",
      percent: 0,
      processed: 0,
      due: 2,
      inProgress: 2,
      missed: 0,
    });
  });

  it("counts a finished-but-incomplete render as failed", () => {
    const score = scoreDueRenders(
      [slot({ render: { complete: false, processing: false } })],
      NOW,
    );

    expect(score).toMatchObject({
      kind: "scored",
      percent: 0,
      failed: 1,
      missed: 0,
    });
  });
});

describe("dueRenderAccuracyMeta", () => {
  it("names an empty range", () => {
    expect(dueRenderAccuracyMeta({ kind: "none" }, "29 Sep to 5 Oct")).toBe(
      "No renders were due · 29 Sep to 5 Oct",
    );
  });

  it("lists the counts that are not zero", () => {
    expect(
      dueRenderAccuracyMeta(
        {
          kind: "scored",
          percent: 82,
          processed: 41,
          due: 50,
          inProgress: 3,
          missed: 2,
          failed: 4,
          upcoming: 6,
        },
        "29 Sep to 5 Oct",
      ),
    ).toBe(
      "41 of 50 finished · 3 in progress · 2 missed · 4 failed · 6 still to come · 29 Sep to 5 Oct",
    );
  });
});

describe("sydney date range", () => {
  it("defaults to the last 7 Sydney days, inclusive", () => {
    expect(lastSydneyDays("2026-10-05", 7)).toEqual({
      from: "2026-09-29",
      to: "2026-10-05",
    });
  });

  it("lists a window that starts weeks earlier", () => {
    const dates = sydneyDatesInRange("2026-08-31", "2026-09-14");
    expect(dates?.[0]).toBe("2026-08-31");
    expect(dates?.at(-1)).toBe("2026-09-14");
    expect(dates).toHaveLength(15);
  });

  it("refuses a span longer than the request cap", () => {
    expect(sydneyDatesInRange("2026-01-01", "2026-05-01")).toBeNull();
  });

  it("labels a single day and a span", () => {
    expect(formatSydneyRangeLabel("2026-10-05", "2026-10-05")).toBe("5 Oct");
    expect(formatSydneyRangeLabel("2026-09-29", "2026-10-05")).toBe(
      "29 Sept to 5 Oct",
    );
  });
});

describe("due render breakdown", () => {
  it("counts each Sydney day and lists the ones that did not finish", () => {
    const slots: DueRenderAttentionSlot[] = [
      {
        ...slot({ render: complete() }),
        schedulerId: 1,
        accountId: 10,
        accountName: "Finished Club",
        accountType: "Club",
        scheduledTime: "09:00:00",
        render: { complete: true, processing: false, renderId: 1, failureReason: null },
      },
      {
        ...slot(),
        dueAt: "2026-10-04T09:00:00+11:00",
        schedulerId: 2,
        accountId: 11,
        accountName: "Missed Club",
        accountType: "Club",
        scheduledTime: "09:00:00",
        render: null,
      },
    ];

    expect(dueRendersByDay(slots, NOW)).toEqual([
      {
        date: "2026-10-04",
        label: "4 Oct",
        processed: 0,
        inProgress: 0,
        missed: 1,
        failed: 0,
        upcoming: 0,
      },
      {
        date: "2026-10-05",
        label: "5 Oct",
        processed: 1,
        inProgress: 0,
        missed: 0,
        failed: 0,
        upcoming: 0,
      },
    ]);

    const attention = dueRenderAttentionRows(slots, NOW);
    expect(attention).toHaveLength(1);
    expect(attention[0]?.accountName).toBe("Missed Club");
    expect(attention[0]?.outcome).toBe("missed");
  });
});

describe("sydneyCalendarDate", () => {
  it("uses the Sydney calendar day across the UTC date line", () => {
    expect(sydneyCalendarDate(new Date("2026-10-04T14:00:00.000Z"))).toBe(
      "2026-10-05",
    );
  });
});
