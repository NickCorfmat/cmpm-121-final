import { parse } from "yaml";

import Phaser from "phaser";
import { Player } from "../prefabs/Player";
import { GameState } from "../prefabs/GameState";
import { Grid, GridConfig } from "../prefabs/Grid";
import { Stats, StatsConfig } from "../prefabs/Stats";
import { ButtonManager } from "../prefabs/ButtonManager";

export interface Trackables {
  buildingsPlaced: number;
  resourcesCollected: number;
  turnsPlayed: number;
}

export interface Building {
  readonly type: string;
  readonly cost: number;
  readonly rate: number;
  readonly scale: number;
}

export class PlayScene extends Phaser.Scene {
  public gridConfig!: GridConfig;
  public statsConfig!: StatsConfig;
  public trackables!: Trackables;
  public RESOURCE_GOAL: number = 1000;
  public buildings: Building[] = [];
  public gameState!: GameState;
  public grid!: Grid;
  public stats!: Stats;
  public player!: Player;
  public buttons!: ButtonManager;

  constructor() {
    super("scenePlay");
  }

  init(): void {
    const yamlText = this.cache.text.get("scenario");
    const config = parse(yamlText);

    // set game display parameters
    this.gridConfig = config.gridConfig;
    this.statsConfig = {
      x: this.gridConfig.width * this.gridConfig.size,
      y: 0,
      width:
        this.game.scale.width - this.gridConfig.width * this.gridConfig.size,
      height: this.game.scale.height,
    };

    this.buildings = config.buildings;
    this.RESOURCE_GOAL = config.RESOURCE_GOAL;
    this.trackables = config.trackables;
  }

  create(): void {
    this.gameState = new GameState(this);
    this.grid = new Grid(this, this.gridConfig);
    this.stats = new Stats(
      this,
      this.statsConfig.x,
      this.statsConfig.y,
      this.statsConfig.width,
      this.statsConfig.height
    );
    this.player = new Player(this, 0, 0, this.grid);
    this.buttons = new ButtonManager(this);
  }

  update(): void {
    this.player.update();
  }

  updateUI(): void {
    // prioritize displaying stats of selected cell
    this.grid.selectedCell
      ? this.stats.update(this.grid.selectedCell)
      : this.player.displayCurrentCellStats();

    this.player.updatePlayerDisplay();
  }

  startNextRound(): void {
    this.grid.step();
    this.updateUI();
    this.gameState.save();
  }

  checkWinCondition(): void {
    if (this.player.resources >= this.RESOURCE_GOAL) {
      this.scene.start("sceneWin", this.trackables);
    }
  }

  launchGame(): void {
    const savedData = localStorage.getItem("AUTO_SAVE");

    // prompt user to continue from auto-save or start new game
    if (savedData && confirm("Do you want to continue where you left off?")) {
      this.gameState.load();
    }
  }
}
