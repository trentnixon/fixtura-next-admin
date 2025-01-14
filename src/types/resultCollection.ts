export interface ResultCollectionAttributes {
  whenWasTheLastCollection: string;
}

export interface ResultCollection {
  id: number;
  attributes: ResultCollectionAttributes;
}

export interface ResultCollectionState {
  resultCollections: ResultCollection[];
  accountResultCollections: ResultCollection[];
  resultCollectionDetails: ResultCollection | null;
  loading: boolean;
  error: string | null;
}
