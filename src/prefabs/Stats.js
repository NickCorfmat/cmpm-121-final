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

    // tunable text parameters
    this.textConfig = {
      fontSize: "24px",
      fill: "#fff",
      backgroundColor: "000",
      padding: 5,
    };

    // create text elements
    this.name = this.scene.add.text(0, 0, "", this.textConfig);
    this.location = this.scene.add.text(0, 0, "", this.textConfig);
    this.sunLevel = this.scene.add.text(0, 0, "", this.textConfig);
    this.waterLevel = this.scene.add.text(0, 0, "", this.textConfig);

    // center text
    this.name.setOrigin(0.5);
    this.location.setOrigin(0.5);
    this.sunLevel.setOrigin(0.5);
    this.waterLevel.setOrigin(0.5);

    // declare icon sprite
    this.icon = null;

    // create collect button
    this.collectButton = this.scene.add.text(0, 0, "Collect Resources", {
      fontSize: "16px",
      fill: "#0f0",
      backgroundColor: "#000",
      padding: { x: 10, y: 5 },
    });
    this.collectButton.setOrigin(0.5);
    this.collectButton.setInteractive();
    this.collectButton.on("pointerdown", () => this.collectResources());
    this.collectButton.setVisible(false);
  }

  update(cell) {
    this.cell = cell;

    this.displayCellName();
    this.displayCellIcon();
    this.displayCellLocation();
    this.displaySunLevel();
    this.displayWaterLevel();
    this.displayCollectButton();
  }

  updateStats(cell) {
    this.selectedCell = cell;
    const sunLevelText = cell.building
      ? `Sun Level (Last Turn): \n${cell.sunLevel}\n`
      : `Sun Level (Last Turn): \n${cell.sunLevel} (unused)\n`;
    const resourcesText = cell.building
      ? `Resources: \n${cell.building.resources}`
      : "";
    const buildingText = cell.building
      ? `Building: \n${cell.building.name}\n`
      : "No Building";
    this.text.setText(
      `Cell: (${cell.row}, ${cell.col})\n${sunLevelText}\nWater Level: \n${cell.waterLevel}\n\n${buildingText}\n${resourcesText}`
    );

    if (cell.building && cell.building.resources > 0) {
      this.collectButton.setVisible(true);
    } else {
      this.collectButton.setVisible(false);
    }
  }

  displayCellName() {
    const x = this.x + this.width / 2;
    const y = 43;

    let text =
      this.cell.building == null
        ? "Cell: Empty"
        : `Cell: ${this.cell.building.type}`;

    this.name.setPosition(x, y);
    this.name.setText(text);
  }

  displayCellIcon() {
    const x = this.x + this.width / 2;
    const y = this.height / 3;
    const size = this.width / 2;

    this.iconframe = this.scene.add
      .sprite(x, y, "cell")
      .setDisplaySize(size, size);

    if (this.cell.building) {
      this.icon = this.scene.add.image(x, y, this.cell.building.texture);
      this.icon.setDisplaySize(size, size);
    }
  }

  displayCellLocation() {
    const x = this.x + this.width / 2;
    const y = (3 * this.height) / 5;

    const text = `Location: (${this.cell.row}, ${this.cell.col})`;

    this.location.setPosition(x, y);
    this.location.setText(text);
  }

  displaySunLevel() {
    const x = this.x + this.width / 2;
    const y = (2 * this.height) / 3 + 5;

    const text = `Sun Level: ${this.cell.sunLevel}`;

    this.sunLevel.setPosition(x, y);
    this.sunLevel.setText(text);
  }

  displayWaterLevel() {
    const x = this.x + this.width / 2;
    const y = (3 * this.height) / 4;

    const text = `Water Level: ${this.cell.waterLevel}`;

    this.waterLevel.setPosition(x, y);
    this.waterLevel.setText(text);
  }

  displayCollectButton() {
    if (this.cell.building && this.cell.building.resources > 0) {
      const x = this.x + this.width / 2;
      const y = this.height - 30;

      this.collectButton.setPosition(x, y);
      this.collectButton.setVisible(true);
    } else {
      this.collectButton.setVisible(false);
    }
  }

  collectResources() {
    if (this.cell.building) {
      const collected = this.cell.building.collectResources();
      this.scene.player.resources += collected;
      this.scene.player.updateResourceDisplay();
      this.update(this.cell); // Refresh stats display
    }
  }
}
