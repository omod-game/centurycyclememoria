document.addEventListener("DOMContentLoaded", () => {
  const gameScreen = document.getElementById("centurycyclememoria-game-screen");
  const bgImage = document.getElementById("centurycyclememoria-bg-image");
  const charImage = document.getElementById("centurycyclememoria-char-image");
  const textBox = document.getElementById("centurycyclememoria-text");
  const overlay = document.getElementById("centurycyclememoria-overlay");
  const nameBox = document.getElementById("centurycyclememoria-name");
  const choiceContainer = document.getElementById("choice-container");
  const textboxWrapper = document.getElementById("centurycyclememoria-textbox-wrapper");

  const menuButton = document.getElementById("menu-button");
  const menuPanel = document.getElementById("menu-panel");
  const saveButton = document.getElementById("save-button");
  const loadButton = document.getElementById("load-button");
  const logButton = document.getElementById("log-button");
  const menuHome = document.getElementById("menu-home");
  const menuClose = document.getElementById("menu-close");

  const logOverlay = document.getElementById("log-overlay");
  const logClose = document.getElementById("log-close");
  const logContent = document.getElementById("log-content");

  const loadOnStart = localStorage.getItem("loadOnStart");

  // state
  let currentLine = 0;
  let suppressLogPush = false; // ロード時などで addLogEntry を抑止したい場合に true にする
  let waitingChoice = false;   // 選択肢表示中かどうか
  let wasChoiceVisible = false; // ログを閉じた後に選択肢を復元するため

  const affection = { miku: 0, shizuka: 0, rena: 0 };
  const logHistory = [];

  // --- シナリオ（元のものをそのまま入れてください） ---
  const scenario = [
    { text: "──闇の中、ただひとつの光が浮かんでいた。", bg: "bg_black.jpg" },
    { text: "月明かりに照らされ、桜の花びらが静かに舞う。", bg: "bg_night_sakura.jpg" },
    { text: "その夜に交わされた約束は、百年の輪を越えて──再び巡る。", bg: "bg_night_sakura.jpg", overlay: true },
    { text: "──そして、四月。", bg: "bg_classroom_morning.jpg" },
    { text: "「……ここが、俺の新しい日常か」", bg: "bg_classroom_morning.jpg" },
    { text: "緊張で胸が重い。それでも、期待に似たざわつきがどこか奥にある。", bg: "bg_classroom_morning.jpg" },
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

    {
      choice: true,
      text: "未来の案内をどうする？",
      options: [
        { text: "未来と一緒に学校を見て回る", next: "library_intro", affection: { miku: 1 } },
        { text: "一人で校内を歩いてみたい", next: "self_walk" }
      ]
    },

    { id: "library_intro", text: "未来に連れられて、静かな図書室へと足を踏み入れる。", bg: "bg_library_inside.jpg" },
    { text: "本の匂いと、窓から差す夕陽の柔らかな光。時間が止まったような空気だった。", bg: "bg_library_inside.jpg" },
    { speaker: "桜井 未来", text: "ここには、よく静がいるんだよ", bg: "bg_library_inside.jpg", char: "char_miku_smile.png" },
    { speaker: "桜井 未来", text: "本に夢中になってて、声をかけても気づかないことがあるくらい", bg: "bg_library_inside.jpg", char: "char_miku_smile.png" },
    { text: "……静かに本をめくる姿が、容易に想像できた。", bg: "bg_library_inside.jpg" },

    { id: "self_walk", text: "一人で校内を歩いてみることにした。", bg: "bg_school_corridor_noon.jpg" },
    { text: "静かな廊下を歩いていると、ふと開いたドアの奥で、本を読んでいる少女の姿が目に入る。", bg: "bg_library_inside.jpg" },
    { text: "──おそらく、未来が言っていた『静』だろう。", bg: "bg_library_inside.jpg" },
    { speaker: "？？？", text: "……あ、えっと……転校生……？", bg: "bg_library_inside.jpg", char: "char_shizuka_shy.png" },
    { text: "お互いにぎこちない挨拶を交わした。", bg: "bg_library_inside.jpg" },

    { text: "図書室を後にし、やがて生徒会室の前に立つ。", bg: "bg_council_door.jpg" },
    { speaker: "桜井 未来", text: "ここは玲奈がよくいるところ。生徒会長なんだ", bg: "bg_council_door.jpg", char: "char_miku_smile.png" },
    { text: "扉の奥からは、誰かが書類をめくる音がかすかに聞こえた。", bg: "bg_council_door.jpg" },
    { speaker: "桜井 未来", text: "真面目でしっかりしてるけど……ちょっと厳しいところもあるかな", bg: "bg_council_door.jpg", char: "char_miku_smile.png" },

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

    { id: "miku_root", text: "校門を出ると、未来が少し照れたようにこちらを見た。", bg: "bg_school_gate_evening.jpg", char: "char_miku_smile.png" },
    { speaker: "桜井 未来", text: "ねえ……一緒に帰ってもいい？", bg: "bg_school_gate_evening.jpg", char: "char_miku_blush.png" },
    { text: "不思議と自然に『うん』と答えていた。", bg: "bg_street_evening.jpg" },
    { text: "並んで歩く道は、さっきよりもずっと近く感じられた。", bg: "bg_street_evening.jpg", overlay: true },

    { id: "shizuka_root", text: "未来と別れ、図書室に足を運んだ。", bg: "bg_library_inside_evening.jpg" },
    { text: "夕陽に照らされる窓辺で、一人の少女が静かに本を読んでいた。", bg: "bg_library_inside_evening.jpg" },
    { speaker: "？？？", text: "……転校生？", bg: "bg_library_inside_evening.jpg", char: "char_shizuka_shy.png" },
    { text: "本を閉じ、はにかむように微笑む彼女の姿に、不思議と落ち着きを感じた。", bg: "bg_library_inside_evening.jpg" },

    { id: "rena_root", text: "生徒会室の扉をノックすると、中から凛とした声が返ってきた。", bg: "bg_council_inside_evening.jpg" },
    { speaker: "？？？", text: "入っていいわよ。……転校生ね？", bg: "bg_council_inside_evening.jpg", char: "char_rena_cool.png" },
    { text: "整然と並ぶ書類と、机に座る少女の姿。", bg: "bg_council_inside_evening.jpg" },
    { speaker: "玲奈", text: "私は生徒会長の白石玲奈。困ったことがあれば言いなさい。ただし、甘えは許さないわよ", bg: "bg_council_inside_evening.jpg", char: "char_rena_serious.png" },
    { text: "その真っ直ぐな瞳に、思わず背筋が伸びる。", bg: "bg_council_inside_evening.jpg" },
    { speaker: "桜井 未来", text: "ほらね、ちょっと厳しいでしょ。でも頼りになるんだよ", bg: "bg_council_inside_evening.jpg", char: "char_miku_smile.png" },
    { text: "玲奈は軽くため息をつくと、書類に視線を戻した。", bg: "bg_council_inside_evening.jpg" },
    { speaker: "玲奈", text: "……歓迎するわ。けれど、ここで過ごすなら覚悟を持ちなさい。", bg: "bg_council_inside_evening.jpg", char: "char_rena_cool.png" },
    { text: "意味深な言葉に、心がざわめく。", bg: "bg_council_inside_evening.jpg", overlay: true },

    { text: "夕暮れの鐘が、校舎に静かに響いた。", bg: "bg_school_corridor_evening.jpg" },
    { text: "その音は、始まりを告げる鐘──それとも、終わりを繰り返す鐘なのか。", bg: "bg_school_corridor_evening.jpg", overlay: true },
    { text: "胸の奥で、答えの見えないざわめきが鳴り止まなかった。", bg: "bg_school_corridor_evening.jpg" }

    // ...以降続ける
  ];

  // --- helper: playBGM（無ければ無処理） ---
  function playBGM(bgm) {
    // 実装があれば再生。今はプレースホルダ。
    // 例: const audio = new Audio(bgm); audio.loop = true; audio.play();
  }

  // --- helper: 最後に出た該当の選択肢ログエントリを探す ---
  function findLastChoiceLogForLine(line) {
    if (!line || !line.choice) return null;
    const needle = "▼ " + line.text;
    for (let i = logHistory.length - 1; i >= 0; i--) {
      const e = logHistory[i];
      if (e && e.text === needle && Array.isArray(e.choices)) return e;
    }
    return null;
  }

  // ----------------- showLine -----------------
  // 戻り値: true = 通常テキストを表示した（進行すれば currentLine++ する）, false = 選択肢を表示した／何も表示しなかった
  function showLine() {
    const line = scenario[currentLine];
    if (!line) return false;

    // 選択肢判定（choiceフラグを優先）
    if (line.choice) {
      waitingChoice = true;
      displayChoice(line);    // 選択肢表示（これ内で currentLine を固定）
      textboxWrapper.style.display = "none";
      wasChoiceVisible = true;
      return false;
    } else {
      waitingChoice = false;
      choiceContainer.style.display = "none";
      textboxWrapper.style.display = "block";
      wasChoiceVisible = false;
    }

    // 背景・立ち絵・オーバーレイ
    if (line.bg) bgImage.src = line.bg;
    if (line.char) {
      charImage.src = line.char;
      charImage.style.display = "block";
    } else {
      charImage.style.display = "none";
    }
    overlay.style.opacity = line.overlay ? 1 : 0;

    // 台詞 or 描写
    if (line.speaker) {
      nameBox.style.display = "inline-block";
      nameBox.textContent = line.speaker;
      textBox.innerHTML = `「${line.text.replace(/\n/g, "<br>")}」`;

      if (!suppressLogPush && !line.choice) addLogEntry(line.speaker, line.text);
    } else {
      nameBox.style.display = "none";
      textBox.innerHTML = line.text ? line.text.replace(/\n/g, "<br>") : "";

      if (!suppressLogPush && !line.choice) addLogEntry(null, line.text);
    }

    return true;
  }

  // ----------------- displayChoice -----------------
  // fromRestore: true のときは logHistory に新規 push しない（既に保存済みのはず）
  function displayChoice(line, fromRestore = false) {
    // currentLine を選択肢の行に固定しておく（他処理が currentLine を参照するため）
    const choiceIndex = scenario.findIndex(l => l === line);
    if (choiceIndex >= 0) currentLine = choiceIndex;

    // 背景・立ち絵をその選択肢行の設定に合わせる
    if (line.bg) bgImage.src = line.bg;
    if (line.char) {
      charImage.src = line.char;
      charImage.style.display = "block";
    } else {
      charImage.style.display = "none";
    }
    overlay.style.opacity = line.overlay ? 1 : 0;

    choiceContainer.innerHTML = "";
    choiceContainer.style.display = "flex";

    const prompt = document.createElement("div");
    prompt.id = "choice-prompt";
    prompt.className = "choice-prompt";
    prompt.textContent = line.text;
    choiceContainer.appendChild(prompt);

    // ログ保存は初回表示のみ
    if (!fromRestore && !suppressLogPush) {
      logHistory.push({
        speaker: line.speaker || null,
        text: "▼ " + line.text,
        choices: line.options.map(opt => ({ text: opt.text, selected: false }))
      });
    }

    // もしログに既に選択状態が残っていればそれを反映（fromRestoreの場合が主）
    const existingLog = findLastChoiceLogForLine(line); // null なら未選択
    const selectedIndex = existingLog ? existingLog.choices.findIndex(c => c.selected) : -1;

    line.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.textContent = opt.text;
      btn.className = "scenario-choice";
      if (idx === selectedIndex) {
        btn.classList.add("selected"); // CSS側で .selected を装飾してください
      }

      btn.addEventListener("click", () => {
        // affection の増加
        if (opt.affection) {
          for (const key in opt.affection) {
            affection[key] += opt.affection[key];
          }
        }

        // 次の行 index を決める（id 指定 or 単純に次）
        let nextIndex;
        if (opt.next) {
          nextIndex = scenario.findIndex(l => l.id === opt.next);
          if (nextIndex < 0) nextIndex = currentLine + 1;
        } else {
          nextIndex = currentLine + 1;
        }

        // ログの last choice エントリに選択結果を反映
        const lastEntry = findLastChoiceLogForLine(line);
        if (lastEntry && Array.isArray(lastEntry.choices)) {
          lastEntry.choices = line.options.map(o => ({ text: o.text, selected: o.text === opt.text }));
        }

        waitingChoice = false;
        choiceContainer.innerHTML = "";
        choiceContainer.style.display = "none";

        // currentLine を次に移し、即座に次のテキストを表示（showLine が true を返すので advance は不要）
        currentLine = nextIndex;
        // 注意: suppressLogPush は false のままにしておく（ここは通常進行）
        const progressed = showLine();
        if (progressed) {
          // nothing to do: click handler increments currentLine when appropriate
        }
      });

      choiceContainer.appendChild(btn);
    });

    textBox.textContent = "";
    nameBox.style.display = "none";
  }

  // ----------------- ログ表示関連 -----------------
  logButton.addEventListener("click", () => {
    updateLog();
    logOverlay.style.display = "block";
    wasChoiceVisible = (choiceContainer.style.display === "flex");
    textboxWrapper.style.display = "none";
    choiceContainer.style.display = "none";
    menuPanel.classList.remove("show");
    menuButton.classList.remove("active");
    menuButton.style.display = "none";
  });

  logClose.addEventListener("click", () => {
    logOverlay.style.display = "none";
    menuButton.style.display = "block";
    menuPanel.style.display = "flex";
    menuPanel.classList.remove("show");
    menuButton.classList.remove("active");

    if (wasChoiceVisible) {
      choiceContainer.style.display = "flex";
      textboxWrapper.style.display = "none";
    } else {
      choiceContainer.style.display = "none";
      textboxWrapper.style.display = "block";
    }
  });

  function addLogLine(speaker, text, color = "#fff") {
    const div = document.createElement("div");
    div.className = "log-entry";
    div.style.marginBottom = "12px";
    div.style.width = "80%";
    div.style.marginLeft = "0";
    div.style.marginRight = "auto";

    if (speaker) {
      const name = document.createElement("div");
      name.className = "log-speaker";
      name.textContent = speaker;
      name.style.color = color;
      name.style.fontWeight = "bold";
      name.style.marginBottom = "4px";
      div.appendChild(name);
    }

    const txt = document.createElement("div");
    txt.className = "log-text";
    txt.innerHTML = speaker ? `「${text.replace(/\n/g, "<br/>")}」` : text.replace(/\n/g, "<br/>");
    txt.style.whiteSpace = "pre-wrap";
    txt.style.wordBreak = "break-word";
    div.appendChild(txt);

    logContent.appendChild(div);
    const lastLog = logContent.lastElementChild;
    if (lastLog) lastLog.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  function updateLog() {
    logContent.innerHTML = "";
    logHistory.forEach(entry => {
      if (entry.text) {
        const charColors = { "桜井 未来": "#ff69b4", "？？？": "#87ceeb", "玲奈": "#ffa500" };
        const color = charColors[entry.speaker] || "#fff";
        addLogLine(entry.speaker, entry.text, color);
      }
      if (entry.choices) {
        entry.choices.forEach(opt => {
          const c = document.createElement("div");
          c.className = "log-choice" + (opt.selected ? " log-selected" : "");
          const prefix = opt.selected ? "" : "　 ";
          c.textContent = prefix + opt.text;
          logContent.appendChild(c);
        });
      }
    });
    const lastLog = logContent.lastElementChild;
    if (lastLog) lastLog.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  // ----------------- クリックで進む（修正） -----------------
  gameScreen.addEventListener("click", (e) => {
    if (menuPanel.classList.contains("show")) return;
    if (logOverlay.style.display === "block") return;
    if (waitingChoice) return;
    if (e.target.closest("#menu-button, #menu-panel")) return;

    if (currentLine < scenario.length) {
      const progressed = showLine(); // 表示して、trueなら通常行（currentLine を進める）
      if (progressed) currentLine++;
    }
  });

  // ----------------- セーブ / ロード -----------------
  function saveGame() {
    // 保存する currentLine は「現在見えている選択肢行」を反映するようにする
    // （waitingChoice の場合、currentLine は選択行になっているはずだが念のためログから検索）
    let saveLine = currentLine;
    if (waitingChoice) {
      // 最後に出ている '▼ ' の行を探してそのシナリオ index を使う
      const lastChoiceLog = logHistory.slice().reverse().find(e => e.text && e.text.startsWith("▼ "));
      if (lastChoiceLog) {
        const choiceText = lastChoiceLog.text.slice(2);
        const idx = scenario.findIndex(l => l.choice && l.text === choiceText);
        if (idx >= 0) saveLine = idx;
      } else {
        // fallback: 現状の currentLine を使う
      }
    }

    const saveData = {
      currentLine: saveLine,
      affection,
      logHistory,
      waitingChoice: !!waitingChoice,
      // 以下は補助的に UI 復元のために保存（必須ではないが便利）
      bg: bgImage.src,
      char: charImage.src
    };
    localStorage.setItem("centurycyclememoria-save", JSON.stringify(saveData));
    alert("ゲームをセーブしました。");
  }

  function loadGame(showAlert = true) {
    const saveData = JSON.parse(localStorage.getItem("centurycyclememoria-save"));
    if (saveData) {
      currentLine = saveData.currentLine || 0;
      Object.assign(affection, saveData.affection || {});

      // ログ復元
      logHistory.length = 0;
      if (Array.isArray(saveData.logHistory)) logHistory.push(...saveData.logHistory);

      // waitingChoice 復元
      waitingChoice = !!saveData.waitingChoice;

      // suppressLogPush during UI rebuild so we don't duplicate entries
      suppressLogPush = true;
      restoreLine(currentLine, saveData);
      suppressLogPush = false;

      if (showAlert) alert("ゲームをロードしました。");
      return true;
    } else {
      if (showAlert) alert("セーブデータがありません。");
      return false;
    }
  }

  // restoreLine: saveData を optional に取り、選択肢の復元を試みる
  function restoreLine(lineIndex, saveData = {}) {
    const line = scenario[lineIndex];
    if (!line) return;

    // まずログ表示を更新（ログを先に描画すると状態把握が楽）
    logContent.innerHTML = "";
    updateLog();

    // 背景を復元（セーブデータ優先 → 行にbgがあれば適用）
    if (saveData.bg) {
      bgImage.src = saveData.bg;
    } else if (line.bg) {
      bgImage.src = line.bg;
    } else {
      bgImage.src = "bg_moon_sakura.jpg"; // デフォルト
    }
  
    // キャラ立ち絵を復元
    if (saveData.char) {
      charImage.src = saveData.char;
      charImage.style.display = "block";
    } else if (line.char) {
      charImage.src = line.char;
      charImage.style.display = "block";
    } else {
      charImage.style.display = "none";
    }
  
    // ✅ 選択肢の行なら専用処理
    if (line.choice && line.options) {
      const lastChoiceLog = findLastChoiceLogForLine(line);
      const selectedIndex = lastChoiceLog
        ? lastChoiceLog.choices.findIndex(c => c.selected)
        : -1;
  
      if (selectedIndex === -1) {
        // まだ選んでいない → 選択肢 UI を表示
        waitingChoice = true;
        displayChoice(line, true); // fromRestore = true → ログに二重追加しない
        textboxWrapper.style.display = "none";
        return;
      } else {
        // 既に選んである → 分岐先へ進む
        const chosenOpt = line.options[selectedIndex];
        let nextIndex = (chosenOpt && chosenOpt.next)
          ? scenario.findIndex(l => l.id === chosenOpt.next)
          : lineIndex + 1;
        if (nextIndex < 0) nextIndex = lineIndex + 1;
  
        currentLine = nextIndex;
        restoreLine(currentLine, saveData); // 再帰的に復元
        return;
      }
    }

    // 非選択肢行の復元（背景・立ち絵）
    if (line.bg) bgImage.src = line.bg;
    if (line.char) {
      charImage.src = line.char;
      charImage.style.display = "block";
    } else {
      charImage.style.display = "none";
    }
    overlay.style.opacity = line.overlay ? 1 : 0;

    if (line.speaker) {
      nameBox.style.display = "inline-block";
      nameBox.textContent = line.speaker;
      textBox.innerHTML = `「${line.text.replace(/\n/g, "<br>")}」`;
    } else {
      nameBox.style.display = "none";
      textBox.innerHTML = line.text ? line.text.replace(/\n/g, "<br>") : "";
    }
  }

  // addLogEntry: 重複しない簡易デデュープ
  function addLogEntry(speaker, text) {
    if (suppressLogPush) return;  // ここが無いと二重登録
    const last = logHistory[logHistory.length - 1];
    if (!last || last.speaker !== speaker || last.text !== text) {
      logHistory.push({ speaker, text });
    }
    // ログパネルが開いている場合は更新
    if (logOverlay.style.display === "block") updateLog();
  }

  // ----------------- 起動時の処理 -----------------
  const shouldLoad = localStorage.getItem("loadOnStart") === "true";
  localStorage.removeItem("loadOnStart");

  textboxWrapper.style.display = "none";
  waitingChoice = true;
  bgImage.src = "bg_moon_sakura.jpg";

  if (shouldLoad) {
    showYesNoMenu("続きから始めますか？", () => {
      const loaded = loadGame(false);
      if (!loaded) {
        currentLine = 0;
        startGame();
      }
    });
  } else {
    showYesNoMenu("最初から始めますか？", () => {
      currentLine = 0;
      startGame();
    });
  }

  function startGame() {
    choiceContainer.innerHTML = "";
    choiceContainer.style.display = "none";
    waitingChoice = false;
    textboxWrapper.style.display = "block";
    // 最初のクリックで showLine() が呼ばれます
  }

  // Confirmation menu
  function showYesNoMenu(question, yesCallback) {
    choiceContainer.innerHTML = "";
    choiceContainer.style.display = "flex";
    choiceContainer.style.flexDirection = "column";
    choiceContainer.style.alignItems = "center";
    choiceContainer.style.justifyContent = "center";

    const prompt = document.createElement("div");
    prompt.id = "choice-prompt";
    prompt.textContent = question;
    choiceContainer.appendChild(prompt);

    const yesBtn = document.createElement("button");
    yesBtn.className = "scenario-choice";
    yesBtn.textContent = "はい";
    yesBtn.addEventListener("click", () => yesCallback());

    const noBtn = document.createElement("button");
    noBtn.className = "scenario-choice";
    noBtn.textContent = "いいえ";
    noBtn.addEventListener("click", () => { window.location.href = "index.html"; });

    choiceContainer.appendChild(yesBtn);
    choiceContainer.appendChild(noBtn);
  }

  // ----------------- メニュー等 -----------------
  menuButton.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = menuPanel.classList.toggle("show");
    menuButton.classList.toggle("active", isOpen);
    menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  menuClose.addEventListener("click", () => {
    menuPanel.classList.remove("show");
    menuButton.setAttribute("aria-expanded", "false");
  });

  document.addEventListener("click", (e) => {
    if (!menuPanel.contains(e.target) && e.target !== menuButton) {
      menuPanel.classList.remove("show");
      menuButton.classList.remove("active");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });

  saveButton.addEventListener("click", saveGame);
  loadButton.addEventListener("click", () => loadGame(true));

  menuHome.addEventListener("click", () => { window.location.href = "index.html"; });

});
