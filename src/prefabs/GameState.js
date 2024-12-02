class GameState {
  constructor(scene) {
    this.scene = scene;

    this.stateHistory = [];
    this.stateIndex = -1;
  }

  save() {
    const snapshot = this.getBoardSnapshot();
    localStorage.setItem("AUTO_SAVE", snapshot);

    this.stateHistory = this.stateHistory.slice(0, this.stateIndex + 1);
    this.stateHistory.push(snapshot);
    this.stateIndex++;

    this.saveUndoHistory("AUTO_SAVE_HISTORY");
  }

  load() {
    const snapshot = localStorage.getItem("AUTO_SAVE");
    this.loadBoardSnapshot(snapshot);

    this.loadUndoHistory("AUTO_SAVE");
  }

  undo() {
    if (this.stateIndex > 0) {
      this.stateIndex--;
      const snapshot = this.stateHistory[this.stateIndex];
      this.loadBoardSnapshot(snapshot);
    }
  }

  redo() {
    if (this.stateIndex < this.stateHistory.length - 1) {
      this.stateIndex++;
      const snapshot = this.stateHistory[this.stateIndex];
      this.loadBoardSnapshot(snapshot);
    }
  }

  getBoardSnapshot() {
    return JSON.stringify({
      grid: this.scene.grid.toJSON(),
      player: this.scene.player.toJSON(),
      trackables: this.scene.trackables,
    });
  }

  loadBoardSnapshot(snapshot) {
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

  saveUndoHistory(key) {
    const undoHistorySnapshot = JSON.stringify({
      stateHistory: this.stateHistory,
      stateIndex: this.stateIndex,
    });


    localStorage.setItem(key, undoHistorySnapshot);
  }

  loadUndoHistory(key) {
    const undoHistorySnapshot = localStorage.getItem(key);

    if (undoHistorySnapshot) {
      const history = JSON.parse(undoHistorySnapshot)
      this.stateHistory = history.stateHistory;
      this.stateIndex = history.stateIndex;
    }
  }

  saveToSlot(slot) {
    const snapshot = this.getBoardSnapshot();
    localStorage.setItem(`SLOT_${slot}`, snapshot);

    this.saveUndoHistory(`SLOT_${slot}_HISTORY`);
  }

  loadFromSlot(slot) {
    const snapshot = localStorage.getItem(`SLOT_${slot}`);
    this.loadBoardSnapshot(snapshot);

    this.loadUndoHistory(`SLOT_${slot}_HISTORY`);
  }

  refreshGameScene() {
    const { row, col } = this.scene.player;
    const currentCell = this.scene.grid.getCell(row, col);

    this.scene.stats.update(currentCell);
    this.scene.player.updateCellInteractivity();
    this.scene.player.updatePlayerDisplay();
  }
}
