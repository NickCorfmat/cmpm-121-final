import Phaser from "phaser";
import { Trackables } from "./Play";

export class WinScene extends Phaser.Scene {
  private buildingsPlaced: number;
  private resourcesCollected: number;
  private turnsPlayed: number;
  private textConfig: Phaser.Types.GameObjects.Text.TextStyle;
  private text: Phaser.GameObjects.Text;

  constructor() {
    super("sceneWin");
  }

  init(data: Trackables): void {
    this.buildingsPlaced = data.buildingsPlaced;
    this.resourcesCollected = data.resourcesCollected;
    this.turnsPlayed = data.turnsPlayed;

    // tunable text parameters
    this.textConfig = {
      fontSize: "32px",
      align: "center",
      lineSpacing: 10,
    };
  }

  create(): void {
    this.text = this.add
      .text(
        this.game.scale.width / 2,
        this.game.scale.height / 2,
        this.getWinText(),
        this.textConfig
      )
      .setOrigin(0.5);
  }

  // Source: Brace, How can I shorten a long string message?
  getWinText(): string {
    return (
      `You Win!\n` +
      `Buildings Placed: ${this.buildingsPlaced}\n` +
      `Resources Collected: ${this.resourcesCollected}\n` +
      `Turns Played: ${this.turnsPlayed}`
    );
  }
}
