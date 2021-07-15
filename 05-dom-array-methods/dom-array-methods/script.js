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
