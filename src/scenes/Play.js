/*
[F0.a] You control a character moving over a 2D grid.
[F0.b] You advance time manually in the turn-based simulation.
[F0.c] You can reap or sow plants on grid cells only when you are near them.
[F0.d] Grid cells have sun and water levels. The incoming sun and water for each cell is somehow randomly generated each turn. Sun energy cannot be stored in a cell (it is used immediately or lost) while water moisture can be slowly accumulated over several turns.
[F0.e] Each plant on the grid has a distinct type (e.g. one of 3 species) and a growth level (e.g. “level 1”, “level 2”, “level 3”).
[F0.f] Simple spatial rules govern plant growth based on sun, water, and nearby plants (growth is unlocked by satisfying conditions).
[F0.g] A play scenario is completed when some condition is satisfied (e.g. at least X plants at growth level Y or above).
*/
class Play extends Phaser.Scene {
  constructor() {
    super("scenePlay");
  }

  init() {
    this.gridConfig = { width: 8, height: 8, size: 40 };
    this.isPlayerTurn = true;
    this.selectedCell = null;
    this.previousSelectedCell = null;
  }

  create() {
    // set background color
    this.cameras.main.setBackgroundColor(0x000000);

    this.grid = new Grid(this, this.gridConfig);

    const cell = this.grid.getCell(0, 0);
    const cellCenter = cell.getCenter();

    this.player = new Player(this, cellCenter.x, cellCenter.y, this.gridConfig);

    // add event listener to end turn button
    document
      .getElementById("endTurnButton")
      .addEventListener("click", () => this.endTurn());

    // add event listener to grid cells
    this.grid.grid.forEach(cell => {
      cell.setInteractive();
      cell.on('pointerdown', () => this.selectCell(cell));
    });

    // initialize buttons
    this.buttons = new ButtonManager(this);

    this.gameState.saveState();

    this.launchGame();
  }

  update() {
    this.player.update();
  }

  updateUI() {
    // prioritize displaying stats of selected cell
    this.grid.selectedCell
      ? this.stats.update(this.grid.selectedCell)
      : this.player.displayCurrentCellStats();

    this.player.updatePlayerDisplay();
  }

  startNextRound() {
    this.grid.step();
    this.updateUI();
    this.gameState.saveState();
  }

  checkWinCondition() {
    if (this.player.resources >= this.RESOURCE_GOAL) {
      this.scene.start("sceneWin", this.trackables);
    }
  }

  launchGame() {
    const savedData = localStorage.getItem(this.local_storage_key);

    // prompt user to continue from auto-save or start new game
    if (savedData && confirm("Do you want to continue where you left off?")) {
      this.gameState.load();
    }
  }
}