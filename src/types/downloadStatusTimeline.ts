import type { Download } from "@/types/download";

export type DownloadStatusTimelineWindowPreset = "24h" | "48h" | "7d";

export type DownloadStatusTimelineParams = {
  from: string;
  to: string;
  page?: number;
  pageSize?: number;
};

export type StrapiPaginationMeta = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export type DownloadStatusTimelineResponse = {
  data: Download[];
  meta: {
    from: string;
    to: string;
    pagination: StrapiPaginationMeta;
  };
};
