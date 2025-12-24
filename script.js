// Fretboard Trainer script
const notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
// Open string notes (mod 12): E A D G B E
const openStrings = [4, 9, 2, 7, 11, 4]; // indexes into notes array

let countdownSeconds = 3;
let autoIntervalMs = 5000;
let countdownIntervalId = null;
let allowedNotes = notes.slice(); // can be changed by difficulty level
let bellAudio = null;
let currentNote = null;
let currentLang = 'id';

const translations = {
  id: {
    title: 'Fretboard Trainer',
    subtitle: 'Aplikasi latihan menghapal posisi note pada fretboard Gitar Listrik',
    subtitle2: 'Cari pada fret bawah dan fret atas (setelah fret 12)',
    displayPositionLabel: 'Senar:',
    intervalLabel: 'Countdown interval (detik):',
    levelLabel: 'Key yang muncul:',
    levelOptions: [
      'Level 1 — A, B, C, D',
      'Level 2 — E, F, G',
      'Level 3 — Semua key'
    ],
    startBtn: 'Mulai',
    stopBtn: 'Berhenti',
    noteText: 'Catatan: Aplikasi akan menampilkan note acak dan posisi senar setiap interval.'
  },
  en: {
    title: 'Fretboard Trainer',
    subtitle: 'Practice memorizing note positions on the electric guitar fretboard',
    subtitle2: 'Search on lower and upper frets (after fret 12)',
    displayPositionLabel: 'String:',
    intervalLabel: 'Countdown interval (seconds):',
    levelLabel: 'Keys to appear:',
    levelOptions: [
      'Level 1 — A, B, C, D',
      'Level 2 — E, F, G',
      'Level 3 — All keys'
    ],
    startBtn: 'Start',
    stopBtn: 'Stop',
    noteText: 'Note: The app will show a random note and string position at each interval.'
  }
};

function applyLanguage(lang) {
  const t = translations[lang] || translations.id;
  const titleEl = document.querySelector('.title');
  const subtitleEl = document.getElementById('subtitle');
  const subtitle2El = document.getElementById('subtitle2');
  const intervalLabel = document.getElementById('interval-label');
  const levelLabel = document.getElementById('level-label');
  const levelSelect = document.getElementById('level-select');
  const startBtn = document.getElementById('start-btn');
  const stopBtn = document.getElementById('stop-btn');
  const noteText = document.getElementById('note-text');
  const displayPositionLabelEl = document.getElementById('display-position-label');

  if (titleEl) titleEl.textContent = t.title;
  if (subtitleEl) subtitleEl.textContent = t.subtitle;
  if (subtitle2El) subtitle2El.textContent = t.subtitle2;
  if (intervalLabel) intervalLabel.firstChild && (intervalLabel.childNodes[0].textContent = t.intervalLabel + ' ');
  if (levelLabel) levelLabel.childNodes[0] && (levelLabel.childNodes[0].textContent = t.levelLabel + ' ');
  if (levelSelect) {
    // update option texts but keep values
    const opts = levelSelect.options;
    for (let i = 0; i < opts.length && i < t.levelOptions.length; i++) {
      opts[i].text = t.levelOptions[i];
    }
  }
  if (startBtn) startBtn.textContent = t.startBtn;
  if (stopBtn) stopBtn.textContent = t.stopBtn;
  if (noteText) noteText.textContent = t.noteText;
  if (displayPositionLabelEl) displayPositionLabelEl.textContent = (t.displayPositionLabel || 'Senar:');
  document.title = t.title;
}

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

function pickRandomNotePosition(excludeNote) {
  // choose a target note, excluding `excludeNote` when possible
  let candidates = allowedNotes;
  if (excludeNote) {
    const filtered = allowedNotes.filter(n => n !== excludeNote);
    if (filtered.length > 0) candidates = filtered;
  }
  const targetNote = candidates[Math.floor(Math.random() * candidates.length)];
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
  // remember the currently displayed note so next pick can avoid repeats
  currentNote = pos.note;
}

function updateCountdownDisplay() {
  const el = document.getElementById('countdown');
  if (el) el.textContent = `${countdownSeconds}s`;
}

function advanceOnce() {
  const pos = pickRandomNotePosition(currentNote);
  updateDisplay(pos);
  // attempt to play audio file named after the note (e.g. "B#.mp3").
  // encodeURIComponent is used so filenames containing "#" are requested correctly ("#" -> "%23").
  if (bellAudio) {
    // reset fallback flag for this attempt
    bellAudio._triedFallback = false;
    // choose filename based on selected language
    let filename = encodeURIComponent(pos.note) + '.mp3';
    if (currentLang === 'en') {
      filename = 'Eng-' + encodeURIComponent(pos.note) + '.mp3';
    }
    // set src to filename and try to load it
    bellAudio.src = filename;
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

  // language selector
  const langSelect = document.getElementById('lang-select');
  if (langSelect) {
    currentLang = langSelect.value || 'id';
    applyLanguage(currentLang);
    langSelect.addEventListener('change', () => {
      currentLang = langSelect.value || 'id';
      applyLanguage(currentLang);
      // show a new note after language change to reflect audio filename
      advanceOnce();
    });
  } else {
    applyLanguage(currentLang);
  }

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
