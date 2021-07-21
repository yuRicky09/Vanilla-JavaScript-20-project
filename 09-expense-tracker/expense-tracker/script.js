const balance = document.querySelector("#balance");
const moneyPlus = document.querySelector("#money-plus");
const moneyMinus = document.querySelector("#money-minus");
const list = document.querySelector("#list");
const form = document.querySelector("#form");
const text = document.querySelector("#text");
const amount = document.querySelector("#amount");

class Transaction {
  constructor(id, text, amount) {
    this.id = id;
    this.text = text;
    this.amount = amount;
  }
}

// dummyTransactions = 假資料(花費紀錄)
// const dummyTransactions = [
//   { id: 1, text: "Flower", amount: -20 },
//   { id: 2, text: "Salary", amount: 300 },
//   { id: 3, text: "Book", amount: -10 },
//   { id: 4, text: "Camera", amount: 150 },
// ];
const data = JSON.parse(localStorage.getItem("transactions"));
let transactions = data ? data : [];

// 抓到text跟amount存入到Transaction obj
const addTransaction = function (e) {
  e.preventDefault();
  if (!text.value.trim() || !amount.value) {
    alert("Please enter text or amount");
  } else {
    const transaction = new Transaction(
      generateID(),
      text.value.trim(),
      +amount.value
    );
    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValue();

    text.value = "";
    amount.value = "";

    updateLocalStorage();
  }
};

const generateID = function () {
  return Math.floor(Math.random() * 100000000);
};

// 將花費紀錄加到DOM list
const addTransactionDOM = function (transaction) {
  // Get sign
  const sign = transaction.amount < 0 ? "-" : "+";

  const item = document.createElement("li");
  item.classList.add(sign === "-" ? "minus" : "plus");
  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span><button class="delete-btn" data-id="${transaction.id}">x</button>
  `;
  list.appendChild(item);
};

// update balance, income, expense value
const updateValue = function () {
  const amounts = transactions.map((transaction) => transaction.amount);

  const total = amounts.reduce((acc, amount) => (acc += amount), 0).toFixed(2);

  const income = amounts
    .filter((amount) => amount > 0)
    .reduce((acc, amount) => (acc += amount), 0)
    .toFixed(2);

  const expense = amounts
    .filter((amount) => amount < 0)
    .reduce((acc, amount) => (acc += amount) * -1, 0)
    .toFixed(2);

  balance.innerHTML = total;
  moneyPlus.innerHTML = income;
  moneyMinus.innerHTML = expense;
};

const removeTransaction = function (e) {
  if (!e.target.classList.contains("delete-btn")) {
    return;
  } else {
    const deleteItem = e.target.closest(".delete-btn");
    transactions = transactions.filter(
      (item) => item.id !== deleteItem.dataset.id * 1
    );
  }

  updateLocalStorage();

  init();
};

const updateLocalStorage = function () {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

// init app
const init = function () {
  list.innerHTML = "";

  transactions.forEach(addTransactionDOM);
  updateValue();
};

init();

// Event listener
form.addEventListener("submit", addTransaction);
list.addEventListener("click", removeTransaction);
