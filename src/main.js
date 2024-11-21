"use strict";

let config = {
  type: Phaser.AUTO,
  width: 560,
  height: 320,
  parent: "game-container",
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