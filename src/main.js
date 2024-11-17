"use strict";

let config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 800,
  render: {
    pixelArt: true,
  },
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
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
