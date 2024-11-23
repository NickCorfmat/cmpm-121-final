"use strict";

let config = {
  type: Phaser.AUTO,
  width: 840,
  height: 480,
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
  scene: [Load, Keys, Play],
};

let game = new Phaser.Game(config);
const { width, height } = game.config;