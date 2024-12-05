export interface Scenario {
  name: string;
  startResources: number;
  victoryCondition: string;
  buildings: Array<{ type: string; row: number; col: number; level: number }>;
  unplacableCells: Array<{ row: number; col: number }>;
}

export function parseScenarioFile(fileContent: string): Scenario {
  const lines = fileContent.split("\n");
  const scenario: Scenario = {
    name: "",
    startResources: 0,
    victoryCondition: "",
    buildings: [],
    unplacableCells: [],
  };

  lines.forEach((line) => {
    const [key, value] = line.split(":").map((s) => s.trim());
    switch (key) {
      case "Scenario":
        scenario.name = value;
        break;
      case "StartResources":
        scenario.startResources = parseInt(value);
        break;
      case "VictoryCondition":
        scenario.victoryCondition = value;
        break;
      case "Buildings":
      case "UnplacableCells":
        // These will be parsed separately
        break;
      default:
        if (key.startsWith("- Type")) {
          const buildingParts = value.split(",").map((s) => s.trim());
          const building = {
            type: buildingParts[0].split(" ")[1],
            row: parseInt(buildingParts[1].split(" ")[1]),
            col: parseInt(buildingParts[2].split(" ")[1]),
            level: parseInt(buildingParts[3].split(" ")[1]),
          };
          scenario.buildings.push(building);
        } else if (key.startsWith("- Row")) {
          const cellParts = value.split(",").map((s) => s.trim());
          const cell = {
            row: parseInt(cellParts[0].split(" ")[1]),
            col: parseInt(cellParts[1].split(" ")[1]),
          };
          scenario.unplacableCells.push(cell);
        }
        break;
    }
  });

  console.log("Parsed scenario:", scenario); // Add log to verify parsing
  return scenario;
}
