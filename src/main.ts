"use strict";

import Phaser from "phaser";

let config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
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
  scene: [Load, Keys, Play, Win],
};

const game = new Phaser.Game(config);
const { width, height } = game.config;