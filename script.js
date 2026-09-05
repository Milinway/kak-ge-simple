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

const musicPlayer = document.querySelector('.music-player');
const birthdayAudio = document.querySelector('#birthday-audio');
const playMusicButton = document.querySelector('#play-music');
const pauseMusicButton = document.querySelector('#pause-music');
const musicStatus = document.querySelector('.music-status');

function updateMusicState(isPlaying) {
  musicPlayer?.classList.toggle('is-playing', isPlaying);
  if (musicStatus) musicStatus.textContent = isPlaying ? 'Music playing' : 'Music paused';
  playMusicButton?.setAttribute('aria-pressed', String(isPlaying));
  pauseMusicButton?.setAttribute('aria-pressed', String(!isPlaying));
}

playMusicButton?.addEventListener('click', () => {
  birthdayAudio?.play().catch(() => {
    if (musicStatus) musicStatus.textContent = 'Song file not found';
  });
});

pauseMusicButton?.addEventListener('click', () => birthdayAudio?.pause());
birthdayAudio?.addEventListener('play', () => updateMusicState(true));
birthdayAudio?.addEventListener('pause', () => updateMusicState(false));
birthdayAudio?.addEventListener('ended', () => updateMusicState(false));
