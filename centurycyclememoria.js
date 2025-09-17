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

  let currentLine = 0;
  let suppressLogPush = false; // true の間は showLine() が logHistory へ push しない
  let waitingChoice = false;   // 選択肢処理中かどうか
  let wasChoiceVisible = false; // ログを閉じた後に選択肢を復元するため

  const affection = { miku: 0, shizuka: 0, rena: 0 };
  const logHistory = [];

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
    // 未来ルート
    { id: "library_intro", text: "未来に連れられて、静かな図書室へと足を踏み入れる。", bg: "bg_library_inside.jpg" },
    { text: "本の匂いと、窓から差す夕陽の柔らかな光。時間が止まったような空気だった。", bg: "bg_library_inside.jpg" },
    { speaker: "桜井 未来", text: "ここには、よく静がいるんだよ", bg: "bg_library_inside.jpg", char: "char_miku_smile.png" },
    { speaker: "桜井 未来", text: "本に夢中になってて、声をかけても気づかないことがあるくらい", bg: "bg_library_inside.jpg", char: "char_miku_smile.png" },
    { text: "……静かに本をめくる姿が、容易に想像できた。", bg: "bg_library_inside.jpg" },

    // 自分で歩くルート
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

    // 未来ルート
    { id: "miku_root", text: "校門を出ると、未来が少し照れたようにこちらを見た。", bg: "bg_school_gate_evening.jpg", char: "char_miku_smile.png" },
    { speaker: "桜井 未来", text: "ねえ……一緒に帰ってもいい？", bg: "bg_school_gate_evening.jpg", char: "char_miku_blush.png" },
    { text: "不思議と自然に『うん』と答えていた。", bg: "bg_street_evening.jpg" },
    { text: "並んで歩く道は、さっきよりもずっと近く感じられた。", bg: "bg_street_evening.jpg", overlay: true },

    // 静ルート
    { id: "shizuka_root", text: "未来と別れ、図書室に足を運んだ。", bg: "bg_library_inside_evening.jpg" },
    { text: "夕陽に照らされる窓辺で、一人の少女が静かに本を読んでいた。", bg: "bg_library_inside_evening.jpg" },
    { speaker: "？？？", text: "……転校生？", bg: "bg_library_inside_evening.jpg", char: "char_shizuka_shy.png" },
    { text: "本を閉じ、はにかむように微笑む彼女の姿に、不思議と落ち着きを感じた。", bg: "bg_library_inside_evening.jpg" },

    // 玲奈ルート
    { id: "rena_root", text: "生徒会室の扉をノックすると、中から凛とした声が返ってきた。", bg: "bg_council_inside_evening.jpg" },
    { speaker: "？？？", text: "入っていいわよ。……転校生ね？", bg: "bg_council_inside_evening.jpg", char: "char_rena_cool.png" },
    { text: "整然と並ぶ書類と、机に座る少女の姿。", bg: "bg_council_inside_evening.jpg" },
    { speaker: "玲奈", text: "私は生徒会長の一ノ瀬玲奈。困ったことがあれば言いなさい。ただし、甘えは許さないわよ", bg: "bg_council_inside_evening.jpg", char: "char_rena_serious.png" }
    // 以下は省略。上記と同じ構造で scenario を続ける
  ];

  // ----------------- showLine -----------------
  function showLine() {
    const line = scenario[currentLine];
    if (!line) return;

    // 選択肢判定
    if (line.choice) {
      waitingChoice = true;
      displayChoice(line);    // ← この中で push しない！
      textboxWrapper.style.display = "none";
      wasChoiceVisible = true;
      return;
    } else {
      waitingChoice = false;
      choiceContainer.style.display = "none";
      textboxWrapper.style.display = "block";
      wasChoiceVisible = false;
    }

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
    
      // ロード時などに二重pushさせないためのフラグチェック
      if (!suppressLogPush && !line.choice) {
        addLogEntry(line.speaker, line.text);
      }
    
    } else {
      nameBox.style.display = "none";
      textBox.innerHTML = line.text.replace(/\n/g, "<br>");
    
      if (!suppressLogPush && !line.choice) {
        addLogEntry(null, line.text);
      }
    }
  }

  // ----------------- displayChoice -----------------
  function displayChoice(line) {
    choiceContainer.innerHTML = "";
    choiceContainer.style.display = "flex";

    const prompt = document.createElement("div");
    prompt.id = "choice-prompt";
    prompt.className = "choice-prompt";
    prompt.textContent = line.text;
    choiceContainer.appendChild(prompt);

    logHistory.push({
      speaker: line.speaker || null,
      text: "▼ " + line.text,
      choices: line.options.map(opt => ({ text: opt.text, selected: false }))
    });


    const choicesLog = [];

    line.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt.text;
      btn.className = "scenario-choice";

      btn.addEventListener("click", () => {
        if (opt.affection) {
          for (const key in opt.affection) {
            affection[key] += opt.affection[key];
          }
        }
        if (opt.next) {
          const nextIndex = scenario.findIndex(l => l.id === opt.next);
          if (nextIndex >= 0) currentLine = nextIndex;
        } else {
          currentLine++;
        }

        waitingChoice = false;
        choiceContainer.innerHTML = "";

        const lastEntry = logHistory[logHistory.length - 1];
        if (lastEntry && lastEntry.choices) {
          lastEntry.choices = line.options.map(o => ({
            text: o.text,
            selected: o.text === opt.text
          }));
        }

        showLine();
      });

      choiceContainer.appendChild(btn);
    });

    textBox.textContent = "";
    nameBox.style.display = "none";
  }

  // ----------------- ログ表示 -----------------
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
  // ログの表示設定
  function addLogLine(speaker, text, color = "#fff") {
    const div = document.createElement("div");
    div.className = "log-entry";
    div.style.marginBottom = "12px";
    div.style.width = "80%";         // 幅を広げて読みやすく
    div.style.marginLeft = "0";      // 左寄せ
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
    // ✅ speakerがあるときだけ「」を付ける
    txt.innerHTML = speaker
      ? `「${text.replace(/\n/g, "<br>")}」`
      : text.replace(/\n/g, "<br>");
    txt.style.whiteSpace = "pre-wrap"; // 改行・空白を保持
    txt.style.wordBreak = "break-word"; // 長文の折返し対応
    div.appendChild(txt);
  
    logContent.appendChild(div);
  
    // 最新ログを中央にスクロール
    const lastLog = logContent.lastElementChild;
    if (lastLog) {
      lastLog.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }

  // ログ内の設定
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
          // 選んだものは▶、選ばなかったものは全角スペースで揃える
          const prefix = opt.selected ? "" : "　 ";
          c.textContent = prefix + opt.text;
          logContent.appendChild(c);
        });
      }
    });
  
    const lastLog = logContent.lastElementChild;
    if (lastLog) lastLog.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  // ----------------- 画面タップで進行 -----------------
  gameScreen.addEventListener("click", (e) => {
    if (menuPanel.classList.contains("show")) return;
    if (logOverlay.style.display === "block") return;
    if (waitingChoice) return;
    if (e.target.closest("#menu-button, #menu-panel")) return;

    if (currentLine < scenario.length) {
      showLine(currentLine); // 今の行を表示
      currentLine++;
    }
  });

  // ----------------- セーブ -----------------
  function saveGame() {
    const saveData = { currentLine, affection, logHistory, waitingChoice };
    localStorage.setItem("centurycyclememoria-save", JSON.stringify(saveData));
    alert("ゲームをセーブしました。");
  }

  // ----------------- ロード -----------------
  function loadGame(showAlert = true) {
    const saveData = JSON.parse(localStorage.getItem("centurycyclememoria-save"));
    if (saveData) {
      currentLine = saveData.currentLine;
      Object.assign(affection, saveData.affection);
  
      // ✅ ログ履歴は保存済みをそのまま使う
      logHistory.length = 0;
      logHistory.push(...saveData.logHistory);

      // ✅ waitingChoice も復元
      waitingChoice = !!saveData.waitingChoice;
      
      // ✅ セーブ時点を復元（進めない・二重登録しない）
      restoreLine(currentLine);

        if (showAlert) alert("ゲームをロードしました。");
        return true;
      } else {
          if (showAlert) alert("セーブデータがありません。");
          return false;
        }
      }

  function restoreLine(lineIndex) {
    const line = scenario[lineIndex];
    if (!line) return;

    // 選択肢の行なら専用処理
    if (line.choice) {
      // waitingChoice が true なら選択肢を再表示
      if (waitingChoice) {
        displayChoice(line);
        textboxWrapper.style.display = "none";
        return;
      }
      // すでに選択済みならスキップ
      
      // ログを確認して選択済みかどうかチェック
      const lastEntry = logHistory[logHistory.length - 1];
      const hasSelected = lastEntry?.choices?.some(c => c.selected);
    
      if (!hasSelected) {
        // まだ選んでない → 選択肢を再表示
        waitingChoice = true;
        displayChoice(line);
        textboxWrapper.style.display = "none";
        return;
      }
      // 選んである → 通常進行
    }
  
    // 背景復元
    if (line.bg) bgImage.src = line.bg;
  
    // キャラ立ち絵復元
    if (line.char) {
      charImage.src = line.char;   // ✅ 修正
      charImage.style.display = "block";
    } else {
      charImage.style.display = "none";
    }
  
    // BGM復元
    if (line.bgm) playBGM(line.bgm);
  
    // テキスト復元
    if (line.speaker) {
      nameBox.style.display = "inline-block";
      nameBox.textContent = line.speaker;
      textBox.innerHTML = `「${line.text.replace(/\n/g, "<br>")}」`;
    } else {
      nameBox.style.display = "none";
      textBox.innerHTML = line.text ? line.text.replace(/\n/g, "<br>") : "";
    }
  
    // ログ更新（既存の logHistory から）
    logContent.innerHTML = "";
    const charColors = { "桜井 未来": "#ff69b4", "？？？": "#87ceeb", "玲奈": "#ffa500" };
    logHistory.forEach(entry => {
      if (entry.text) {
        const color = charColors[entry.speaker] || "#fff";
        addLogLine(entry.speaker, entry.text, color);
      }
      if (entry.choices) {
        entry.choices.forEach(opt => {
          const c = document.createElement("div");
          c.className = "log-choice" + (opt.selected ? " log-selected" : "");
          c.textContent = opt.text;
          logContent.appendChild(c);
        });
      }
    });
  }


  // 変更後：関数を追加（showLine / displayChoice / loadGame と共に使います）
  function addLogEntry(speaker, text) {
    // 直前のログとまったく同じなら push しない（簡易デデュープ）
    const last = logHistory[logHistory.length - 1];
    if (!last || last.speaker !== speaker || last.text !== text) {
      logHistory.push({ speaker, text });
    }
  }

  // ----------------- ゲーム開始前の確認 -----------------
  const shouldLoad = localStorage.getItem("loadOnStart") === "true";
  localStorage.removeItem("loadOnStart");
  
  // 最初はテキスト非表示・クリック進行も無効化
  textboxWrapper.style.display = "none";
  waitingChoice = true;
  
  // 背景を固定（確認画面用）
  bgImage.src = "bg_moon_sakura.jpg";
  
  if (shouldLoad) {
    showYesNoMenu("続きから始めますか？", () => {
      const loaded = loadGame(false);
      if (!loaded) {
        currentLine = 0; // セーブが無ければ最初から
      }
      startGame();
    });
  } else {
    showYesNoMenu("最初から始めますか？", () => {
      currentLine = 0;
      startGame();
    });
  }
  
  // ----------------- ゲーム開始処理 -----------------
  function startGame() {
    choiceContainer.innerHTML = "";
    choiceContainer.style.display = "none";  // メニューを消す
    waitingChoice = false;                   // クリック進行を有効化
    textboxWrapper.style.display = "block";
  
    // ※「続きから」は loadGame が currentLine を復元するのでリセットしない
    // 「最初から」は yesCallback 内で currentLine = 0 をセット済み
  
    // showLine() は呼ばない！
    // ✅ 最初のクリックで1ページ目を表示する
  }
  
  // ----------------- 確認メニュー表示 -----------------
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
    yesBtn.addEventListener("click", () => {
      yesCallback();
    });
  
    const noBtn = document.createElement("button");
    noBtn.className = "scenario-choice";
    noBtn.textContent = "いいえ";
    noBtn.addEventListener("click", () => {
      window.location.href = "index.html"; // ホームに戻る
    });
  
    choiceContainer.appendChild(yesBtn);
    choiceContainer.appendChild(noBtn);
  }



  // ----------------- メニュー操作 -----------------
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
      menuButton.classList.remove("active"); // 黒背景を消す
      menuButton.setAttribute("aria-expanded", "false");
    }
  });

  saveButton.addEventListener("click", saveGame);
  loadButton.addEventListener("click", loadGame);

  menuHome.addEventListener("click", () => {
    window.location.href = "index.html";
  });
});
