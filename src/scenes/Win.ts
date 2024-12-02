class Win extends Phaser.Scene {
  constructor() {
    super("sceneWin");
  }

  init(data): void {
    this.buildingsPlaced = data.buildingsPlaced;
    this.resourcesCollected = data.resourcesCollected;
    this.turnsPlayed = data.turnsPlayed;

    // tunable text parameters
    this.textConfig = {
      fontSize: "32px",
      fill: "#fff",
      align: "center",
      lineSpacing: 10,
    };
  }

  create(): void {
    this.text = this.add
      .text(width / 2, height / 2, this.getWinText(), this.textConfig)
      .setOrigin(0.5);
  }

  // Source: Brace, How can I shorten a long string message?
  getWinText(): void {
    return (
      `You Win!\n` +
      `Buildings Placed: ${this.buildingsPlaced}\n` +
      `Resources Collected: ${this.resourcesCollected}\n` +
      `Turns Played: ${this.turnsPlayed}`
    );
  }
}
