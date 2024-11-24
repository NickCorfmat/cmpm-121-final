/*
Equation for determining resource output each turn:
  Sun level + water Level * building multiplier = resource output per turn

Building cost and production output:
  Drill: 10 resources, 1x multiplier
  Excavator: 30 resources, 2x multiplier
  Demolition Plant: 50 resources, 3x multiplier

Building levels:
  Buildings start at level 1
  For every unique type of adjacent building that building is upgraded by 1 level
  Building levels increase the multiplier by 1
*/
class Building extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, row, col, grid, config) {
    // convert logical to pixel for displaying cell
    const { x, y } = grid.logicalToPixelCoords(row, col);
    
    super(scene, x, y, config.type);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // sprite configs
    this.setScale(config.scale);

    // store references
    this.type = config.type;
    this.cost = config.cost;
    this.baseMultiplier = config.multiplier;
    this.row = row;
    this.col = col;
    this.grid = grid;

    this.resources = 0;
    this.level = 1;
    this.updateMultiplier();
  }

  updateMultiplier() {
    this.multiplier = this.baseMultiplier + (this.level - 1);
  }

  generateResources(sunLevel, waterLevel) {
    this.resources += (sunLevel + waterLevel) * this.multiplier;
  }

  collectResources() {
    const collected = this.resources;
    this.scene.resourcesCollected += collected;
    this.resources = 0;
    return collected;
  }

  updateLevel() {
    const adjacentBuildings = this.getAdjacentBuildings();
    const uniqueTypes = new Set(adjacentBuildings.map(b => b.type));
    this.level = 1 + uniqueTypes.size;
    this.updateMultiplier();
  }

  getAdjacentBuildings() {
    const directions = [
      { row: -1, col: 0 }, // up
      { row: 1, col: 0 },  // down
      { row: 0, col: -1 }, // left
      { row: 0, col: 1 }   // right
    ];

    const adjacentBuildings = [];

    directions.forEach(dir => {
      const newRow = this.row + dir.row;
      const newCol = this.col + dir.col;
      if (newRow >= 0 && newRow < this.grid.height && newCol >= 0 && newCol < this.grid.width) {
        const cell = this.grid.getCell(newRow, newCol);
        if (cell && cell.building) {
          adjacentBuildings.push(cell.building);
        }
      }
    });

    return adjacentBuildings;
  }
}
