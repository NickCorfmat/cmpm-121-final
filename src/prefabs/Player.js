class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, row, col, grid, texture = "player") {
    // convert logical to pixel for displaying cell
    const { x, y } = grid.logicalToCoordinates(row, col);

    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // sprite configs
    const converage = 0.75;

    this.setOrigin(0.5);
    this.setDisplaySize(grid.size * converage, grid.size * converage);

    // store references
    this.scene = scene;
    this.grid = grid;
    this.row = row; // player logical coords
    this.col = col;
    this.x = x; // player pixel coords
    this.y = y;

    this.KEYS = scene.scene.get("sceneKeys").KEYS;

    // initialize resources
    this.resources = 100;
    this.updateResourceDisplay();

    // spawn player at current cell
    this.movePlayer(0, 0);
  }

  update() {
    this.checkForInput();
  }

  checkForInput() {
    const { KEYS } = this;

    if (Phaser.Input.Keyboard.JustDown(KEYS.LEFT)) {
      this.movePlayer(-1, 0);
    } else if (Phaser.Input.Keyboard.JustDown(KEYS.RIGHT)) {
      this.movePlayer(1, 0);
    } else if (Phaser.Input.Keyboard.JustDown(KEYS.UP)) {
      this.movePlayer(0, -1);
    } else if (Phaser.Input.Keyboard.JustDown(KEYS.DOWN)) {
      this.movePlayer(0, 1);
    }
  }

  movePlayer(dRow, dCol) {
    const newRow = this.row + dRow;
    const newCol = this.col + dCol;

    if (this.isValidMove(newRow, newCol)) {
      this.row = newRow;
      this.col = newCol;

      // update player pixel coordinates
      const coords = this.grid.logicalToCoordinates(this.row, this.col);
      this.x = coords.x;
      this.y = coords.y;

      this.updateCurrentCell();
    }
  }

  isValidMove(row, col) {
    const isWithinWidth = row >= 0 && row < this.grid.width;
    const isWithinHeight = col >= 0 && col < this.grid.height;

    return isWithinWidth && isWithinHeight;
  }

  updateCurrentCell() {
    if (this.scene.previousCell) {
      this.scene.previousCell.clearTint();
    }

    // get the cell player is standing over
    this.scene.currentCell = this.grid.getCell(this.row, this.col);
    this.scene.currentCell.selectCell();

    this.scene.previousCell = this.scene.currentCell;
  }

  canAfford(cost) {
    return this.resources >= cost;
  }

  spendResources(cost) {
    if (this.canAfford(cost)) {
      this.resources -= cost;
      this.updateResourceDisplay();
      return true;
    }
    return false;
  }

  updateResourceDisplay() {
    document.getElementById(
      "resourceDisplay"
    ).innerText = `Resources: ${this.resources}`;
  }
}
