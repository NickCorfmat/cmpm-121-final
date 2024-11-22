class Cell extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, size, texture = "cell") {
    super(scene, x * size, y * size, texture);
    scene.add.existing(this);

    // sprite configs
    this.setOrigin(0);
    this.setDisplaySize(size, size);

    // store references
    this.scene = scene;
    this.gridX = x * size + size / 2;
    this.gridY = y * size + size / 2;
    this.size = size;

    this.makeClickable();
  }

  makeClickable() {
    this.setInteractive();
    this.on("pointerdown", () => {
      this.selectCell();
    });
  }

  selectCell() {
    this.setTint(0x00ff00);
  }
}

class Grid {
  constructor(scene, gridConfig) {
    // store references
    this.scene = scene;
    this.gridConfig = gridConfig;

    this.createGrid();
  }

  createGrid() {
    // create a grid with grouped sprites
    this.cells = new Map();

    // destructuring grid config
    const { width, height, size } = this.gridConfig;

    // loop through grid width and height
    for (let row = 0; row < width; row++) {
      for (let col = 0; col < height; col++) {
        // draw grid cell
        const cell = new Cell(this.scene, row, col, size);

        // add cell sprite to grid container
        this.cells.set(this.generateKey(row, col), cell);
      }
    }
  }

  getCell(row, col) {
    return this.cells.get(this.generateKey(row, col));
  }

  getCellFromCoordinates(x, y) {
    const { row, col } = this.getLogicalCoordinates(x, y);
    return this.getCell(row, col);
  }

  getLogicalCoordinates(x, y) {
    return {
      row: Math.floor(x / this.gridConfig.size),
      col: Math.floor(y / this.gridConfig.size),
    };
  }

  // Extracting key generation to own function idea inspired by Brace
  generateKey(row, col) {
    return `${row}:${col}`;
  }
}
