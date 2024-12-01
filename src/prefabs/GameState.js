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

    // initialize 3 save slots
    this.saveStates = [null, null, null];

    this.stateHistory = [];
  }

  save() {
    const snapshot = this.getSnapshot();
    localStorage.setItem(this.key, snapshot);
    this.stateHistory.push(snapshot);
  }

  load() {
    const snapshot = localStorage.getItem(this.key);
    this.loadFromSnapshot(snapshot);
    this.refreshGameScene();
  }

  undo() {}

  redo() {}

  getSnapshot() {
    return JSON.stringify({
      grid: this.scene.grid.toJSON(),
      player: this.scene.player.toJSON(),
      trackables: this.scene.trackables,
    });
  }

  loadFromSnapshot(snapshot) {
    if (snapshot) {
      const gameState = JSON.parse(snapshot);

      this.scene.grid.fromJSON(gameState.grid);
      this.scene.player.fromJSON(gameState.player);
      this.scene.trackables = { ...gameState.trackables };
    } else {
      alert("Trying to load from empty slot!");
    }
  }

  refreshGameScene() {
    const { row, col } = this.scene.player;
    const currentCell = this.scene.grid.getCell(row, col);

    this.scene.stats.update(currentCell);
    this.scene.player.updateCellInteractivity();
    this.scene.player.updatePlayerDisplay();
  }
}
