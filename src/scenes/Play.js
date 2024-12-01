/*
Mechanics:
- Player can move one grid tile per turn and place on building per turn
- Player can only place a building on an empty grid tile (Buttons for each building type near end turn button)
- Player can only place a building if they have enough resources
- Player starts with enough resources for 2 buildings
- Player can harvest resources from buildings (must be within one grid cell)
- Each turn player receives the same resources from buildings with different rates based on the type (Drill, Ecavator, DemolitionPlant)
- Player can oil buildings to increase their oil level (must be within one grid cell)
- At the end of the turn, each cell is updated with a sun level, if a building is present, the building recieves the sun level (otherwise the sun level is wasted) and the cell is updated with resources based on the sun and oil level of the cell
- Player cannot oil cells with no buildings
- Buildings use 1 oil level per turn and may be oiled to a maximum of 5
*/

class Play extends Phaser.Scene {
  constructor() {
    super("scenePlay");
  }

  init() {
    // set game display parameters
    this.gridConfig = { width: 8, height: 8, size: 50 };
    this.statsConfig = {
      x: this.gridConfig.width * this.gridConfig.size,
      y: 0,
      width: width - this.gridConfig.width * this.gridConfig.size,
      height: height,
    };

    this.buildings = [
      {
        type: "Drill",
        cost: 10,
        rate: 1,
        scale: 1.6,
      },
      {
        type: "Excavator",
        cost: 30,
        rate: 1.5,
        scale: 1.6,
      },
      {
        type: "DemolitionPlant",
        cost: 50,
        rate: 2,
        scale: 1.6,
      },
    ];

    this.RESOURCE_GOAL = 1000;

    // initialize game stats
    this.trackables = {
      buildingsPlaced: 0,
      resourcesCollected: 0,
      turnsPlayed: 0,
    };

    this.local_storage_key = "saveData";
  }

  create() {
    // initialize game state manager
    this.gameState = new GameState(this);

    // initialize game window
    this.grid = new Grid(this, this.gridConfig);
    this.stats = new Stats(
      this,
      this.statsConfig.x,
      this.statsConfig.y,
      this.statsConfig.width,
      this.statsConfig.height
    );

    // initialize player
    this.player = new Player(this, 0, 0, this.grid);

    // initialize buttons
    this.buttons = new ButtonManager(this);
    
    this.launchGame();
  }

  update() {
    this.player.update();
  }

  updateUI() {
    // prioritize displaying stats of selected cell
    this.grid.selectedCell
      ? this.stats.update(this.grid.selectedCell)
      : this.player.displayCurrentCellStats();

    this.player.updatePlayerDisplay();
  }

  startNextRound() {
    this.grid.step();
    this.updateUI();
    this.gameState.saveState();
  }

  checkWinCondition() {
    if (this.player.resources >= this.RESOURCE_GOAL) {
      this.scene.start("sceneWin", this.trackables);
    }
  }

  launchGame() {
    const savedData = localStorage.getItem(this.local_storage_key);

    // prompt user to continue from auto-save or start new game
    if (savedData && confirm("Do you want to continue where you left off?")) {
      this.gameState.load();
    }

    this.gameState.save();
  }
}
