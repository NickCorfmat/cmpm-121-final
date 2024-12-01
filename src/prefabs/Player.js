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

        // set player depth to ensure it is above everything else
        this.setDepth(10);
    }

    update() {
        this.checkForInput();
    }

    checkForInput() {
        const { KEYS } = this;

    switch (true) {
      case Phaser.Input.Keyboard.JustDown(KEYS.LEFT):
        this.movePlayer(-1, 0);
        this.scene.gameState.saveState();
        break;
      case Phaser.Input.Keyboard.JustDown(KEYS.RIGHT):
        this.movePlayer(1, 0);
        this.scene.gameState.saveState();
        break;
      case Phaser.Input.Keyboard.JustDown(KEYS.UP):
        this.movePlayer(0, -1);
        this.scene.gameState.saveState();
        break;
      case Phaser.Input.Keyboard.JustDown(KEYS.DOWN):
        this.movePlayer(0, 1);
        this.scene.gameState.saveState();
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

      this.displayCurrentCellStats();

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