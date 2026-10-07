import { beforeEach, describe, expect, it, vi } from "vitest";
import axiosInstance from "@/lib/axios";

vi.mock("@/lib/axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("wipeFreeTrial", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not remove a free trial when the client id is missing", async () => {
    const { wipeFreeTrial } = await import("../wipeFreeTrial");

    const result = await wipeFreeTrial(Number.NaN);

    expect(result).toEqual({
      ok: false,
      message: "A client id is required",
    });
    expect(axiosInstance.post).not.toHaveBeenCalled();
  });

  it("reports a removed free trial", async () => {
    vi.mocked(axiosInstance.post).mockResolvedValue({
      data: { data: { outcome: "wiped" } },
    });
    const { wipeFreeTrial } = await import("../wipeFreeTrial");

    const result = await wipeFreeTrial(42);

    expect(result).toEqual({ ok: true, outcome: "wiped" });
    expect(axiosInstance.post).toHaveBeenCalledWith(
      "/account/42/admin/free-trial/wipe",
    );
  });

  it("reports that nothing was removed", async () => {
    vi.mocked(axiosInstance.post).mockResolvedValue({
      data: { data: { outcome: "already_clear" } },
    });
    const { wipeFreeTrial } = await import("../wipeFreeTrial");

    const result = await wipeFreeTrial(42);

    expect(result).toEqual({ ok: true, outcome: "already_clear" });
  });

  it("reports that the client could not be matched to one organisation", async () => {
    vi.mocked(axiosInstance.post).mockRejectedValue({
      message: "Request failed with status code 409",
      status: 409,
      data: { data: { outcome: "organisation_unavailable" } },
    });
    const { wipeFreeTrial } = await import("../wipeFreeTrial");

    const result = await wipeFreeTrial(42);

    expect(result).toEqual({
      ok: false,
      outcome: "organisation_unavailable",
      message:
        "This client could not be matched to one organisation. Nothing was deleted.",
    });
  });

  it("surfaces the CMS authentication message", async () => {
    vi.mocked(axiosInstance.post).mockRejectedValue({
      message: "Request failed with status code 401",
      status: 401,
      data: {
        data: null,
        error: {
          status: 401,
          name: "UnauthorizedError",
          message: "Authentication required",
          details: {},
        },
      },
    });
    const { wipeFreeTrial } = await import("../wipeFreeTrial");

    const result = await wipeFreeTrial(42);

    expect(result).toEqual({
      ok: false,
      message: "Authentication required",
    });
  });

  it("surfaces the CMS failure message", async () => {
    vi.mocked(axiosInstance.post).mockRejectedValue({
      message: "Request failed with status code 500",
      status: 500,
      data: {
        data: null,
        error: {
          status: 500,
          name: "InternalServerError",
          message: "Could not remove the free trial",
          details: {},
        },
      },
    });
    const { wipeFreeTrial } = await import("../wipeFreeTrial");

    const result = await wipeFreeTrial(42);

    expect(result).toEqual({
      ok: false,
      message: "Could not remove the free trial",
    });
  });
});
