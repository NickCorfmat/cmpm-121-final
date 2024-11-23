class Grid {
  constructor(scene, gridConfig) {
    // store references
    this.scene = scene;
    this.width = gridConfig.width;
    this.height = gridConfig.height;
    this.size = gridConfig.size;

    // create a map to store cells and their row/col keys
    this.cells = new Map();

    // track cell selection
    this.selectedCell = null;
    this.lastSelectedCell = null;

    this.createGrid();
  }

  createGrid() {
    // loop through each cell in the grid
    for (let row = 0; row < this.width; row++) {
      for (let col = 0; col < this.height; col++) {
        // initialize cell and append it to grid map
        const cell = new Cell(this.scene, row, col, this);
        this.cells.set(this.generateKey(row, col), cell);
      }
    }
  }

  selectCell(row, col) {
    // retrieve selected cell
    this.selectedCell = this.getCell(row, col);

    // select cell only if game deems it selectable
    if (this.selectedCell.isClickable) {
      this.selectedCell.enableBorder();

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
