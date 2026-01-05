import { z } from "zod";

export const assetFormSchema = z.object({
  Name: z.string().min(1, "Name is required"),
  CompositionID: z.string().min(1, "Composition ID is required"),
  SubTitle: z.string().optional(),
  Icon: z.string().optional(),
  Sport: z.enum(["Cricket", "AFL", "Hockey", "Netball", "Basketball"], {
    message: "Sport is required",
  }),
  ContentType: z.enum(["Single", "Collective"], {
    message: "Content Type is required",
  }),
  description: z.string().optional(),
  Blurb: z.string().optional(),
  assetDescription: z.string().optional(),
  Metadata: z.unknown().optional(),
  filter: z.string().optional(),
  ArticleFormats: z.string().optional(),
  asset_category: z.number().optional(),
  asset_type: z.number().optional(),
  subscription_package: z.number().optional(),
  play_hq_end_point: z.number().optional(),
  account_types: z.array(z.number()).optional(),
});

export type AssetFormValues = z.infer<typeof assetFormSchema>;
