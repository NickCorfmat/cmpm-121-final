class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, gridConfig, texture = "player") {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // sprite configs
    const converage = 0.75;

    this.setOrigin(0.5);
    this.setDisplaySize(
      gridConfig.size * converage,
      gridConfig.size * converage
    );

    // store references
    this.scene = scene;
    this.gridConfig = gridConfig;
    this.grid = scene.grid;
    this.x = x;
    this.y = y;

    this.KEYS = scene.scene.get("sceneKeys").KEYS;

    // initialize resources
    this.resources = 100;
    this.updateResourceDisplay();
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

  movePlayer(dx, dy) {
    const newX = this.x + dx * this.gridConfig.size;
    const newY = this.y + dy * this.gridConfig.size;

    if (this.isValidMove(newX, newY)) {
      this.x = newX;
      this.y = newY;

      this.updateCurrentCell();
    }
  }

  isValidMove(x, y) {
    const { width, height, size } = this.gridConfig;

    const isWithinWidth = x >= 0 && x < width * size;
    const isWithinHeight = y >= 0 && y < height * size;

    return isWithinWidth && isWithinHeight;
  }

  updateCurrentCell() {
    if (this.scene.previousCell) {
      this.scene.previousCell.clearTint();
    }

    // get the cell player is standing over
    this.scene.currentCell = this.grid.getCellFromCoordinates(this.x, this.y);
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
