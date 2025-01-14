export interface RenderTokenAttributes {
  token: string;
  expiration: string; // assuming it's a date string
}

export interface RenderToken {
  id: number;
  attributes: RenderTokenAttributes;
}
