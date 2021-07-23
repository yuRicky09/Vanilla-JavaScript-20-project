const postsContainer = document.getElementById("posts-container");
const loading = document.querySelector(".loader");
const filter = document.getElementById("filter");

let limit = 5;
let page = 1;

//*  Fetch posts from API
const getPosts = async function () {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`
  );

  const data = await res.json();
  return data;
};

//* Show post in DOM
const showPosts = async function () {
  const posts = await getPosts();
  posts.forEach((post) => {
    const postEl = document.createElement("div");
    postEl.classList.add("post");
    postEl.innerHTML = `
      <div class="number">${post.id}</div>
      <div class="post-info">
        <h2 class="post-title">${post.title}</h2>
        <p class="post-body">${post.body}</p>
      </div>
    `;

    postsContainer.appendChild(postEl);
  });
};

//* Show loader & fetch more post
const showLoading = async function () {
  loading.classList.add("show");

  setTimeout(() => {
    loading.classList.remove("show");

    setTimeout(() => {
      page++;
      showPosts();
    });
  }, 1000);
};

//* 思維: 1.先抓到input的輸入值  2.用這個輸入值做出一個用來比對的正規表達式 3.先判斷元素內的字串有無與表達式match到的字有則用replace method把match到的字換成要改成的字，沒有match就維持原來樣子
const filterPost = function () {
  const inputWord = this.value;
  const regExp = new RegExp(inputWord, "gi");
  console.log(regExp);
  const allPostInfo = document.querySelectorAll(".post-info");
  allPostInfo.forEach((postInfo) => {
    const title = postInfo.children[0].innerText;
    const body = postInfo.children[1].innerText;
    if (title.match(regExp)) {
      const newtitle = title.replace(
        regExp,
        `<span class="hl">${this.value}</span>`
      );
      postInfo.children[0].innerHTML = newtitle;
    } else {
      postInfo.children[0].innerHTML = title;
    }

    if (body.match(regExp)) {
      const newBody = body.replace(
        regExp,
        `<span class="hl">${this.value}</span>`
      );
      postInfo.children[1].innerHTML = newBody;
    } else {
      postInfo.children[1].innerHTML = body;
    }

    if (!title.match(regExp) && !body.match(regExp)) {
      postInfo.parentElement.style.display = "none";
    } else {
      postInfo.parentElement.style.display = "flex";
    }
  });
};

window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight, offsetHeight } =
    document.documentElement;
  console.log(scrollTop, scrollHeight, clientHeight);
  //! 當今天有垂直卷軸時(但表內容物超過現在視窗高度可容大小)
  //! scrollHeight(整個文件的高度) = scrollTop (卷軸距離最top點滾動了多少)+ clientHeight (整個文件可看到的高度)
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    showLoading();
    //! 這時候新fetch下來的內容又會增加scrollHeight的值，但這個增加的值就又會是卷軸又可滾動的距離，所以當我們滾動快到底時又會再次成功觸發上面的公式，這樣就可以達成無限卷軸的功能
  }
});

filter.addEventListener("input", filterPost);

// init
showPosts();
