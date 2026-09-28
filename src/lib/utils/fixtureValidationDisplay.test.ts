import {
  breakdownCategoriesBelow,
  findWeakestBreakdown,
  formatValidationStatus,
  validationProgressIndicatorClass,
} from "@/app/dashboard/fixtures/_components/_utils/fixtureValidationDisplay";

describe("fixtureValidationDisplay", () => {
  it("formats validation status labels", () => {
    expect(formatValidationStatus("excellent")).toBe("Excellent");
  });

  it("finds weakest breakdown category", () => {
    const weakest = findWeakestBreakdown({
      basicInfo: 100,
      scheduling: 100,
      matchDetails: 100,
      content: 25,
      relations: 80,
      results: 100,
    });
    expect(weakest).toEqual({ label: "Content", value: 25 });
  });

  it("maps scores to progress colors", () => {
    expect(validationProgressIndicatorClass(90)).toContain("emerald");
    expect(validationProgressIndicatorClass(10)).toContain("red");
  });

  it("lists categories below threshold for gap hints", () => {
    const gaps = breakdownCategoriesBelow({
      basicInfo: 100,
      scheduling: 100,
      matchDetails: 100,
      content: 25,
      relations: 80,
      results: 100,
    });
    expect(gaps).toHaveLength(1);
    expect(gaps[0].key).toBe("content");
    expect(gaps[0].hint).toMatch(/prompts/i);
  });
});
