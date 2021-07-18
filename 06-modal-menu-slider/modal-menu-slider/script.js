const sidebarBtn = document.querySelector("#toggle");
const body = document.querySelector("body");
const signUpBtn = document.querySelector("#open");
const closeBtn = document.querySelector("#close");
const layout = document.querySelector("#modal");
const modal = document.querySelector(".modal");
const test = document.querySelector(".test");

signUpBtn.addEventListener("click", () => {
  layout.style.visibility = "visible ";
  modal.style.opacity = 1;
});

closeBtn.addEventListener("click", () => {
  layout.style.visibility = "hidden";
  modal.style.opacity = 0;
});

layout.addEventListener("click", (e) => {
  console.log("layout be clicked");
  if (e.target === layout) {
    layout.style.visibility = "hidden";
    modal.style.opacity = 0;
  } else return;
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && layout.style.visibility === "visible") {
    layout.style.visibility = "hidden";
    modal.style.opacity = 0;
  }
});

sidebarBtn.addEventListener("click", () => {
  body.classList.toggle("showSidebar");
});

window.addEventListener("click", () => {
  test.classList.toggle("hidden");
});
