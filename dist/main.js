"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
const Load_1 = require("./scenes/Load");
const Keys_1 = require("./scenes/Keys");
const Play_1 = require("./scenes/Play");
const Win_1 = require("./scenes/Win");
"use strict";
let config = {
    type: phaser_1.default.AUTO,
    width: 700,
    height: 400,
    parent: "phaser-game",
    render: {
        pixelArt: true,
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
        },
    },
    scene: [Load_1.LoadScene, Keys_1.KeyScene, Play_1.PlayScene, Win_1.WinScene],
};
const game = new phaser_1.default.Game(config);
const { width, height } = game.config;
//# sourceMappingURL=main.js.map