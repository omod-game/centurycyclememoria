const gameScreen = document.getElementById("centurycyclememoria-game-screen");
const bgImage = document.getElementById("centurycyclememoria-bg-image");
const charImage = document.getElementById("centurycyclememoria-char-image");
const textBox = document.getElementById("centurycyclememoria-text");
const overlay = document.getElementById("centurycyclememoria-overlay");

let currentLine = 0;

// シナリオ
const scenario = [
  { text: "──闇に浮かぶ月夜。桜の花びらが、静かに風に舞っていた。", bg: "ccm_black.jpg" },
  { text: "その夜に結ばれた約束は、百年の輪を越えて再び巡る。", bg: "ccm_black.jpg", overlay: true },
  { text: "──四月、転校初日の朝。", bg: "ccm_classroom_bg.jpg" },
  { text: "教室に入ると、ざわめきと新しい匂いが押し寄せてきた。", bg: "ccm_classroom_bg.jpg" },
  // 以降は本編のセリフを追加
];

// シナリオ表示
function showLine() {
  const line = scenario[currentLine];
  if (!line) return;

  // 背景切替
  if (line.bg) {
    bgImage.src = line.bg;
  }

  // キャラ画像（必要ならline.charで設定可能）
  if (line.char) {
    charImage.src = line.char;
    charImage.style.display = "block";
  } else {
    charImage.style.display = "none";
  }

  // オーバーレイ
  overlay.style.opacity = line.overlay ? 1 : 0;

  // テキスト
  textBox.textContent = line.text;
}

// クリックで次へ
gameScreen.addEventListener("click", () => {
  currentLine++;
  if (currentLine < scenario.length) {
    showLine();
  }
});

// ページ読み込みで即ナレーション開始
window.addEventListener("load", () => {
  currentLine = 0;
  showLine();
});
