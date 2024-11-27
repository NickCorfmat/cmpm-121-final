class Save {
  constructor(scene, player, grid) {
    this.scene = scene;
    this.player = player;
    this.grid = grid;

    this.saveGame();
  }

  saveGame() {
    /* TO SAVE:
     * placer location
     * resources
     * turns
     * buildings placed
     * grid data (sun levels, water levels)
     *
     * TODO:
     * every placed building and their collected resources
     */
    const gameState = {
      playerRow: this.player.row,
      playerCol: this.player.col,
      totalResources: this.player.resources,
      resourcesCollected: this.scene.resourcesCollected,
      turnsPlayed: this.scene.turnsPlayed,
      buildingsPlaced: this.scene.buildingsPlaced,
      gridData: this.grid.getByteArrayString(),
    };
    localStorage.setItem("saveData", JSON.stringify(gameState));
  }

  loadGame() {
    const data = JSON.parse(localStorage.getItem("saveData"));

    this.player.row = data.playerRow;
    this.player.col = data.playerCol;
    this.player.resources = data.totalResources;
    this.scene.resourcesCollected = data.resourcesCollected;
    this.scene.turnsPlayed = data.turnsPlayed;
    this.scene.buildingsPlaced = data.buildingsPlaced;
    this.grid.loadByteArray(data.gridData);
    this.player.updatePlayerCoordinates(this.player.row, this.player.col);

    // display stats of current cell
    const currentCell = this.grid.getCell(this.player.row, this.player.col);
    this.scene.stats.update(currentCell);
    // make adjacent cells interactable
    this.player.updateCellInteractivity();

    this.player.updateResourceDisplay();
  }
}
