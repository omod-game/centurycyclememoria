const gameScreen = document.getElementById("centurycyclememoria-game-screen");
const bgImage = document.getElementById("centurycyclememoria-bg-image");
const charImage = document.getElementById("centurycyclememoria-char-image");
const textBox = document.getElementById("centurycyclememoria-text");
const overlay = document.getElementById("centurycyclememoria-overlay");
const nameBox = document.getElementById("centurycyclememoria-name");

let currentLine = 0;
let waitingChoice = null;  // 選択肢表示中フラグ
let affection = { miku: 0, shizuka: 0, rena: 0 };

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
  { text: "……ああ、ちょっと遠くから。", bg: "bg_classroom_morning.jpg" },
  { speaker: "桜井 未来", text: "へえ！　なんだか楽しみだね。クラス替えもあったし、ちょうど新しいスタートだよ", bg: "bg_classroom_morning.jpg", char: "char_miku_smile.png" },
  { text: "その言葉に、不安が少しだけ和らいだ。", bg: "bg_classroom_morning.jpg" },
  { text: "窓の外、春風に舞う桜の花びらが、未来の笑顔を一層まぶしくしていた。", bg: "bg_classroom_sakura.jpg" },
  { speaker: "桜井 未来", text: "ねえ、もしよかったら──放課後、学校案内してあげる！", bg: "bg_classroom_sakura.jpg", char: "char_miku_smile.png" },
  { text: "唐突な誘いに、胸の奥が熱くなる。", bg: "bg_classroom_sakura.jpg" },
  { text: "まるで、ずっと前から待ち望んでいた約束のように。", bg: "bg_dream_overlay.jpg", overlay: true },

  // ▼選択肢を追加
  { 
    choice: true,
    text: "未来の案内をどうする？",
    options: [
      { text: "未来と一緒に学校を見て回る", next: "library_intro", affection: { miku: 1 } },
      { text: "一人で校内を歩いてみたい", next: "self_walk" }
    ]
  },

  // ──未来ルート
  { id: "library_intro", text: "未来に連れられて、静かな図書室へと足を踏み入れる。", bg: "bg_library_inside.jpg" },
  { text: "本の匂いと、窓から差す夕陽の柔らかな光。時間が止まったような空気だった。", bg: "bg_library_inside.jpg" },
  { speaker: "桜井 未来", text: "ここには、よく静がいるんだよ", bg: "bg_library_inside.jpg", char: "char_miku_smile.png" },
  { speaker: "桜井 未来", text: "本に夢中になってて、声をかけても気づかないことがあるくらい", bg: "bg_library_inside.jpg", char: "char_miku_smile.png" },
  { text: "……静かに本をめくる姿が、容易に想像できた。", bg: "bg_library_inside.jpg" },

  // ──自分で歩くルート
  { id: "self_walk", text: "一人で校内を歩いてみることにした。", bg: "bg_school_corridor_noon.jpg" },
  { text: "静かな廊下を歩いていると、ふと開いたドアの奥で、本を読んでいる少女の姿が目に入る。", bg: "bg_library_inside.jpg" },
  { text: "──おそらく、未来が言っていた『静』だろう。", bg: "bg_library_inside.jpg" },
  { speaker: "？？？", text: "……あ、えっと……転校生……？", bg: "bg_library_inside.jpg", char: "char_shizuka_shy.png" },
  { text: "お互いにぎこちない挨拶を交わした。", bg: "bg_library_inside.jpg" },

  // 共通で次のキャラに繋がる
  { text: "図書室を後にし、やがて生徒会室の前に立つ。", bg: "bg_council_door.jpg" },
  { speaker: "桜井 未来", text: "ここは玲奈がよくいるところ。生徒会長なんだ", bg: "bg_council_door.jpg", char: "char_miku_smile.png" },
  { text: "扉の奥からは、誰かが書類をめくる音がかすかに聞こえた。", bg: "bg_council_door.jpg" },
  { speaker: "桜井 未来", text: "真面目でしっかりしてるけど……ちょっと厳しいところもあるかな", bg: "bg_council_door.jpg", char: "char_miku_smile.png" },
  { text: "未来の声には、尊敬とほんの少しの緊張が混じっていた。", bg: "bg_council_door.jpg" },

  // 以下、屋上の流れへ
  { text: "案内はひと通り終わり、気づけば夕暮れ時になっていた。", bg: "bg_school_corridor_evening.jpg" },
  { speaker: "桜井 未来", text: "最後に……特別な場所、見せてあげる！", bg: "bg_school_corridor_evening.jpg" },
  { text: "未来に手を引かれ、階段を上る。", bg: "bg_school_stairs_evening.jpg" },
  { text: "扉を開けた先に広がっていたのは──", bg: "bg_rooftop_evening.jpg" },
  { text: "茜色の空と、遠くに見える街並み。", bg: "bg_rooftop_evening.jpg" },
  { speaker: "桜井 未来", text: "ここ、私のお気に入りなんだ。嫌なことがあっても……ここに来ると落ち着くの", bg: "bg_rooftop_evening.jpg" },
  { text: "未来の横顔は、夕陽に照らされて金色に輝いていた。", bg: "bg_rooftop_evening.jpg", overlay: true },
  { text: "風が吹き抜け、桜の花びらが舞い込む。", bg: "bg_rooftop_evening.jpg" },
  { speaker: "桜井 未来", text: "ねえ……また、ここに来てくれる？", bg: "bg_rooftop_evening.jpg" },
  { text: "その問いに、自然と頷いていた。", bg: "bg_rooftop_evening.jpg" },
  // 選択肢
  { 
    choice: true,
    text: "放課後、どうする？",
    options: [
      { text: "未来と一緒に帰る", next: "miku_root", bg: "bg_school_gate_evening.jpg", affection: { miku: 1 } },
      { text: "図書室に寄る", next: "shizuka_root", bg: "bg_library_inside_evening.jpg", affection: { shizuka: 1 } },
      { text: "生徒会室に寄る", next: "rena_root", bg: "bg_council_inside_evening.jpg", affection: { rena: 1 } },
      { text: "一人で帰る", next: "solo_root", bg: "bg_street_evening.jpg" }
    ]
  },
  
  // 未来ルート
  { id: "miku_root", text: "校門を出ると、未来が少し照れたようにこちらを見た。", bg: "bg_school_gate_evening.jpg", char: "char_miku_smile.png" },
  { speaker: "桜井 未来", text: "ねえ……一緒に帰ってもいい？", bg: "bg_school_gate_evening.jpg", char: "char_miku_blush.png" },
  { text: "不思議と自然に『うん』と答えていた。", bg: "bg_street_evening.jpg" },
  { text: "並んで歩く道は、さっきよりもずっと近く感じられた。", bg: "bg_street_evening.jpg", overlay: true },
  // affection.miku += 1
  
  // 静ルート
  { id: "shizuka_root", text: "未来と別れ、図書室に足を運んだ。", bg: "bg_library_inside_evening.jpg" },
  { text: "夕陽に照らされる窓辺で、一人の少女が静かに本を読んでいた。", bg: "bg_library_inside_evening.jpg" },
  { speaker: "？？？", text: "……転校生？", bg: "bg_library_inside_evening.jpg", char: "char_shizuka_shy.png" },
  { text: "本を閉じ、はにかむように微笑む彼女の姿に、不思議と落ち着きを感じた。", bg: "bg_library_inside_evening.jpg" },
  // affection.shizuka += 1
  
  // 玲奈ルート
  { id: "rena_root", text: "生徒会室の扉をノックすると、中から凛とした声が返ってきた。", bg: "bg_council_inside_evening.jpg" },
  { speaker: "？？？", text: "入っていいわよ。……転校生ね？", bg: "bg_council_inside_evening.jpg", char: "char_rena_cool.png" },
  { text: "整然と並ぶ書類と、机に座る少女の姿。", bg: "bg_council_inside_evening.jpg" },
  { speaker: "玲奈", text: "私は生徒会長の一ノ瀬玲奈。困ったことがあれば言いなさい。ただし、甘えは許さないわよ", bg: "bg_council_inside_evening.jpg", char: "char_rena_serious.png" },
  // affection.rena += 1
  

  ];


// ----------------------------
// シナリオ表示
// ----------------------------
function showLine() {
  const line = scenario[currentLine];
  if (!line) return;

  // 選択肢処理
  if (line.choice) {
    waitingChoice = line;
    displayChoice(line);
    return;
  }
  waitingChoice = null;

  // 選択肢表示をクリア
  const choiceContainer = document.getElementById("choice-container");
  if (choiceContainer) choiceContainer.innerHTML = "";

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

  // 名前とセリフ
  if (line.speaker) {
    nameBox.textContent = line.speaker;
    nameBox.style.display = "inline-block";
    textBox.textContent = `「${line.text}」`;
  } else {
    nameBox.style.display = "none";
    textBox.textContent = line.text;
  }

  // affection 反映
  if (line.affection) {
    for (const key in line.affection) {
      affection[key] += line.affection[key];
      console.log(`${key} affection: ${affection[key]}`);
    }
  }

  // 光る演出
  if (line.flash) {
    const textboxContainer = document.getElementById("centurycyclememoria-textbox");
    textboxContainer.classList.add("textbox-flash");
    setTimeout(() => {
      textboxContainer.classList.remove("textbox-flash");
    }, 2000);
  }
}

// ----------------------------
// 選択肢表示（中央一覧表示・背景変更対応）
// ----------------------------
function displayChoice(choiceLine) {
  waitingChoice = choiceLine;

  // choice-container を用意
  let choiceContainer = document.getElementById("choice-container");
  if (!choiceContainer) {
    choiceContainer = document.createElement("div");
    choiceContainer.id = "choice-container";
    document.getElementById("centurycyclememoria-game-screen").appendChild(choiceContainer);
  }
  choiceContainer.innerHTML = "";

  choiceLine.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.textContent = opt.text;
    btn.className = "scenario-choice fade-in";
    
    // 背景フェード用クリック前に設定
    btn.addEventListener("mouseenter", () => {
      if (opt.bg) {
        // 背景フェード切り替え
        bgImage.style.transition = "opacity 0.6s ease";
        bgImage.style.opacity = 0;
        setTimeout(() => {
          bgImage.src = opt.bg;
          bgImage.style.opacity = 1;
        }, 200);
      }
    });

    btn.addEventListener("click", () => {
      // affection反映
      if (opt.affection) {
        for (const key in opt.affection) {
          affection[key] += opt.affection[key];
          console.log(`${key} affection: ${affection[key]}`);
        }
      }

      // 次のシナリオへジャンプ
      if (opt.next) {
        const nextIndex = scenario.findIndex(l => l.id === opt.next);
        if (nextIndex >= 0) {
          currentLine = nextIndex;
          waitingChoice = null;
          choiceContainer.innerHTML = "";
          showLine();
        }
      }
    });

    choiceContainer.appendChild(btn);
  });
}
// ----------------------------
// クリックで次へ
// ----------------------------
gameScreen.addEventListener("click", () => {
  if (waitingChoice) return; // 選択肢表示中は進まない
  currentLine++;
  if (currentLine < scenario.length) showLine();
});

// ----------------------------
// ページ読み込みで即ナレーション開始
// ----------------------------
window.addEventListener("load", () => {
  currentLine = 0;
  showLine();
});
