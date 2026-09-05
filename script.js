// Website ini sengaja dibuat tanpa npm, React, Vite, atau library apa pun.
// Kamu cukup masukkan foto ke assets/photos dengan nama yang sudah disiapkan.

const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');

menuButton?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

const extensions = ['jpg', 'jpeg', 'png', 'webp'];

function findPhoto(slot) {
  const baseName = slot.dataset.photo;
  const image = slot.querySelector('img');
  let index = 0;

  function tryNext() {
    if (index >= extensions.length) return;
    const src = `assets/photos/${baseName}.${extensions[index]}`;
    index += 1;

    const probe = new Image();
    probe.onload = () => {
      image.src = src;
      slot.classList.add('has-photo');
    };
    probe.onerror = tryNext;
    probe.src = src;
  }

  tryNext();
}

document.querySelectorAll('[data-photo]').forEach(findPhoto);

const memorySlots = [...document.querySelectorAll('.memory-card .photo-slot')];
const memoryViewer = document.querySelector('.memory-viewer');
const viewerImage = document.querySelector('.viewer-image');
const viewerTitle = document.querySelector('#viewer-title');
const viewerCounter = document.querySelector('.viewer-counter');
const viewerPreview = document.querySelector('.viewer-preview');
let activeMemoryIndex = 0;

function renderMemory(index) {
  const slot = memorySlots[index];
  const sourceImage = slot?.querySelector('img');
  if (!slot || !sourceImage?.src) return;

  activeMemoryIndex = index;
  viewerImage.src = sourceImage.src;
  viewerImage.alt = sourceImage.alt;
  viewerTitle.textContent = slot.closest('.memory-card')?.querySelector('figcaption')?.textContent || `Memory ${String(index + 1).padStart(2, '0')}`;
  viewerCounter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(memorySlots.length).padStart(2, '0')}`;
  viewerPreview?.querySelectorAll('button').forEach((button, previewIndex) => {
    button.classList.toggle('is-active', previewIndex === index);
  });
}

function openMemory(index) {
  renderMemory(index);
  if (typeof memoryViewer?.showModal === 'function') memoryViewer.showModal();
}

memorySlots.forEach((slot, index) => {
  slot.addEventListener('click', () => openMemory(index));
  slot.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openMemory(index);
    }
  });
});

memorySlots.forEach((slot, index) => {
  const image = slot.querySelector('img');
  const previewButton = document.createElement('button');
  previewButton.type = 'button';
  previewButton.className = 'viewer-preview-item';
  previewButton.setAttribute('aria-label', `Lihat Memory ${String(index + 1).padStart(2, '0')}`);
  previewButton.innerHTML = '<img alt="" />';
  const previewImage = previewButton.querySelector('img');
  previewImage.src = image?.src || '';
  image?.addEventListener('load', () => {
    previewImage.src = image.src;
  });
  previewButton.addEventListener('click', () => renderMemory(index));
  viewerPreview?.append(previewButton);
});

document.querySelectorAll('[data-viewer-action]').forEach((button) => {
  button.addEventListener('click', () => {
    const direction = button.dataset.viewerAction === 'next' ? 1 : -1;
    renderMemory((activeMemoryIndex + direction + memorySlots.length) % memorySlots.length);
  });
});

document.querySelector('.viewer-close')?.addEventListener('click', () => memoryViewer?.close());
memoryViewer?.addEventListener('click', (event) => {
  if (event.target === memoryViewer) memoryViewer.close();
});
document.addEventListener('keydown', (event) => {
  if (!memoryViewer?.open) return;
  if (event.key === 'ArrowRight') renderMemory((activeMemoryIndex + 1) % memorySlots.length);
  if (event.key === 'ArrowLeft') renderMemory((activeMemoryIndex - 1 + memorySlots.length) % memorySlots.length);
});

const musicPlayer = document.querySelector('.music-player');
const birthdayAudio = document.querySelector('#birthday-audio');
const playMusicButton = document.querySelector('#play-music');
const pauseMusicButton = document.querySelector('#pause-music');
const musicStatus = document.querySelector('.music-status');

function updateMusicState(isPlaying) {
  musicPlayer?.classList.toggle('is-playing', isPlaying);
  document.body.classList.toggle('is-music-theme', isPlaying);
  if (musicStatus) musicStatus.textContent = isPlaying ? 'Music playing' : 'Music paused';
  playMusicButton?.setAttribute('aria-pressed', String(isPlaying));
  pauseMusicButton?.setAttribute('aria-pressed', 'false');
  playMusicButton?.classList.toggle('is-active', isPlaying);
  pauseMusicButton?.classList.remove('is-active');
}

playMusicButton?.addEventListener('click', () => {
  birthdayAudio?.play().catch(() => {
    if (musicStatus) musicStatus.textContent = 'Song file not found';
    updateMusicState(false);
  });
});

pauseMusicButton?.addEventListener('click', () => birthdayAudio?.pause());
birthdayAudio?.addEventListener('play', () => updateMusicState(true));
birthdayAudio?.addEventListener('pause', () => updateMusicState(false));
birthdayAudio?.addEventListener('ended', () => updateMusicState(false));
updateMusicState(false);

/* =========================================================
   MEMORY MASONRY
   Membuat tinggi grid menyesuaikan ukuran asli foto.
   Tempel di PALING BAWAH script.js.
   ========================================================= */


function resizeMemoryCard(card) {
  const grid = card.closest('.memory-grid');

  if (!grid) return;

  const gridStyle = window.getComputedStyle(grid);

  const rowHeight =
    parseFloat(gridStyle.getPropertyValue('grid-auto-rows'));

  const rowGap =
    parseFloat(gridStyle.getPropertyValue('row-gap'));

  /*
    Ambil tinggi asli kartu SETELAH foto dimuat.
  */
  const cardHeight =
    card.getBoundingClientRect().height;

  /*
    Hitung berapa baris kecil yang diperlukan.
  */
  const rowSpan = Math.ceil(
    (cardHeight + rowGap) /
    (rowHeight + rowGap)
  );

  card.style.gridRowEnd =
    `span ${rowSpan}`;
}


function layoutMemoryGrid() {
  const cards =
    document.querySelectorAll('.memory-card');

  requestAnimationFrame(() => {
    cards.forEach((card) => {
      resizeMemoryCard(card);
    });
  });
}


/*
  Jalankan setelah halaman selesai dimuat.
*/
window.addEventListener(
  'load',
  layoutMemoryGrid
);


/*
  Kalau ukuran layar berubah,
  hitung ulang ukuran kartu.
*/
let memoryResizeTimer;

window.addEventListener('resize', () => {
  clearTimeout(memoryResizeTimer);

  memoryResizeTimer = setTimeout(() => {
    layoutMemoryGrid();
  }, 120);
});


/*
  Sangat penting:
  hitung ulang saat masing-masing foto selesai dimuat.
*/
document
  .querySelectorAll('.memory-card img')
  .forEach((image) => {

    image.addEventListener(
      'load',
      layoutMemoryGrid
    );

  });

const ambientDecorAssets = [
  'alien2.png',
  'alien3.png',
  'alien4.png',
  'car2.png',
  'denim2.png',
  'f11.png',
  'guitar2.png',
  'guitar3.png',
  'kak ge project (7).png',
  'race.png',
  'rockstar.png',
  'rockstar2.png',
  'star.png',
  'starrandom.png',
  'starrandom2.png',
  'vintage.png',
  'vintage2.png',
  'ygafim.png'
];

const randomDecorLayer = document.querySelector('.random-decor-layer');

/*
  Pseudo-random dengan seed tetap:
  komposisinya terlihat acak/abstrak, tapi tidak "lompat-lompat"
  setiap kali halaman direfresh.
*/
function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithRandom(items, random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function placeAmbientDecor() {
  if (!randomDecorLayer) return;

  randomDecorLayer.replaceChildren();

  const viewportWidth = document.documentElement.clientWidth;
  if (viewportWidth <= 720) return;

  const random = seededRandom(22092004);
  const assets = shuffleWithRandom(ambientDecorAssets, random);
  const layerRect = randomDecorLayer.getBoundingClientRect();
  const layerPageTop = layerRect.top + window.scrollY;

  const sections = [
    document.querySelector('.hero'),
    document.querySelector('.stats'),
    document.querySelector('.memories'),
    document.querySelector('.flashback'),
    document.querySelector('.letter-section'),
    document.querySelector('.facts'),
    document.querySelector('footer')
  ].filter(Boolean);

  /* Desktop lebar dapat dua aksen per area; tablet cukup satu. */
  const itemsPerSection = viewportWidth >= 1180 ? 2 : 1;
  let assetIndex = 0;

  sections.forEach((section, sectionIndex) => {
    const rect = section.getBoundingClientRect();
    const sectionPageTop = rect.top + window.scrollY;

    for (let slot = 0; slot < itemsPerSection; slot += 1) {
      if (assetIndex >= assets.length) return;

      const asset = assets[assetIndex];
      const item = document.createElement('span');
      const image = document.createElement('img');

      const size = Math.round(62 + random() * 76);
      const rotation = Math.round(-22 + random() * 44);
      const opacity = (0.24 + random() * 0.25).toFixed(2);

      /*
        Penempatan dibiasakan ke gutter kiri/kanan supaya gambar dekor
        tetap berada di whitespace dan tidak mengganggu teks/foto utama.
      */
      const useLeft = (sectionIndex + slot) % 2 === 0;
      const jitterX = (random() - 0.5) * 34;

      let x;
      if (useLeft) {
        x = rect.left - size * (0.52 + random() * 0.18) + jitterX;
      } else {
        x = rect.right - size * (0.45 - random() * 0.12) + jitterX;
      }

      x = Math.max(8, Math.min(viewportWidth - size - 8, x));

      const yRatio = slot === 0
        ? 0.16 + random() * 0.28
        : 0.58 + random() * 0.24;
      const y = sectionPageTop - layerPageTop + rect.height * yRatio;

      item.className = 'random-decor-item';
      if ((assetIndex + sectionIndex) % 3 === 0) item.classList.add('is-ring');
      if ((assetIndex + sectionIndex) % 4 === 1) item.classList.add('is-tape');
      if ((assetIndex + sectionIndex) % 5 === 2) item.classList.add('is-ghost');

      item.style.left = `${Math.round(x)}px`;
      item.style.top = `${Math.round(y)}px`;
      item.style.width = `${size}px`;
      item.style.transform = `rotate(${rotation}deg)`;
      item.style.setProperty('--decor-opacity', opacity);

      image.src = `assets/decor/${asset}`;
      image.alt = '';
      item.append(image);
      randomDecorLayer.append(item);

      assetIndex += 1;
    }
  });
}

window.addEventListener('load', placeAmbientDecor);

let ambientDecorResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(ambientDecorResizeTimer);
  ambientDecorResizeTimer = setTimeout(placeAmbientDecor, 180);
});
