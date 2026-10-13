/* ═══════════════════════════════════════════
   PIZZA MAKER — game.js
   Cartoon SVG toppings, category sidebar,
   drag-and-drop onto illustrated pizza
═══════════════════════════════════════════ */

// ── SVG topping art ────────────────────────────────────────────────────────
// Each returns an SVG string rendered at the given size.
// Sizes used: palette = 80×80, dropped-on-pizza = 54×54, preview = 38×38

const TOPPING_SVG = {

  /* ── BASE LAYER TOPPINGS ── */
  sauce: (s=80) => `<svg viewBox="0 0 80 80" width="${s}" height="${s}">
    <circle cx="40" cy="40" r="36" fill="#c0392b"/>
    <circle cx="40" cy="40" r="28" fill="#e74c3c"/>
    <circle cx="32" cy="32" r="6"  fill="#ff6b6b" opacity=".6"/>
    <circle cx="50" cy="46" r="4"  fill="#ff6b6b" opacity=".5"/>
  </svg>`,

  cheese: (s=80) => `<svg viewBox="0 0 80 80" width="${s}" height="${s}">
    <rect x="8" y="22" width="64" height="36" rx="10" fill="#f4d03f"/>
    <rect x="8" y="22" width="64" height="12" rx="8"  fill="#f9e47a"/>
    <circle cx="24" cy="45" r="6" fill="#e6b800" opacity=".7"/>
    <circle cx="46" cy="48" r="5" fill="#e6b800" opacity=".7"/>
    <circle cx="62" cy="40" r="4" fill="#e6b800" opacity=".6"/>
  </svg>`,

  /* ── VEGGIES ── */
  tomato: (s=80) => `<svg viewBox="0 0 80 80" width="${s}" height="${s}">
    <!-- body -->
    <circle cx="40" cy="44" r="30" fill="#e74c3c"/>
    <circle cx="40" cy="44" r="30" fill="url(#tg)" opacity=".35"/>
    <!-- shine -->
    <ellipse cx="30" cy="30" rx="8" ry="5" fill="#ff9999" opacity=".7" transform="rotate(-20 30 30)"/>
    <!-- cross lines -->
    <line x1="40" y1="16" x2="40" y2="72" stroke="#c0392b" stroke-width="2.5" opacity=".5"/>
    <line x1="12" y1="44" x2="68" y2="44" stroke="#c0392b" stroke-width="2.5" opacity=".5"/>
    <!-- stem -->
    <rect x="37" y="10" width="6" height="10" rx="3" fill="#27ae60"/>
    <path d="M40 14 Q46 8 50 12" stroke="#27ae60" stroke-width="3" fill="none" stroke-linecap="round"/>
    <defs><radialGradient id="tg"><stop offset="0%" stop-color="#ff6b6b"/><stop offset="100%" stop-color="#c0392b"/></radialGradient></defs>
  </svg>`,

  jalapeno: (s=80) => `<svg viewBox="0 0 80 80" width="${s}" height="${s}">
    <ellipse cx="40" cy="46" rx="22" ry="28" fill="#27ae60" transform="rotate(-15 40 46)"/>
    <ellipse cx="40" cy="46" rx="14" ry="20" fill="#2ecc71" opacity=".7" transform="rotate(-15 40 46)"/>
    <line x1="40" y1="18" x2="40" y2="72" stroke="#1a7a45" stroke-width="2" opacity=".5" transform="rotate(-15 40 46)"/>
    <path d="M36 14 Q40 8 44 12" stroke="#27ae60" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="34" cy="32" rx="4" ry="6" fill="#a9dfbf" opacity=".5" transform="rotate(-15 34 32)"/>
  </svg>`,

  mushroom: (s=80) => `<svg viewBox="0 0 80 80" width="${s}" height="${s}">
    <!-- cap -->
    <ellipse cx="40" cy="38" rx="30" ry="22" fill="#c8a068"/>
    <ellipse cx="40" cy="38" rx="30" ry="22" fill="url(#mg)"/>
    <!-- spots -->
    <circle cx="30" cy="32" r="5"  fill="#f5e6d0" opacity=".8"/>
    <circle cx="50" cy="30" r="4"  fill="#f5e6d0" opacity=".8"/>
    <circle cx="42" cy="44" r="3.5" fill="#f5e6d0" opacity=".7"/>
    <!-- underside gills -->
    <ellipse cx="40" cy="54" rx="18" ry="7" fill="#e8c99a"/>
    <!-- stem -->
    <rect x="33" y="54" width="14" height="18" rx="7" fill="#f0d9b8"/>
    <rect x="36" y="54" width="3"  height="18" rx="2" fill="#e8c99a" opacity=".6"/>
    <rect x="41" y="54" width="3"  height="18" rx="2" fill="#e8c99a" opacity=".6"/>
    <defs><radialGradient id="mg" cx="38%" cy="36%"><stop offset="0%" stop-color="#e0b87a"/><stop offset="100%" stop-color="#9a6830"/></radialGradient></defs>
  </svg>`,

  olive: (s=80) => `<svg viewBox="0 0 80 80" width="${s}" height="${s}">
    <circle cx="24" cy="46" r="14" fill="#2c3e50"/>
    <circle cx="56" cy="46" r="14" fill="#2c3e50"/>
    <circle cx="40" cy="36" r="14" fill="#2c3e50"/>
    <circle cx="24" cy="46" r="7"  fill="#e74c3c"/>
    <circle cx="56" cy="46" r="7"  fill="#e74c3c"/>
    <circle cx="40" cy="36" r="7"  fill="#e74c3c"/>
    <circle cx="22" cy="43" r="3"  fill="#5d6d7e" opacity=".6"/>
    <circle cx="54" cy="43" r="3"  fill="#5d6d7e" opacity=".6"/>
    <circle cx="38" cy="33" r="3"  fill="#5d6d7e" opacity=".6"/>
  </svg>`,

  onion: (s=80) => `<svg viewBox="0 0 80 80" width="${s}" height="${s}">
    <!-- outer ring -->
    <ellipse cx="40" cy="46" rx="30" ry="20" fill="none" stroke="#d4a0e0" stroke-width="9"/>
    <!-- middle ring -->
    <ellipse cx="40" cy="46" rx="18" ry="11" fill="none" stroke="#c084d8" stroke-width="7"/>
    <!-- inner dot -->
    <ellipse cx="40" cy="46" rx="6"  ry="4"  fill="#a855c8"/>
    <!-- shine -->
    <ellipse cx="28" cy="40" rx="5" ry="3" fill="#fff" opacity=".25" transform="rotate(-20 28 40)"/>
  </svg>`,

  pepper: (s=80) => `<svg viewBox="0 0 80 80" width="${s}" height="${s}">
    <!-- body -->
    <path d="M40 14 C20 14 10 28 12 46 C14 60 28 70 40 70 C52 70 66 60 68 46 C70 28 60 14 40 14Z" fill="#e74c3c"/>
    <!-- lobes -->
    <path d="M40 14 C35 14 28 20 30 32 C32 44 38 52 40 52 C42 52 48 44 50 32 C52 20 45 14 40 14Z" fill="#c0392b" opacity=".4"/>
    <!-- shine -->
    <ellipse cx="30" cy="28" rx="6" ry="10" fill="#ff8888" opacity=".5" transform="rotate(-15 30 28)"/>
    <!-- stem -->
    <rect x="37" y="6" width="6" height="12" rx="3" fill="#27ae60"/>
  </svg>`,

  basil: (s=80) => `<svg viewBox="0 0 80 80" width="${s}" height="${s}">
    <ellipse cx="40" cy="42" rx="28" ry="20" fill="#27ae60" transform="rotate(-10 40 42)"/>
    <ellipse cx="40" cy="42" rx="28" ry="20" fill="#2ecc71" transform="rotate(10 40 42)" opacity=".8"/>
    <line x1="40" y1="22" x2="40" y2="62" stroke="#1a7a40" stroke-width="2.5" opacity=".6"/>
    <line x1="24" y1="34" x2="56" y2="50" stroke="#1a7a40" stroke-width="1.8" opacity=".5"/>
    <line x1="24" y1="50" x2="56" y2="34" stroke="#1a7a40" stroke-width="1.8" opacity=".5"/>
    <ellipse cx="28" cy="36" rx="5" ry="7" fill="#a9dfbf" opacity=".45" transform="rotate(-10 28 36)"/>
  </svg>`,

  /* ── MEATS ── */
  pepperoni: (s=80) => `<svg viewBox="0 0 80 80" width="${s}" height="${s}">
    <circle cx="40" cy="40" r="32" fill="#922b21"/>
    <circle cx="40" cy="40" r="32" fill="url(#pg)"/>
    <!-- fat marbling -->
    <circle cx="28" cy="30" r="5"  fill="#e8c4a0" opacity=".7"/>
    <circle cx="52" cy="34" r="4"  fill="#e8c4a0" opacity=".6"/>
    <circle cx="36" cy="52" r="4.5" fill="#e8c4a0" opacity=".65"/>
    <circle cx="55" cy="52" r="3.5" fill="#e8c4a0" opacity=".55"/>
    <!-- edge curl -->
    <circle cx="40" cy="40" r="32" fill="none" stroke="#7b241c" stroke-width="4" opacity=".5"/>
    <defs><radialGradient id="pg" cx="40%" cy="38%"><stop offset="0%" stop-color="#c0392b"/><stop offset="100%" stop-color="#7b241c"/></radialGradient></defs>
  </svg>`,

  bacon: (s=80) => `<svg viewBox="0 0 80 80" width="${s}" height="${s}">
    <!-- wavy strips -->
    <path d="M8 28 Q20 20 32 28 Q44 36 56 28 Q68 20 76 28 L76 38 Q64 46 52 38 Q40 30 28 38 Q16 46 8 38Z" fill="#c0392b"/>
    <path d="M8 28 Q20 20 32 28 Q44 36 56 28 Q68 20 76 28 L76 32 Q64 24 52 32 Q40 40 28 32 Q16 24 8 32Z" fill="#e8c4a0"/>
    <path d="M8 44 Q20 36 32 44 Q44 52 56 44 Q68 36 76 44 L76 54 Q64 62 52 54 Q40 46 28 54 Q16 62 8 54Z" fill="#c0392b"/>
    <path d="M8 44 Q20 36 32 44 Q44 52 56 44 Q68 36 76 44 L76 48 Q64 40 52 48 Q40 56 28 48 Q16 40 8 48Z" fill="#e8c4a0"/>
  </svg>`,

  /* ── EXTRAS ── */
  pineapple: (s=80) => `<svg viewBox="0 0 80 80" width="${s}" height="${s}">
    <!-- chunk body -->
    <rect x="14" y="28" width="52" height="36" rx="10" fill="#f39c12"/>
    <!-- diamond texture -->
    <line x1="14" y1="40" x2="66" y2="40" stroke="#e67e22" stroke-width="2" opacity=".6"/>
    <line x1="14" y1="52" x2="66" y2="52" stroke="#e67e22" stroke-width="2" opacity=".6"/>
    <line x1="28" y1="28" x2="28" y2="64" stroke="#e67e22" stroke-width="2" opacity=".6"/>
    <line x1="42" y1="28" x2="42" y2="64" stroke="#e67e22" stroke-width="2" opacity=".6"/>
    <line x1="56" y1="28" x2="56" y2="64" stroke="#e67e22" stroke-width="2" opacity=".6"/>
    <!-- shine -->
    <rect x="18" y="30" width="16" height="8" rx="4" fill="#f9e47a" opacity=".5"/>
    <!-- leaves -->
    <path d="M30 28 Q28 16 24 12" stroke="#27ae60" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M40 28 Q40 14 40 10" stroke="#27ae60" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M50 28 Q52 16 56 12" stroke="#27ae60" stroke-width="4" fill="none" stroke-linecap="round"/>
  </svg>`,

  anchovy: (s=80) => `<svg viewBox="0 0 80 80" width="${s}" height="${s}">
    <ellipse cx="40" cy="40" rx="32" ry="12" fill="#5d6d7e" transform="rotate(-15 40 40)"/>
    <ellipse cx="40" cy="40" rx="28" ry="8"  fill="#7f8c8d" opacity=".7" transform="rotate(-15 40 40)"/>
    <!-- eye -->
    <circle cx="56" cy="33" r="4" fill="#fff"/>
    <circle cx="56" cy="33" r="2" fill="#2c3e50"/>
    <!-- tail fin -->
    <path d="M10 46 L4 54 L4 38 Z" fill="#5d6d7e" transform="rotate(-15 10 46)"/>
    <!-- belly stripe -->
    <ellipse cx="40" cy="40" rx="22" ry="4"  fill="#bdc3c7" opacity=".4" transform="rotate(-15 40 40)"/>
  </svg>`,
};

// ── Topping catalogue by category ─────────────────────────────────────────
const CATEGORIES = {
  base: [
    { key: 'sauce',    label: 'TOMATO SAUCE' },
    { key: 'cheese',   label: 'CHEESE' },
  ],
  veggies: [
    { key: 'tomato',   label: 'TOMATO' },
    { key: 'jalapeno', label: 'JALAPEÑO' },
    { key: 'mushroom', label: 'MUSHROOM' },
    { key: 'olive',    label: 'OLIVES' },
    { key: 'onion',    label: 'ONION' },
    { key: 'pepper',   label: 'RED PEPPER' },
    { key: 'basil',    label: 'BASIL' },
  ],
  meats: [
    { key: 'pepperoni', label: 'PEPPERONI' },
    { key: 'bacon',     label: 'BACON' },
    { key: 'anchovy',   label: 'ANCHOVY' },
  ],
  extras: [
    { key: 'pineapple', label: 'PINEAPPLE' },
  ],
};

const TOPPING_LABEL = {};
Object.values(CATEGORIES).flat().forEach(t => { TOPPING_LABEL[t.key] = t.label; });

// ── State ─────────────────────────────────────────────────────────────────
let currentCat      = 'base';
let dragTopping     = null;   // key of topping being dragged
let droppedItems    = [];     // { key, fx, fy } — fractional coords on 420px pizza
let activeCat       = 'base';

// ── DOM refs ──────────────────────────────────────────────────────────────
const startScreen   = document.getElementById('start-screen');
const gameScreen    = document.getElementById('game-screen');
const ovenScreen    = document.getElementById('oven-screen');
const eatScreen     = document.getElementById('eat-screen');
const nomScreen     = document.getElementById('nom-screen');

const startBtn      = document.getElementById('start-btn');
const cookBtn       = document.getElementById('cook-btn');
const undoBtn       = document.getElementById('undo-btn');
const resetBtn      = document.getElementById('reset-btn');
const eatBtn        = document.getElementById('eat-btn');
const replayBtn     = document.getElementById('replay-btn');
const playAgainBtn  = document.getElementById('play-again-btn');

const toppingsList  = document.getElementById('toppings-list');
const pizzaDrop     = document.getElementById('pizza-drop');
const toppingLayer  = document.getElementById('topping-layer');
const dropHint      = document.getElementById('drop-hint');
const ovenMsg       = document.getElementById('oven-msg');
const eatRecipe     = document.getElementById('eat-recipe');

// pizza base SVG layers
const sauceCircle   = document.getElementById('pizza-sauce-circle');
const cheeseCircle  = document.getElementById('pizza-cheese-circle');

// ── Screen switcher ───────────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ── Build topping list for a category ────────────────────────────────────
function buildToppingsList(cat) {
  toppingsList.innerHTML = '';
  CATEGORIES[cat].forEach(({ key, label }) => {
    const item = document.createElement('div');
    item.className   = 'topping-item';
    item.draggable   = true;
    item.dataset.key = key;
    item.innerHTML   = TOPPING_SVG[key](80) + `<span class="t-label">${label}</span>`;

    // Mouse drag
    item.addEventListener('dragstart', e => {
      dragTopping = key;
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'copy';
    });
    item.addEventListener('dragend', () => item.classList.remove('dragging'));

    // Touch drag
    let ghost = null;
    item.addEventListener('touchstart', e => {
      dragTopping = key;
      ghost = document.createElement('div');
      ghost.innerHTML = TOPPING_SVG[key](72);
      ghost.style.cssText = `
        position:fixed; pointer-events:none; z-index:9999;
        transform:translate(-50%,-50%);
        filter:drop-shadow(0 4px 10px rgba(0,0,0,.5));
      `;
      document.body.appendChild(ghost);
    }, { passive: true });

    item.addEventListener('touchmove', e => {
      if (!ghost) return;
      const t = e.touches[0];
      ghost.style.left = t.clientX + 'px';
      ghost.style.top  = t.clientY + 'px';
      e.preventDefault();
    }, { passive: false });

    item.addEventListener('touchend', e => {
      if (ghost) { ghost.remove(); ghost = null; }
      const t  = e.changedTouches[0];
      const el = document.elementFromPoint(t.clientX, t.clientY);
      if (el && (pizzaDrop.contains(el) || el === pizzaDrop)) {
        const rect = pizzaDrop.getBoundingClientRect();
        dropAt(t.clientX - rect.left, t.clientY - rect.top);
      }
      dragTopping = null;
    });

    toppingsList.appendChild(item);
  });
}

// ── Category tab switching ────────────────────────────────────────────────
document.querySelectorAll('.cat-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    buildToppingsList(tab.dataset.cat);
  });
});

// ── Pizza drop zone ───────────────────────────────────────────────────────
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
  dropAt(e.clientX - rect.left, e.clientY - rect.top);
});

function dropAt(x, y) {
  if (!dragTopping) return;

  const W  = pizzaDrop.offsetWidth;
  const H  = pizzaDrop.offsetHeight;
  const cx = W / 2, cy = H / 2;
  const dx = x - cx, dy = y - cy;
  const r  = Math.min(cx, cy);

  // Must land inside the circle (with margin for topping radius)
  if (dx * dx + dy * dy > (r - 20) * (r - 20)) return;

  const key = dragTopping;
  droppedItems.push({ key, fx: x / W, fy: y / H });

  // Base layers: update the SVG circles directly
  if (key === 'sauce') {
    sauceCircle.setAttribute('fill', '#c0392b');
  } else if (key === 'cheese') {
    cheeseCircle.setAttribute('opacity', '1');
  }

  // Place topping visually
  placeToppingDot(key, x, y, toppingLayer, 54);

  dropHint.classList.add('hidden');
  dragTopping = null;
}

function placeToppingDot(key, x, y, layer, size) {
  const dot = document.createElement('div');
  dot.className = 'dropped-topping';
  dot.style.left = x + 'px';
  dot.style.top  = y + 'px';
  dot.innerHTML  = TOPPING_SVG[key](size);
  layer.appendChild(dot);
  return dot;
}

// ── Undo / reset ─────────────────────────────────────────────────────────
undoBtn.addEventListener('click', () => {
  if (droppedItems.length === 0) return;
  droppedItems.pop();
  // Rebuild entire layer from scratch (cheapest reliable approach)
  rebuildPizzaLayer();
});

resetBtn.addEventListener('click', resetPizza);

function resetPizza() {
  droppedItems = [];
  dragTopping  = null;
  rebuildPizzaLayer();
}

function rebuildPizzaLayer() {
  toppingLayer.innerHTML = '';
  // Reset base layers
  sauceCircle.setAttribute('fill', '#e8a030');
  cheeseCircle.setAttribute('opacity', '0');

  const W = pizzaDrop.offsetWidth;
  const H = pizzaDrop.offsetHeight;

  droppedItems.forEach(({ key, fx, fy }) => {
    if (key === 'sauce') {
      sauceCircle.setAttribute('fill', '#c0392b');
    } else if (key === 'cheese') {
      cheeseCircle.setAttribute('opacity', '1');
    }
    placeToppingDot(key, fx * W, fy * H, toppingLayer, 54);
  });

  if (droppedItems.length === 0) {
    dropHint.classList.remove('hidden');
  }
}

// ── Cook! ─────────────────────────────────────────────────────────────────
cookBtn.addEventListener('click', () => {
  if (droppedItems.length === 0) {
    shakEl(cookBtn);
    return;
  }
  showScreen('oven-screen');
  runOven();
});

const OVEN_MSGS = [
  'Heating up…',
  'Pre-heating to 450°F…',
  'Sliding pizza in…',
  'Baking away! 🔥',
  'Almost there…',
  '✨ Golden perfection!',
];

function runOven() {
  let i = 0;
  ovenMsg.textContent = OVEN_MSGS[0];
  const iv = setInterval(() => {
    i++;
    if (i < OVEN_MSGS.length) {
      ovenMsg.textContent = OVEN_MSGS[i];
    } else {
      clearInterval(iv);
      goToEat();
    }
  }, 1100);
}

// ── Eat screen ────────────────────────────────────────────────────────────
function goToEat() {
  // Recipe label
  const seen = new Set(), labels = [];
  droppedItems.forEach(({ key }) => {
    if (!seen.has(key)) { seen.add(key); labels.push(TOPPING_LABEL[key]); }
  });
  eatRecipe.textContent = labels.length ? `Toppings: ${labels.join(', ')}` : 'Plain pizza!';

  // Render preview pizza
  renderPreviewPizza(document.getElementById('eat-pizza-preview'), 220);
  showScreen('eat-screen');
}

function renderPreviewPizza(container, size) {
  container.innerHTML = '';

  // Base SVG (scaled)
  const scale = size / 420;
  const svgBase = `
  <svg viewBox="0 0 420 420" width="${size}" height="${size}" style="position:absolute;inset:0;pointer-events:none;">
    <circle cx="210" cy="210" r="205" fill="#b8751a"/>
    <circle cx="210" cy="210" r="195" fill="#c8892a"/>
    <circle cx="210" cy="210" r="165" fill="${droppedItems.some(d=>d.key==='sauce') ? '#c0392b' : '#e8a030'}"/>
    <circle cx="210" cy="210" r="165" fill="#f4d03f" opacity="${droppedItems.some(d=>d.key==='cheese') ? '0.9' : '0'}"/>
  </svg>`;
  container.insertAdjacentHTML('beforeend', svgBase);

  // Topping layer
  const layer = document.createElement('div');
  layer.className = 'preview-topping-layer';
  container.appendChild(layer);

  droppedItems.forEach(({ key, fx, fy }) => {
    if (key === 'sauce' || key === 'cheese') return;
    placeToppingDot(key, fx * size, fy * size, layer, Math.round(54 * scale));
  });
}

// ── Nom screen ────────────────────────────────────────────────────────────
eatBtn.addEventListener('click', () => {
  renderPreviewPizza(document.getElementById('nom-pizza-preview'), 220);
  document.getElementById('nom-msg').textContent = 'NOM NOM NOM! 😋';
  playAgainBtn.style.display = 'none';
  showScreen('nom-screen');

  const nomPizza = document.getElementById('nom-pizza-preview');
  setTimeout(() => {
    nomPizza.style.transition = 'transform .8s ease-in, opacity .8s ease-in';
    nomPizza.style.transform  = 'scale(0)';
    nomPizza.style.opacity    = '0';
  }, 2600);
  setTimeout(() => {
    document.getElementById('nom-msg').textContent = 'DELICIOUS! 🎉';
    playAgainBtn.style.display = 'inline-block';
    nomPizza.style.transition  = '';
    nomPizza.style.transform   = '';
    nomPizza.style.opacity     = '';
  }, 3500);
});

// ── Navigation ────────────────────────────────────────────────────────────
startBtn.addEventListener('click', () => {
  resetPizza();
  buildToppingsList('base');
  document.querySelectorAll('.cat-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.cat === 'base'));
  showScreen('game-screen');
});

replayBtn.addEventListener('click', () => {
  resetPizza();
  showScreen('game-screen');
});

playAgainBtn.addEventListener('click', () => {
  resetPizza();
  showScreen('start-screen');
});

// ── Shake utility ─────────────────────────────────────────────────────────
function shakEl(el) {
  if (!document.getElementById('shake-kf')) {
    const s = document.createElement('style');
    s.id = 'shake-kf';
    s.textContent = `@keyframes shake-kf {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-9px)}
      40%{transform:translateX(9px)}
      60%{transform:translateX(-6px)}
      80%{transform:translateX(6px)}
    }`;
    document.head.appendChild(s);
  }
  el.style.animation = 'shake-kf .4s ease';
  el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
}

// ── Init ──────────────────────────────────────────────────────────────────
buildToppingsList('base');
