class Grid {
  constructor(scene, gridConfig) {
    // store references
    this.scene = scene;
    this.width = gridConfig.width;
    this.height = gridConfig.height;
    this.size = gridConfig.size;

    // create a map to store cells and their row/col keys
    this.cells = new Map();

    this.BYTES_PER_CELL = 12; // 4 bytes each for sunLevel, waterLevel, and buildingIndex
    this.NUM_CELLS = this.width * this.height;

    this.sunLevel = 0;
    this.waterLevel = 2;

    // track cell selection
    this.selectedCell = null;
    this.lastSelectedCell = null;

    this.createGrid();
  }

  // refactoring with help from Brace
  // https://chat.brace.tools/c/cddb0a0d-e4b1-4775-99bb-9d9f5cbf0962
  createGrid() {
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const cell = new Cell(this.scene, row, col, this);
        this.cells.set(this.generateKey(row, col), cell);
      }
    }
  }

  // Update all cells' levels randomly (example game logic)
  updateCellLevels() {
    for (let [key, cell] of this.cells.entries()) {
      cell.sunLevel = Phaser.Math.Between(1, 5);
      cell.waterLevel = Phaser.Math.Between(0, 5);
    }
  }

  selectCell(row, col) {
    // retrieve selected cell
    const cell = this.getCell(row, col);

    // select cell only if game deems it selectable
    if (cell.isClickable) {
      this.selectedCell = cell;
      this.selectedCell.enableBorder();

      if (this.selectedCell === this.lastSelectedCell) {
        // deselect cell if previously selected
        if (this.selectedCell) this.selectedCell.disableBorder();
        if (this.lastSelectedCell) this.lastSelectedCell.disableBorder();

        this.selectedCell = null;
        this.lastSelectedCell = null;
      } else {
        // unhighlight previously selected cell
        if (this.lastSelectedCell) {
          this.lastSelectedCell.disableBorder();
        }

        // update cell selection tracking
        this.lastSelectedCell = this.selectedCell;

        // display stats of currently selected cell
        this.scene.stats.update(this.selectedCell);
      }
    }
  }

  // Extracting key generation to own function idea inspired by Brace
  generateKey(row, col) {
    return `${row}:${col}`;
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

  getByteArray() {}

  loadByteArray(byteArray) {}

  toJSON() {}

  fromJSON(state) {}
}
