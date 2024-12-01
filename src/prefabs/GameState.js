class GameState {
  constructor(scene) {
    this.scene = scene;
    this.key = this.scene.local_storage_key;

    // initialize 3 save slots
    this.saveStates = [null, null, null];

    this.stateHistory = [];
    this.currentStateIndex = -1;
  }

  save() {
    console.log("save");
    const snapshot = this.getSnapshot();
    localStorage.setItem(this.key, snapshot);

    this.stateHistory = this.stateHistory.slice(0, this.currentStateIndex + 1);
    this.stateHistory.push(snapshot);
    this.currentStateIndex++;
  }

  load() {
    const snapshot = localStorage.getItem(this.key);
    this.loadFromSnapshot(snapshot);
  }

  undo() {
    if (this.currentStateIndex > 0) {
      this.currentStateIndex--;
      const snapshot = this.stateHistory[this.currentStateIndex];
      this.loadFromSnapshot(snapshot);
    }
  }

  redo() {
    if (this.currentStateIndex < this.stateHistory.length - 1) {
      this.currentStateIndex++;
      const snapshot = this.stateHistory[this.currentStateIndex];
      this.loadFromSnapshot(snapshot);
    }
  }

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

      this.refreshGameScene();
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

  saveState() {
    const snapshot = this.getSnapshot();
    this.stateHistory.push(snapshot);
    this.redoHistory = []; // Clear redo history on new action
  }
}
