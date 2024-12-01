# Devlog Entry - 11/14/24

## Introducing the team

- Marco Ogaz-Vega - Engine Lead
- Ayden Le - Design Co-Lead
- Nick Corfmat - Tools Lead
- Nathan Wiinikka - Design Co-Lead

## Tools and materials

1. Our team will be using the Phaser 3 game engine given our familiarity with this framework and its support for web-based 2D game development. The engine’s environment will allow us to quickly prototype and refine the grid-based game by providing us with the necessary tools for development. Built-in features like physics, animation, and input handlers are just some examples of the development tools that will allow us to design an enjoyable game experience.

2. For this project, we will be starting out with JavaScript, as it is Phaser’s native language and will allow us to utilize its API without having to worry about compatibility issues. Additionally, we will be storing and managing all of our game’s data using JSON, given the readability and low weight of this format. JSON is also highly compatible with JavaScript—a quality that will allow us to seamlessly integrate it with our game’s source code.

3. Visual Studio Code will be our team’s primary IDE for its overall familiarity and for its ease of integration with Github. Github will be our version controller for this project so VS Code’s compatibility with it will be a major help. As for asset creation, Piskel and Aesprite will be our primary resources as they are great 2D pixel editors with lots of features applicable to game development projects.

4. We plan to migrate from JavaScript to Typescript given the close similarities both languages share, as well as the benefits Typescript offers. We will continue using Phaser as our primary game engine, however, we will have to modify our original code to account for differences between JavaScript and Typescript. For example, adding strict type-checking to functions and variables to ensure the game’s code is less susceptible to breaking and ensuring this change remains consistent with Phaser API function calls.

## Outlook

As a team, we are hoping to avert expectations about the aesthetic and design decisions in order to accomplish all the required elements of the assignment in a fun and unique way. One way we might do this is changing the overall farming aesthetic to something like sci-fi or fantasy. On the design front, we might implement Three.js in order to render 3-D game objects in a browser framework. We are hoping to use our combined academic experience in Phaser 3 through our course work at UCSC to make a nice foundation for us as we continue to learn more about the engine and experiment with new libraries. We anticipate that learning typescript in the context of Phaser 3 will be our biggest hurdle as we all do not have much experience with these two in tandem.

## Sources

Astronaut sprite from "Space Runner Asset Pack" by
MattWalkden on itch.io
https://mattwalkden.itch.io/free-space-runner-pack

Cell and stats tile made in GIMP
https://www.gimp.org/

# Devlog Entry - 11/23/24

## How we satisfied the software requirements
- [F0.a] The player can control a character over a 2d grid using the arrow keys. The player also uses the mouse to select grid cells to view stats about that grid cell and any applicable buildings that might be placed there. Players can also purchase buildings when a grid cell is selected in the buy menu below the game screen.

- [F0.b] The player can advance time with the "end turn" button which is located in the buy menu below the game screen. Each turn randomly generates new sun and water levels for each cell, as well as produces collectable resources for all currently placed buildings. Resources can be accumulated over multiple turns in buildings.
  
- [F0.c] The player can place buildings and collect resources from them only when they are within one cell from them; in other words, they can only interact with adjacent cells.
  
- [F0.d] Each grid cell has a sun and water level that is randomly generated after each turn. The sun level for any given level is always a random number between 1 and 5 and only gets added to cells that contain a building. The water level for every cell starts at level 2 but every turn has an equal chance of increasing by 1, decreasing by 1, or staying the same.
  
- [F0.e] Each building has a distinct type: Drill, Excavator, or Demolition Plant. All three types of buildings have a level 1, 2, and 3. Levels are unlocked by having a different type of building next to a building.
  
- [F0.f] For every unique building placed next to each other, those buildings gain a level. In order for a building to reach level 3, it must have at least 2 unique buildings adjacent to that building's cell.
  
- [F0.g] The play scenario is satisfied when the player collects a total of 1000 resources. After the player collects 1000 resources the game is transitioned to a Win scene and the player is shown stats like how many total resources they collected, how many buildings they placed, and how many turns they took to win.

## Reflection
There were many changes we had to make in order to satisfy the F0 requirements. For example, we had to change the design of the machines and their resource collection. We had initially planned to oil the machines manually with the player so that the player has some control over how well the machines take in resources. This oil mechanic was planned to take the place of the water mechanic currently implemented. Because the water and sun had to be random in some way we had to adjust our design of our game in order to fit these requirements. We had also planned on a separate mechanic on how to level up machines using the resources they collected. However, this again had to be adjusted because of the requirements stating that growth had to be determined spatially. Our tools and materials used were the same ones we stated in the previous devlog. The familiarity with these tools aided us in our development and not many adjustments were made in this regard. Our roles were kept intact throughout this development as well.
