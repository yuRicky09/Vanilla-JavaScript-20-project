const musicContainer = document.querySelector("#music-container");
const playBtn = document.querySelector("#play");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");

const audio = document.querySelector("#audio");
const progress = document.querySelector("#progress");
const progressContainer = document.querySelector("#progress-container");
const title = document.querySelector("#title");
const cover = document.querySelector("#cover");

//  Song title
const songs = ["hey", "summer", "ukulele"];

//  Keep track song
let songIndex = 2;

// Initially load song details into DOM
const loadSong = function (song) {
  title.innerText = song;
  //! 兩種設定html 元素屬性的寫法
  // cover.src = `images/${song}.jpg`;
  cover.setAttribute("src", `./images/${song}.jpg`);
  audio.src = `music/${song}.mp3`;
};

const playSong = function () {
  musicContainer.classList.add("play");
  playBtn.querySelector("i.fas").classList.remove("fa-play");
  playBtn.querySelector("i.fas").classList.add("fa-pause");
  audio.play();
};

const pauseSong = function () {
  musicContainer.classList.remove("play");
  playBtn.querySelector("i.fas").classList.remove("fa-pause");
  playBtn.querySelector("i.fas").classList.add("fa-play");
  audio.pause();
};

const nextSong = function () {
  songIndex === 2 ? (songIndex = 0) : songIndex++;
  loadSong(songs[songIndex]);
  playSong();
};

const lastSong = function () {
  songIndex === 0 ? (songIndex = 2) : songIndex--;
  loadSong(songs[songIndex]);
  playSong();
};

const updateProgress = function () {
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = `${progressPercent}%`;
};

const setProgress = function (e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
};

loadSong(songs[songIndex]);

//  Event listeners
playBtn.addEventListener("click", () => {
  musicContainer.classList.contains("play") ? pauseSong() : playSong();
});

nextBtn.addEventListener("click", nextSong);

prevBtn.addEventListener("click", lastSong);

audio.addEventListener("timeupdate", updateProgress);
progressContainer.addEventListener("click", setProgress);
audio.addEventListener("ended", nextSong);
// // Song titles
// const songs = ['hey', 'summer', 'ukulele'];

// // Keep track of song
// let songIndex = 2;

// // Initially load song details into DOM
// loadSong(songs[songIndex]);

// // Update song details
// function loadSong(song) {
//   title.innerText = song;
//   audio.src = `music/${song}.mp3`;
//   cover.src = `images/${song}.jpg`;
// }

// // Play song
// function playSong() {
//   musicContainer.classList.add('play');
//   playBtn.querySelector('i.fas').classList.remove('fa-play');
//   playBtn.querySelector('i.fas').classList.add('fa-pause');

//   audio.play();
// }

// // Pause song
// function pauseSong() {
//   musicContainer.classList.remove('play');
//   playBtn.querySelector('i.fas').classList.add('fa-play');
//   playBtn.querySelector('i.fas').classList.remove('fa-pause');

//   audio.pause();
// }

// // Previous song
// function prevSong() {
//   songIndex--;

//   if (songIndex < 0) {
//     songIndex = songs.length - 1;
//   }

//   loadSong(songs[songIndex]);

//   playSong();
// }

// // Next song
// function nextSong() {
//   songIndex++;

//   if (songIndex > songs.length - 1) {
//     songIndex = 0;
//   }

//   loadSong(songs[songIndex]);

//   playSong();
// }

// // Update progress bar
// function updateProgress(e) {
//   const { duration, currentTime } = e.srcElement;
//   const progressPercent = (currentTime / duration) * 100;
//   progress.style.width = `${progressPercent}%`;
// }

// // Set progress bar
// function setProgress(e) {
//   const width = this.clientWidth;
//   const clickX = e.offsetX;
//   const duration = audio.duration;

//   audio.currentTime = (clickX / width) * duration;
// }

// // Event listeners
// playBtn.addEventListener('click', () => {
//   const isPlaying = musicContainer.classList.contains('play');

//   if (isPlaying) {
//     pauseSong();
//   } else {
//     playSong();
//   }
// });

// // Change song
// prevBtn.addEventListener('click', prevSong);
// nextBtn.addEventListener('click', nextSong);

// // Time/song update
// audio.addEventListener('timeupdate', updateProgress);

// // Click on progress bar
// progressContainer.addEventListener('click', setProgress);

// // Song ends
// audio.addEventListener('ended', nextSong);
