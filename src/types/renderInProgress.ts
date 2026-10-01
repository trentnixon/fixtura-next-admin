/** GET /api/render/admin/in-progress — see .comms/Strapi/handoff/cms-handoff-fleet-operations.md */

export type RenderInProgressRow = {
  renderId: number;
  renderName: string | null;
  processing: boolean;
  complete: boolean;
  startedAt: string | null;
  schedulerId: number | null;
  schedulerName: string | null;
  accountId: number | null;
  accountName: string | null;
  accountType: string | null;
  scheduledTime: string | null;
};

export type RenderInProgressResponse = {
  data: {
    activeCount: number;
    rows: RenderInProgressRow[];
  };
};
