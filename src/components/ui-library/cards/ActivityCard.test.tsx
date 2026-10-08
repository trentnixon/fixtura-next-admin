import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Receipt } from "lucide-react";
import ActivityCard from "./ActivityCard";

describe("ActivityCard", () => {
  it("renders two orders that share a tier and amount", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ActivityCard
        title="Recent orders"
        items={[
          {
            id: 11,
            icon: Receipt,
            label: "Free Trial · $0.00",
            meta: "1 Jan 2026",
          },
          {
            id: 12,
            icon: Receipt,
            label: "Free Trial · $0.00",
            meta: "2 Jan 2026",
          },
        ]}
      />,
    );

    expect(screen.getAllByText("Free Trial · $0.00")).toHaveLength(2);
    expect(screen.getByText("1 Jan 2026")).toBeInTheDocument();
    expect(screen.getByText("2 Jan 2026")).toBeInTheDocument();
    expect(
      error.mock.calls.some((call) =>
        call.some((part) => String(part).includes("same key")),
      ),
    ).toBe(false);

    error.mockRestore();
  });
});
