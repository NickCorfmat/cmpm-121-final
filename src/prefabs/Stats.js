class Stats extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, width, height) {
    super(scene, x, y, width, height);

    scene.add.rectangle(x, y, width, height, 0x6d8a85);
  }
}
