export interface Event {
    time: number;
    action: string;
    parameters: Record<string, any>;
  }
  
  export interface Level {
    name: string;
    starting_conditions: {
      player_health: number;
      player_position: [number, number];
      weather: string;
    };
    random_weather_policy: string[];
    victory_conditions: string[];
    events: Event[];
  }
  
  export interface Scenario {
    levels: Level[];
  }
  