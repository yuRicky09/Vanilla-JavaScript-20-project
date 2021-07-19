const wordEl = document.querySelector("#word");
const wrongLettersEl = document.querySelector("#wrong-letters");
const playAgainBtn = document.querySelector("#play-button");
const popup = document.querySelector("#popup-container");
const notification = document.querySelector("#notification-container");
const finalMessage = document.querySelector("#final-message");

const figureParts = document.querySelectorAll(".figure-part");

const correctLetters = [];
const wrongLetters = [];
let selectedWord;
let timeoutID;

const url = "https://random-words-api.vercel.app/word";

// 思維: 先藉由api產生亂數單字   再藉由監聽keydown來判斷輸入字有無match產生的單子 無就...有就...
// 遊戲結束後 按下reset btn後重新reset並且再fetch一次產生亂數單字

// 正確的話show出字母
//! 概念是把選到的單字用splict把每個字母切成一個陣列內的元素去loop看有沒有match到correctLetters
const displayWord = function () {
  const html = `${selectedWord
    .split("")
    .map((letter) => {
      return `
    <span class="letter">
      ${correctLetters.includes(letter) ? letter : ""}
    </span>
    `;
    })
    .join("")}`;

  wordEl.innerHTML = html;
  //! 因為html格式是<span>??</span>換行<span>??</span> 所以直接拿innerText的話每個字母中間會有換行字元 所以我們把它替換掉
  const innerWord = wordEl.innerText.replace(/\n/g, "");

  if (innerWord === selectedWord) {
    finalMessage.innerText = "Congratulation! You Win";
    window.removeEventListener("keydown", matchLetter);
    popup.style.display = "flex";
  }
};

//  Update the wrong letter
const updateWrongLettersEl = function () {
  // 更新錯字在wrong container
  wrongLettersEl.innerHTML =
    wrongLetters.length > 0
      ? `
  <p>Wrong</P>
  ${wrongLetters
    .map((letter) => {
      return `<span>${letter}<span>`;
    })
    .join(",")}
  `
      : "";

  // 更新hangman
  const errors = wrongLetters.length;
  figureParts.forEach((part, index) => {
    if (index < errors) {
      part.style.display = "block";
    } else {
      part.style.display = "none";
    }
  });

  //  check是否人已被吊死
  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = "Unfortunately you lost.";
    popup.style.display = "flex";
    //! 讓監聽失效 不然雖然跳出popup但wrong letter的部分還是會運作
    window.removeEventListener("keydown", matchLetter);
  }
};

// Show notification
const showNotification = function () {
  notification.classList.add("show");

  clearTimeout(timeoutID);

  timeoutID = setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
};

// match letters
const matchLetter = function (e) {
  //! 我們只希望當輸入值是a~z才觸發 而a的keycode=65 z的keycode=90
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    const letter = e.key;
    if (selectedWord.includes(letter)) {
      if (!correctLetters.includes(letter)) {
        correctLetters.push(letter);
        displayWord();
      } else {
        showNotification();
      }
    } else {
      if (!wrongLetters.includes(letter)) {
        wrongLetters.push(letter);
        updateWrongLettersEl();
      } else {
        showNotification();
      }
    }
  }
};

// init the game
const resetGame = async function () {
  // splice會改變原本元素
  correctLetters.splice(0);
  wrongLetters.splice(0);

  await getRandomWord();

  popup.style.display = "none";
  updateWrongLettersEl();
  window.addEventListener("keydown", matchLetter);
};

// 藉由api拿到亂數word
const getRandomWord = async function () {
  const res = await fetch(url);
  const data = await res.json();
  const { word } = data[0];
  selectedWord = word.replace(" ", "").toLowerCase();
  console.log(selectedWord);
  displayWord();
  return;
};

getRandomWord();

// Event listener
window.addEventListener("keydown", matchLetter);
playAgainBtn.addEventListener("click", resetGame);
