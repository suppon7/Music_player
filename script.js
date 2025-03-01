const currentTimeDisplay = document.getElementById("currentTime"),
  totalTimeDisplay = document.getElementById("totalTime"),
  playlist = document.getElementById('playlist'),
  fileInput = document.getElementById('fileInput'),
  playPauseBtn = document.getElementById('playPauseBtn'),
  seekBar = document.getElementById('seekBar'),
  cover = document.getElementById('cover'),
  nextBtn = document.getElementById('nextBtn'),
  shuffleBtn = document.getElementById("shuffleBtn"),
  repeatBtn = document.getElementById("repeatBtn"),
  track = document.getElementById("currentTrack"),
  audio = new Audio();
let audioFiles = [],
  currentIndex = 0,
  isUpdating = false,
  lastSeekValue = -1,
  isShuffle = false,
  isRepeat = false;
currentTimeDisplay.textContent = "--:--";
totalTimeDisplay.textContent = "--:--";

cover.addEventListener('click', () => {
  fileInput.click();
});

// Function
function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

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
  track.textContent = file.name.replace(".mp3", "");
  playlistItems.forEach(item => item.classList.remove('active'));
  playlistItems[index].classList.add('active');
}

// Event
audio.addEventListener("loadedmetadata", () => {
  totalTimeDisplay.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  currentTimeDisplay.textContent = formatTime(audio.currentTime);
});

seekBar.addEventListener('input', () => {
  audio.currentTime = (seekBar.value / 100) * audio.duration;
});

audio.addEventListener("ended", () => {
  if (isRepeat) {
    loadAudio(currentIndex);
  } else {
    nextBtn.click();
  }
});

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
  if (isRepeat) {
    isRepeat = false;
    repeatBtn.classList.toggle("active", false);
  }
});

repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("active", isRepeat);
  if (isShuffle) {
    isShuffle = false;
    shuffleBtn.classList.toggle("active", false);
  }
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

nextBtn.addEventListener('click', () => {
  if (isShuffle) {
    currentIndex = Math.floor(Math.random() * audioFiles.length);
    loadAudio(currentIndex);
  } else {
    currentIndex = (currentIndex + 1) % audioFiles.length;
    loadAudio(currentIndex);
  }
});

fileInput.addEventListener('change', (event) => {
  setTimeout(() => {
    audioFiles = Array.from(event.target.files).filter(file => file.type.startsWith('audio/'));
    displayPlaylist(audioFiles);
    if (audioFiles.length > 0) {
      loadAudio(currentIndex);
    }
  }, 50);
});


audio.addEventListener('timeupdate', () => {
  if (!isNaN(audio.duration)) {
    const newValue = (audio.currentTime / audio.duration) * 100;
    if (Math.abs(newValue - lastSeekValue) > 1) {
      requestAnimationFrame(() => {
        seekBar.value = newValue;
        lastSeekValue = newValue;
      });
    }
  }
});