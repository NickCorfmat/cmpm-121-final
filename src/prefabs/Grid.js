class Grid {
  constructor(scene, gridConfig) {
    // store references
    this.scene = scene;
    this.width = gridConfig.width;
    this.height = gridConfig.height;
    this.size = gridConfig.size;

    this.selectedCell = null;
    this.lastSelectedCell = null;

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

  selectCell(row, col) {
    this.selectedCell = this.getCell(row, col);

    console.log("-----------------")

    this.selectedCell.border.setVisible(true);

    if (this.lastSelectedCell) {
      this.lastSelectedCell.border.setVisible(false);
    }

    this.lastSelectedCell = this.selectedCell;

    this.scene.stats.update(this.selectedCell);
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
