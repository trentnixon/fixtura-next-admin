export interface AssociationAttributes {
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

export interface Association {
  id: number;
  attributes: AssociationAttributes;
}

export interface AssociationState {
  association: Association | null;
  loading: boolean;
  error: string | null;
}
