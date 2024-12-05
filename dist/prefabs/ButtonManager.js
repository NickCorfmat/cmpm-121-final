"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonManager = void 0;
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
        for (let i = 1; i <= 3; i++) {
            this.createButton(`saveSlot${i}`, () => this.handleSaveSlot(i));
            this.createButton(`loadSlot${i}`, () => this.handleLoadSlot(i));
        }
        // create "exit slots" button
        this.createButton("exitButton", () => this.returnToMain());
        // create player action buttons
        this.createPurchaseButtons();
        this.createNextRoundButton();
        this.createUndoButton();
        this.createRedoButton();
        this.updateUI();
    }
    showSlot(type) {
        this.state = type;
        this.updateUI();
    }
    handleSaveSlot(slot) {
        this.scene.gameState.saveToSlot(slot);
        this.returnToMain();
    }
    handleLoadSlot(slot) {
        this.scene.gameState.loadFromSlot(slot);
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
        this.toggleVisibility(["saveSlot1", "saveSlot2", "saveSlot3"], isSave);
        this.toggleVisibility(["loadSlot1", "loadSlot2", "loadSlot3"], isLoad);
        this.toggleVisibility(["exitButton"], isSave || isLoad);
        this.toggleVisibility(["undoButton"], !isSave && !isLoad);
        this.toggleVisibility(["redoButton"], !isSave && !isLoad);
    }
    createPurchaseButtons() {
        // create purchase buttons for each building type
        this.scene.buildings.forEach((building, index) => {
            const id = `buy${building.type}Button`;
            const text = `Buy ${building.type}: $${building.cost}`;
            this.createButton(id, () => this.purchaseBuilding(index), text);
            this.toggleVisibility([id], true); // always show
        });
    }
    purchaseBuilding(index) {
        var _a;
        const building = this.scene.buildings[index];
        const { grid, player, gameState, stats, trackables } = this.scene;
        if (this.canPlaceBuilding(building.cost)) {
            player.spendResources(building.cost);
            // place building
            (_a = grid.selectedCell) === null || _a === void 0 ? void 0 : _a.setBuilding(index);
            // update game stats
            trackables.buildingsPlaced++;
            stats.update(grid.selectedCell);
            player.updatePlayerDisplay();
            gameState.save();
        }
    }
    canPlaceBuilding(cost) {
        return (this.scene.grid.selectedCell != null &&
            this.scene.player.resources >= cost &&
            this.scene.grid.selectedCell.buildingRef < 0);
    }
    createNextRoundButton() {
        const button = document.getElementById("nextRoundButton");
        button === null || button === void 0 ? void 0 : button.addEventListener("click", () => {
            this.scene.startNextRound();
        });
    }
    createUndoButton() {
        const undoButton = document.getElementById("undoButton");
        undoButton === null || undoButton === void 0 ? void 0 : undoButton.addEventListener("click", () => {
            this.scene.gameState.undo();
        });
    }
    createRedoButton() {
        const redoButton = document.getElementById("redoButton");
        redoButton === null || redoButton === void 0 ? void 0 : redoButton.addEventListener("click", () => {
            this.scene.gameState.redo();
        });
    }
    // Helpers
    createButton(id, handler, text) {
        const button = document.getElementById(id);
        if (button) {
            if (text)
                button.innerHTML = text;
            button.className = "hidden";
            button.onclick = handler;
        }
    }
    toggleVisibility(ids, show) {
        ids.forEach((id) => {
            const element = document.getElementById(id);
            element === null || element === void 0 ? void 0 : element.classList.toggle("hidden", !show);
        });
    }
}
exports.ButtonManager = ButtonManager;
//# sourceMappingURL=ButtonManager.js.map