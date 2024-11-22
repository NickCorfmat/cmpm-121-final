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
      fontSize: "16px",
      fill: "#fff",
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
  }

  updateStats(cell) {
    this.cell = cell;

    this.displayCellName();
    this.displayCellIcon();
    this.displayCellLocation();
    this.displaySunLevel();
    this.displayWaterLevel();
  }

  displayCellName() {
    const x = this.x + this.width / 2;
    const y = 30;

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

    this.icon = this.scene.add.rectangle(x, y, size, size, 0x000000);
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
    const y = (2 * this.height) / 3;

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
}
