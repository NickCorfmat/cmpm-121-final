class Keys extends Phaser.Scene {
  constructor() {
    super("sceneKeys");
  }

  // Key encapsulation code from Nathan Altice, https://github.com/nathanaltice/BurgerBoss/blob/master/src/scenes/Keys.js
  create() {
    const { KeyCodes } = Phaser.Input.Keyboard;

    this.keys = this.input.keyboard.addKeys({
      LEFT: KeyCodes.LEFT,
      RIGHT: KeyCodes.RIGHT,
      UP: KeyCodes.UP,
      DOWN: KeyCodes.DOWN,
      JUMP: KeyCodes.SPACE,
    });

    this.scene.launch("scenePlay");
  }
}
