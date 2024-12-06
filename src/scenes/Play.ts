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
  readonly growthRule: string; // New property
}

export interface VictoryCondition {
  type: "resources" | "level3Buildings" | "specificBuilding";
  goal: number;
  buildingType?: string;
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
    growthRule: string; // New property
  }> = [];

  public gameState!: GameState;
  public grid!: Grid;
  public stats!: Stats;
  public player!: Player;
  public buttons!: ButtonManager;
  public victoryCondition!: VictoryCondition;

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

    this.buildings = config.buildings.map((building: any) => ({
      ...building,
      growthRule: building.growthRule || "default", // Default to "default" if not specified
    }));
    this.RESOURCE_GOAL = config.RESOURCE_GOAL;
    this.trackables = config.trackables;
    this.victoryCondition = config.victoryCondition;
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

    this.updateVictoryConditionText();

    // Language switching buttons
    document.getElementById("lang-en")?.addEventListener("click", () => {
      LanguageManager.setLanguage("en");
      this.updateUIText();
      this.updateVictoryConditionText();
    });
    document.getElementById("lang-ar")?.addEventListener("click", () => {
      LanguageManager.setLanguage("ar");
      this.updateUIText();
      this.updateVictoryConditionText();
    });
    document.getElementById("lang-zh")?.addEventListener("click", () => {
      LanguageManager.setLanguage("zh");
      this.updateUIText();
      this.updateVictoryConditionText();
    });

    this.launchGame();
  }

  updateVictoryConditionText(): void {
    const victoryConditionElement = document.getElementById("victoryCondition");
    if (victoryConditionElement) {
      if (this.victoryCondition.type === "resources") {
        victoryConditionElement.setAttribute("data-translate", "collectGoal");
        victoryConditionElement.textContent = LanguageManager.getTranslation("collectGoal", { goal: this.victoryCondition.goal });
      } else if (this.victoryCondition.type === "level3Buildings") {
        victoryConditionElement.setAttribute("data-translate", "level3BuildingsGoal");
        victoryConditionElement.textContent = LanguageManager.getTranslation("level3BuildingsGoal", { goal: this.victoryCondition.goal });
      } else if (this.victoryCondition.type === "specificBuilding") {
        victoryConditionElement.setAttribute("data-translate", "specificBuildingGoal");
        victoryConditionElement.textContent = LanguageManager.getTranslation("specificBuildingGoal", { goal: this.victoryCondition.goal, buildingType: LanguageManager.getTranslation(this.victoryCondition.buildingType ?? '') });
      }
    }
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
    if (this.victoryCondition.type === "resources") {
      if (this.player.resources >= this.victoryCondition.goal) {
        this.scene.start("sceneWin", this.trackables);
      }
    } else if (this.victoryCondition.type === "level3Buildings") {
      const level3Buildings = Array.from(this.grid.cells.values()).filter(
        (cell) => cell.level === 3
      ).length;
      if (level3Buildings >= this.victoryCondition.goal) {
        this.scene.start("sceneWin", this.trackables);
      }
    } else if (this.victoryCondition.type === "specificBuilding") {
      const specificBuildings = Array.from(this.grid.cells.values()).filter(
        (cell) => cell.getName() === this.victoryCondition.buildingType
      ).length;
      if (specificBuildings >= this.victoryCondition.goal) {
        this.scene.start("sceneWin", this.trackables);
      }
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
