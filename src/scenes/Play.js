/*
[F0.a] You control a character moving over a 2D grid.
[F0.b] You advance time manually in the turn-based simulation.
[F0.c] You can reap or sow plants on grid cells only when you are near them.
[F0.d] Grid cells have sun and water levels. The incoming sun and water for each cell is somehow randomly generated each turn. Sun energy cannot be stored in a cell (it is used immediately or lost) while water moisture can be slowly accumulated over several turns.
[F0.e] Each plant on the grid has a distinct type (e.g. one of 3 species) and a growth level (e.g. “level 1”, “level 2”, “level 3”).
[F0.f] Simple spatial rules govern plant growth based on sun, water, and nearby plants (growth is unlocked by satisfying conditions).
[F0.g] A play scenario is completed when some condition is satisfied (e.g. at least X plants at growth level Y or above).

Mechanics:
- Player can move one grid tile per turn and place on building per turn
- Player can only place a building on an empty grid tile (Buttons for each building type near end turn button)
- Player can only place a building if they have enough resources
- Player starts with enough resources for 2 buildings
- Player can harvest resources from buildings (must be within one grid cell)
- Each turn player receives the same resources from buildings with different rates based on the type (Drill, Ecavator, DemolitionPlant)
- Player can oil buildings to increase their oil level (must be within one grid cell)
- At the end of the turn, each cell is updated with a sun level, if a building is present, the building recieves the sun level (otherwise the sun level is wasted) and the cell is updated with resources based on the sun and oil level of the cell
- Player cannot oil cells with no buildings
- Buildings use 1 oil level per turn and may be oiled to a maximum of 5
*/

class Play extends Phaser.Scene {
  constructor() {
    super("scenePlay");
  }

  init() {
    // set game display parameters
    this.gridConfig = { width: 8, height: 8, size: 50 };
    this.statsConfig = {
      x: this.gridConfig.width * this.gridConfig.size,
      y: 0,
      width: width - this.gridConfig.width * this.gridConfig.size,
      height: height,
    };

    this.BUILDINGS = [
      {
        type: "Drill",
        cost: 10,
        multiplier: 1,
        tint: 0x000000,
        scale: 1.9,
      },
      {
        type: "Excavator",
        cost: 30,
        multiplier: 2,
        tint: 0x8b4513,
        scale: 1.9,
      },
      {
        type: "DemolitionPlant",
        cost: 50,
        multiplier: 3,
        tint: 0xff0000,
        scale: 1.9,
      },
    ];

    // initialize game stats
    this.buildingsPlaced = 0;
    this.resourcesCollected = 0;
    this.turnsPlayed = 0;
  }

  create() {
    // set background color
    this.cameras.main.setBackgroundColor(0x000000);

    this.grid = new Grid(this, this.gridConfig);

    this.stats = new Stats(
      this,
      this.statsConfig.x,
      this.statsConfig.y,
      this.statsConfig.width,
      this.statsConfig.height
    );

    this.player = new Player(this, 0, 0, this.grid);

    this.createNextRoundButton();

    // add event listeners to building buttons
    this.createBuyButtons();
  }

  createBuyButtons() {
    this.BUILDINGS.forEach((building) => {
      const button = document.getElementById("buy" + building.type + "Button");
      button.innerText = `Buy ${building.type}: $${building.cost}`;
      button.addEventListener("click", () => this.buyBuilding(building.type));
    });
  }

  buyBuilding(type) {
    // find building object based on property. Source: Brace
    const buildingConfig = this.BUILDINGS.find((b) => b.type === type);
    // construct building in current cell
    if (
      this.grid.selectedCell &&
      this.player.resources >= buildingConfig.cost &&
      !this.grid.selectedCell.building
    ) {
      this.player.spendResources(buildingConfig.cost);
      const { row, col } = this.grid.selectedCell.getLogicalCoords();
      this.grid.selectedCell.building = new Building(
        this,
        row,
        col,
        this.grid,
        buildingConfig
      );
      this.buildingsPlaced++; // Increment buildings placed
      this.stats.update(this.grid.selectedCell); // Update stats after buying a building
      this.player.updateResourceDisplay(); // Update resource display
    }
  }

  startNextRound() {
    this.turnsPlayed++; // Increment turns played
    this.grid.updateCellLevels();
    this.grid.cells.forEach((cell) => {
      if (cell.building) {
        cell.building.updateLevel(); // Update building level
        cell.building.generateResources(cell.sunLevel, cell.waterLevel);
      }
    });
    if (this.grid.selectedCell) {
      this.stats.update(this.grid.selectedCell);
    }
    this.player.updateResourceDisplay(); // Update resource display
    this.checkWinCondition();
  }

  createNextRoundButton() {
    const button = document.getElementById("nextRoundButton");

    button.addEventListener("click", () => {
      this.startNextRound();
    });
  }

  checkWinCondition() {
    if (this.player.resources >= 1000) {
      this.scene.start("sceneWin", {
        buildingsPlaced: this.buildingsPlaced,
        resourcesCollected: this.resourcesCollected,
        turnsPlayed: this.turnsPlayed,
      });
    }
  }

  update() {
    this.player.update();
  }
}
