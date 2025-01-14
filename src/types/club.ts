/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ClubAttributes {
  Name: string;
  PlayHQID: string;
  href: string;
  Logo: any;
  ParentLogo: string;
  website: any;
  location: any;
  contactDetails: any;
  PlayHQLogo: any;
  hasPlayhqLogoStored: boolean;
  Sport: string;
}

export interface Club {
  id: number;
  attributes: ClubAttributes;
}

export interface ClubState {
  club: Club | null;
  loading: boolean;
  error: string | null;
}
