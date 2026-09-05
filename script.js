// Pure HTML + CSS + JavaScript. No npm, Vite, React, or external library.

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

// Automatic photo resolver. A data-photo="name" element will try jpg/jpeg/png/webp.
const extensions = ['jpg', 'jpeg', 'png', 'webp'];

function findPhoto(slot) {
  const baseName = slot.dataset.photo;
  const image = slot.querySelector('img');
  if (!baseName || !image) return;
  let index = 0;

  function tryNext() {
    if (index >= extensions.length) return;
    const src = `assets/photos/${baseName}.${extensions[index++]}`;
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

// Memories viewer
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
  viewerTitle.textContent = slot.closest('.memory-card')?.querySelector('figcaption')?.textContent || `Memory ${index + 1}`;
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

  const previewButton = document.createElement('button');
  previewButton.type = 'button';
  previewButton.className = 'viewer-preview-item';
  previewButton.setAttribute('aria-label', `Lihat Memory ${index + 1}`);
  previewButton.innerHTML = '<img alt="" />';
  const previewImage = previewButton.querySelector('img');
  const sourceImage = slot.querySelector('img');
  sourceImage?.addEventListener('load', () => { previewImage.src = sourceImage.src; });
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
memoryViewer?.addEventListener('click', (event) => { if (event.target === memoryViewer) memoryViewer.close(); });
document.addEventListener('keydown', (event) => {
  if (!memoryViewer?.open) return;
  if (event.key === 'Escape') memoryViewer.close();
  if (event.key === 'ArrowRight') renderMemory((activeMemoryIndex + 1) % memorySlots.length);
  if (event.key === 'ArrowLeft') renderMemory((activeMemoryIndex - 1 + memorySlots.length) % memorySlots.length);
});

// Music player
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
  pauseMusicButton?.classList.toggle('is-active', !isPlaying && birthdayAudio?.currentTime > 0);
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
