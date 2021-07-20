const search = document.querySelector("#search");
const submit = document.querySelector("#submit");
const random = document.querySelector("#random");
const mealsEl = document.querySelector("#meals");
const resultHeading = document.querySelector("#result-heading");
const single_mealEl = document.querySelector("#single-meal");

// Search meal and fetch from API
const searchMeal = function (e) {
  e.preventDefault();

  // 每次fetch新的meal之前，先clear舊的資料
  mealsEl.innerHTML = "";

  // Get input value
  const term = search.value;
  // 獲得meal
  if (term.trim()) {
    fetchMealAndDisplay(term);
  } else {
    alert("Please enter a search term");
  }
};

const fetchMealAndDisplay = async function (term) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  const data = await res.json();

  if (!data.meals) {
    resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`;
  } else {
    resultHeading.innerHTML = `<h2>Search results for '${term}': </h2>`;
    mealsEl.innerHTML = data.meals
      .map(
        (meal) => `
      <div class="meal">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="meal-info" data-mealid="${meal.idMeal}">
          <h3>${meal.strMeal}</h3>
        </div>
      </div>
    `
      )
      .join("");
  }
  // clear input
  search.value = "";
};

const fecthDateByClick = async function (mealID = "") {
  const url = mealID
    ? `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
    : `https://www.themealdb.com/api/json/v1/1/random.php`;
  console.log(url);
  const res = await fetch(url);
  const data = await res.json();
  return data.meals[0];
};

const getMealById = async function (mealID) {
  const meal = await fecthDateByClick(mealID);

  addMealToDOM(meal);
};

const getMealByRandomBtn = async function () {
  const meal = await fecthDateByClick();

  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";
  addMealToDOM(meal);
};

const addMealToDOM = function (meal) {
  const ingredients = [];

  //! 這邊迴圈i設<=20是因為這個api給的材料格式的key是固定meal.strIngredient1~meal.strIngredient20  沒有value就給null
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
};

// Event Listeners
submit.addEventListener("submit", searchMeal);
mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.target.closest(".meal-info");

  if (!mealInfo) {
    return;
  } else {
    const mealID = mealInfo.dataset.mealid;
    getMealById(mealID);
  }
});
random.addEventListener("click", getMealByRandomBtn);
