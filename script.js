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
  pauseMusicButton?.setAttribute('aria-pressed', String(!isPlaying));
  playMusicButton?.classList.toggle('is-active', isPlaying);
  pauseMusicButton?.classList.toggle('is-active', !isPlaying);
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

const unusedDecorAssets = [
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

unusedDecorAssets.forEach((asset, index) => {
  const item = document.createElement('span');
  const image = document.createElement('img');
  const size = 44 + Math.random() * 64;
  const rotation = -18 + Math.random() * 36;

  item.className = 'random-decor-item';
  item.style.left = `${2 + Math.random() * 94}%`;
  item.style.top = `${2 + Math.random() * 94}%`;
  item.style.width = `${size}px`;
  item.style.transform = `rotate(${rotation}deg)`;
  item.style.opacity = `${0.58 + Math.random() * 0.3}`;
  item.style.zIndex = String(index % 3);
  image.src = `assets/decor/${asset}`;
  image.alt = '';
  item.append(image);
  randomDecorLayer?.append(item);
});