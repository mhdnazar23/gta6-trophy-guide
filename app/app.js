// Platinum Road — GTA VI trophy tracker.
// Offline static app: loads app/data/trophies.json, saves progress in
// localStorage, and never makes a network request of its own.
const KEY = 'gta6-platinum-road-progress-v1';
const NOTES_KEY = 'gta6-platinum-road-notes-v1';
const params = new URLSearchParams(location.search);

const data = await (await fetch('data/trophies.json')).json();
const trophies = data.trophies;

let earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
let notes = JSON.parse(localStorage.getItem(NOTES_KEY) ?? '{}');

// Demo mode (?demo=13) seeds 13 early story/activity trophies when nothing
// is saved yet, so screenshots and first-time visitors see a live tracker.
// The platinum (id 1) and A Long Road (id 14) are never seeded: they can
// only be earned after everything else.
const DEMO_EARNED_IDS = [2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 15, 16];
if (params.get('demo') === '13' && earned.size === 0) {
  earned = new Set(trophies.filter((t) => DEMO_EARNED_IDS.includes(t.id)).map((t) => t.name));
  save();
}

const $ = (id) => document.getElementById(id);
const listEl = $('list');
const detailEl = $('detail');

function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned]));
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function spoilerOn() {
  return $('spoilers').checked;
}

function displayName(t) {
  if (t.hidden && spoilerOn() && !earned.has(t.name)) return 'Hidden trophy';
  return t.name;
}

function displayDesc(t) {
  if (t.hidden && spoilerOn() && !earned.has(t.name)) return 'Earn this trophy to reveal its description.';
  return t.description;
}

function gradeLabel(t) {
  return t.grade.charAt(0).toUpperCase() + t.grade.slice(1);
}

function kindLabel(t) {
  return t.kind.charAt(0).toUpperCase() + t.kind.slice(1);
}

function renderProgress() {
  const total = trophies.length;
  $('earnedCount').textContent = earned.size;
  $('barFill').style.width = `${Math.round((earned.size / total) * 100)}%`;
  const byGrade = {};
  for (const t of trophies) {
    byGrade[t.grade] = byGrade[t.grade] ?? { total: 0, earned: 0 };
    byGrade[t.grade].total += 1;
    if (earned.has(t.name)) byGrade[t.grade].earned += 1;
  }
  $('gradeCounts').textContent = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => `${gradeLabel({ grade: g })} ${byGrade[g].earned}/${byGrade[g].total}`)
    .join(' · ');
  const next = trophies.filter((t) => !earned.has(t.name)).slice(0, 3);
  $('nextUp').textContent = next.length
    ? `Next up: ${next.map((t) => displayName(t)).join(' · ')}`
    : 'Platinum earned — congratulations, Leonida Legend!';
}

function matches(t) {
  const q = $('search').value.trim().toLowerCase();
  if (q) {
    const hay = `${t.name} ${t.description} ${t.guide} ${t.kind}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if ($('grade').value !== 'all' && t.grade !== $('grade').value) return false;
  if ($('kind').value !== 'all' && t.kind !== $('kind').value) return false;
  if ($('unearnedOnly').checked && earned.has(t.name)) return false;
  return true;
}

function renderList() {
  const shown = trophies.filter(matches);
  $('resultCount').textContent = `Showing ${shown.length} of ${trophies.length} trophies`;
  listEl.replaceChildren();
  for (const t of shown) {
    const li = document.createElement('li');
    li.className = `card${earned.has(t.name) ? ' earned' : ''}`;
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', `Mark ${displayName(t)} earned`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.name);
      else earned.delete(t.name);
      save();
      renderProgress();
      renderList();
      renderRoadmap();
    });
    const body = document.createElement('div');
    const h = document.createElement('h3');
    h.textContent = displayName(t);
    const desc = document.createElement('p');
    desc.className = 'desc';
    desc.textContent = displayDesc(t);
    const meta = document.createElement('p');
    meta.className = 'meta';
    meta.textContent = `${kindLabel(t)}${t.target ? ` · target ${t.target}` : ''}${t.missable ? ' · potentially missable' : ''}${t.hidden ? ' · hidden' : ''}`;
    const tags = document.createElement('p');
    if (t.missable) {
      const warn = document.createElement('span');
      warn.className = 'tag warn';
      warn.textContent = 'Potentially missable — reported';
      tags.append(warn);
    }
    body.append(h, desc, meta, tags);
    const pill = document.createElement('span');
    pill.className = `pill ${t.grade}`;
    pill.textContent = gradeLabel(t);
    const open = document.createElement('button');
    open.type = 'button';
    open.textContent = 'Guide';
    open.addEventListener('click', () => showDetail(t));
    const right = document.createElement('div');
    right.append(pill, document.createElement('br'), open);
    li.append(box, body, right);
    listEl.append(li);
  }
}

function showDetail(t) {
  detailEl.hidden = false;
  detailEl.replaceChildren();
  const h = document.createElement('h3');
  h.textContent = displayName(t);
  const desc = document.createElement('p');
  desc.textContent = displayDesc(t);
  const guide = document.createElement('p');
  if (t.hidden && spoilerOn() && !earned.has(t.name)) {
    guide.textContent = 'Guide hidden until this trophy is earned — turn spoilers off to read it, or tick the trophy as earned.';
  } else {
    guide.textContent = t.guide;
  }
  const src = document.createElement('p');
  src.className = 'sources';
  src.textContent = `Sources: ${t.sources.join(' · ')}`;
  const noteLabel = document.createElement('label');
  noteLabel.textContent = 'Your note';
  const note = document.createElement('textarea');
  note.value = notes[t.name] ?? '';
  note.placeholder = 'e.g. found the spot near the pier — check here on the way back';
  note.addEventListener('input', () => {
    notes[t.name] = note.value;
    save();
  });
  const close = document.createElement('button');
  close.type = 'button';
  close.textContent = 'Close guide';
  close.addEventListener('click', () => { detailEl.hidden = true; });
  detailEl.append(h, desc, guide, src, noteLabel, note, close);
  detailEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

const STAGES = [
  {
    title: 'Stage 1 — Story first',
    text: 'Play Chapters 1–4 and the final mission in order. This earns the 12 chapter and mission trophies, plus the stranger strands you meet along the way. Make a manual save at the start of every chapter.',
    filter: (t) => t.kind === 'story' && [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].includes(t.id),
  },
  {
    title: 'Stage 2 — Stranger strands',
    text: 'Finish all 8 stranger strands — Andy, Kenton, Billy, Randy, Tyrone and the rest. Strands unlock as the story advances, so check the map for stranger icons between story missions.',
    filter: (t) => [22, 23, 24, 25, 26, 27, 29].includes(t.id),
  },
  {
    title: 'Stage 3 — Activities',
    text: 'Work through the activities: 250 stunts, gold in all 42 Shooting Range challenges, drone races at all 14 locations, 20 different race wins, fishing, arcade, bowling and the 9 activity types. The Shooting Range is the longest grind here — start it early.',
    filter: (t) => t.kind === 'activity',
  },
  {
    title: 'Stage 4 — Collectibles and exploration',
    text: 'Sweep Leonida: 3 card sets, WAiNK at 100 locations, all 52 areas, 100 vehicles, and all 18 meditation spots (do the Chapter 1 balcony spot before you leave Chapter 1 — see Missables). Combine these trips: one drive across an area can cover exploration, WAiNK and vehicles at once.',
    filter: (t) => t.kind === 'collectible' || t.kind === 'exploration',
  },
  {
    title: 'Stage 5 — Robberies, money and cleanup',
    text: 'Robberies and money: 5 bank vaults, shops back-to-back with your partner, the armored truck, the jewelry store, one illegal operation for each of the 9 gangs, $250,000 laundered and $100,000 spent, all 8 garages and 10 vehicles on Scooter Bros. Then the final sweep: 50 challenges and whatever is left, until the stats screen reads 100% for A Long Road — and the platinum pops.',
    filter: (t) => t.kind === 'robbery' || t.kind === 'money' || t.id === 14 || t.id === 32,
  },
];

function renderRoadmap() {
  const ol = $('roadmap');
  ol.replaceChildren();
  for (const stage of STAGES) {
    const items = trophies.filter(stage.filter);
    const done = items.filter((t) => earned.has(t.name)).length;
    const li = document.createElement('li');
    const h = document.createElement('h3');
    h.textContent = `${stage.title} — ${done}/${items.length}`;
    const p = document.createElement('p');
    p.textContent = stage.text;
    li.append(h, p);
    ol.append(li);
  }
}

function showView(name) {
  for (const btn of document.querySelectorAll('.tabs button')) {
    btn.classList.toggle('active', btn.dataset.view === name);
  }
  for (const section of document.querySelectorAll('.view')) {
    section.hidden = section.id !== `view-${name}`;
  }
  if (name === 'roadmap') renderRoadmap();
}

for (const btn of document.querySelectorAll('.tabs button')) {
  btn.addEventListener('click', () => showView(btn.dataset.view));
}
for (const id of ['search', 'grade', 'kind', 'spoilers', 'unearnedOnly']) {
  $(id).addEventListener('input', renderList);
  $(id).addEventListener('change', renderList);
}

$('export').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([JSON.stringify({ earned: [...earned], notes }, null, 2)], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gta6-trophy-progress.json';
  a.click();
  // Revoke after a delay: revoking synchronously can cancel the download
  // in some browsers before the file is handed to the download manager.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

$('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const list = Array.isArray(parsed) ? parsed : parsed.earned;
    const valid = new Set(trophies.map((t) => t.name));
    earned = new Set((list ?? []).filter((n) => valid.has(n)));
    if (parsed.notes) notes = parsed.notes;
    save();
    renderProgress();
    renderList();
    renderRoadmap();
  } catch {
    alert('That file is not a valid progress export.');
  }
  e.target.value = '';
});

$('reset').addEventListener('click', () => {
  if (!confirm('Reset all progress and notes?')) return;
  earned = new Set();
  notes = {};
  save();
  renderProgress();
  renderList();
  renderRoadmap();
});

$('demo').addEventListener('click', () => {
  earned = new Set(trophies.filter((t) => DEMO_EARNED_IDS.includes(t.id)).map((t) => t.name));
  save();
  renderProgress();
  renderList();
  renderRoadmap();
});

// Deep links used by screenshots and by the guide itself:
// ?view=roadmap | missables | about, ?view=trophy&id=17, ?spoilers=on|off
if (params.get('spoilers') === 'off') $('spoilers').checked = false;
if (params.get('spoilers') === 'on') $('spoilers').checked = true;
const view = params.get('view');
if (view === 'roadmap' || view === 'missables' || view === 'about') showView(view);
if (view === 'trophy') {
  const t = trophies.find((x) => x.id === Number(params.get('id')));
  if (t) showDetail(t);
}

renderProgress();
renderList();
renderRoadmap();
