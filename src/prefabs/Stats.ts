export class Stats extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, width, height, texture = "stats") {
    super(scene, x, y, texture);
    scene.add.existing(this);

    // store references
    this.scene = scene;
    this.width = width;
    this.height = height;
    this.cell = -1;

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
    this.collectButton.on("pointerdown", () =>
      this.scene.player.collectResourcesFromCell(this.cell)
    );
  }

  update(cell): void {
    this.cell = cell;
    this.getCellInfo();

    this.displayCellName();
    this.displayCellIcon();
    this.displayDescription();
    this.displayCollectButton();
  }

  displayCellName(): void {
    const x = this.x + this.width * 0.5;
    const y = this.height * 0.1;

    this.name.setPosition(x, y);
    this.name.setText(this.cell.getName());
  }

  displayCellIcon(): void {
    const x = this.x + this.width * 0.5;
    const y = this.height * 0.365;
    const size = this.width * 0.5;

    // icon background
    this.iconframe = this.scene.add
      .sprite(x, y, "cell")
      .setDisplaySize(size, size);

    // display building sprite if cell contains one
    if (this.cell.hasBuilding()) {
      this.icon = this.scene.add.image(x, y, this.cell.getTexture());

      // sprite configs
      this.icon.setDisplaySize(size, size);
      this.icon.setOrigin(0.5);
    }
  }

  getCellInfo(): void {
    this.location = `Location: (${this.cell.row}, ${this.cell.col})`;
    this.sunLevel = `Sun Level: ${this.cell.sunLevel}`;
    this.waterLevel = `Water Level: ${this.cell.waterLevel}`;
    this.level = `Level: ${this.cell.level}`;
  }

  displayDescription(): void {
    this.description.setText(
      `${this.level}\n${this.location}\n${this.sunLevel}\n${this.waterLevel}`
    );
  }

  displayCollectButton(): void {
    if (this.cell.hasBuilding() && this.cell.resources > 0) {
      const x = this.x + this.width * 0.5;
      const y = this.height - 30;

      this.collectButton.setPosition(x, y);
      this.collectButton.setVisible(true);
    } else {
      this.collectButton.setVisible(false);
    }
  }
}
