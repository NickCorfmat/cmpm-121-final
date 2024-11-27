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
      fontSize: "20px",
      fill: "#fff",
      backgroundColor: "000",
      padding: 10,
      lineSpacing: 10,
    };

    // create text elements
    this.name = this.scene.add.text(0, 0, "", this.textConfig);
    this.description = this.scene.add.text(
      this.x + this.width * 0.5,
      this.height * 0.75,
      "",
      this.textConfig
    );

    // center text
    this.name.setOrigin(0.5);
    this.description.setOrigin(0.5);

    // declare icon sprite
    this.icon = null;

    // create collect button
    this.collectButton = this.scene.add.text(0, 0, "Collect Resources", {
      fontSize: "16px",
      fill: "#0f0",
      backgroundColor: "#000",
      padding: { x: 10, y: 5 },
    });

    // collect button configs
    this.collectButton.setOrigin(0.5);
    this.collectButton.setVisible(false);

    this.collectButton.setInteractive();
    this.collectButton.on("pointerdown", () => this.collectResources());
  }

  update(cell) {
    this.cell = cell;
    this.getCellInfo();

    this.displayCellName();
    this.displayCellIcon();
    this.displayDescription();
    this.displayCollectButton();
  }

  displayCellName() {
    const x = this.x + this.width * 0.5;
    const y = this.height * 0.1;

    let text =
      this.cell.building == null
        ? "Cell: Empty"
        : `Cell: ${this.cell.building.type}`;

    this.name.setPosition(x, y);
    this.name.setText(text);
  }

  displayCellIcon() {
    const x = this.x + this.width * 0.5;
    const y = this.height * 0.365;
    const size = this.width * 0.5;

    this.iconframe = this.scene.add
      .sprite(x, y, "cell")
      .setDisplaySize(size, size);

    if (this.cell.building) {
      this.icon = this.scene.add.image(x, y, this.cell.building.texture);
      this.icon.setDisplaySize(size, size);
    }
  }

  getCellInfo() {
    this.location = `Location: (${this.cell.row}, ${this.cell.col})`;
    this.sunLevel = `Sun Level: ${this.cell.sunLevel}`;
    this.waterLevel = `Water Level: ${this.cell.waterLevel}`;

    this.level = this.cell.building
      ? `Level: ${this.cell.building.level}`
      : "Level: 0";
  }

  displayDescription() {
    this.description.setText(
      `${this.level}\n${this.location}\n${this.sunLevel}\n${this.waterLevel}`
    );
  }

  displayCollectButton() {
    if (this.cell.building && this.cell.building.resources > 0) {
      const x = this.x + this.width * 0.5;
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

      // update game states
      this.scene.player.resources += collected;
      this.scene.player.updateResourceDisplay();
      this.update(this.cell);

      this.scene.checkWinCondition();
    }
  }
}
