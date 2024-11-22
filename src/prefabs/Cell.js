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
    this.building = null;

    // initialize sun and water levels
    this.sunLevel = Phaser.Math.Between(1, 5);
    this.waterLevel = 2;

    this.makeClickable();

    // create a graphics object for the border
    this.addBorder();
  }

  makeClickable() {
    this.setInteractive();
    this.on("pointerdown", () => {
      this.grid.selectCell(this.row, this.col);
    });
  }

  updateSunLevel() {
    this.sunLevel = Phaser.Math.Between(1, 5);
  }

  updateWaterLevel() {
    const change = Phaser.Math.Between(-1, 1);
    this.waterLevel = Math.max(0, Math.min(5, this.waterLevel + change));
  }

  addBorder() {
    this.border = this.scene.add.graphics();

    this.border.lineStyle(2, 0x34eba8, 1);
    this.border.strokeRect(
      this.x - this.displayWidth / 2,
      this.y - this.displayHeight / 2,
      this.displayWidth,
      this.displayHeight
    );
    this.border.setVisible(false);
  }

  getLogicalCoords() {
    return { row: this.row, col: this.col };
  }
}
