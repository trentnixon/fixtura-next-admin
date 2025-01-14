/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ThemeAttributes {
  Name: string;
  Theme: any; // assuming JSON object
  CreatedBy: number;
  isPublic: boolean;
}

export interface Theme {
  id: number;
  attributes: ThemeAttributes;
}
