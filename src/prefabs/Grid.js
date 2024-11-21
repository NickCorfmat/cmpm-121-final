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

    // make cells clickable
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
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        // draw grid cell
        const cell = new Cell(this.scene, x, y, size);

        // add cell sprite to grid container
        this.cells.set(this.generateKey(x, y), cell);
      }
    }
  }

  getCell(x, y) {
    return this.cells.get(this.generateKey(x, y));
  }

  // Extracting key generation to own function idea inspired by Brace
  generateKey(x, y) {
    return `${x}:${y}`;
  }
}
