class Stats extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, width, height, texture = "stats") {
    super(scene, x, y, texture);
    scene.add.existing(this);

    this.setOrigin(0);
    this.setDisplaySize(width, height);
  }
}
