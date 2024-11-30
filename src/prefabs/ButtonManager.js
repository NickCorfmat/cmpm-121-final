// Source: Brace helped refactor ButtonManager to adopt a state approach to
// displaying save/load buttons, along with their respective slot buttons.

class ButtonManager {
  constructor(scene) {
    this.scene = scene;
    this.state = "main";

    // create game buttons
    this.initButtons();
  }

  initButtons() {
    // create Save/Load buttons
    this.createButton("saveButton", () => this.showSlot("save"));
    this.createButton("loadButton", () => this.showSlot("load"));

    // create Save/Load slot buttons
    for (let i = 0; i < this.scene.saveStates.length; i++) {
      this.createButton(`saveSlot${i}`, () => this.handleSaveSlot(i));
      this.createButton(`loadSlot${i}`, () => this.handleLoadSlot(i));
    }

    // create "exit slots" button
    this.createButton("exitButton", () => this.returnToMain());

    // create player action buttons
    this.createPurchaseButtons();
    this.createNextRoundButton();

    this.updateUI();
  }

  showSlot(type) {
    this.state = type;
    this.updateUI();
  }

  handleSaveSlot(slot) {
    const snapshot = this.scene.gameState.getSnapshot();
    this.scene.saveStates[slot] = snapshot;

    //alert(`Game saved successfully to slot: ${slot + 1}`);

    this.returnToMain();
  }

  handleLoadSlot(slot) {
    const snapshot = this.scene.saveStates[slot];
    this.scene.gameState.loadFromSnapshot(snapshot);

    this.returnToMain();
  }

  returnToMain() {
    this.state = "main";
    this.updateUI();
  }

  updateUI() {
    const isMain = this.state === "main";
    const isSave = this.state === "save";
    const isLoad = this.state === "load";

    this.toggleVisibility(["saveButton", "loadButton"], isMain);
    this.toggleVisibility(["saveSlot0", "saveSlot1", "saveSlot2"], isSave);
    this.toggleVisibility(["loadSlot0", "loadSlot1", "loadSlot2"], isLoad);
    this.toggleVisibility(["exitButton"], isSave || isLoad);
  }

  createPurchaseButtons() {
    // create purchase buttons for each building type
    this.scene.BUILDINGS.forEach((building) => {
      const id = `buy${building.type}Button`;
      const text = `Buy ${building.type}: $${building.cost}`;

      this.createButton(id, () => this.purchaseBuilding(building.type), text);
      this.toggleVisibility([id], true); // always show
    });
  }

  purchaseBuilding(type) {
    // retrieve building config based on building type. Source: Brace
    const buildingConfig = this.scene.BUILDINGS.find((b) => b.type === type);
    const grid = this.scene.grid;

    // place building in selected cell
    if (this.canPlaceBuilding(buildingConfig.cost)) {
      this.scene.player.spendResources(buildingConfig.cost);

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
      this.scene.player.updateResourceDisplay();
    }
  }

  canPlaceBuilding(cost) {
    return (
      this.scene.grid.selectedCell &&
      this.scene.player.resources >= cost &&
      !this.scene.grid.selectedCell.building
    );
  }

  createNextRoundButton() {
    const button = document.getElementById("nextRoundButton");

    button.addEventListener("click", () => {
      this.scene.startNextRound();
    });
  }

  // Helpers
  createButton(id, handler, text) {
    const button = document.getElementById(id);

    if (text) button.innerHTML = text;
    button.className = "hidden";
    button.onclick = handler;
  }

  toggleVisibility(ids, show) {
    ids.forEach((id) => {
      const element = document.getElementById(id);
      element.classList.toggle("hidden", !show);
    });
  }
}
