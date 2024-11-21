class Grid extends Phaser.GameObjects.Sprite {
  constructor(scene, gridConfig) {
    super(scene);
    scene.add.existing(this);

    // store references
    this.scene = scene;
    this.gridConfig = gridConfig;

    this.createGrid();
  }

  createGrid() {
    // create a grid with grouped sprites
    this.grid = this.scene.add.group();

    // destructuring grid config
    const { width, height, size } = this.gridConfig;

    // loop through grid width and height
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        // draw grid cell
        const cell = this.scene.add.rectangle(
          i * size,
          j * size,
          size,
          size,
          0xb5b5b5
        );

        cell.setStrokeStyle(2, 0x000000);
        cell.setOrigin(0);

        // add cell sprite to grid container
        this.grid.add(cell);
      }
    }
  }
}
