const gameScreen = document.getElementById("centurycyclememoria-game-screen");
const bgImage = document.getElementById("centurycyclememoria-bg-image");
const charImage = document.getElementById("centurycyclememoria-char-image");
const overlay = document.getElementById("centurycyclememoria-overlay");

const nameBox = document.getElementById("centurycyclememoria-name");
const textBox = document.getElementById("centurycyclememoria-text");

let currentLine = 0;

// シナリオ
const scenario = [
  { text: "──闇の中、ただひとつの光が浮かんでいた。", bg: "bg_black.jpg" },
  { text: "月明かりに照らされ、桜の花びらが静かに舞う。", bg: "bg_night_sakura.jpg" },
  { text: "その夜に交わされた約束は、百年の輪を越えて──再び巡る。", bg: "bg_night_sakura.jpg", overlay: true },

  { text: "──そして、四月。", bg: "bg_classroom_morning.jpg" },
  { text: "「……ここが、俺の新しい日常か」", bg: "bg_classroom_morning.jpg" },
  { text: "黒板には『席替え』と書かれていた。", bg: "bg_classroom_morning.jpg" },
  { text: "残った席は──桜井未来の隣だった。", bg: "bg_classroom_morning.jpg" },
  { text: "未来「よろしくね！」", bg: "bg_classroom_morning.jpg" },
  { text: "未来「転校生なんだよね？ どこから来たの？」", bg: "bg_classroom_morning.jpg" },
  { text: "「……ああ、ちょっと遠くから」", bg: "bg_classroom_morning.jpg" },
  { text: "未来「へえ！　なんだか楽しみだね。クラス替えもあったし、ちょうど新しいスタートだよ」", bg: "bg_classroom_morning.jpg" },
  { text: "窓の外、春風に舞う桜の花びらが、未来の笑顔を一層まぶしくしていた。", bg: "bg_classroom_sakura.jpg" },
  { text: "未来「ねえ、もしよかったら──放課後、学校案内してあげる！」", bg: "bg_classroom_sakura.jpg" },
  { text: "まるで、ずっと前から待ち望んでいた約束のように。", bg: "bg_dream_overlay.jpg", overlay: true },

  { text: "未来に連れられて、静かな図書室へと足を踏み入れる。", bg: "bg_library_inside.jpg" },
  { text: "未来「ここには、よく静がいるんだよ」", bg: "bg_library_inside.jpg" },
  { text: "未来「本に夢中になってて、声をかけても気づかないことがあるくらい」", bg: "bg_library_inside.jpg" },
  { text: "図書室を出て、次に案内されたのは生徒会室。", bg: "bg_council_door.jpg" },
  { text: "未来「ここは玲奈がよくいるところ。生徒会長なんだ」", bg: "bg_council_door.jpg" },
];

// テキスト描画処理
function renderText(line) {
  const match = line.text.match(/^(.+?)「(.+)」$/);

  if (match) {
    const name = match[1];
    const dialogue = match[2];

    // 名前表示
    nameBox.style.display = "inline-block";
    nameBox.textContent = name;

    // セリフ本文
    textBox.textContent = `「${dialogue}」`;
  } else {
    // ナレーションは名前帯を消す
    nameBox.style.display = "none";
    textBox.textContent = line.text;
  }
}

// シナリオ表示
function showLine() {
  const line = scenario[currentLine];
  if (!line) return;

  // 背景切替
  if (line.bg) {
    bgImage.src = line.bg;
  }

  // キャラ画像
  if (line.char) {
    charImage.src = line.char;
    charImage.style.display = "block";
  } else {
    charImage.style.display = "none";
  }

  // オーバーレイ
  overlay.style.opacity = line.overlay ? 1 : 0;

  // テキスト
  renderText(line);
}

// クリックで次へ
gameScreen.addEventListener("click", () => {
  currentLine++;
  if (currentLine < scenario.length) {
    showLine();
  }
});

// ページ読み込みで即開始
window.addEventListener("load", () => {
  currentLine = 0;
  showLine();
});
