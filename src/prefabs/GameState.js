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
    this.key = this.scene.local_storage_key;
  }

  save() {
    const gameState = {
      grid: this.scene.grid.getByteArrayString(),
      player: this.scene.player.toJSON(),
      trackables: this.scene.trackables,
    };

    localStorage.setItem(this.key, JSON.stringify(gameState));
  }

  load() {
    const savedData = localStorage.getItem(this.key);

    if (savedData) {
      const gameState = JSON.parse(savedData);
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
    if (snapshot) {
      this.scene.grid.loadByteArray(snapshot.grid);
      this.scene.player.fromJSON(snapshot.player);
      this.scene.trackables = { ...snapshot.trackables };
    } else {
      console.log("Trying to load from empty slot!");
    }
  }

  refreshGameScene() {
    const { row, col } = this.scene.player;
    const currentCell = this.scene.grid.getCell(row, col);

    this.scene.stats.update(currentCell);
    this.scene.player.updateCellInteractivity();
    this.scene.player.updateResourceDisplay();
  }
}
