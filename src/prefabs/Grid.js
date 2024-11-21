class Grid extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, width, height, gridSize) {
    super(scene);
    scene.add.existing(this);
    scene.physics.add.existing(this)

    // storing argument references
    this.scene = scene;
    this.width = width;
    this.height = height;
    this.gridSize = gridSize;

    this.createGrid();
  }

  createGrid() {
    // create a grid with grouped sprites
    this.grid = this.scene.add.group();

    // loop through grid width and height
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {

        // draw grid cell
        const cell = this.scene.add.rectangle(
          i * this.gridSize,
          j * this.gridSize,
          this.gridSize,
          this.gridSize,
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
