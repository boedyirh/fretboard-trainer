// Fretboard Trainer script
const notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
// Open string notes (mod 12): E A D G B E
const openStrings = [4, 9, 2, 7, 11, 4]; // indexes into notes array

let countdownSeconds = 3;
let autoIntervalMs = 5000;
let countdownIntervalId = null;
let allowedNotes = notes.slice(); // can be changed by difficulty level
let bellAudio = null;

function playBell() {
  if (!bellAudio) return;
  try {
    // rewind and play; browsers may block autoplay until user gesture
    bellAudio.currentTime = 0;
    const playPromise = bellAudio.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => { /* ignore play failures (autoplay policy) */ });
    }
  } catch (e) {
    // ignore
  }
}

function pickRandomNotePosition() {
  const targetNote = allowedNotes[Math.floor(Math.random() * allowedNotes.length)];
  // compute possible positions on each string (we only need to show string number and note name)
  const positions = openStrings.map((openIdx, i) => {
    return { string: i + 1, note: targetNote };
  });
  // pick a random string among available positions
  const pos = positions[Math.floor(Math.random() * positions.length)];
  return pos;
}

function setLevel(level) {
  // level: '1' = A,B,C,D ; '2' = E,F,G ; '3' = all keys
  if (level === '1') {
    allowedNotes = ['A','A#','B','C','C#','D','D#'];
  } else if (level === '2') {
    allowedNotes = ['E','F','F#','G','G#',];
  } else {
    allowedNotes = notes.slice();
  }
}

function updateDisplay(pos) {
  const noteEl = document.getElementById('display-note');
  const stringEl = document.getElementById('string-num');
  if (noteEl) noteEl.textContent = pos.note;
  if (stringEl) stringEl.textContent = pos.string;
}

function updateCountdownDisplay() {
  const el = document.getElementById('countdown');
  if (el) el.textContent = `${countdownSeconds}s`;
}

function advanceOnce() {
  const pos = pickRandomNotePosition();
  updateDisplay(pos);
  // attempt to play audio file named after the note (e.g. "B#.mp3").
  // encodeURIComponent is used so filenames containing "#" are requested correctly ("#" -> "%23").
  if (bellAudio) {
    // reset fallback flag for this attempt
    bellAudio._triedFallback = false;
    // set src to encoded note filename and try to load it
    bellAudio.src = encodeURIComponent(pos.note) + '.mp3';
    try { bellAudio.load(); } catch (e) { /* ignore load errors */ }
  }
  // play the audio (will fallback silently if play fails)
  playBell();
  countdownSeconds = Math.max(1, Math.floor(autoIntervalMs / 1000));
  updateCountdownDisplay();
}

function startAutoAdvance(ms = 5000) {
  stopAutoAdvance();
  autoIntervalMs = Math.max(1000, ms);
  countdownSeconds = Math.max(1, Math.floor(autoIntervalMs / 1000));
  updateCountdownDisplay();
  // show first immediately
  advanceOnce();
  countdownIntervalId = setInterval(() => {
    countdownSeconds--;
    if (countdownSeconds <= 0) {
      advanceOnce();
    }
    updateCountdownDisplay();
  }, 1000);
}

function stopAutoAdvance() {
  if (countdownIntervalId) {
    clearInterval(countdownIntervalId);
    countdownIntervalId = null;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // initial display
  const initial = pickRandomNotePosition();
  updateDisplay(initial);
  updateCountdownDisplay();

  const startBtn = document.getElementById('start-btn');
  const stopBtn = document.getElementById('stop-btn');
  const intervalInput = document.getElementById('interval-input');
  const levelSelect = document.getElementById('level-select');

  // initialize level (default to 3 = all keys)
  if (levelSelect) {
    setLevel(levelSelect.value || '3');
    levelSelect.addEventListener('change', () => {
      setLevel(levelSelect.value);
      // immediately show a new note from the selected level
      advanceOnce();
    });
  }

  // get bell audio element if present
  bellAudio = document.getElementById('bell-audio');

  if (bellAudio) {
    // If the requested note audio file cannot be loaded/played, fall back to generic bell sound once.
    bellAudio.addEventListener('error', function _onAudioError() {
      if (bellAudio._triedFallback) return;
      bellAudio._triedFallback = true;
      try {
        bellAudio.src = 'bell.mp3';
        bellAudio.load();
        playBell();
      } catch (e) {
        // ignore further errors
      }
    });
  }

  if (startBtn) startBtn.addEventListener('click', () => {
    const val = parseInt(intervalInput && intervalInput.value, 10) || 5;
    startAutoAdvance(val * 1000);
  });
  if (stopBtn) stopBtn.addEventListener('click', () => {
    stopAutoAdvance();
  });

  // auto-start with 5 seconds
  startAutoAdvance(5000);
});
