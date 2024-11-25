class Grid {
  constructor(scene, gridConfig) {
    // store references
    this.scene = scene;
    this.width = gridConfig.width;
    this.height = gridConfig.height;
    this.size = gridConfig.size;

    // create a map to store cells and their row/col keys
    this.cells = new Map();

    // create DataView object to serve as byte array
    this.numItems = this.width * this.height;
    this.bytesPerItem = 8;
    this.buffer = new ArrayBuffer(this.numItems * this.bytesPerItem);
    this.byteArray = new DataView(this.buffer);

    this.sunLevel = 0;
    this.waterLevel = 2;

    // track cell selection
    this.selectedCell = null;
    this.lastSelectedCell = null;

    this.createGrid();
  }

  createGrid() {
    let row = 0;
    let col = 0;
    for (let i = 0; i < this.numItems; i++) {
      const offset = i * this.bytesPerItem;
      // append sun and water level to byte array
      this.byteArray.setInt32(offset, this.sunLevel, true);
      this.byteArray.setInt32(offset + 4, this.waterLevel, true);

      this.createCell(offset, row, col);

      col++;
      if (col >= 8) {
        col = 0;
        row++;
      }
    }
  }

  createCell(offset, row, col) {
    const cell = new Cell(
      this.scene,
      row,
      col,
      this.byteArray.getInt32(offset, true),
      this.byteArray.getInt32(offset + 4, true),
      this
    );
    this.cells.set(this.generateKey(row, col), cell);
  }

  selectCell(row, col) {
    // retrieve selected cell
    const cell = this.getCell(row, col);

    // select cell only if game deems it selectable
    if (cell.isClickable) {
      this.selectedCell = cell;
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
    // update byte array
    let row = 0;
    let col = 0;
    for (let i = 0; i < this.numItems; i++) {
      const offset = i * this.bytesPerItem;

      this.sunLevel = Phaser.Math.Between(1, 5);
      this.byteArray.setInt32(offset, this.sunLevel, true);

      const change = Phaser.Math.Between(-1, 1);
      this.waterLevel = Math.max(0, Math.min(5, this.waterLevel + change));
      this.byteArray.setInt32(offset + 4, this.waterLevel, true);

      // update cell in grid
      const cell = this.getCell(row, col);
      cell.updateSunLevel(this.byteArray.getInt32(offset, true));
      cell.updateWaterLevel(this.byteArray.getInt32(offset + 4, true));

      col++;
      if (col >= 8) {
        col = 0;
        row++;
      }
    }
  }
}
