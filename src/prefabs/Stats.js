class Stats extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, width, height, texture = "stats") {
    super(scene, x, y, texture);
    scene.add.existing(this);

    this.setOrigin(0);
    this.setDisplaySize(width, height);
    this.text = scene.add.text(x + 10, y + 10, "", {
      fontSize: "16px",
      fill: "#fff",
    });
  }

  updateStats(cell) {
    const sunLevelText = cell.building ? `Sun Level: ${cell.sunLevel}` : `Sun Level: ${cell.sunLevel} (unused)`;
    this.text.setText(`Cell: (${cell.row}, ${cell.col})\n${sunLevelText}\nWater Level: ${cell.waterLevel}`);
  }
}
