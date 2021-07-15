"use strict";

const container = document.querySelector(".container");
const seats = document.querySelectorAll(".row .seat:not(.occupied)");
const count = document.querySelector("#count");
const total = document.querySelector("#total");
const movieSelect = document.querySelector("#movie");
// console.log(movieSelect.value);
let ticketPrice = +movieSelect.value;

// Get data from localstorage and populate UI
const populateUI = function () {
  const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"));

  if (selectedSeats !== null && selectedSeats.length > 0) {
    seats.forEach((seat, index) => {
      // 代表說現在拋出來的seat的index有在這selectedSeats這陣列裡
      if (selectedSeats.indexOf(index) > -1) {
        seat.classList.add("selected");
      }
    });
  }

  const selectedMovie = localStorage.getItem("movieIndex");

  if (selectedMovie !== null) {
    movieSelect.selectedIndex = selectedMovie;
  }
};

populateUI();

const setMovieData = function (movieIndex, moviePrice) {
  localStorage.setItem("moviePrice", moviePrice);
  localStorage.setItem("movieIndex", movieIndex);
};

const updateSelectedCount = function () {
  const selectedSeats = document.querySelectorAll(".row .seat.selected");

  // 存位置到localstorage
  // 作法 紀錄所有位置中被選的位置的index
  const seatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));
  console.log(seatsIndex);
  localStorage.setItem("selectedSeats", JSON.stringify(seatsIndex));

  const selectedSeatsCount = selectedSeats.length;

  count.innerText = selectedSeatsCount;
  total.innerText = selectedSeatsCount * ticketPrice;
};

//  Movie selcet event
movieSelect.addEventListener("change", (e) => {
  ticketPrice = +e.target.value;
  console.dir(e.target);
  console.log(e.target[e.target.selectedIndex].textContent);
  //! selectedIndex 是selectDOM元素 內建的property 可以抓到現在選到的option的index值是多少
  setMovieData(e.target.selectedIndex, e.target.value);
  updateSelectedCount();
});

// Seat click event
container.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("seat") &&
    !e.target.classList.contains("occupied")
  ) {
    e.target.classList.toggle("selected");

    updateSelectedCount();
  }
});

// 一開始init and 重整頁面時也要重新更新
updateSelectedCount();
