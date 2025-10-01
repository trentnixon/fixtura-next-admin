export interface ClubContactInfo {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  website: string;
}

export interface FetchClubContactInfoResponse {
  data: ClubContactInfo[];
}
