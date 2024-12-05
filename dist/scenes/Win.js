"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinScene = void 0;
const phaser_1 = __importDefault(require("phaser"));
class WinScene extends phaser_1.default.Scene {
    constructor() {
        super("sceneWin");
        this.buildingsPlaced = 0;
        this.resourcesCollected = 0;
        this.turnsPlayed = 0;
    }
    init(data) {
        this.buildingsPlaced = data.buildingsPlaced;
        this.resourcesCollected = data.resourcesCollected;
        this.turnsPlayed = data.turnsPlayed;
        // tunable text parameters
        this.textConfig = {
            fontSize: "32px",
            align: "center",
            lineSpacing: 10,
        };
    }
    create() {
        this.text = this.add
            .text(this.game.scale.width / 2, this.game.scale.height / 2, this.getWinText(), this.textConfig)
            .setOrigin(0.5);
    }
    // Source: Brace, How can I shorten a long string message?
    getWinText() {
        return (`You Win!\n` +
            `Buildings Placed: ${this.buildingsPlaced}\n` +
            `Resources Collected: ${this.resourcesCollected}\n` +
            `Turns Played: ${this.turnsPlayed}`);
    }
}
exports.WinScene = WinScene;
//# sourceMappingURL=Win.js.map