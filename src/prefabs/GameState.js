class GameState {
  constructor(scene) {
    this.scene = scene;

    this.stateHistory = [];
    this.currentStateIndex = -1;
  }

  save() {
    console.log("auto-save");
    const snapshot = this.getSnapshot();
    console.log(snapshot);
    localStorage.setItem("AUTO_SAVE", snapshot);

    this.stateHistory = this.stateHistory.slice(0, this.currentStateIndex + 1);
    this.stateHistory.push(snapshot);
    this.currentStateIndex++;
  }

  load() {
    const snapshot = localStorage.getItem("AUTO_SAVE");
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

  saveToSlot(slot) {
    console.log(`saved to slot: ${slot}`);
    const snapshot = this.getSnapshot();
    localStorage.setItem(`SLOT_${slot}`, snapshot);
  }

  loadFromSlot(slot) {
    console.log(`loaded from slot: ${slot}`);
    const snapshot = localStorage.getItem(`SLOT_${slot}`);
    this.loadFromSnapshot(snapshot);
  }

  refreshGameScene() {
    const { row, col } = this.scene.player;
    const currentCell = this.scene.grid.getCell(row, col);

    this.scene.stats.update(currentCell);
    this.scene.player.updateCellInteractivity();
    this.scene.player.updatePlayerDisplay();
  }
}
