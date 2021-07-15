// const caclulate = async function () {
//   const res = await fetch("item.json");
//   const data = await res.json();
//   console.log(data);
//   document.body.innerHTML = `<h1>${data[0].text}</h1>`;
// };

// caclulate();

const currencyElOne = document.querySelector("#currency-one");
const currencyElTwo = document.querySelector("#currency-two");
//! amount === 量,額,共計
const amountElOne = document.querySelector("#amount-one");
const amountElTwo = document.querySelector("#amount-two");

const rateEl = document.querySelector("#rate");
const swap = document.querySelector("#swap");

// Fetch貨幣匯率 更新DOM
const calculate = async function () {
  // 抓到所有現在的值
  const currencyOne = currencyElOne.value;
  const currencyTwo = currencyElTwo.value;
  const res = await fetch(
    `https://v6.exchangerate-api.com/v6/8498b553c54901c56ea77841/latest/${currencyOne}`
  );
  const data = await res.json();
  rateEl.innerText = `1${currencyOne} = ${data.conversion_rates[currencyTwo]} ${currencyTwo}`;
  amountElTwo.value = (
    amountElOne.value * data.conversion_rates[currencyTwo]
  ).toFixed(2);
};

const swapEl = function () {
  [currencyElOne.value, currencyElTwo.value] = [
    currencyElTwo.value,
    currencyElOne.value,
  ];
  calculate();
};
// Event Listener
currencyElOne.addEventListener("change", calculate);
currencyElTwo.addEventListener("change", calculate);
//! input事件只要是input值有改變就會觸發 不管是手動填寫或是用按鈕改值
amountElOne.addEventListener("input", calculate);
amountElTwo.addEventListener("input", calculate);
swap.addEventListener("click", swapEl);
