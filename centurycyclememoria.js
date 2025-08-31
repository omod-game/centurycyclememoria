const gameScreen = document.getElementById("centurycyclememoria-game-screen");
const bgImage = document.getElementById("centurycyclememoria-bg-image");
const charImage = document.getElementById("centurycyclememoria-char-image");
const textBox = document.getElementById("centurycyclememoria-text");
const overlay = document.getElementById("centurycyclememoria-overlay");
const nameBox = document.getElementById("centurycyclememoria-name");

let currentLine = 0;

// シナリオ
const scenario = [
  { text: "──闇の中、ただひとつの光が浮かんでいた。", bg: "bg_black.jpg" },
  { text: "月明かりに照らされ、桜の花びらが静かに舞う。", bg: "bg_night_sakura.jpg" },
  { text: "その夜に交わされた約束は、百年の輪を越えて──再び巡る。", bg: "bg_night_sakura.jpg", overlay: true },

  { text: "──そして、四月。", bg: "bg_classroom_morning.jpg" },
  { text: "「……ここが、俺の新しい日常か」", bg: "bg_classroom_morning.jpg" },
  { text: "緊張で胸が重い。それでも、期待に似たざわつきがどこか奥にある。", bg: "bg_classroom_morning.jpg", group: true },
  { text: "黒板には『席替え』と書かれていた。", bg: "bg_classroom_morning.jpg" },
  { text: "残った席は──桜井 未来の隣だった。", bg: "bg_classroom_morning.jpg" },
  { speaker: "桜井 未来", text: "よろしくね！", bg: "bg_classroom_morning.jpg", char: "char_miku_smile.png" },
  { text: "偶然のようでいて、なぜかずっと前から決まっていた気がした。", bg: "bg_classroom_morning.jpg", char: "char_miku_dream.png", overlay: true },
  { speaker: "桜井 未来", text: "転校生なんだよね？ どこから来たの？", bg: "bg_classroom_morning.jpg", char: "char_miku_smile.png" },
  { text: "……ああ、ちょっと遠くから", bg: "bg_classroom_morning.jpg" },
  { speaker: "桜井 未来", text: "へえ！　なんだか楽しみだね。クラス替えもあったし、ちょうど新しいスタートだよ", bg: "bg_classroom_morning.jpg" },
  { text: "その言葉に、不安が少しだけ和らいだ。", bg: "bg_classroom_morning.jpg" },
  { text: "窓の外、春風に舞う桜の花びらが、未来の笑顔を一層まぶしくしていた。", bg: "bg_classroom_sakura.jpg" },
  { speaker: "桜井 未来", text: "ねえ、もしよかったら──放課後、学校案内してあげる！", bg: "bg_classroom_sakura.jpg" },
  { text: "唐突な誘いに、胸の奥が熱くなる。", bg: "bg_classroom_sakura.jpg" },
  { text: "まるで、ずっと前から待ち望んでいた約束のように。", bg: "bg_dream_overlay.jpg", overlay: true },

  { text: "未来に連れられて、静かな図書室へと足を踏み入れる。", bg: "bg_library_inside.jpg" },
  { text: "本の匂いと、窓から差す夕陽の柔らかな光。時間が止まったような空気だった。", bg: "bg_library_inside.jpg" },
  { speaker: "桜井 未来", text: "ここには、よく静がいるんだよ", bg: "bg_library_inside.jpg" },
  { speaker: "桜井 未来", text: "本に夢中になってて、声をかけても気づかないことがあるくらい", bg: "bg_library_inside.jpg" },
  { text: "……静かに本をめくる姿が、容易に想像できた。", bg: "bg_library_inside.jpg" },

  { text: "図書室を出て、次に案内されたのは生徒会室。", bg: "bg_council_door.jpg" },
  { speaker: "桜井 未来", text: "ここは玲奈がよくいるところ。生徒会長なんだ", bg: "bg_council_door.jpg" },
  { text: "扉の奥からは、誰かが書類をめくる音がかすかに聞こえた。", bg: "bg_council_door.jpg" },
  { speaker: "桜井 未来", text: "真面目でしっかりしてるけど……ちょっと厳しいところもあるかな", bg: "bg_council_door.jpg" },
  { text: "未来の声には、尊敬とほんの少しの緊張が混じっていた。", bg: "bg_council_door.jpg" }
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

  // 名前とセリフ
  if (line.speaker) {
    nameBox.textContent = line.speaker;
    nameBox.style.display = "inline-block";
    textBox.textContent = `「${line.text}」`;
  } else {
    nameBox.style.display = "none";
    textBox.textContent = line.text;
  }
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
