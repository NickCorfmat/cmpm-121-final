import { GameState } from "../prefabs/GameState";
import { Grid } from "../prefabs/Grid";
import { Player } from "../prefabs/Player";
import { Stats } from "../prefabs/Stats";
import { ButtonManager } from "../prefabs/ButtonManager";

class Play extends Phaser.Scene {
  private gridConfig: { width: number; height: number; size: number };
  private statsConfig: { x: number; y: number; width: number; height: number };
  public buildings: Array<{
    type: string;
    cost: number;
    rate: number;
    scale: number;
  }>;
  public RESOURCE_GOAL: number;
  public trackables: {
    buildingsPlaced: number;
    resourcesCollected: number;
    turnsPlayed: number;
  };

  public gameState!: GameState;
  public grid!: Grid;
  public stats!: Stats;
  public player!: Player;
  private buttons!: ButtonManager;

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
    // initialize game state manager
    this.gameState = new GameState(this);

    // initialize game window
    this.grid = new Grid(this, this.gridConfig);
    this.stats = new Stats(
      this,
      this.statsConfig.x,
      this.statsConfig.y,
      this.statsConfig.width,
      this.statsConfig.height
    );

    // initialize player
    this.player = new Player(this, 0, 0, this.grid);

    // initialize buttons
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