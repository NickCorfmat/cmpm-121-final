const CACHE_NAME = "game-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/src/main.ts",
  "/src/style.css",
  "/src/prefabs/ButtonManager.ts",
  "/src/prefabs/Cell.ts",
  "/src/prefabs/GameState.ts",
  "/src/prefabs/Grid.ts",
  "/src/prefabs/LanguageManager.ts",
  "/src/prefabs/Player.ts",
  "/src/prefabs/Stats.ts",
  "/src/scenes/Keys.ts",
  "/src/scenes/Load.ts",
  "/src/scenes/Play.ts",
  "/src/scenes/Win.ts",
  "/config/scenario.yaml",
  "/assets/Astronaut_Idle.json",
  "/assets/Astronaut_Idle.png",
  "/assets/cell.png",
  "/assets/demo1.png",
  "/assets/demo2.png",
  "/assets/demo3.png",
  "/assets/drill1.png",
  "/assets/drill2.png",
  "/assets/drill3.png",
  "/assets/excavator1.png",
  "/assets/excavator2.png",
  "/assets/excavator3.png",
  "/assets/stats.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
