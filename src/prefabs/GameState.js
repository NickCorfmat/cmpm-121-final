class GameState {
  constructor(scene) {
    this.scene = scene;

    this.save();
  }

  save() {
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
      grid: this.scene.grid.getByteArrayString(),
      player: this.scene.player.toJSON(),
      trackables: this.scene.trackables,
    };

    localStorage.setItem("saveData", JSON.stringify(gameState));
    console.log(JSON.stringify(gameState));
  }

  load() {
    const savedData = localStorage.getItem("saveData");

    if (savedData) {
      const gameState = JSON.parse(savedData);
      if (!gameState) return null;

      this.scene.grid.loadByteArray(gameState.grid);
      this.scene.player.fromJSON(gameState.player);
      this.scene.trackables = { ...gameState.trackables };
    }

    this.refreshGameScene();
  }

  refreshGameScene() {
    const { row, col } = this.scene.player;
    const currentCell = this.grid.getCell(row, col);

    this.scene.player.updatePlayerCoordinates(row, col);
    this.scene.stats.update(currentCell);
    this.player.updateCellInteractivity();
    this.player.updateResourceDisplay();
  }
}
