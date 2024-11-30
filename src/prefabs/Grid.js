class Grid {
  constructor(scene, gridConfig) {
    // store references
    this.scene = scene;
    this.width = gridConfig.width;
    this.height = gridConfig.height;
    this.size = gridConfig.size;

    // create a map to store cells and their row/col keys
    this.cells = new Map();

    this.BYTES_PER_CELL = 20;
    this.NUM_CELLS = this.width * this.height;

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

  // progress board state according to game's logic
  step() {
    this.cells.forEach((cell) => cell.step());
    this.scene.trackables.turnsPlayed++;
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

  getByteArray() {
    const byteArray = new ArrayBuffer(this.NUM_CELLS * this.BYTES_PER_CELL);
    const dataView = new DataView(byteArray);

    let byteOffset = 0;

    // Loop through each cell in row-major order
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const cell = this.getCell(row, col);

        // write properties to byte array
        dataView.setInt32(byteOffset, cell.buildingRef, true);
        byteOffset += 4;
        dataView.setInt32(byteOffset, cell.level, true);
        byteOffset += 4;
        dataView.setInt32(byteOffset, cell.sunLevel, true);
        byteOffset += 4;
        dataView.setInt32(byteOffset, cell.waterLevel, true);
        byteOffset += 4;
        dataView.setInt32(byteOffset, cell.resources, true);
        byteOffset += 4;
      }
    }

    return byteArray;
  }

  loadByteArray(byteArray) {
    const dataView = new DataView(byteArray);
    let byteOffset = 0;
    const cells = new Map();

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const buildingRef = dataView.getInt32(byteOffset, true);
        byteOffset += 4;
        const level = dataView.getInt32(byteOffset, true);
        byteOffset += 4;
        const sunLevel = dataView.getInt32(byteOffset, true);
        byteOffset += 4;
        const waterLevel = dataView.getInt32(byteOffset, true);
        byteOffset += 4;
        const resources = dataView.getInt32(byteOffset, true);
        byteOffset += 4;

        // restore the cell
        const cell = new Cell(this.scene, row, col, this);
        cell.restore({ buildingRef, level, sunLevel, waterLevel, resources });

        cells.set(this.generateKey(row, col), cell);
      }
    }

    cells.forEach((value, key) => {
      console.log(`Key: ${key}, Value:`, value);
    });

    this.cells = cells;
  }

  arrayBufferToBase64(buffer) {
    const binary = String.fromCharCode(...new Uint8Array(buffer));
    return btoa(binary);
  }

  base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const buffer = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      buffer[i] = binary.charCodeAt(i);
    }

    return buffer.buffer;
  }

  toJSON() {
    const byteArray = this.getByteArray();
    return this.arrayBufferToBase64(byteArray);
  }

  fromJSON(gridData) {
    const byteArray = this.base64ToArrayBuffer(gridData);
    this.loadByteArray(byteArray);
  }
}
