const draggableList = document.querySelector("#draggable-list");
const check = document.querySelector("#check");

const richestPeople = [
  "Jeff Bezos",
  "Bill Gates",
  "Warren Buffett",
  "Bernard Arnault",
  "Carlos Slim Helu",
  "Amancio Ortega",
  "Larry Ellison",
  "Mark Zuckerberg",
  "Michael Bloomberg",
  "Larry Page",
];

// Store listitems
const listItems = [];

let dragStartIndex;

// Insert list items into DOM
const createList = function () {
  //! 不希望破壞原本資料 所以先copy
  //! 這邊map跟sort在做的是我們希望每次頁面reload後可以打亂資料順序 所以把每筆資料當作obj的一個鍵值對，並且在給他一個亂數值的鍵值對，方便我們用亂數來排列
  [...richestPeople]
    .map((data) => ({
      value: data,
      sort: Math.random(),
    }))
    .sort((a, b) => a.sort - b.sort)
    .forEach((data, index) => {
      const listItem = document.createElement("li");

      listItem.setAttribute("data-index", index);

      listItem.innerHTML = `
      <span class="number">${index + 1}</span>
      <div class="draggable" draggable="true">
        <p class="person-name">${data.value}</p>
        <i class="fas fa-grip-lines"></i>
      </div>
    `;
      //! listItem是以一個DOM元素作為資料存入這個陣列，而不是HTML格式的文字字串
      listItems.push(listItem);

      draggableList.appendChild(listItem);
    });

  addDragDropEvent();
};

// addDragDropEvent
const addDragDropEvent = function () {
  const draggableItems = document.querySelectorAll(".draggable");
  const dropTargetSpaceAll = document.querySelectorAll(".draggable-list li");
  draggableItems.forEach((item) => {
    item.addEventListener("dragstart", dragStart);
  });

  dropTargetSpaceAll.forEach((item) => {
    item.addEventListener("dragover", dragOver);
    item.addEventListener("drop", drop);
    item.addEventListener("dragenter", dragEnter);
    item.addEventListener("dragleave", dragLeave);
  });
};

//* 當可拖曳元素被拖曳時觸發
const dragStart = function () {
  // console.log(this, "此元素被拖曳搂!");
  dragStartIndex = this.closest("li").dataset.index;
};

//* 當拖曳元素經過一個有效的放置目標位置時觸發(每幾百毫秒觸發一次)
const dragOver = function (e) {
  //! 要先阻止over的預設行為才能讓drop監聽事件有效
  e.preventDefault();
  // console.log(this, "有目標經過這個可放置區域摟");
};

//* 當拖曳元素進入一個有效的放置目標位置時觸發
const dragEnter = function () {
  // console.log(this, "有目標進入這個可放置區域摟");
  this.classList.add("over");
};

//* 當拖曳元素離開一個有效的放置目標位置時觸發
const dragLeave = function () {
  // console.log(this, "有目標離開這個可放置區域摟");
  this.classList.remove("over");
};

//* 當拖曳元素被放置於一個有效的放置目標位置時觸發
const drop = function () {
  // console.log(this, "有目標被丟置這個可放置區域摟");

  const dragEndIndex = +this.dataset.index;

  swapItems(dragStartIndex, dragEndIndex);

  this.classList.remove("over");
};

//*  邏輯是先抓出我們拖曳元素的index(存放於dataset裡)， 當drop事件觸發之後在抓出被丟區塊的index 之後交換裡面的內容 使用appendChild
//! appendChild有個特性，如果将被插入的节点已经存在于当前文档的文档树中，那么 appendChild() 只会将它从原先的位置移动到新的位置（不需要事先移除要移动的节点）。这意味着，一个节点不可能同时出现在文档的不同位置。所以，如果某个节点已经拥有父节点，在被传递给此方法后，它首先会被移除，再被插入到新的位置。

const swapItems = function (dragStartIndex, dragEndIndex) {
  const itemOne = listItems[dragStartIndex].querySelector(".draggable");
  const itemTwo = listItems[dragEndIndex].querySelector(".draggable");
  console.log(itemOne, itemTwo);

  listItems[dragStartIndex].appendChild(itemTwo);
  listItems[dragEndIndex].appendChild(itemOne);
};

const checkOrder = function () {
  const nowOrder = document.querySelectorAll(".person-name");
  const nowOrderValue = [];

  nowOrder.forEach((person) => {
    nowOrderValue.push(person.innerText);
  });

  richestPeople.forEach((person, index) => {
    person === nowOrderValue[index]
      ? (nowOrder[index].closest("li").className = "right")
      : (nowOrder[index].closest("li").className = "wrong");
  });
};

check.addEventListener("click", checkOrder);

createList();
