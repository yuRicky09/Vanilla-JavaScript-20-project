const main = document.getElementById("main");
const addUserBtn = document.getElementById("add-user");
const doubleBtn = document.getElementById("double");
const showMillionairesBtn = document.getElementById("show-millionaires");
const sortBtn = document.getElementById("sort");
const calculateWealthBtn = document.getElementById("calculate-wealth");

let data = [];

// Fetch random user
const getRandomUser = async function () {
  const res = await fetch("https://randomuser.me/api");
  const userData = await res.json();
  const user = userData.results[0];
  const newUser = {
    name: `${user.name.first} ${user.name.last}`,
    money: Math.floor(Math.random() * 1000000),
  };

  addData(newUser);
  updataDOM(data);
};

// Add obj to data arr
const addData = function (obj) {
  data.push(obj);
};

// Update DOM
const updataDOM = function (providedData = data) {
  main.innerHTML = "<h2><strong>Person</strong> Wealth</h2>";

  providedData.forEach((person) => {
    const div = document.createElement("div");
    div.classList.add("person");
    div.innerHTML = `<strong>${person.name}</strong> ${formatMoney(
      person.money
    )}`;

    main.appendChild(div);
  });
};

// Format number as money https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-string
const formatMoney = function (number) {
  return "$" + number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

const doubleUserMoney = function () {
  data = data.map((person) => {
    // return {
    //   name: person.name,
    //   money: person.money * 2,
    // }; 另外一種寫法
    return {
      ...person,
      money: person.money * 2,
    };
  });

  updataDOM();
};

const sortByMoney = function () {
  data.sort((a, b) => b.money - a.money);

  updataDOM();
};

const showMillionaires = function () {
  data = data.filter((person) => person.money > 1000000);

  updataDOM();
};

const calculateAllMoney = function () {
  const allMoney = data.reduce((acc, person) => (acc += person.money), 0);

  const div = document.createElement("div");
  div.innerHTML = `<h3>Total Wealth: <strong>${formatMoney(
    allMoney
  )}</strong></h3>`;
  main.appendChild(div);
};
// Event listener

addUserBtn.addEventListener("click", getRandomUser);
doubleBtn.addEventListener("click", doubleUserMoney);
sortBtn.addEventListener("click", sortByMoney);
showMillionairesBtn.addEventListener("click", showMillionaires);
calculateWealthBtn.addEventListener("click", calculateAllMoney);
// // Fetch random user and add money
// async function getRandomUser() {
//   const res = await fetch('https://randomuser.me/api');
//   const data = await res.json();

//   const user = data.results[0];

//   const newUser = {
//     name: `${user.name.first} ${user.name.last}`,
//     money: Math.floor(Math.random() * 1000000)
//   };

//   addData(newUser);
// }

// // Double eveyones money
// function doubleMoney() {
//   data = data.map(user => {
//     return { ...user, money: user.money * 2 };
//   });

//   updateDOM();
// }

// // Sort users by richest
// function sortByRichest() {
//   console.log(123);
//   data.sort((a, b) => b.money - a.money);

//   updateDOM();
// }

// // Filter only millionaires
// function showMillionaires() {
//   data = data.filter(user => user.money > 1000000);

//   updateDOM();
// }

// // Calculate the total wealth
// function calculateWealth() {
//   const wealth = data.reduce((acc, user) => (acc += user.money), 0);

//   const wealthEl = document.createElement('div');
//   wealthEl.innerHTML = `<h3>Total Wealth: <strong>${formatMoney(
//     wealth
//   )}</strong></h3>`;
//   main.appendChild(wealthEl);
// }

// // Add new obj to data arr
// function addData(obj) {
//   data.push(obj);

//   updateDOM();
// }

// // Update DOM
// function updateDOM(providedData = data) {
//   // Clear main div
//   main.innerHTML = '<h2><strong>Person</strong> Wealth</h2>';

//   providedData.forEach(item => {
//     const element = document.createElement('div');
//     element.classList.add('person');
//     element.innerHTML = `<strong>${item.name}</strong> ${formatMoney(
//       item.money
//     )}`;
//     main.appendChild(element);
//   });
// }

// Format number as money - https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-string
// function formatMoney(number) {
//   return '$' + number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
// }

// // Event listeners
// addUserBtn.addEventListener('click', getRandomUser);
// doubleBtn.addEventListener('click', doubleMoney);
// sortBtn.addEventListener('click', sortByRichest);
// showMillionairesBtn.addEventListener('click', showMillionaires);
// calculateWealthBtn.addEventListener('click', calculateWealth);
