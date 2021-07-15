const video = document.querySelector("#video");
const play = document.querySelector("#play");
const stop = document.querySelector("#stop");
const progress = document.querySelector("#progress");
const timestamp = document.querySelector("#timestamp");

// 播放 暫停video
const toggleVideoStatis = function () {
  const method = video.paused ? "play" : "pause";
  video[method]();
};

//  更新播放icon
const updatePlayIcon = function () {
  play.innerHTML = video.paused
    ? '<i class="fa fa-play fa-2x"></i>'
    : '<i class="fa fa-pause fa-2x"></i>';
};

// 更新進度條
const updateProgress = function () {
  progress.value = (video.currentTime / video.duration) * 100;
  //! Math.floor() 函式會回傳小於等於所給數字的最大整數。 Math.floor(5.95) ==> 5
  let mins = Math.floor(video.currentTime / 60);
  //! 下面是在規定時間格式 小於10分鐘時補0 讓分鐘格是能維持在00兩位數
  if (mins < 10) {
    mins = "0" + String(mins);
  }

  let secs = Math.floor(video.currentTime % 60);
  if (secs < 10) {
    secs = "0" + String(secs);
  }

  timestamp.textContent = `${mins}:${secs}`;
};

// 手動設定進度條
const setVideoProgress = function () {
  video.currentTime = (+progress.value * video.duration) / 100;
};

//  暫停video
const stopVideo = function () {
  video.currentTime = 0;
  video.pause();
};
// Event listener
video.addEventListener("click", toggleVideoStatis);
video.addEventListener("play", updatePlayIcon);
video.addEventListener("pause", updatePlayIcon);
video.addEventListener("timeupdate", updateProgress);

play.addEventListener("click", toggleVideoStatis);

stop.addEventListener("click", stopVideo);

progress.addEventListener("change", setVideoProgress);
