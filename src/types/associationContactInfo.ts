export interface AssociationContactInfo {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  website: string;
}

export interface FetchAssociationContactInfoResponse {
  data: AssociationContactInfo[];
}
