class Win extends Phaser.Scene {
  constructor() {
    super("sceneWin");
  }

  init(data) {
    this.buildingsPlaced = data.buildingsPlaced;
    this.resourcesCollected = data.resourcesCollected;
    this.turnsPlayed = data.turnsPlayed;
  }

  create() {
    this.add
      .text(350, 100, "You Win!", { fontSize: "64px", fill: "#fff" })
      .setOrigin(0.5);
    this.add
      .text(350, 200, `Buildings Placed: ${this.buildingsPlaced}`, {
        fontSize: "32px",
        fill: "#fff",
      })
      .setOrigin(0.5);
    this.add
      .text(350, 250, `Resources Collected: ${this.resourcesCollected}`, {
        fontSize: "32px",
        fill: "#fff",
      })
      .setOrigin(0.5);
    this.add
      .text(350, 300, `Turns Played: ${this.turnsPlayed}`, {
        fontSize: "32px",
        fill: "#fff",
      })
      .setOrigin(0.5);
  }
}
