class ButtonManager {
  constructor(scene, buildings, player) {
    this.scene = scene;
    this.buildings = buildings;
    this.player = player;

    // create game buttons
    this.createSaveButton();
    this.createLoadButton();
    this.createSaveSlots();
    this.createLoadSlots();
    this.createPurchaseButtons();
    this.createNextRoundButton();
  }

  createPurchaseButtons() {
    // create purchase buttons for each building type
    this.buildings.forEach((building) => {
      const button = document.getElementById("buy" + building.type + "Button");
      button.innerText = `Buy ${building.type}: $${building.cost}`;

      // purchase building on click
      button.addEventListener("click", () => {
        this.purchaseBuilding(building.type);
      });
    });
  }

  purchaseBuilding(type) {
    // retrieve building config based on building type. Source: Brace
    const buildingConfig = this.buildings.find((b) => b.type === type);
    const grid = this.scene.grid;

    // place building in selected cell
    if (this.canPlaceBuilding(buildingConfig.cost)) {
      this.player.spendResources(buildingConfig.cost);

      const { row, col } = grid.selectedCell.getLogicalCoords();

      // assign building to selected cell
      grid.selectedCell.building = new Building(
        this.scene,
        row,
        col,
        grid,
        buildingConfig
      );

      // update game stats
      this.scene.trackables.buildingsPlaced++;
      this.scene.stats.update(grid.selectedCell);
      this.player.updateResourceDisplay();
    }
  }

  canPlaceBuilding(cost) {
    return (
      this.scene.grid.selectedCell &&
      this.player.resources >= cost &&
      !this.scene.grid.selectedCell.building
    );
  }

  createNextRoundButton() {
    const button = document.getElementById("nextRoundButton");

    button.addEventListener("click", () => {
      this.scene.startNextRound();
    });
  }

  createSaveButton() {
    const button = document.getElementById("saveButton");

    button.addEventListener("click", () => {
      this.displaySaveSlots();
    });
  }

  createLoadButton() {
    const button = document.getElementById("loadButton");

    button.addEventListener("click", () => {
      this.displayLoadSlots();
    });
  }

  createSaveSlots() {
    for (let slot = 0; slot < this.scene.saveStates.length; slot++) {
      const slotButton = document.getElementById(`saveFile${slot}`);
      this.hideElements([`saveFile${slot}`]);

      slotButton.addEventListener("click", () => {
        this.saveToSlot(slot);
      });
    }
  }

  createLoadSlots() {
    for (let slot = 0; slot < this.scene.saveStates.length; slot++) {
      const slotButton = document.getElementById(`loadFile${slot}`);
      this.hideElements([`loadFile${slot}`]);

      slotButton.addEventListener("click", () => {
        this.loadFromSlot(slot);
      });
    }
  }

  displaySaveSlots() {
    this.hideElements(["saveButton", "loadButton"]);
    this.showElements(["saveFile0", "saveFile1", "saveFile2"]);
  }

  displayLoadSlots() {
    this.hideElements(["saveButton", "loadButton"]);
    this.showElements(["loadFile0", "loadFile1", "loadFile2"]);
  }

  saveToSlot(slot) {
    console.log("Saved to slot: " + slot);
    const snapshot = this.scene.gameState.getSnapshot();
    this.scene.saveStates[slot] = snapshot;

    this.hideElements(["saveFile0", "saveFile1", "saveFile2"]);
    this.showElements(["saveButton", "loadButton"]);
  }

  loadFromSlot(slot) {
    console.log("Loaded from slot: " + slot);
    const snapshot = this.scene.saveStates[slot];
    this.scene.gameState.loadFromSnapshot(snapshot);

    this.hideElements(["loadFile0", "loadFile1", "loadFile2"]);
    this.showElements(["saveButton", "loadButton"]);
  }

  // Helpers

  // Source: Brace, https://chat.brace.tools/c/c8b149e6-dcc5-4e61-836d-c184f3fa7ef5
  hideElements(ids) {
    ids.forEach((id) => {
      const element = document.getElementById(id);

      // hide element
      if (element) {
        element.classList.add("hidden");
      }
    });
  }

  showElements(ids) {
    ids.forEach((id) => {
      const element = document.getElementById(id);

      // show element
      if (element) {
        element.classList.remove("hidden");
      }
    });
  }
}
