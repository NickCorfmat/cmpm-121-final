class Grid {
  constructor(scene, gridConfig) {
    // store references
    this.scene = scene;
    this.width = gridConfig.width;
    this.height = gridConfig.height;
    this.size = gridConfig.size;

    // create a map to store cells and their row/col keys
    this.cells = new Map();

    // create DataView object to function as byte array
    this.numItems = this.width * this.height;
    this.bytesPerItem = 8;
    this.BYTE_OFFSET = 4;
    this.buffer = new ArrayBuffer(this.numItems * this.bytesPerItem);
    this.byteArray = new DataView(this.buffer);

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
    for (let i = 0; i < this.numItems; i++) {
      const offset = i * this.bytesPerItem;
      this.changeCellData(offset, this.sunLevel, this.waterLevel);

      const row = Math.floor(i / this.width);
      const col = i % this.width;
      this.createCell(
        row,
        col,
        this.byteArray.getInt32(offset, true),
        this.byteArray.getInt32(offset + this.BYTE_OFFSET, true)
      );
    }
  }

  // append sun and water level to byte array
  changeCellData(offset, sunLevel, waterLevel) {
    this.byteArray.setInt32(offset, sunLevel, true);
    this.byteArray.setInt32(offset + this.BYTE_OFFSET, waterLevel, true);
  }

  createCell(row, col, sunLevel, waterLevel) {
    const cell = new Cell(this.scene, row, col, sunLevel, waterLevel, this);
    this.cells.set(this.generateKey(row, col), cell);
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

  getByteArrayString() {
    // convert byteArray into string for saving to local storage
    return btoa(String.fromCharCode(...new Uint8Array(this.byteArray.buffer)));
  }

  loadByteArray(gridData) {
    // convert string from local storage into byte array
    const arrayBuffer = Uint8Array.from(atob(gridData), (c) =>
      c.charCodeAt(0)
    ).buffer;

    this.byteArray = new DataView(arrayBuffer);
    this.loadCellLevels();
  }

  loadCellLevels() {
    for (let i = 0; i < this.numItems; i++) {
      const offset = i * this.bytesPerItem;

      const row = Math.floor(i / this.width);
      const col = i % this.width;
      this.updateCellObject(offset, row, col);
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

  // update water and sun levels
  // refactoring with help from Brace
  // https://chat.brace.tools/c/cddb0a0d-e4b1-4775-99bb-9d9f5cbf0962
  updateCellLevels() {
    for (let i = 0; i < this.numItems; i++) {
      const offset = i * this.bytesPerItem;

      this.sunLevel = Phaser.Math.Between(1, 5);
      const change = Phaser.Math.Between(-1, 1);
      this.waterLevel = Math.max(0, Math.min(5, this.waterLevel + change));
      this.changeCellData(offset, this.sunLevel, this.waterLevel);

      const row = Math.floor(i / this.width);
      const col = i % this.width;
      this.updateCellObject(offset, row, col);
    }
  }

  // update cell in grid
  updateCellObject(offset, row, col) {
    const cell = this.getCell(row, col);
    const sunLevel = this.byteArray.getInt32(offset, true);
    const waterLevel = this.byteArray.getInt32(offset + this.BYTE_OFFSET, true);

    cell.updateSunLevel(sunLevel);
    cell.updateWaterLevel(waterLevel);
  }
}
