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
  }

  endTurn() {
    this.isPlayerTurn = true;
    // Add logic for advancing time and updating grid cells
  }

  update() {
    if (this.isPlayerTurn) {
      this.player.update();
    }
  }
}
