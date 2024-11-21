class Load extends Phaser.Scene {
  constructor() {
    super("sceneLoad");
  }

  preload() {
    // load assets
    this.load.path = "./assets";

    this.load.image("player", "/player.png")
  }

  create() {
    this.scene.launch("sceneKeys");
  }
}
