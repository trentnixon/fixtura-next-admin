import { classifyGradeFixture } from "./gradeFixtureListGroup";

const today = new Date("2026-09-28T10:00:00");

describe("classifyGradeFixture", () => {
  it("treats finished, completed, and final as complete", () => {
    expect(
      classifyGradeFixture({ date: "2026-09-01", status: "finished" }, today),
    ).toBe("complete");
    expect(
      classifyGradeFixture({ date: "2026-09-01", status: "completed" }, today),
    ).toBe("complete");
    expect(
      classifyGradeFixture({ date: "2026-10-01", status: "final" }, today),
    ).toBe("complete");
  });

  it("keeps future and same-day games on scheduled", () => {
    expect(
      classifyGradeFixture({ date: "2026-10-04", status: "upcoming" }, today),
    ).toBe("scheduled");
    expect(
      classifyGradeFixture({ date: "2026-09-28", status: "scheduled" }, today),
    ).toBe("scheduled");
    expect(
      classifyGradeFixture({ date: "2026-10-04", status: null }, today),
    ).toBe("scheduled");
  });

  it("lists past games with no result status as needs result", () => {
    expect(
      classifyGradeFixture({ date: "2026-09-20", status: null }, today),
    ).toBe("needs-result");
    expect(
      classifyGradeFixture({ date: "2026-09-20", status: "" }, today),
    ).toBe("needs-result");
    expect(
      classifyGradeFixture({ date: "2026-09-20", status: "unknown" }, today),
    ).toBe("needs-result");
    expect(
      classifyGradeFixture({ date: "2026-09-20", status: "upcoming" }, today),
    ).toBe("needs-result");
    expect(
      classifyGradeFixture({ date: "2026-09-20", status: "scheduled" }, today),
    ).toBe("needs-result");
  });

  it("keeps past games that already have a non-result status on scheduled", () => {
    expect(
      classifyGradeFixture({ date: "2026-09-20", status: "cancelled" }, today),
    ).toBe("scheduled");
    expect(
      classifyGradeFixture(
        { date: "2026-09-20", status: "in_progress" },
        today,
      ),
    ).toBe("scheduled");
  });

  it("does not treat a missing date as a past game", () => {
    expect(classifyGradeFixture({ date: null, status: null }, today)).toBe(
      "scheduled",
    );
  });
});
