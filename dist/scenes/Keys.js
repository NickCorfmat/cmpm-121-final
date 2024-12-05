"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyScene = void 0;
const phaser_1 = __importDefault(require("phaser"));
class KeyScene extends phaser_1.default.Scene {
    constructor() {
        super("sceneKeys");
    }
    // Key encapsulation code from Nathan Altice, https://github.com/nathanaltice/BurgerBoss/blob/master/src/scenes/Keys.js
    create() {
        const { KeyCodes } = phaser_1.default.Input.Keyboard;
        this.KEYS = this.input.keyboard.addKeys({
            LEFT: KeyCodes.LEFT,
            RIGHT: KeyCodes.RIGHT,
            UP: KeyCodes.UP,
            DOWN: KeyCodes.DOWN,
        });
        this.scene.launch("scenePlay");
    }
}
exports.KeyScene = KeyScene;
//# sourceMappingURL=Keys.js.map