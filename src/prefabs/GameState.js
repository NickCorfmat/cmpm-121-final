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

class GameState {
  constructor(scene) {
    this.scene = scene;
  }

  save() {
    const gameState = {
      grid: this.scene.grid.getByteArrayString(),
      player: this.scene.player.toJSON(),
      trackables: this.scene.trackables,
    };

    localStorage.setItem("saveData", JSON.stringify(gameState));
  }

  load() {
    const savedData = localStorage.getItem("saveData");

    if (savedData) {
      const gameState = JSON.parse(savedData);
      if (!gameState) return null;

      this.loadFromSnapshot(gameState);
    }

    this.refreshGameScene();
  }

  getSnapshot() {
    return {
      grid: this.scene.grid.getByteArrayString(),
      player: this.scene.player.toJSON(),
      trackables: this.scene.trackables,
    };
  }

  loadFromSnapshot(snapshot) {
    this.scene.grid.loadByteArray(snapshot.grid);
    this.scene.player.fromJSON(snapshot.player);
    this.scene.trackables = { ...snapshot.trackables };
  }

  refreshGameScene() {
    const { row, col } = this.scene.player;
    console.log(row, col);
    const currentCell = this.scene.grid.getCell(row, col);

    this.scene.player.updatePlayerCoordinates(row, col);
    this.scene.stats.update(currentCell);
    this.scene.player.updateCellInteractivity();
    this.scene.player.updateResourceDisplay();
  }
}
