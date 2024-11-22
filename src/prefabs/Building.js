/*
Equation for determining resource output each turn:
  Sun level + water Level * building multiplier = resource output per turn

Building cost and production output:
  Drill: 10 resources, 1x multiplier
  Excavator: 30 resources, 2x multiplier
  Demolition Plant: 50 resources, 3x multiplier
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
    this.multiplier = config.multiplier;
    this.row = row;
    this.col = row;

    this.resources = 0;
  }

  generateResources(sunLevel, waterLevel) {
    this.resources += (sunLevel + waterLevel) * this.multiplier;
  }

  collectResources() {
    const collected = this.resources;
    this.resources = 0;
    return collected;
  }
}
