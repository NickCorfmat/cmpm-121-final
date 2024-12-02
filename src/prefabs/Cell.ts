export class Cell extends Phaser.GameObjects.Sprite {
  private row: number;
  private col: number;
  private grid: Grid;

  private buildingRef: number = -1;
  private level: number = 0;
  private sunLevel: number = 0;
  private waterLevel: number = 0;
  private resources: number = 0;

  private isClickable: boolean = false;
  private border?: Phaser.GameObjects.Graphics;
  private buildingIcon?: Phaser.GameObjects.Sprite;

  constructor(
    scene: Phaser.Scene,
    row: number,
    col: number,
    grid: Grid,
    texture: string = "cell"
  ) {
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

    // cell properties/behaviors
    this.createBorder();
    this.enableMouseEvents();
  }

  createBorder(): void {
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

  enableMouseEvents(): void {
    this.setInteractive();
    this.on("pointerdown", () => {
      this.grid.selectCell(this.row, this.col);
    });
  }

  displayBuilding(): void {
    if (this.hasBuilding()) {
      const { scale } = this.scene.buildings[this.buildingRef];
      const texture = this.getTexture();

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
  }

  step(): void {
    this.updateLevel();
    this.updateSunLevel();
    this.updateWaterLevel();
    this.generateResources();
  }

  generateResources(): void {
    if (this.hasBuilding()) {
      const { rate } = this.scene.buildings[this.buildingRef];
      this.resources += (this.sunLevel + this.waterLevel) * rate;
    }
  }

  updateSunLevel(): void {
    const value = Phaser.Math.Between(1, 5);
    this.setSunLevel(value);
  }

  updateWaterLevel(): void {
    const value = Phaser.Math.Between(0, 5);
    this.setWaterLevel(value);
  }

  updateLevel(): void {
    if (this.hasBuilding()) {
      const uniqueCount = new Set(this.getAdjacentBuildings()).size;

      if (uniqueCount >= 2 && !this.maxLevelReached()) {
        this.level++;
        this.displayBuilding();
      }
    }
  }

  resetResources(): void {
    this.resources = 0;
  }

  restore({ buildingRef, level, sunLevel, waterLevel, resources }): void {
    this.buildingRef = buildingRef;
    this.level = level;
    this.sunLevel = level;
    this.waterLevel = waterLevel;
    this.resources = resources;

    this.removeBuildingSprite();
    this.displayBuilding();
  }

  // Getters/Setters

  setSunLevel(value): void {
    // only store sun level if cell is has building
    if (this.hasBuilding()) {
      this.sunLevel = value;
    }
  }

  setWaterLevel(value): void {
    this.waterLevel = value;
  }

  setBuilding(ref): void {
    if (!this.hasBuilding() && this.buildingExists(ref)) {
      this.buildingRef = ref;
      this.level++;

      this.displayBuilding();
    }
  }

  setLevel(level): void {
    this.level = level;
    this.displayBuilding();
  }

  setResources(value): void {
    this.resources = value;
  }

  setClickable(): void {
    this.isClickable = true;
  }

  disableClickable(): void {
    this.isClickable = false;
  }

  enableBorder(): void {
    this.border.setVisible(true);
  }

  disableBorder(): void {
    this.border.setVisible(false);
  }

  getAdjacentBuildings(): number[] {
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

  getName(): string {
    if (this.buildingRef == -1) {
      return "Empty";
    } else {
      return this.scene.buildings[this.buildingRef].type;
    }
  }

  getTexture(): string {
    if (this.hasBuilding()) {
      const { type } = this.scene.buildings[this.buildingRef];
      return type + this.level;
    }

    return "";
  }

  getLogicalCoords() {
    return { row: this.row, col: this.col };
  }

  // Helpers

  hasBuilding(): boolean {
    return this.buildingRef >= 0;
  }

  buildingExists(ref): boolean {
    return ref >= 0 && ref < this.scene.buildings.length;
  }

  maxLevelReached(): boolean {
    return this.level >= 3;
  }

  removeBuildingSprite(): void {
    if (this.buildingIcon) {
      this.buildingIcon.destroy();
      this.buildingIcon = null;
    }
  }
}
