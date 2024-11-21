"use strict";

let config = {
  type: Phaser.AUTO,
  width: 320,
  height: 320,
  render: {
    pixelArt: true,
  },
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: [Load, Keys, Play],
};

let game = new Phaser.Game(config);
const { width, height } = game.config;
