const currentTimeDisplay = document.getElementById("currentTime");
const totalTimeDisplay = document.getElementById("totalTime");
const playPauseBtn = document.getElementById('playPauseBtn');
const volumeBar = document.getElementById('volumeBar');
const fileInput = document.getElementById('fileInput');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const playlist = document.getElementById('playlist');
const seekBar = document.getElementById('seekBar');
const sidebar = document.querySelector('.sidebar');
const audio = new Audio();
let audioFiles = [];
let currentIndex = 0;
let isUpdating = false;
let lastSeekValue = -1;
let isShuffle = false;
let isRepeat = false;
currentTimeDisplay.textContent = "--:--";
totalTimeDisplay.textContent = "--:--";

cover.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', (event) => {
  setTimeout(() => {
    audioFiles = Array.from(event.target.files).filter(file => file.type.startsWith('audio/'));
    displayPlaylist(audioFiles);
    if (audioFiles.length > 0) {
      loadAudio(currentIndex);
    }
  }, 50); // 少し遅延させる
});


playPauseBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playPauseBtn.innerHTML = `<span class="material-icons">pause</span>`;
  } else {
    audio.pause();
    playPauseBtn.innerHTML = `<span class="material-icons">play_arrow</span>`;
  }
});

audio.addEventListener('timeupdate', () => {
  if (!isNaN(audio.duration)) {
    const newValue = (audio.currentTime / audio.duration) * 100;
    if (Math.abs(newValue - lastSeekValue) > 1) { // 1% 以上変化したら更新
      requestAnimationFrame(() => {
        seekBar.value = newValue;
        lastSeekValue = newValue;
      });
    }
  }
});


seekBar.addEventListener('input', () => {
  audio.currentTime = (seekBar.value / 100) * audio.duration;
});

function displayPlaylist(files) {
  playlist.innerHTML = '';
  const fragment = document.createDocumentFragment();
  files.forEach((file, index) => {
    const li = document.createElement('li');
    li.classList.add('playlist-item');
    li.textContent = file.name.replace('.mp3', '');
    li.addEventListener('click', () => {
      currentIndex = index;
      loadAudio(currentIndex);
    });
    fragment.appendChild(li);
  });
  playlist.appendChild(fragment);
}


function loadAudio(index) {
  const file = audioFiles[index];
  const fileURL = URL.createObjectURL(file);
  const playlistItems = document.querySelectorAll('.playlist-item');
  audio.src = fileURL;
  audio.load();
  audio.play();
  playPauseBtn.innerHTML = `<span class="material-icons">pause</span>`;
  document.getElementById("currentTrack").textContent = file.name.replace(".mp3", "　");
  playlistItems.forEach(item => item.classList.remove('active'));
  playlistItems[index].classList.add('active');
}


volumeBar.addEventListener('input', () => {
  audio.volume = volumeBar.value / 100;
});

audio.addEventListener("loadedmetadata", () => {
  totalTimeDisplay.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  currentTimeDisplay.textContent = formatTime(audio.currentTime);
});

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

document.getElementById("shuffleBtn").addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
  if (isRepeat) {
    isRepeat = false;
    repeatBtn.classList.toggle("active", false);
  }
});

document.getElementById("repeatBtn").addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("active", isRepeat);
  if (isShuffle) {
    isShuffle = false;
    shuffleBtn.classList.toggle("active", false);
  }
});

audio.addEventListener("ended", () => {
  if (isRepeat) {
    loadAudio(currentIndex);
  } else {
    nextBtn.click();
  }
});

prevBtn.addEventListener('click', () => {
  if (isShuffle) {
    currentIndex = Math.floor(Math.random() * audioFiles.length);
    loadAudio(currentIndex);
  } else {
    currentIndex = (currentIndex - 1 + audioFiles.length) % audioFiles.length;
    loadAudio(currentIndex);
  }
});

nextBtn.addEventListener('click', () => {
  if (isShuffle) {
    currentIndex = Math.floor(Math.random() * audioFiles.length);
    loadAudio(currentIndex);
  } else {
    currentIndex = (currentIndex + 1) % audioFiles.length;
    loadAudio(currentIndex);
  }
});