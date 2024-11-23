class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, row, col, grid, texture = "player") {
    // convert logical to pixel for displaying cell
    const { x, y } = grid.logicalToPixelCoords(row, col);

    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // sprite configs
    const converage = 1;

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

    // set player depth to ensure it is above everything else
    this.setDepth(10);

    this.anims.play("idle");

    // spawn player at current cell
    this.movePlayer(0, 0);
  }

  update() {
    this.checkForInput();
  }

  checkForInput() {
    const { KEYS } = this;

    switch (true) {
      case Phaser.Input.Keyboard.JustDown(KEYS.LEFT):
        this.movePlayer(-1, 0);
        break;
      case Phaser.Input.Keyboard.JustDown(KEYS.RIGHT):
        this.movePlayer(1, 0);
        break;
      case Phaser.Input.Keyboard.JustDown(KEYS.UP):
        this.movePlayer(0, -1);
        break;
      case Phaser.Input.Keyboard.JustDown(KEYS.DOWN):
        this.movePlayer(0, 1);
        break;
      default:
        break;
    }
  }

  movePlayer(dRow, dCol) {
    const newRow = this.row + dRow;
    const newCol = this.col + dCol;

    if (this.isValidMove(newRow, newCol)) {
      this.updatePlayerCoordinates(newRow, newCol);

      // display stats of current cell
      const currentCell = this.grid.getCell(newRow, newCol);
      this.scene.stats.update(currentCell);

      // make adjacent cells interactable
      this.updateCellInteractivity();
    }
  }

  updatePlayerCoordinates(newRow, newCol) {
    // update player logical coordinates
    this.row = newRow;
    this.col = newCol;

    // update player pixel coordinates
    const coords = this.grid.logicalToPixelCoords(newRow, newCol);

    this.x = coords.x;
    this.y = coords.y;
  }

  isValidMove(row, col) {
    const isWithinWidth = row >= 0 && row < this.grid.width;
    const isWithinHeight = col >= 0 && col < this.grid.height;

    return isWithinWidth && isWithinHeight;
  }

  spendResources(cost) {
    if (this.resources >= cost) {
      this.resources -= cost;
      this.updateResourceDisplay();
      return true;
    }

    return false;
  }

  updateResourceDisplay() {
    const resourceDisplay = document.getElementById("resourceDisplay");
    resourceDisplay.innerText = `Resources: ${this.resources}`;
  }

  updateCellInteractivity() {
    // disable interactivty on all cells
    this.grid.cells.forEach((cell) => {
      cell.disableClickable();
      cell.disableBorder();
    });

    for (let row = this.row - 1; row < this.row + 2; row++) {
      for (let col = this.col - 1; col < this.col + 2; col++) {
        // skip current cell
        if (row === this.row && col === this.col) continue;

        // check if cell is within bounds
        if (
          row >= 0 &&
          row < this.grid.width &&
          col >= 0 &&
          col < this.grid.height
        ) {
          const cell = this.grid.getCell(row, col);
          cell.setClickable();
        }
      }
    }
  }
}
