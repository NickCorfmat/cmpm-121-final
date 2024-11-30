class Cell extends Phaser.GameObjects.Sprite {
  constructor(scene, row, col, grid, texture = "cell") {
    // convert logical to pixel for displaying cell
    const { x, y } = grid.logicalToPixelCoords(row, col);

    super(scene, x, y, texture);
    scene.add.existing(this);

    // sprite configs
    this.setOrigin(0.5);
    this.setDisplaySize(grid.size, grid.size);

    // store references
    this.scene = scene;
    this.row = row;
    this.col = col;
    this.grid = grid;

    // cell game state
    this.buildingRef = -1; // default: no building
    this.level = 0;
    this.sunLevel = 0;
    this.waterLevel = 0;

    this.isClickable = false;

    // cell properties/behaviors
    this.createBorder();
    this.enableMouseEvents();
  }

  createBorder() {
    this.border = this.scene.add.graphics();

    // set border appearance
    this.border.lineStyle(2, 0x34eba8, 1);
    this.border.strokeRect(
      this.x - this.displayWidth / 2,
      this.y - this.displayHeight / 2,
      this.displayWidth,
      this.displayHeight
    );

    // hide border when created
    this.disableBorder();
  }

  enableMouseEvents() {
    this.setInteractive();
    this.on("pointerdown", () => {
      this.grid.selectCell(this.row, this.col);
    });
  }

  // Getters/Setters

  setSunLevel(value) {
    // only store sun level if cell is occupied
    if (this.hasBuilding()) {
      this.sunLevel = value;
    }
  }

  setWaterLevel(value) {
    this.waterLevel = value;
  }

  setClickable() {
    this.isClickable = true;
  }

  disableClickable() {
    this.isClickable = false;
  }

  enableBorder() {
    this.border.setVisible(true);
  }

  disableBorder() {
    this.border.setVisible(false);
  }

  // Helpers

  hasBuilding() {
    return this.buildingRef >= 0;
  }

  getLogicalCoords() {
    return { row: this.row, col: this.col };
  }
}
