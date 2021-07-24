const word = document.querySelector("#word");
const text = document.querySelector("#text");
const scoreEl = document.querySelector("#score");
const timeEl = document.querySelector("#time");
const endgameEl = document.querySelector("#end-game-container");
const settingsBtn = document.querySelector("#settings-btn");
const settings = document.querySelector("#settings");
const settingsForm = document.querySelector("#settings-form");
const difficultySelect = document.querySelector("#difficulty");
const resetBtn = document.querySelector("#resetBtn");
const finalScore = document.querySelector("#finalScore");
const startBtn = document.querySelector("#startBtn");

let nowWord;
let time = 10;
let score = 1;
let setIntervalId;

//* 先隨機產生一個亂數單字
//! 因為timer的設定是秒數歸零後才會結束掉這個timer， 所以當在timer歸零前有任何操作造成要初始遊戲時我們要先清除掉前一個timer
const getRandomWord = async function () {
  clearInterval(setIntervalId);

  const res = await fetch("https://random-words-api.vercel.app/word");
  const [data] = await res.json();
  nowWord = data.word.toLowerCase();
  word.innerText = nowWord;

  setIntervalId = setInterval(timer, 1000);
  text.focus();
};

//* 比對單字
const matchWord = function () {
  const typingWord = this.value;

  if (typingWord === nowWord) {
    //1.增加時間與分數
    updateTimeAndScore();
    //2.清空輸入欄並更新單字
    this.value = "";
    getRandomWord();
  }
};

const updateTimeAndScore = function () {
  timeEl.innerText = +timeEl.innerText.slice(0, -1) + time + "s";
  scoreEl.innerText = +scoreEl.innerText + score;
};

const setGameMode = async function () {
  const gameMode = difficultySelect.value;
  clearInterval(setIntervalId);
  await init();
  if (gameMode === "easy") {
    time = 10;
  } else if (gameMode === "medium") {
    time = 5;
  } else if (gameMode === "hard") {
    time = 2;
  }
};

//* 設置遊戲計時器
const timer = function () {
  if (timeEl.innerText === "0s") {
    clearInterval(setIntervalId);
    gameOverInfo();
  } else {
    timeEl.innerText = +timeEl.innerText.slice(0, -1) - 1 + "s";
  }
};

//* 計時器歸零時秀出結束選單
const gameOverInfo = function () {
  endgameEl.style.display = "flex";
  finalScore.innerText = `Your final score is ${scoreEl.innerText}`;
  resetBtn.addEventListener("click", init);
};

//* 當按下resetBtn or 重選遊戲難度時初始遊戲
const init = async function () {
  await getRandomWord();
  text.value = "";
  timeEl.innerText = "10s";
  scoreEl.innerText = "0";
  endgameEl.style.display = "none";
};

const showGameModeSetting = function () {
  settings.classList.toggle("hide");
};

//* Event listener
startBtn.addEventListener("click", init);

text.addEventListener("input", matchWord);

difficultySelect.addEventListener("change", setGameMode);

settingsBtn.addEventListener("click", showGameModeSetting);
