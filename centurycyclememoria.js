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

    // 以下は省略。上記と同じ構造で scenario を続ける
  ];

  // ----------------- showLine -----------------
  function showLine() {
    const line = scenario[currentLine];
    if (!line) return;

    // 選択肢判定
    if (line.choice) {
      waitingChoice = true;
      displayChoice(line);
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
      textBox.textContent = `「${line.text}」`;
    } else {
      nameBox.style.display = "none";
      textBox.textContent = line.text;
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

    logHistory.push({ speaker: line.speaker || null, text: line.text });

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

        line.options.forEach(o => {
          choicesLog.push({ text: o.text, selected: o.text === opt.text });
        });
        logHistory.push({ choices: choicesLog });

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
    menuButton.style.display = "none";
  });

  logClose.addEventListener("click", () => {
    logOverlay.style.display = "none";
    menuButton.style.display = "block";
    menuPanel.style.display = "flex";
    menuPanel.classList.remove("show");

    if (wasChoiceVisible) {
      choiceContainer.style.display = "flex";
      textboxWrapper.style.display = "none";
    } else {
      choiceContainer.style.display = "none";
      textboxWrapper.style.display = "block";
    }
  });

  function updateLog() {
    logContent.innerHTML = "";
    logHistory.forEach(entry => {
      if (entry.text) {
        const div = document.createElement("div");
        div.className = "log-entry";
        div.textContent = entry.speaker ? `${entry.speaker}「${entry.text}」` : entry.text;
        logContent.appendChild(div);
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

  // ----------------- 画面タップで進行 -----------------
  gameScreen.addEventListener("click", (e) => {
    if (menuPanel.classList.contains("show")) return;
    if (logOverlay.style.display === "block") return;
    if (waitingChoice) return;
    if (e.target.closest("#menu-button, #menu-panel")) return;

    currentLine++;
    if (currentLine < scenario.length) showLine();
  });

  // ----------------- セーブ・ロード -----------------
  function saveGame() {
    const saveData = { currentLine, affection, logHistory };
    localStorage.setItem("centurycyclememoria-save", JSON.stringify(saveData));
    alert("ゲームをセーブしました。");
  }

  function loadGame(showAlert = true) {
    const saveData = JSON.parse(localStorage.getItem("centurycyclememoria-save"));
    if (saveData) {
      currentLine = saveData.currentLine;
      Object.assign(affection, saveData.affection);
      logHistory.length = 0;
      logHistory.push(...saveData.logHistory);
      showLine();
      if (showAlert) alert("ゲームをロードしました。");
      return true;
    } else {
      if (showAlert) alert("セーブデータがありません。");
      return false;
    }
  }

  const shouldLoad = localStorage.getItem("loadOnStart") === "true";
  localStorage.removeItem("loadOnStart");
  if (shouldLoad) {
    const loaded = loadGame(false);
    if (!loaded) showLine();
  } else {
    showLine();
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
      menuButton.setAttribute("aria-expanded", "false");
    }
  });

  saveButton.addEventListener("click", saveGame);
  loadButton.addEventListener("click", loadGame);

  menuHome.addEventListener("click", () => {
    window.location.href = "index.html";
  });
});