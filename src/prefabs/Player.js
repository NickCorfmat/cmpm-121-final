class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, gridConfig, texture = "player") {
    super(scene, x, y, texture);
    scene.add.existing(this);

    // store references
    this.scene = scene;
    this.gridConfig = gridConfig;
    this.KEYS = scene.scene.get("sceneKeys").KEYS;

    // sprite configs
    this.setOrigin(0);
    this.setScale(2);
  }

  update() {
    this.checkForInput();
  }

  checkForInput() {
    const { KEYS } = this;

    if (KEYS.LEFT.isDown) {
      this.moveCharacter(-1, 0);
    } else if (KEYS.RIGHT.isDown) {
      this.moveCharacter(1, 0);
    } else if (KEYS.UP.isDown) {
      this.moveCharacter(0, -1);
    } else if (KEYS.DOWN.isDown) {
      this.moveCharacter(0, 1);
    }
  }

  moveCharacter(dx, dy) {
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
}
