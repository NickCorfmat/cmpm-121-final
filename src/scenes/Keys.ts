class Keys extends Phaser.Scene {
  private KEYS;

  constructor() {
    super("sceneKeys");
  }

  // Key encapsulation code from Nathan Altice, https://github.com/nathanaltice/BurgerBoss/blob/master/src/scenes/Keys.js
  create(): void {
    const { KeyCodes } = Phaser.Input.Keyboard;

    this.KEYS = this.input.keyboard.addKeys({
      LEFT: KeyCodes.LEFT,
      RIGHT: KeyCodes.RIGHT,
      UP: KeyCodes.UP,
      DOWN: KeyCodes.DOWN,
    });

    this.scene.launch("scenePlay");
  }
}
