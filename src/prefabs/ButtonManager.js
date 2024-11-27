class ButtonManager {
  constructor(scene, buildings, player) {
    this.scene = scene;
    this.buildings = buildings;
    this.player = player;
  }

  createPurchaseButtons() {
    // create purchase buttons for each building type
    this.buildings.forEach((building) => {
      const button = document.getElementById("buy" + building.type + "Button");
      button.innerText = `Buy ${building.type}: $${building.cost}`;

      // purchase building on click
      button.addEventListener("click", () => {
        this.purchaseBuilding(building.type);
      });
    });
  }

  purchaseBuilding(type) {
    // retrieve building config based on building type. Source: Brace
    const buildingConfig = this.buildings.find((b) => b.type === type);
    const grid = this.scene.grid;

    // place building in selected cell
    if (this.canPlaceBuilding(buildingConfig.cost)) {
      this.player.spendResources(buildingConfig.cost);

      const { row, col } = grid.selectedCell.getLogicalCoords();

      // assign building to selected cell
      grid.selectedCell.building = new Building(
        this.scene,
        row,
        col,
        grid,
        buildingConfig
      );

      // update game stats
      this.scene.buildingsPlaced++;
      this.scene.stats.update(grid.selectedCell);
      this.player.updateResourceDisplay();
    }
  }

  canPlaceBuilding(cost) {
    return (
      this.scene.grid.selectedCell &&
      this.player.resources >= cost &&
      !this.scene.grid.selectedCell.building
    );
  }

  createNextRoundButton() {
    const button = document.getElementById("nextRoundButton");

    button.addEventListener("click", () => {
      this.scene.startNextRound();
    });
  }
}
