class Load extends Phaser.Scene {
  constructor() {
    super("sceneLoad");
  }

  preload() {
    // load assets
    this.load.path = "./assets";

    this.load.atlas("player", "/Astronaut_Idle.png", "/Astronaut_Idle.json");
    this.load.image("cell", "/cell.png");
    this.load.image("stats", "/stats.png");
    this.load.image("DemolitionPlant","/demo.png");
    this.load.image("Drill","/drill.png");
    this.load.image("Excavator","/Excavator.png");
  }

  create() {
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("player", {
        frames: [
          "Astronaut_Idle-0",
          "Astronaut_Idle-1",
          "Astronaut_Idle-2",
          "Astronaut_Idle-3",
          "Astronaut_Idle-4",
          "Astronaut_Idle-5",
        ],
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.scene.launch("sceneKeys");
  }
}
