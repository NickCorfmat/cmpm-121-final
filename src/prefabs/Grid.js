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
      this.scene.selectCell(this);
    });
  }

  selectCell() {
    this.border.setVisible(true);
    this.scene.updateStats(this);
  }

  clearSelection() {
    this.border.setVisible(false);
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

    this.border.lineStyle(2, 0x00ff00, 1);
    this.border.strokeRect(
      this.x - this.displayWidth / 2,
      this.y - this.displayHeight / 2,
      this.displayWidth,
      this.displayHeight
    );
    this.border.setVisible(false);
  }
}

class Grid {
  constructor(scene, gridConfig) {
    // store references
    this.scene = scene;
    this.width = gridConfig.width;
    this.height = gridConfig.height;
    this.size = gridConfig.size;

    this.createGrid();
  }

  createGrid() {
    // create a map to store cells and their row/col keys
    this.cells = new Map();

    // loop through grid width and height
    for (let row = 0; row < this.width; row++) {
      for (let col = 0; col < this.height; col++) {
        // draw grid cell
        const cell = new Cell(this.scene, row, col, this);

        // add cell sprite to grid container
        this.cells.set(this.generateKey(row, col), cell);
      }
    }
  }

  getCell(row, col) {
    return this.cells.get(this.generateKey(row, col));
  }

  getCellFromPixelCoords(x, y) {
    const { row, col } = this.pixelToLogicalCoords(x, y);
    return this.getCell(row, col);
  }

  pixelToLogicalCoords(x, y) {
    return {
      row: Math.floor(x / this.size),
      col: Math.floor(y / this.size),
    };
  }

  logicalToPixelCoords(row, col) {
    const x = row * this.size + this.size / 2;
    const y = col * this.size + this.size / 2;

    return { x, y };
  }

  // Extracting key generation to own function idea inspired by Brace
  generateKey(row, col) {
    return `${row}:${col}`;
  }

  updateCellLevels() {
    this.cells.forEach((cell) => {
      cell.updateSunLevel();
      cell.updateWaterLevel();
    });
  }
}
