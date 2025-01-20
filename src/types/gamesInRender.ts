/* eslint-disable @typescript-eslint/no-explicit-any */
import { Render } from "./render";
import { GameMetaData } from "./gameMetaData";
import { GameDataAFL } from "./gameDataAFL";
import { GameDataNetball } from "./gameDataNetball";
import { GameDataHockey } from "./gameDataHockey";
import { GameDataBasketball } from "./gameDataBasketball";

// Type definition for the GameResultsInRender collection type
export interface GameResultsInRender {
  id: number; // Unique identifier for each GameResultsInRender entry
  attributes: GameResultsInRenderAttributes; // Attributes for the GameResultsInRender entry
}

// Attributes of the GameResultsInRender
export interface GameResultsInRenderAttributes {
  render: RelationTo<Render>; // Relation to the Render collection
  game_meta_datum: RelationTo<GameMetaData>; // Relation to the GameMetaData collection
  game_data_afl?: RelationTo<GameDataAFL>; // Relation to the AFL game data (optional)
  game_data_netball?: RelationTo<GameDataNetball>; // Relation to the Netball game data (optional)
  game_data_hockey?: RelationTo<GameDataHockey>; // Relation to the Hockey game data (optional)
  game_data_basketball?: RelationTo<GameDataBasketball>; // Relation to the Basketball game data (optional)
}

// Generic type for relations
export interface RelationTo<T extends { attributes: any }> {
  data: {
    id: number;
    attributes: T["attributes"];
  };
}

// Type for a response from the API fetching multiple GameResultsInRender entries
export interface GameResultsInRenderResponse {
  data: GameResultsInRender[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Type for a response from the API fetching a single GameResultsInRender entry
export interface SingleGameResultsInRenderResponse {
  data: GameResultsInRender;
  meta: Record<string, never>;
}
