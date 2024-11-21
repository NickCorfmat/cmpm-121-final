class Building extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}

class MiningLaser extends Building {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
  }
}

class MiningLaser extends Building {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
  }
}

class MiningLaser extends Building {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
  }
}
