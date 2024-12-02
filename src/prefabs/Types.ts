import { Grid, GridConfig } from "./Grid";
import { Stats, StatsConfig } from "./Stats";
import { GameState } from "./GameState";
import { Player } from "./Player";
import { ButtonManager } from "./ButtonManager";

export interface Trackables {
  buildingsPlaced: number;
  resourcesCollected: number;
  turnsPlayed: number;
}
