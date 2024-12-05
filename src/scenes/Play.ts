import Phaser from "phaser";
import { Player } from "../prefabs/Player";
import { GameState } from "../prefabs/GameState";
import { Grid, GridConfig } from "../prefabs/Grid";
import { Stats, StatsConfig } from "../prefabs/Stats";
import { ButtonManager } from "../prefabs/ButtonManager";
import { parseScenarioFile, Scenario } from "../ScenerioParser";
import { LanguageManager, Language } from "../prefabs/LanguageManager";

export interface Trackables {
  buildingsPlaced: number;
  resourcesCollected: number;
  turnsPlayed: number;
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

    // this.loadScenario();
  }

  async loadScenario(): Promise<void> {
    try {
      const response = await fetch("config/scenarios.txt");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const scenarioFileContent = await response.text();
      const scenario = parseScenarioFile(scenarioFileContent);

      console.log("Loaded scenario:", scenario); // Add log to verify loading

      // Apply the scenario settings
      this.player.resources = scenario.startResources;
      this.RESOURCE_GOAL = parseInt(scenario.victoryCondition.split(" ")[1]);

      // Place buildings
      scenario.buildings.forEach((building) => {
        const cell = this.grid.getCell(building.row, building.col);
        if (cell) {
          cell.setBuilding(
            this.buildings.findIndex((b) => b.type === building.type)
          );
          cell.setLevel(building.level);
        }
      });

      // Mark unplacable cells
      scenario.unplacableCells.forEach((cellInfo) => {
        const cell = this.grid.getCell(cellInfo.row, cellInfo.col);
        if (cell) {
          cell.setUnplacable();
        }
      });
    } catch (error) {
      console.error("Error loading scenario file:", error);
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
}
