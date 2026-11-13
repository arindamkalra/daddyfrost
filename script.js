/* ============ Frost's website ============ */

const $ = (s) => document.querySelector(s);

/* ---------- Sounds ---------- */
const voice = $("#voice");
const meows = [voice, $("#meow2"), $("#meow3")];

function play(audio) {
  try {
    audio.currentTime = 0;
    const p = audio.play();
    if (p && p.catch) p.catch(() => {});
  } catch (e) { /* ignore */ }
}
const randomMeow = () => play(meows[Math.floor(Math.random() * meows.length)]);

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  let t = $(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

/* ---------- Hero: voice button + clickable photo ---------- */
const sayings = ["mrrp.", "MRAOW.", "feed me.", "I was asleep.", "no.", "...meow?", "you may leave.", "where's my snack"];
const heroCat = $("#heroCat");
const bubble = $("#heroBubble");
const meowBtn = $("#meowBtn");
let bubbleTimer;

function frostSpeaks(useVoice = true) {
  if (useVoice) play(voice); else randomMeow();
  bubble.textContent = sayings[Math.floor(Math.random() * sayings.length)];
  bubble.classList.add("show");
  heroCat.classList.remove("wiggle");
  void heroCat.offsetWidth;
  heroCat.classList.add("wiggle");
  meowBtn.classList.add("playing");
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => {
    bubble.classList.remove("show");
    meowBtn.classList.remove("playing");
  }, 1600);
}
meowBtn.addEventListener("click", () => frostSpeaks(true));
heroCat.addEventListener("click", () => frostSpeaks(false));
heroCat.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); frostSpeaks(false); }
});

/* ---------- Live sleep counter (he sleeps ~16 of 24 hours) ---------- */
const sleepEl = $("#sleepCounter");
function updateSleep() {
  const now = new Date();
  const hoursToday = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  sleepEl.textContent = (hoursToday * (16 / 24)).toFixed(3);
}
updateSleep();
setInterval(updateSleep, 1000);

/* ---------- Random floating Zzz while idle ---------- */
let idleTimer;
function resetIdle() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(spawnZ, 7000);
}
function spawnZ() {
  const z = document.createElement("div");
  z.className = "zzz";
  z.textContent = ["z", "Z", "zz", "Zzz"][Math.floor(Math.random() * 4)];
  z.style.left = 10 + Math.random() * 80 + "vw";
  z.style.top = 30 + Math.random() * 60 + "vh";
  document.body.appendChild(z);
  setTimeout(() => z.remove(), 3000);
  idleTimer = setTimeout(spawnZ, 1200);
}
["mousemove", "scroll", "keydown", "touchstart"].forEach((ev) =>
  window.addEventListener(ev, resetIdle, { passive: true })
);
resetIdle();

/* ---------- Bee & butterfly hunt ---------- */
const meadow = $("#meadow");
const caughtEl = $("#caught");
const bugStat = $("#bugStat");
const huntMsg = $("#huntMsg");
const huntLines = [
  "GOT ONE! (released it)",
  "Pounce! …it's fine, it flew off.",
  "Majestic leap. Mild success.",
  "He's out of breath. Nap required.",
  "Bee secured. Bee released. Bee confused.",
  "Butterfly booped.",
];
let caught = 0;
const bugs = [];
const BUG_TYPES = ["🐝", "🦋", "🐝", "🦋", "🕷️", "🕷️"];
const spiderLines = [
  "Spider eliminated. No mercy.",
  "SPLAT. The house is safe again.",
  "Spider removed from the premises. Permanently.",
  "Frost: 1. Spider: 0. Forever.",
];
const missLines = ["Missed! Pretending that was on purpose.", "Swipe… and miss.", "Too slow. Too floofy."];

function makeBug(type) {
  const el = document.createElement("span");
  el.className = "bug";
  el.textContent = type;
  el.setAttribute("role", "button");
  el.setAttribute("aria-label", type === "🐝" ? "bee" : type === "🦋" ? "butterfly" : "spider");
  meadow.appendChild(el);
  const w = meadow.clientWidth, h = meadow.clientHeight;
  const bug = {
    el, type,
    x: Math.random() * (w - 60),
    y: type === "🕷️" ? h * 0.6 + Math.random() * (h * 0.2) : 50 + Math.random() * (h * 0.55),
    vx: (Math.random() - 0.5) * 3,
    vy: (Math.random() - 0.5) * 3,
    t: Math.random() * 100,
    alive: true,
  };
  el.addEventListener("pointerdown", (e) => { e.stopPropagation(); catchBug(bug, e); });
  bugs.push(bug);
}

function catchBug(bug, e) {
  if (!bug.alive) return;
  bug.alive = false;
  bug.el.classList.add("caught");
  caught++;
  caughtEl.textContent = caught;
  bugStat.textContent = caught;
  const lines = bug.type === "🕷️" ? spiderLines : huntLines;
  huntMsg.textContent = lines[Math.floor(Math.random() * lines.length)];
  if (bug.type === "🕷️") play($("#meow3"));
  pawPrint(e);
  if (caught % 5 === 0) {
    play($("#meow2"));
    toast(`${caught} critters hunted! Frost needs a 3-hour nap now. 💤`);
  }
  setTimeout(() => {
    bug.el.remove();
    bugs.splice(bugs.indexOf(bug), 1);
    makeBug(bug.type);
  }, 900);
}

function pawPrint(e) {
  const r = meadow.getBoundingClientRect();
  const p = document.createElement("span");
  p.className = "pawprint";
  p.textContent = "🐾";
  p.style.left = e.clientX - r.left - 16 + "px";
  p.style.top = e.clientY - r.top - 16 + "px";
  meadow.appendChild(p);
  setTimeout(() => p.remove(), 900);
}

meadow.addEventListener("pointerdown", (e) => {
  pawPrint(e);
  huntMsg.textContent = missLines[Math.floor(Math.random() * missLines.length)];
});

let mouse = { x: -999, y: -999 };
meadow.addEventListener("pointermove", (e) => {
  const r = meadow.getBoundingClientRect();
  mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
});
meadow.addEventListener("pointerleave", () => (mouse = { x: -999, y: -999 }));

function animateBugs() {
  const w = meadow.clientWidth, h = meadow.clientHeight;
  for (const b of bugs) {
    if (!b.alive) continue;
    b.t += 0.05;
    // wander
    b.vx += (Math.random() - 0.5) * 0.4;
    b.vy += b.type === "🕷️" ? (Math.random() - 0.5) * 0.15 : (Math.random() - 0.5) * 0.4 + Math.sin(b.t) * 0.05;
    // flee the paw a little
    const dx = b.x + 20 - mouse.x, dy = b.y + 20 - mouse.y;
    const d = Math.hypot(dx, dy);
    if (d < 110) { b.vx += (dx / d) * 0.9; b.vy += (dy / d) * 0.9; }
    // speed limit
    const max = b.type === "🐝" ? 3.6 : b.type === "🕷️" ? 2.2 : 2.6;
    const sp = Math.hypot(b.vx, b.vy);
    if (sp > max) { b.vx = (b.vx / sp) * max; b.vy = (b.vy / sp) * max; }
    b.x += b.vx; b.y += b.vy;
    // walls (keep above the flowers)
    if (b.x < 0) { b.x = 0; b.vx *= -1; }
    if (b.x > w - 50) { b.x = w - 50; b.vx *= -1; }
    const top = b.type === "🕷️" ? h * 0.55 : 44; // spiders stay on the grass
    if (b.y < top) { b.y = top; b.vy *= -1; }
    if (b.y > h - 100) { b.y = h - 100; b.vy *= -1; }
    const flip = b.vx < 0 ? 1 : -1;
    const flap = b.type === "🦋" ? 1 + Math.sin(b.t * 6) * 0.12 : b.type === "🕷️" ? 1 + Math.sin(b.t * 10) * 0.05 : 1;
    b.el.style.transform = `translate(${b.x}px, ${b.y}px) scale(${flip * flap}, ${flap})`;
  }
  requestAnimationFrame(animateBugs);
}
BUG_TYPES.forEach(makeBug);
requestAnimationFrame(animateBugs);

/* ---------- Grumpy-o-Meter ---------- */
const moods = [
  { max: 5, title: "DANGER ZONE", img: "frost-03.jpg", g: 100, text: "Just woke up. Do not speak. Do not breathe loudly. Do not exist." },
  { max: 20, title: "SILENT JUDGEMENT", img: "frost-07.jpg", g: 80, text: "He's awake, and he's judging you. Specifically you." },
  { max: 40, title: "SNACKS ONLY", img: "frost-14.jpg", g: 58, text: "Will accept snacks. Will not accept affection. Place snack down and back away slowly." },
  { max: 70, title: "TOLERABLE", img: "frost-05.jpg", g: 35, text: "You may approach. One (1) head scratch permitted. Do not push it." },
  { max: 100, title: "PEAK CHILL", img: "frost-12.jpg", g: 15, text: "Sitting like a tiny old man. Life is good. Belly is fluffy." },
  { max: 121, title: "…ZZZ", img: "frost-15.jpg", g: 3, text: "Too much being awake. Back to sleep. The cycle begins again." },
];
const slider = $("#wakeSlider");
const grumpyImg = $("#grumpyImg");
let currentMood = 0;
function updateMood() {
  const m = +slider.value;
  $("#minutes").textContent = m;
  const i = moods.findIndex((x) => m < x.max);
  const mood = moods[i];
  $("#gaugeFill").style.width = mood.g + "%";
  $("#moodTitle").textContent = mood.title;
  $("#moodText").textContent = mood.text;
  if (i !== currentMood) {
    currentMood = i;
    grumpyImg.style.opacity = 0;
    setTimeout(() => { grumpyImg.src = "assets/photos/" + mood.img; grumpyImg.style.opacity = 1; }, 150);
    if (i === 0) play($("#meow2"));
  }
}
slider.addEventListener("input", updateMood);

/* ---------- Gallery + lightbox ---------- */
const photos = [
  ["frost-11.jpg", "the retired uncle pose"],
  ["frost-03.jpg", "just woke up. hates you."],
  ["frost-01.jpg", "gazing at birds he will never chase"],
  ["frost-13.jpg", "melted. floor nap."],
  ["frost-09.jpg", "tail up = something's about to happen"],
  ["frost-05.jpg", "penthouse resident, floor 2"],
  ["frost-15.jpg", "sunbeam acquired"],
  ["frost-07.jpg", "sofa supervisor"],
  ["frost-04.jpg", "mountain view, eyes closed"],
  ["frost-10.jpg", "belly rubs permitted (3 seconds)"],
  ["frost-17.jpg", "balcony patrol"],
  ["frost-02.jpg", "door guard, night shift"],
  ["frost-06.jpg", "nap at altitude"],
  ["frost-16.jpg", "lion mane, kitten heart"],
  ["frost-08.jpg", "the loaf, horizontal edition"],
  ["frost-12.jpg", "contemplating snacks"],
  ["frost-14.jpg", "heard a dog. didn't move."],
];
const gallery = $("#gallery");
photos.forEach(([file, cap], i) => {
  const fig = document.createElement("figure");
  fig.className = "g-item";
  fig.tabIndex = 0;
  fig.innerHTML = `<img src="assets/photos/${file}" alt="Frost: ${cap}" loading="lazy" /><p>${cap}</p>`;
  fig.addEventListener("click", () => openLb(i));
  fig.addEventListener("keydown", (e) => { if (e.key === "Enter") openLb(i); });
  gallery.appendChild(fig);
});

const lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap");
let lbIndex = 0;
function showLb() {
  const [file, cap] = photos[lbIndex];
  lbImg.src = "assets/photos/" + file;
  lbImg.alt = "Frost: " + cap;
  lbCap.textContent = cap;
}
function openLb(i) { lbIndex = i; showLb(); lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); }
function closeLb() { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); }
const step = (d) => { lbIndex = (lbIndex + d + photos.length) % photos.length; showLb(); };
$("#lbClose").addEventListener("click", closeLb);
$("#lbPrev").addEventListener("click", () => step(-1));
$("#lbNext").addEventListener("click", () => step(1));
lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
document.addEventListener("keydown", (e) => {
  if (!lb.classList.contains("open")) return;
  if (e.key === "Escape") closeLb();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});

/* ---------- Footer paw: mood roulette ---------- */
const pawReplies = [
  "Purr. You may continue. 😺",
  "Bite. Gently. As a warning. 😾",
  "He rolled over. It's a trap. Do NOT touch the belly.",
  "He's asleep. He was always asleep.",
  "Slow blink. That's basically 'I love you'.",
  "Mrrrp? (translation: where is dinner)",
];
const footerPaw = $("#footerPaw");
function pet() {
  footerPaw.classList.remove("pet");
  void footerPaw.offsetWidth;
  footerPaw.classList.add("pet");
  randomMeow();
  toast(pawReplies[Math.floor(Math.random() * pawReplies.length)]);
}
footerPaw.addEventListener("click", pet);
footerPaw.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pet(); } });
