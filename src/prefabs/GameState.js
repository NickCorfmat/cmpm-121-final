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
    this.saveState(); // Save the current state to the history
  }

  load() {
    const snapshot = localStorage.getItem(this.key);
    this.loadFromSnapshot(snapshot);
  }

  undo() {
    console.log("Undo called");
    console.log("State history length before undo:", this.stateHistory.length);
    console.log("Redo history length before undo:", this.redoHistory.length);

    if (this.stateHistory.length > 1) {
      const currentState = this.stateHistory.pop();
      this.redoHistory.push(currentState);
      const previousState = this.stateHistory[this.stateHistory.length - 1];
      this.loadFromSnapshot(previousState);
      this.scene.stats.update(this.scene.grid.selectedCell);
    }

    console.log("State history length after undo:", this.stateHistory.length);
    console.log("Redo history length after undo:", this.redoHistory.length);
  }

  redo() {
    console.log("Redo called");
    console.log("State history length before redo:", this.stateHistory.length);
    console.log("Redo history length before redo:", this.redoHistory.length);

    if (this.redoHistory.length > 0) {
      const nextState = this.redoHistory.pop();
      this.stateHistory.push(nextState);
      this.loadFromSnapshot(nextState);
      this.scene.stats.update(this.scene.grid.selectedCell);
    }

    console.log("State history length after redo:", this.stateHistory.length);
    console.log("Redo history length after redo:", this.redoHistory.length);
  }

  getSnapshot() {
    return JSON.stringify({
      grid: this.scene.grid.toJSON(),
      player: this.scene.player.toJSON(),
      trackables: this.scene.trackables,
      stateHistory: this.stateHistory,
      redoHistory: this.redoHistory,
    });
  }

  loadFromSnapshot(snapshot) {
    if (snapshot) {
      const gameState = JSON.parse(snapshot);

      console.log("Loading snapshot:", gameState);

      this.scene.grid.fromJSON(gameState.grid);
      this.scene.player.fromJSON(gameState.player);
      this.scene.trackables = { ...gameState.trackables };
      this.stateHistory = gameState.stateHistory || [];
      this.redoHistory = gameState.redoHistory || [];

      this.refreshGameScene();
    } else {
      alert("Trying to load from empty slot!");
    }
  }

  refreshGameScene() {
    const { row, col } = this.scene.player;
    const currentCell = this.scene.grid.getCell(row, col);

    this.scene.grid.selectedCell = currentCell; // Ensure selectedCell is set
    this.scene.stats.update(currentCell);
    this.scene.player.updateCellInteractivity();
    this.scene.player.updatePlayerDisplay();
  }

  saveState() {
    const snapshot = this.getSnapshot();
    this.stateHistory.push(snapshot);
    this.redoHistory = []; // Clear redo history on new action
  }

  loadStateHistory(snapshot) {
    this.stateHistory = [snapshot];
    this.redoHistory = [];
  }
}
