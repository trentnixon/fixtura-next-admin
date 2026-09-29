"use server";

import axiosInstance from "@/lib/axios";
import qs from "qs";
import { handleApiError } from "../utils/error-handler";

export interface PreviewVideoRow {
  id: number;
  name: string;
  position: string;
  size: string;
  loop: boolean;
  muted: boolean;
  offthread: boolean;
  volume: number | null;
  rate: number | null;
  overlay: unknown;
  publishedAt: string | null;
}

interface RawVideo {
  id: number;
  name?: string;
  position?: string;
  size?: string;
  loop?: boolean;
  muted?: boolean;
  offthread?: boolean;
  volume?: number | string | null;
  rate?: number | string | null;
  playbackRate?: number | string | null;
  useOffthreadVideo?: boolean | null;
  overlay?: unknown;
  publishedAt?: string | null;
  attributes?: Omit<RawVideo, "id" | "attributes">;
}

function text(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

function numberOrNull(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function toPreviewVideo(raw: RawVideo): PreviewVideoRow {
  const source = raw.attributes ?? raw;
  const offthread = source.offthread ?? source.useOffthreadVideo;
  return {
    id: raw.id,
    name: text(source.name),
    position: text(source.position) || "center",
    size: text(source.size) || "cover",
    loop: source.loop !== false,
    muted: source.muted !== false,
    offthread: offthread !== false,
    volume: numberOrNull(source.volume),
    rate: numberOrNull(source.rate ?? source.playbackRate),
    overlay: source.overlay ?? null,
    publishedAt: source.publishedAt ?? null,
  };
}

export async function fetchPreviewVideos(): Promise<{ data: PreviewVideoRow[] }> {
  const query = qs.stringify(
    {
      publicationState: "preview",
      sort: ["name:asc"],
      pagination: { page: 1, pageSize: 100 },
    },
    { encodeValuesOnly: true },
  );

  try {
    const response = await axiosInstance.get(`/template-videos?${query}`);
    const body = response.data as { data?: RawVideo[] } | RawVideo[];
    const rows = Array.isArray(body) ? body : (body.data ?? []);
    return { data: rows.map((row) => toPreviewVideo(row)) };
  } catch (error) {
    handleApiError(error, "fetchPreviewVideos");
  }
}
