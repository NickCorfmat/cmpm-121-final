class Load extends Phaser.Scene {
  constructor() {
    super("sceneLoad");
  }

  preload() {
    // load assets
    this.load.path = "./assets";
  }

  create() {
    this.scene.launch("sceneKeys");
  }
}
