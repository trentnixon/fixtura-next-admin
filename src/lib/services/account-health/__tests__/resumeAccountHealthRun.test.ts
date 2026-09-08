import { describe, expect, it, vi, beforeEach } from "vitest";
import axiosInstance from "@/lib/axios";

vi.mock("@/lib/axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("resumeAccountHealthRun", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("accepts backend resumed envelope", async () => {
    vi.mocked(axiosInstance.post).mockResolvedValue({
      data: {
        data: { status: "resumed", runId: 475, itemId: 1655 },
      },
    });

    const { resumeAccountHealthRun } = await import(
      "@/lib/services/account-health/resumeAccountHealthRun"
    );

    const result = await resumeAccountHealthRun(475);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.data.status).toBe("resumed");
      expect(result.data.data.runId).toBe(475);
    }
    expect(axiosInstance.post).toHaveBeenCalledWith(
      "/account/health/runs/475/resume"
    );
  });

  it("returns failure when backend omits resumed status", async () => {
    vi.mocked(axiosInstance.post).mockResolvedValue({
      data: { data: { id: 475 } },
    });

    const { resumeAccountHealthRun } = await import(
      "@/lib/services/account-health/resumeAccountHealthRun"
    );

    const result = await resumeAccountHealthRun(475);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toMatch(/Could not resume the run/);
    }
  });
});
