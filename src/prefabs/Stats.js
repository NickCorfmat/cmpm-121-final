class Stats extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, width, height, texture = "stats") {
    super(scene, x, y, texture);
    scene.add.existing(this);

    // store references
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.cell = null;

    // stats display configs
    this.setOrigin(0);
    this.setDisplaySize(width, height);

    this.textConfig = {
      fontSize: "16px",
      fill: "#fff",
    };

    this.collectButton = scene.add
      .text(x + 10, y + 280, "Collect", {
        fontSize: "16px",
        fill: "#fff",
        backgroundColor: "#000",
        padding: { x: 10, y: 5 },
      })
      .setVisible(false)
      .setInteractive()
      .on("pointerdown", () => {
        if (this.selectedCell && this.selectedCell.building) {
          const collected = this.selectedCell.building.collectResources();
          scene.player.resources += collected;
          scene.player.updateResourceDisplay();
          this.updateStats(this.selectedCell);
        }
      });
  }

  updateStats(cell) {
    this.cell = cell;

    this.clearDisplay();

    this.displayCellName();
    this.displayCellIcon();
    this.displayCellLocation();
    this.displaySunLevel();
    this.displayWaterLevel();
    // const sunLevelText = cell.building
    //   ? `Sun Level (Last Turn): \n${cell.sunLevel}\n`
    //   : `Sun Level (Last Turn): \n${cell.sunLevel} (unused)\n`;
    // const resourcesText = cell.building
    //   ? `Resources: \n${cell.building.resources}`
    //   : "";
    // const buildingText = cell.building
    //   ? `Building: \n${cell.building.constructor.name}\n`
    //   : "No Building";
    // this.text.setText(
    //   `Cell: (${cell.row}, ${cell.col})\n${sunLevelText}\nWater Level: \n${cell.waterLevel}\n\n${buildingText}\n${resourcesText}`
    // );

    // if (cell.building && cell.building.resources > 0) {
    //   this.collectButton.setVisible(true);
    // } else {
    //   this.collectButton.setVisible(false);
    // }
  }

  clearDisplay() {
    this.name = null;
    this.icon = null;
    this.location = null;
  }

  displayCellName() {
    const x = this.x + this.width / 2;
    const y = 30;

    let text =
      this.cell.building == null
        ? "Cell: Empty"
        : `Cell: ${this.cell.building.type}`;

    this.name = this.scene.add.text(x, y, text, this.textConfig);

    // center text
    this.name.setOrigin(0.5);
  }

  displayCellIcon() {
    const x = this.x + this.width / 2;
    const y = this.height / 3;
    const size = this.width / 2;

    this.icon = this.scene.add.rectangle(x, y, size, size, 0x000000);
  }

  displayCellLocation() {
    const x = this.x + this.width / 2;
    const y = (3 * this.height) / 5;

    const text = `Location: (${this.cell.row}, ${this.cell.col})`;

    this.location = this.scene.add.text(x, y, text, this.textConfig);

    // center text
    this.location.setOrigin(0.5);
  }

  displaySunLevel() {
    const x = this.x + this.width / 2;
    const y = (2 * this.height) / 3;

    const text = `Sun Level: ${this.cell.sunLevel}`;
    this.name = this.scene.add.text(x, y, text, this.textConfig);

    // center text
    this.name.setOrigin(0.5);
  }

  displayWaterLevel() {
    const x = this.x + this.width / 2;
    const y = (3 * this.height) / 4;

    const text = `Water Level: ${this.cell.waterLevel}`;
    this.name = this.scene.add.text(x, y, text, this.textConfig);

    // center text
    this.name.setOrigin(0.5);
  }
}
