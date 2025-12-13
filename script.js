// Fretboard Trainer script
const notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
// Open string notes (mod 12): E A D G B E
const openStrings = [4, 9, 2, 7, 11, 4]; // indexes into notes array

let countdownSeconds = 3;
let autoIntervalMs = 5000;
let countdownIntervalId = null;

function pickRandomNotePosition() {
  const targetIdx = Math.floor(Math.random() * notes.length);
  // compute possible positions on each string (fret 0-11)
  const positions = openStrings.map((openIdx, i) => {
    return { string: i + 1, note: notes[targetIdx] };
  });
  // pick a random string among available positions
  const pos = positions[Math.floor(Math.random() * positions.length)];
  return pos;
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
