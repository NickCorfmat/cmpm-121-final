"use strict";

let config = {
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
  scene: [Load, Keys, Play],
};

let game = new Phaser.Game(config);
const { width, height } = game.config;