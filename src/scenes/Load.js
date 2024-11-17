class Load extends Phaser.Scene {
  constructor() {
    super("sceneLoad");
  }

  preload() {}

  create() {
    this.scene.launch("sceneKeys");
  }
}
