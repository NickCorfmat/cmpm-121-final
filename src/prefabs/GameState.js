class GameState {
  constructor(scene) {
    this.scene = scene;
    this.key = this.scene.local_storage_key;

    // initialize 3 save slots
    this.saveStates = [null, null, null];

    this.undoStack = [];
    this.redoStack = [];
  }

  save() {
    const snapshot = this.getSnapshot();

    this.undoStack.push(snapshot);
    this.redoStack = [];

    localStorage.setItem(this.key, snapshot);
  }

  load() {
    const snapshot = localStorage.getItem(this.key);
    this.loadFromSnapshot(snapshot);
  }

  undo() {
    if (this.undoStack.length > 0) {
      const snapshot = this.undoStack.pop();
      this.redoStack.push(snapshot);
      const previousState = this.undoStack[this.undoStack.length - 1];

      if (previousState) {
        this.loadFromSnapshot(previousState);
      }
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const snapshot = this.redoStack.pop();
      this.undoStack.push(snapshot);

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
}
