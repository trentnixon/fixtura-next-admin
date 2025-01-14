/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TemplateAttributes {
  Name: string;
  Poster: string | null; // assuming it's a URL or similar
  Category: string;
  Variation: string;
  FrontEndName: string;
  Gallery: string[]; // assuming it's an array of URLs
  Video: string | null; // assuming it's a URL
  Description: string;
  bundle_audio: number | null; // assuming it's a reference ID
  requiresMedia: boolean;
  TemplateVariation: any; // assuming JSON object
  DiviedFixturesBy: any; // assuming JSON object
  public: boolean;
}

export interface Template {
  id: number;
  attributes: TemplateAttributes;
}
