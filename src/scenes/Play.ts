import { parse } from "yaml";

import Phaser from "phaser";
import { Player } from "../prefabs/Player";
import { GameState } from "../prefabs/GameState";
import { Grid, GridConfig } from "../prefabs/Grid";
import { Stats, StatsConfig } from "../prefabs/Stats";
import { ButtonManager } from "../prefabs/ButtonManager";
import { LanguageManager, Language } from "../prefabs/LanguageManager";

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

  public buildings: Array<{
    type: string;
    cost: number;
    rate: number;
    scale: number;
  }> = [];

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

    // Language switching buttons
    document.getElementById("lang-en")?.addEventListener("click", () => {
      LanguageManager.setLanguage("en");
      this.updateUIText();
      
    });
    document.getElementById("lang-ar")?.addEventListener("click", () => {
      LanguageManager.setLanguage("ar");
      this.updateUIText();
    });
    document.getElementById("lang-zh")?.addEventListener("click", () => {
      LanguageManager.setLanguage("zh");
      this.updateUIText();
    });

  }


  update(): void {
    this.player.update();
  }

  updateUI(): void {
    // prioritize displaying stats of selected cell
    this.grid.selectedCell
      ? this.stats.update(this.grid.selectedCell)
      : this.player.displayCurrentCellStats();

    this.updateUIText();
  }

  updateUIText(): void {
    // Update trackables
    const playerDisplay = document.getElementById("playerDisplay");
    if (playerDisplay) {
      playerDisplay.innerHTML =
        `<span data-translate="resources">${LanguageManager.getTranslation(
          "resources"
        )}</span>: ${this.player.resources}<br />` +
        `<span data-translate="turns">${LanguageManager.getTranslation(
          "turns"
        )}</span>: ${this.trackables.turnsPlayed}<br />` +
        `<span data-translate="buildingsPlaced">${LanguageManager.getTranslation(
          "buildingsPlaced"
        )}</span>: ${this.trackables.buildingsPlaced}`;
    }

    // Update stats UI
    this.stats.updateUIText();
    // Update cell name
    if (this.grid.selectedCell) {
      this.stats.displayCellName();
    }
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
