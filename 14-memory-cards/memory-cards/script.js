const cardsContainer = document.querySelector("#cards-container");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const currentEl = document.querySelector("#current");
const showBtn = document.querySelector("#show");
const hideBtn = document.querySelector("#hide");
const questionEl = document.querySelector("#question");
const answerEl = document.querySelector("#answer");
const addCardBtn = document.querySelector("#add-card");
const deleteCardBtn = document.querySelector("#delete");
const clearBtn = document.querySelector("#clear");
const addContainer = document.querySelector("#add-container");

// Keep track of current card
let currentActiveCard = 0;

// Store DOM cards
let cardsEl = [];

// Store card data
let cardsData = [];

const getCardsDataFromLocalStorage = function () {
  cardsData = JSON.parse(localStorage.getItem("cards"));
  return cardsData ? cardsData : (cardsData = []);
};

//*  先把存在localstorage的card data loop出來
const createCards = function () {
  getCardsDataFromLocalStorage();
  cardsData.forEach((data, index) => createDOMCard(data, index));
};

const createDOMCard = function (data, index) {
  const card = document.createElement("div");
  card.classList.add("card");

  if (index === 0) {
    card.classList.add("active");
  }

  card.innerHTML = `
    <div class="inner-card">
      <div class="inner-card-front">
        <p>${data.question}</p>
      </div>
      <div class="inner-card-back">
        <p>${data.answer}</p>
      </div>
    </div>
  `;

  cardsContainer.appendChild(card);

  // 將DOM模板加到cardsEl 讓之後能存到localstorage
  cardsEl.push(card);
  updateCurrentText();

  card.addEventListener("click", flipCard);
};

// 翻轉卡片
const flipCard = function (e) {
  const target = e.target.closest(".card");
  if (!target) {
    return;
  } else if (target.classList.contains("active")) {
    target.classList.toggle("show-answer");
  }
};

// 顯示卡片目錄位置
const updateCurrentText = function () {
  currentEl.innerText = `${currentActiveCard + 1}/${cardsEl.length}`;
};

// 切換卡片
const goToNextCard = function () {
  //! 空陣列不是falsy 所以我們用長度判斷
  if (cardsEl.length === 0) return;
  // 隱藏現在這張
  cardsEl[currentActiveCard].className = "card left";

  currentActiveCard += 1;

  if (currentActiveCard > cardsEl.length - 1) {
    currentActiveCard = cardsEl.length - 1;
  }

  //將下一張秀出
  cardsEl[currentActiveCard].className = "card active";

  updateCurrentText();
};

const goToPrevCard = function () {
  if (cardsEl.length === 0) return;

  cardsEl[currentActiveCard].className = "card";

  currentActiveCard -= 1;

  if (currentActiveCard < 0) {
    currentActiveCard = 0;
  }

  cardsEl[currentActiveCard].className = "card active";

  updateCurrentText();
};

const showAddCardForm = function () {
  addContainer.classList.add("show");
};

const closeAddCardForm = function () {
  addContainer.classList.remove("show");
};

const addCardToData = function () {
  const question = questionEl.value.trim();
  const answer = answerEl.value.trim();

  if (!question || !answer) {
    window.alert("Must enter Question and Answer");
  } else {
    const newCard = {
      question,
      answer,
    };

    // 將輸入資料存到cardsData 並且用這資料建出DOM且存到cardsEl
    cardsData.push(newCard);
    createDOMCard(newCard, cardsData.length - 1);

    questionEl.value = "";
    answerEl.value = "";

    addContainer.classList.remove("show");

    saveDateToLocalStorage(cardsData);
  }
};

const deleteCardFromData = function () {
  const nowCardNumber = +currentEl.innerText.slice(0, 1) - 1;

  cardsData.splice(nowCardNumber, 1);

  saveDateToLocalStorage(cardsData);
  window.location.reload();
  createCards();
};

const clearAllCards = function () {
  const result = window.prompt("確定要刪除所有卡片嗎? 確定請輸入Y");
  if (result === "Y") {
    localStorage.removeItem("cards");
    window.location.reload();
  } else {
    return;
  }
};

const saveDateToLocalStorage = function (cardsData) {
  const JSONData = JSON.stringify(cardsData);
  localStorage.setItem("cards", JSONData);
};

nextBtn.addEventListener("click", goToNextCard);
prevBtn.addEventListener("click", goToPrevCard);

showBtn.addEventListener("click", showAddCardForm);
hideBtn.addEventListener("click", closeAddCardForm);

addCardBtn.addEventListener("click", addCardToData);
deleteCardBtn.addEventListener("click", deleteCardFromData);

clearBtn.addEventListener("click", clearAllCards);
createCards();
