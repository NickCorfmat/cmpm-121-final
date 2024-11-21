class MiningFacility extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}

class Drill extends MiningFacility {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
  }
}

class Excavator extends MiningFacility {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
  }
}

class DemolitionPlant extends MiningFacility {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
  }
}
