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

export class PlayScene extends Phaser.Scene {
  public gridConfig: GridConfig;
  public statsConfig: StatsConfig;
  public buildings: Array<{
    type: string;
    cost: number;
    rate: number;
    scale: number;
  }>;
  public RESOURCE_GOAL: number;
  public trackables: Trackables;

  public gameState!: GameState;
  public grid: Grid;
  public stats: Stats;
  public player: Player;
  public buttons: ButtonManager;

  constructor() {
    super("scenePlay");
  }

  init(): void {
    // set game display parameters
    this.gridConfig = { width: 8, height: 8, size: 50 };
    this.statsConfig = {
      x: this.gridConfig.width * this.gridConfig.size,
      y: 0,
      width:
        this.game.scale.width - this.gridConfig.width * this.gridConfig.size,
      height: this.game.scale.height,
    };

    this.buildings = [
      {
        type: "Drill",
        cost: 10,
        rate: 1,
        scale: 1.6,
      },
      {
        type: "Excavator",
        cost: 30,
        rate: 1.5,
        scale: 1.6,
      },
      {
        type: "DemolitionPlant",
        cost: 50,
        rate: 2,
        scale: 1.6,
      },
    ];

    this.RESOURCE_GOAL = 1000;

    // initialize game stats
    this.trackables = {
      buildingsPlaced: 0,
      resourcesCollected: 0,
      turnsPlayed: 0,
    };
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

    this.launchGame();
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
