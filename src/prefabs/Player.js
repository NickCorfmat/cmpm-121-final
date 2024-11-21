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
    this.KEYS = scene.scene.get("sceneKeys").KEYS;

    // initialize resources
    this.resources = 100;
    this.updateResourceDisplay();

    this.setDepth(10);
  }

  update() {
    this.checkForInput();
  }

  checkForInput() {
    const { KEYS } = this;

    if (KEYS.LEFT.isDown) {
      this.movePlayer(-1, 0);
    } else if (KEYS.RIGHT.isDown) {
      this.movePlayer(1, 0);
    } else if (KEYS.UP.isDown) {
      this.movePlayer(0, -1);
    } else if (KEYS.DOWN.isDown) {
      this.movePlayer(0, 1);
    }
  }

  movePlayer(dx, dy) {
    const newX = this.x + dx * this.gridConfig.size;
    const newY = this.y + dy * this.gridConfig.size;

    if (this.isValidMove(newX, newY)) {
      this.x = newX;
      this.y = newY;

      this.scene.isPlayerTurn = false;
    }
  }

  isValidMove(x, y) {
    const { width, height, size } = this.gridConfig;

    const isWithinWidth = x >= 0 && x < width * size;
    const isWithinHeight = y >= 0 && y < height * size;

    return isWithinWidth && isWithinHeight;
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
    document.getElementById('resourceDisplay').innerText = `Resources: ${this.resources}`;
  }
}