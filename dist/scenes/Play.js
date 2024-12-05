"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayScene = void 0;
const yaml_1 = require("yaml");
const phaser_1 = __importDefault(require("phaser"));
const Player_1 = require("../prefabs/Player");
const GameState_1 = require("../prefabs/GameState");
const Grid_1 = require("../prefabs/Grid");
const Stats_1 = require("../prefabs/Stats");
const ButtonManager_1 = require("../prefabs/ButtonManager");
class PlayScene extends phaser_1.default.Scene {
    constructor() {
        super("scenePlay");
        this.RESOURCE_GOAL = 1000;
        this.buildings = [];
    }
    init() {
        const yamlText = this.cache.text.get("scenario");
        const config = (0, yaml_1.parse)(yamlText);
        console.log(config);
        // set game display parameters
        this.gridConfig = config.gridConfig;
        this.statsConfig = {
            x: this.gridConfig.width * this.gridConfig.size,
            y: 0,
            width: this.game.scale.width - this.gridConfig.width * this.gridConfig.size,
            height: this.game.scale.height,
        };
        this.buildings = config.buildings;
        this.RESOURCE_GOAL = config.RESOURCE_GOAL;
        this.trackables = config.trackables;
        console.log("hi");
    }
    create() {
        this.gameState = new GameState_1.GameState(this);
        this.grid = new Grid_1.Grid(this, this.gridConfig);
        this.stats = new Stats_1.Stats(this, this.statsConfig.x, this.statsConfig.y, this.statsConfig.width, this.statsConfig.height);
        this.player = new Player_1.Player(this, 0, 0, this.grid);
        this.buttons = new ButtonManager_1.ButtonManager(this);
    }
    update() {
        this.player.update();
    }
    updateUI() {
        // prioritize displaying stats of selected cell
        this.grid.selectedCell
            ? this.stats.update(this.grid.selectedCell)
            : this.player.displayCurrentCellStats();
        this.player.updatePlayerDisplay();
    }
    startNextRound() {
        this.grid.step();
        this.updateUI();
        this.gameState.save();
    }
    checkWinCondition() {
        if (this.player.resources >= this.RESOURCE_GOAL) {
            this.scene.start("sceneWin", this.trackables);
        }
    }
    launchGame() {
        const savedData = localStorage.getItem("AUTO_SAVE");
        // prompt user to continue from auto-save or start new game
        if (savedData && confirm("Do you want to continue where you left off?")) {
            this.gameState.load();
        }
    }
}
exports.PlayScene = PlayScene;
//# sourceMappingURL=Play.js.map