class Keys extends Phaser.Scene {
  constructor() {
    super("sceneKeys");
  }

  create() {
    const { KeyCodes } = Phaser.Input.Keyboard;
    
    this.keys = this.input.keyboard.addKeys({
      LEFT: KeyCodes.LEFT,
      RIGHT: KeyCodes.RIGHT,
      UP: KeyCodes.UP,
      DOWN: KeyCodes.DOWN,
      JUMP: KeyCodes.SPACE,
    });

    this.scene.launch("scenePlay")
  }
}
