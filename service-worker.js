self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
});

self.addEventListener("fetch", (event) => {
  // オフライン対応したいならキャッシュ処理を追加
});
