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

    this.collectButton = scene.add.text(x + 10, y + 280, "Collect", {
      fontSize: "16px",
      fill: "#fff",
      backgroundColor: "#000",
      padding: { x: 10, y: 5 },
    }).setVisible(false).setInteractive().on('pointerdown', () => {
      if (this.selectedCell && this.selectedCell.building) {
        const collected = this.selectedCell.building.collectResources();
        scene.player.resources += collected;
        scene.player.updateResourceDisplay();
        this.updateStats(this.selectedCell);
      }
    });
  }

  updateStats(cell) {
    this.selectedCell = cell;
    const sunLevelText = cell.building ? `Sun Level (Last Turn): \n${cell.sunLevel}\n` : `Sun Level (Last Turn): \n${cell.sunLevel} (unused)\n`;
    const resourcesText = cell.building ? `Resources: \n${cell.building.resources}` : '';
    const buildingText = cell.building ? `Building: \n${cell.building.constructor.name}\n` : 'No Building';
    this.text.setText(`Cell: (${cell.row}, ${cell.col})\n${sunLevelText}\nWater Level: \n${cell.waterLevel}\n\n${buildingText}\n${resourcesText}`);
    
    if (cell.building && cell.building.resources > 0) {
      this.collectButton.setVisible(true);
    } else {
      this.collectButton.setVisible(false);
    }
  }
}
