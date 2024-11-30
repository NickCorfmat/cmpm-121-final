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

    // cell game state
    this.buildingRef = -1; // default: no building
    this.level = 0;
    this.sunLevel = 0;
    this.waterLevel = 0;
    this.resources = 0;

    this.isClickable = false;

    // cell properties/behaviors
    this.createBorder();
    this.enableMouseEvents();
  }

  createBorder() {
    this.border = this.scene.add.graphics();

    // set border appearance
    this.border.lineStyle(2, 0x34eba8, 1);
    this.border.strokeRect(
      this.x - this.displayWidth / 2,
      this.y - this.displayHeight / 2,
      this.displayWidth,
      this.displayHeight
    );

    // hide border when created
    this.disableBorder();
  }

  enableMouseEvents() {
    this.setInteractive();
    this.on("pointerdown", () => {
      this.grid.selectCell(this.row, this.col);
    });
  }

  displayBuilding() {
    const { type, scale } = this.scene.buildings[this.buildingRef];
    const texture = type + this.level;

    if (this.buildingIcon) {
      // redraw sprite if one exists
      this.buildingIcon.setTexture(texture);
    } else {
      // create new sprite
      this.buildingIcon = this.scene.add.sprite(this.x, this.y, texture);

      // sprite configs
      this.buildingIcon.setOrigin(0.5);
      this.buildingIcon.setScale(scale);
    }
  }

  generateResources() {
    if (this.hasBuilding()) {
      const { rate } = this.scene.buildings[this.buildingRef];
      this.resources += (this.sunLevel + this.waterLevel) * this.rate;
    }
  }

  updateSunLevel() {
    const value = Phaser.Math.Between(1, 5);
    this.setSunLevel(value);
  }

  updateWaterLevel() {
    const value = Phaser.Math.Between(0, 5);
    this.setWaterLevel(value);
  }

  step() {
    this.updateLevel();
    this.updateSunLevel();
    this.updateWaterLevel();
  }

  // Getters/Setters

  setSunLevel(value) {
    // only store sun level if cell is has building
    if (this.hasBuilding()) {
      this.sunLevel = value;
    }
  }

  setWaterLevel(value) {
    this.waterLevel = value;
  }

  setBuilding(ref) {
    if (!this.hasBuilding() && this.buildingExists(ref)) {
      this.buildingRef = ref;
      this.level++;

      this.displayBuilding();
    }
  }

  updateLevel() {
    if (this.hasBuilding()) {
      const uniqueCount = new Set(this.getAdjacentBuildings()).size;
      console.log(uniqueCount);

      if (uniqueCount >= 2) {
        this.level++;
        this.displayBuilding();
      }
    }
  }

  setClickable() {
    this.isClickable = true;
  }

  disableClickable() {
    this.isClickable = false;
  }

  enableBorder() {
    this.border.setVisible(true);
  }

  disableBorder() {
    this.border.setVisible(false);
  }

  getAdjacentBuildings() {
    const directions = [
      { row: -1, col: 0 }, // up
      { row: 1, col: 0 }, // down
      { row: 0, col: -1 }, // left
      { row: 0, col: 1 }, // right
    ];

    const adjacentBuildings = [];

    directions.forEach((dir) => {
      const newRow = this.row + dir.row;
      const newCol = this.col + dir.col;
      if (
        newRow >= 0 &&
        newRow < this.grid.height &&
        newCol >= 0 &&
        newCol < this.grid.width
      ) {
        const cell = this.grid.getCell(newRow, newCol);

        if (cell.hasBuilding()) {
          adjacentBuildings.push(cell.buildingRef);
        }
      }
    });

    return adjacentBuildings;
  }

  // Helpers

  hasBuilding() {
    return this.buildingRef >= 0;
  }

  buildingExists(ref) {
    return ref >= 0 && ref < this.scene.buildings.length;
  }

  getLogicalCoords() {
    return { row: this.row, col: this.col };
  }
}
