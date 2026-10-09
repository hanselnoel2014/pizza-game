/* ─────────────────────────────────────────
   PIZZA MAKER — game.js
───────────────────────────────────────── */

// Emoji map for each topping key
const TOPPING_EMOJI = {
  sauce:     '🍅',
  cheese:    '🧀',
  pepperoni: '🥩',
  jalapeno:  '🌶️',
  mushroom:  '🍄',
  olive:     '🫒',
  onion:     '🧅',
  basil:     '🌿',
  pineapple: '🍍',
  bacon:     '🥓',
};

const TOPPING_LABEL = {
  sauce:     'Tomato Sauce',
  cheese:    'Cheese',
  pepperoni: 'Pepperoni',
  jalapeno:  'Jalapeños',
  mushroom:  'Mushrooms',
  olive:     'Olives',
  onion:     'Onions',
  basil:     'Basil',
  pineapple: 'Pineapple',
  bacon:     'Bacon',
};

// ── State ──────────────────────────────
let addedToppings = [];   // list of topping keys in order added
let droppedPositions = []; // {key, x, y} — relative positions (0–1) for each drop
let dragTopping   = null; // currently dragged topping key

// ── DOM refs ───────────────────────────
const screens           = document.querySelectorAll('.screen');
const startBtn          = document.getElementById('start-btn');
const doneBtn           = document.getElementById('done-btn');
const resetBtn          = document.getElementById('reset-btn');
const eatBtn            = document.getElementById('eat-btn');
const replayBtn         = document.getElementById('replay-btn');
const playAgainBtn      = document.getElementById('play-again-btn');
const pizzaDrop         = document.getElementById('pizza-drop');
const toppingLayer      = document.getElementById('topping-layer');
const sauceLayer        = document.getElementById('sauce-layer');
const cheeseLayer       = document.getElementById('cheese-layer');
const dropHint          = document.getElementById('drop-hint');
const recipeText        = document.getElementById('recipe-text');
const ovenStatus        = document.getElementById('oven-status');
const eatRecipe         = document.getElementById('eat-recipe');
const nomText           = document.getElementById('nom-text');
// Eat screen pizza preview
const eatSauceLayer     = document.getElementById('eat-sauce-layer');
const eatCheeseLayer    = document.getElementById('eat-cheese-layer');
const eatToppingLayer   = document.getElementById('eat-topping-layer');
// Nom screen pizza preview
const nomSauceLayer     = document.getElementById('nom-sauce-layer');
const nomCheeseLayer    = document.getElementById('nom-cheese-layer');
const nomToppingLayer   = document.getElementById('nom-topping-layer');

// ── Screen helper ──────────────────────
function showScreen(id) {
  screens.forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ── Start ──────────────────────────────
startBtn.addEventListener('click', () => {
  resetPizza();
  showScreen('game-screen');
});

// ── Drag from palette ──────────────────
document.querySelectorAll('.topping').forEach(el => {
  el.addEventListener('dragstart', e => {
    dragTopping = el.dataset.topping;
    el.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'copy';
  });
  el.addEventListener('dragend', () => el.classList.remove('dragging'));
});

// Touch drag support (mobile)
document.querySelectorAll('.topping').forEach(el => {
  let ghost = null;

  el.addEventListener('touchstart', e => {
    dragTopping = el.dataset.topping;
    ghost = document.createElement('div');
    ghost.textContent = TOPPING_EMOJI[dragTopping];
    ghost.style.cssText = `
      position: fixed; font-size: 2.4rem; pointer-events: none;
      z-index: 9999; transform: translate(-50%,-50%);
      filter: drop-shadow(0 4px 8px rgba(0,0,0,.5));
    `;
    document.body.appendChild(ghost);
  }, { passive: true });

  el.addEventListener('touchmove', e => {
    if (!ghost) return;
    const t = e.touches[0];
    ghost.style.left = t.clientX + 'px';
    ghost.style.top  = t.clientY + 'px';
    e.preventDefault();
  }, { passive: false });

  el.addEventListener('touchend', e => {
    if (ghost) { ghost.remove(); ghost = null; }
    const t = e.changedTouches[0];
    const target = document.elementFromPoint(t.clientX, t.clientY);
    if (target && pizzaDrop.contains(target) || target === pizzaDrop) {
      const rect = pizzaDrop.getBoundingClientRect();
      dropToppingAt(t.clientX - rect.left, t.clientY - rect.top);
    }
    dragTopping = null;
  });
});

// ── Pizza drop zone ────────────────────
pizzaDrop.addEventListener('dragover', e => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
  pizzaDrop.classList.add('drag-over');
});
pizzaDrop.addEventListener('dragleave', () => pizzaDrop.classList.remove('drag-over'));
pizzaDrop.addEventListener('drop', e => {
  e.preventDefault();
  pizzaDrop.classList.remove('drag-over');
  const rect = pizzaDrop.getBoundingClientRect();
  dropToppingAt(e.clientX - rect.left, e.clientY - rect.top);
});

function dropToppingAt(x, y) {
  if (!dragTopping) return;

  const r = pizzaDrop.offsetWidth / 2;
  const dx = x - r, dy = y - r;

  // Keep within the circular pizza (with a little margin)
  if (dx * dx + dy * dy > (r - 10) * (r - 10)) return;

  addedToppings.push(dragTopping);
  // Store as fractional position (0–1) so we can replay at any size
  droppedPositions.push({ key: dragTopping, fx: x / pizzaDrop.offsetWidth, fy: y / pizzaDrop.offsetHeight });

  // Special layer handling for sauce and cheese
  if (dragTopping === 'sauce') {
    sauceLayer.classList.add('visible');
  } else if (dragTopping === 'cheese') {
    cheeseLayer.classList.add('visible');
  }

  // Visual topping dot
  const dot = document.createElement('div');
  dot.className = 'dropped-topping';
  dot.textContent = TOPPING_EMOJI[dragTopping];
  dot.style.left = x + 'px';
  dot.style.top  = y + 'px';
  toppingLayer.appendChild(dot);

  // Hide hint once something is dropped
  dropHint.classList.add('hidden');

  updateRecipe();
  dragTopping = null;
}

function updateRecipe() {
  if (addedToppings.length === 0) {
    recipeText.textContent = 'nothing yet…';
    return;
  }
  // Deduplicate labels for display, preserving order of first appearance
  const seen = new Set();
  const labels = [];
  addedToppings.forEach(t => {
    if (!seen.has(t)) { seen.add(t); labels.push(TOPPING_LABEL[t]); }
  });
  recipeText.textContent = labels.join(', ');
}

// ── Reset ──────────────────────────────
resetBtn.addEventListener('click', resetPizza);
function resetPizza() {
  addedToppings    = [];
  droppedPositions = [];
  dragTopping      = null;
  toppingLayer.innerHTML = '';
  sauceLayer.classList.remove('visible');
  cheeseLayer.classList.remove('visible');
  dropHint.classList.remove('hidden');
  updateRecipe();
}

// ── Done → Oven ────────────────────────
doneBtn.addEventListener('click', () => {
  if (addedToppings.length === 0) {
    shakeButton(doneBtn);
    return;
  }
  showScreen('oven-screen');
  runOvenAnimation();
});

function shakeButton(btn) {
  btn.style.animation = 'shake .4s ease';
  btn.addEventListener('animationend', () => btn.style.animation = '', { once: true });
  // Inject shake keyframes once
  if (!document.getElementById('shake-style')) {
    const s = document.createElement('style');
    s.id = 'shake-style';
    s.textContent = `@keyframes shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-8px)}
      40%{transform:translateX(8px)}
      60%{transform:translateX(-6px)}
      80%{transform:translateX(6px)}
    }`;
    document.head.appendChild(s);
  }
}

// ── Oven animation sequence ────────────
const OVEN_MESSAGES = [
  'Heating up…',
  'Pre-heating oven to 450°F…',
  'Sliding pizza in…',
  'Baking away! 🔥',
  'Almost there…',
  'Golden brown perfection!',
];

function runOvenAnimation() {
  let step = 0;
  ovenStatus.textContent = OVEN_MESSAGES[0];

  const interval = setInterval(() => {
    step++;
    if (step < OVEN_MESSAGES.length) {
      ovenStatus.textContent = OVEN_MESSAGES[step];
    } else {
      clearInterval(interval);
      goToEatScreen();
    }
  }, 1200);
}

function goToEatScreen() {
  // Build recipe summary
  const seen = new Set();
  const labels = [];
  addedToppings.forEach(t => {
    if (!seen.has(t)) { seen.add(t); labels.push(TOPPING_LABEL[t]); }
  });
  eatRecipe.textContent = `Toppings: ${labels.join(', ')}`;

  // Render the actual pizza into the eat-screen preview
  renderBakedPizza(eatSauceLayer, eatCheeseLayer, eatToppingLayer, 220);

  showScreen('eat-screen');
}

// ── Helper: render baked pizza into a preview ──
function renderBakedPizza(sLayer, cLayer, tLayer, size) {
  tLayer.innerHTML = '';

  if (addedToppings.includes('sauce')) {
    sLayer.classList.add('visible');
  } else {
    sLayer.classList.remove('visible');
  }
  if (addedToppings.includes('cheese')) {
    cLayer.classList.add('visible');
  } else {
    cLayer.classList.remove('visible');
  }

  droppedPositions.forEach(({ key, fx, fy }) => {
    if (key === 'sauce' || key === 'cheese') return; // shown as full layers
    const dot = document.createElement('div');
    dot.className = 'dropped-topping';
    dot.textContent = TOPPING_EMOJI[key];
    dot.style.left = (fx * size) + 'px';
    dot.style.top  = (fy * size) + 'px';
    tLayer.appendChild(dot);
  });
}

// ── Eat → Nom ──────────────────────────
eatBtn.addEventListener('click', () => {
  showScreen('nom-screen');
  runNomAnimation();
});

function runNomAnimation() {
  // Render the same pizza on the nom screen
  renderBakedPizza(nomSauceLayer, nomCheeseLayer, nomToppingLayer, 220);
  nomText.textContent = 'Nom nom nom…';
  playAgainBtn.style.display = 'none';

  const nomPizza = document.getElementById('nom-pizza-preview');

  // After 3 seconds "eat" the pizza by shrinking it away, then show done state
  setTimeout(() => {
    nomPizza.style.transition = 'transform 0.8s ease-in, opacity 0.8s ease-in';
    nomPizza.style.transform  = 'scale(0)';
    nomPizza.style.opacity    = '0';
  }, 2800);

  setTimeout(() => {
    nomText.textContent = 'Delicious! 🎉';
    playAgainBtn.style.display = 'inline-block';
    // Reset pizza element for next time
    nomPizza.style.transition = '';
    nomPizza.style.transform  = '';
    nomPizza.style.opacity    = '';
  }, 3700);
}

// ── Play again ─────────────────────────
replayBtn.addEventListener('click',    () => { resetPizza(); showScreen('game-screen'); });
playAgainBtn.addEventListener('click', () => { resetPizza(); showScreen('start-screen'); });
