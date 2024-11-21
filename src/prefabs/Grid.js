class Grid extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, gridConfig) {
    super(scene);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // store references
    this.scene = scene;
    this.gridConfig = gridConfig;

    this.createGrid();
  }

  createGrid() {
    // create a grid with grouped sprites
    this.grid = this.scene.add.group();

    // loop through grid width and height
    for (let i = 0; i < this.gridConfig.width; i++) {
      for (let j = 0; j < this.gridConfig.height; j++) {
        // draw grid cell
        const cell = this.scene.add.rectangle(
          i * this.gridConfig.size,
          j * this.gridConfig.size,
          this.gridConfig.size,
          this.gridConfig.size,
          0x00ff00
        );

        cell.setStrokeStyle(2, 0x000000);
        cell.setOrigin(0, 0);

        // add cell sprite to grid container
        this.grid.add(cell);
      }
    }
  }
}
