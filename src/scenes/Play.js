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
*/
class Play extends Phaser.Scene {
  constructor() {
    super("scenePlay");
  }

  init() {
    this.gridConfig = { width: 8, height: 8, size: 40 };
    this.isPlayerTurn = true;
    this.selectedCell = null;
    this.previousSelectedCell = null;
  }

  create() {
    // set background color
    this.cameras.main.setBackgroundColor(0x000000);

    this.grid = new Grid(this, this.gridConfig);

    const cell = this.grid.getCell(0, 0);

    this.player = new Player(this, cell.gridX, cell.gridY, this.gridConfig);

    // add event listener to end turn button
    document
      .getElementById("endTurnButton")
      .addEventListener("click", () => this.endTurn());

    // add event listeners to building buttons
    this.createBuildingButtons();
  }

  createBuildingButtons() {
    const buyBuildingButtons = ["buyDrillButton", "buyExcavatorButton", "buyDemolitionPlantButton"];
    buyBuildingButtons.forEach(type => {
      document.getElementById(type).addEventListener('click', () => this.buyBuilding(type));
    });
  }

  selectCell(cell) {
    const playerCell = this.grid.getCell(
      Math.floor(this.player.x / this.gridConfig.size),
      Math.floor(this.player.y / this.gridConfig.size)
    );

    const isAdjacent = Math.abs(cell.gridX - playerCell.gridX) <= 1 && Math.abs(cell.gridY - playerCell.gridY) <= 1;

    if (isAdjacent) {
      if (this.previousSelectedCell) {
        this.previousSelectedCell.clearTint();
      }

      this.selectedCell = cell;
      this.selectedCell.setTint(0x00ff00); // Highlight the selected cell with green tint
      this.previousSelectedCell = this.selectedCell;
    }
  }

  buyBuilding(type) {
    if (this.selectedCell && this.player.spendResources(50)) {
      const { x, y } = this.selectedCell.getCenter();
      let building;
      let tint;

      switch (type) {
        case 'buyDrillButton':
          building = new Drill(this, x, y, 'cell');
          tint = 0x000000; // Black
          break;
        case 'buyExcavatorButton':
          building = new Excavator(this, x, y, 'cell');
          tint = 0x8B4513; // Brown
          break;
        case 'buyDemolitionPlantButton':
          building = new DemolitionPlant(this, x, y, 'cell');
          tint = 0xFF0000; // Red
          break;
      }

      this.selectedCell.setTexture('cell');
      this.selectedCell.building = building;
      this.selectedCell.setTint(tint); // Set the tint color for the building
      this.selectedCell = null;
      this.previousSelectedCell = null;
    }
  }

  endTurn() {
    this.isPlayerTurn = true;
    // Add logic for advancing time and updating grid cells
  }

  update() {
    if (this.isPlayerTurn) {
      this.player.update();
    }
  }
}