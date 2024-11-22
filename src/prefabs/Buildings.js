/*
Equation for determining resource output each turn:
  Sun level + water Level * building multiplier = resource output per turn

Building cost and production output:
  Drill: 10 resources, 1x multiplier
  Excavator: 30 resources, 2x multiplier
  Demolition Plant: 50 resources, 3x multiplier
*/
class MiningFacility extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, cost, multiplier) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.cost = cost;
    this.multiplier = multiplier;
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

class Drill extends MiningFacility {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture, 10, 1);
  }
}

class Excavator extends MiningFacility {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture, 30, 2);
  }
}

class DemolitionPlant extends MiningFacility {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture, 50, 3);
  }
}
