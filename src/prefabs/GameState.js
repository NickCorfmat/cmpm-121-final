class GameState {
  constructor(scene) {
    this.scene = scene;
    this.key = this.scene.local_storage_key;

    // initialize 3 save slots
    this.saveStates = [null, null, null];

    this.stateHistory = [];
    this.redoHistory = [];
  }

  save() {
    const snapshot = this.getSnapshot();
    localStorage.setItem(this.key, snapshot);
  }

  load() {
    const snapshot = localStorage.getItem(this.key);
    this.loadFromSnapshot(snapshot);
  }

  undo() {
    if (this.stateHistory.length > 1) {
      const currentState = this.stateHistory.pop();
      this.redoHistory.push(currentState);
      const previousState = this.stateHistory[this.stateHistory.length - 1];
      this.loadFromSnapshot(previousState);
      this.scene.stats.update(this.scene.grid.selectedCell);
    }
  }

  redo() {
    if (this.redoHistory.length > 0) {
      const nextState = this.redoHistory.pop();
      this.stateHistory.push(nextState);
      this.loadFromSnapshot(nextState);
      this.scene.stats.update(this.scene.grid.selectedCell);
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
