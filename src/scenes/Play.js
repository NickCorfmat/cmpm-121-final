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
    this.gridConfig = { width: 8, height: 8, size: 40 };
    this.selectedCell = null;
    this.previousSelectedCell = null;
  }

  create() {
    // set background color
    this.cameras.main.setBackgroundColor(0x000000);

    this.grid = new Grid(this, this.gridConfig);
    this.stats = new Stats(
      this,
      this.gridConfig.width * this.gridConfig.size,
      0,
      width - this.gridConfig.width * this.gridConfig.size,
      height
    );

    this.player = new Player(this, 0, 0, this.grid);

    // add event listener to end turn button
    document
      .getElementById("endTurnButton")
      .addEventListener("click", () => this.endTurn());

    // add event listeners to building buttons
    this.createBuildingButtons();

    // add pointerdown interactivity that calls selectCell for every cell in grid
    this.grid.cells.forEach((cell) => {
      cell.setInteractive();
      cell.on("pointerdown", () => this.selectCell(cell));
    });
  }

  createBuildingButtons() {
    const buyBuildingButtons = [
      { id: "buyDrillButton", type: "buyDrillButton", cost: 10 },
      { id: "buyExcavatorButton", type: "buyExcavatorButton", cost: 30 },
      { id: "buyDemolitionPlantButton", type: "buyDemolitionPlantButton", cost: 50 },
    ];
    buyBuildingButtons.forEach((button) => {
      const btn = document.getElementById(button.id);
      btn.innerText = `${btn.innerText} (${button.cost} resources)`;
      btn.addEventListener("click", () => this.buyBuilding(button.type));
    });
  }

  selectCell(cell) {
    this.selectedCell = cell;
    if (this.previousSelectedCell === this.selectedCell) {
      this.selectedCell.clearSelection();
    } else {
      this.selectedCell.selectCell(); // Highlight the selected cell
      if (this.previousSelectedCell) {
        this.previousSelectedCell.clearSelection(); // Clear the previous selected cell
      }
      this.previousSelectedCell = this.selectedCell;
    }
    this.updateStats(cell);
  }

  updateStats(cell) {
    this.stats.updateStats(cell);
  }

  buyBuilding(type) {
    let cost;
    switch (type) {
      case "buyDrillButton":
        cost = 10;
        break;
      case "buyExcavatorButton":
        cost = 30;
        break;
      case "buyDemolitionPlantButton":
        cost = 50;
        break;
    }

    if (this.selectedCell && this.player.spendResources(cost)) {
      const { x, y } = this.selectedCell.getCenter();
      let building;
      let tint;

      switch (type) {
        case "buyDrillButton":
          building = new Drill(this, x, y, "cell");
          tint = 0x000000; // Black
          break;
        case "buyExcavatorButton":
          building = new Excavator(this, x, y, "cell");
          tint = 0x8b4513; // Brown
          break;
        case "buyDemolitionPlantButton":
          building = new DemolitionPlant(this, x, y, "cell");
          tint = 0xff0000; // Red
          break;
      }

      building.setTint(tint); // Set the tint color for the building
      this.selectedCell.building = building;
      this.selectedCell.setTexture("cell");
    }
  }

  endTurn() {
    this.grid.updateCells();
    this.grid.cells.forEach((cell) => {
      if (cell.building) {
        cell.building.generateResources(cell.sunLevel, cell.waterLevel);
      }
    });
    if (this.selectedCell) {
      this.updateStats(this.selectedCell);
    }
  }

  update() {
    this.player.update();
  }
}