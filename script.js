// Pure HTML + CSS + JavaScript.
// No npm, Vite, React, or external library.


// =========================================================
// MOBILE MENU
// =========================================================

const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');

menuButton?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');

  menuButton.setAttribute(
    'aria-expanded',
    String(isOpen)
  );
});

navLinks
  ?.querySelectorAll('a')
  .forEach((link) => {

    link.addEventListener('click', () => {
      navLinks.classList.remove('open');

      menuButton?.setAttribute(
        'aria-expanded',
        'false'
      );
    });

  });



// =========================================================
// AUTOMATIC PHOTO RESOLVER
//
// data-photo="kakge"
// otomatis mencari:
// kakge.jpg
// kakge.jpeg
// kakge.png
// kakge.webp
// =========================================================

const extensions = [
  'jpg',
  'jpeg',
  'png',
  'webp'
];


function findPhoto(slot) {

  const baseName =
    slot.dataset.photo;

  const image =
    slot.querySelector('img');


  if (!baseName || !image) {
    return;
  }


  let index = 0;


  function tryNext() {

    if (index >= extensions.length) {
      return;
    }


    const src =
      `assets/photos/${baseName}.${extensions[index++]}`;


    const probe =
      new Image();


    probe.onload = () => {

      image.src = src;

      slot.classList.add(
        'has-photo'
      );

    };


    probe.onerror =
      tryNext;


    probe.src = src;

  }


  tryNext();

}


document
  .querySelectorAll('[data-photo]')
  .forEach(findPhoto);



// =========================================================
// MEMORIES VIEWER
// =========================================================

const memorySlots = [
  ...document.querySelectorAll(
    '.memory-card .photo-slot'
  )
];


const memoryViewer =
  document.querySelector(
    '.memory-viewer'
  );


const viewerImage =
  document.querySelector(
    '.viewer-image'
  );


const viewerTitle =
  document.querySelector(
    '#viewer-title'
  );


const viewerCounter =
  document.querySelector(
    '.viewer-counter'
  );


const viewerPreview =
  document.querySelector(
    '.viewer-preview'
  );


let activeMemoryIndex = 0;



// =========================================================
// RENDER MEMORY
// =========================================================

function renderMemory(index) {

  const slot =
    memorySlots[index];


  const sourceImage =
    slot?.querySelector('img');


  if (
    !slot ||
    !sourceImage?.src
  ) {
    return;
  }


  activeMemoryIndex =
    index;


  viewerImage.src =
    sourceImage.src;


  viewerImage.alt =
    sourceImage.alt;


  viewerTitle.textContent =
    slot
      .closest('.memory-card')
      ?.querySelector('figcaption')
      ?.textContent
    ||
    `Memory ${index + 1}`;


  viewerCounter.textContent =
    `${String(index + 1).padStart(2, '0')} / ${String(memorySlots.length).padStart(2, '0')}`;


  viewerPreview
    ?.querySelectorAll('button')
    .forEach(
      (button, previewIndex) => {

        button.classList.toggle(
          'is-active',
          previewIndex === index
        );

      }
    );

}



// =========================================================
// OPEN MEMORY
// =========================================================

function openMemory(index) {

  renderMemory(index);


  if (
    typeof memoryViewer?.showModal
    ===
    'function'
  ) {

    memoryViewer.showModal();

  }

}



// =========================================================
// MEMORY ITEMS
// =========================================================

memorySlots.forEach(
  (slot, index) => {


    // Mouse click
    slot.addEventListener(
      'click',
      () => {

        openMemory(index);

      }
    );


    // Keyboard accessibility
    slot.addEventListener(
      'keydown',
      (event) => {

        if (
          event.key === 'Enter'
          ||
          event.key === ' '
        ) {

          event.preventDefault();

          openMemory(index);

        }

      }
    );


    // Thumbnail preview button
    const previewButton =
      document.createElement(
        'button'
      );


    previewButton.type =
      'button';


    previewButton.className =
      'viewer-preview-item';


    previewButton.setAttribute(
      'aria-label',
      `Lihat Memory ${index + 1}`
    );


    previewButton.innerHTML =
      '<img alt="" />';


    const previewImage =
      previewButton.querySelector(
        'img'
      );


    const sourceImage =
      slot.querySelector(
        'img'
      );


    sourceImage?.addEventListener(
      'load',
      () => {

        previewImage.src =
          sourceImage.src;

      }
    );


    previewButton.addEventListener(
      'click',
      () => {

        renderMemory(index);

      }
    );


    viewerPreview?.append(
      previewButton
    );

  }
);



// =========================================================
// PREVIOUS / NEXT BUTTONS
// =========================================================

document
  .querySelectorAll(
    '[data-viewer-action]'
  )
  .forEach((button) => {

    button.addEventListener(
      'click',
      () => {

        const direction =
          button.dataset.viewerAction
          ===
          'next'
            ? 1
            : -1;


        const newIndex =
          (
            activeMemoryIndex
            +
            direction
            +
            memorySlots.length
          )
          %
          memorySlots.length;


        renderMemory(
          newIndex
        );

      }
    );

  });



// =========================================================
// CLOSE VIEWER
// =========================================================

document
  .querySelector(
    '.viewer-close'
  )
  ?.addEventListener(
    'click',
    () => {

      memoryViewer?.close();

    }
  );



// Close when clicking backdrop
memoryViewer?.addEventListener(
  'click',
  (event) => {

    if (
      event.target === memoryViewer
    ) {

      memoryViewer.close();

    }

  }
);



// =========================================================
// VIEWER KEYBOARD CONTROL
// =========================================================

document.addEventListener(
  'keydown',
  (event) => {


    if (
      !memoryViewer?.open
    ) {

      return;

    }


    // Escape
    if (
      event.key === 'Escape'
    ) {

      memoryViewer.close();

    }


    // Next
    if (
      event.key === 'ArrowRight'
    ) {

      renderMemory(
        (
          activeMemoryIndex
          +
          1
        )
        %
        memorySlots.length
      );

    }


    // Previous
    if (
      event.key === 'ArrowLeft'
    ) {

      renderMemory(
        (
          activeMemoryIndex
          -
          1
          +
          memorySlots.length
        )
        %
        memorySlots.length
      );

    }

  }
);



// =========================================================
// MUSIC PLAYER
// =========================================================

const musicPlayer =
  document.querySelector(
    '.music-player'
  );


const birthdayAudio =
  document.querySelector(
    '#birthday-audio'
  );


const playMusicButton =
  document.querySelector(
    '#play-music'
  );


const pauseMusicButton =
  document.querySelector(
    '#pause-music'
  );


const musicStatus =
  document.querySelector(
    '.music-status'
  );



// =========================================================
// UPDATE MUSIC STATE
// =========================================================

function updateMusicState(
  isPlaying
) {

  musicPlayer?.classList.toggle(
    'is-playing',
    isPlaying
  );


  document.body.classList.toggle(
    'is-music-theme',
    isPlaying
  );


  if (musicStatus) {

    musicStatus.textContent =
      isPlaying
        ? 'Music playing'
        : 'Music paused';

  }


  playMusicButton?.setAttribute(
    'aria-pressed',
    String(isPlaying)
  );


  pauseMusicButton?.setAttribute(
    'aria-pressed',
    String(!isPlaying)
  );


  playMusicButton?.classList.toggle(
    'is-active',
    isPlaying
  );


  pauseMusicButton?.classList.toggle(
    'is-active',
    (
      !isPlaying
      &&
      birthdayAudio?.currentTime > 0
    )
  );

}



// =========================================================
// PLAY BUTTON
// =========================================================

playMusicButton?.addEventListener(
  'click',
  () => {


    birthdayAudio
      ?.play()
      .catch(() => {


        if (musicStatus) {

          musicStatus.textContent =
            'Song file not found';

        }


        updateMusicState(
          false
        );

      });

  }
);



// =========================================================
// PAUSE BUTTON
// =========================================================

pauseMusicButton?.addEventListener(
  'click',
  () => {

    birthdayAudio?.pause();

  }
);



// =========================================================
// AUDIO EVENTS
// =========================================================

birthdayAudio?.addEventListener(
  'play',
  () => {

    updateMusicState(
      true
    );

  }
);


birthdayAudio?.addEventListener(
  'pause',
  () => {

    updateMusicState(
      false
    );

  }
);


birthdayAudio?.addEventListener(
  'ended',
  () => {

    updateMusicState(
      false
    );

  }
);


// Initial state
updateMusicState(
  false
);



// =========================================================
// OPTIONAL DECOR ASSETS
//
// Decor ini akan otomatis muncul kalau file-nya ada.
//
// Taruh file di:
//
// assets/decor/mcqueen1.png
// assets/decor/mcqueen2.png
// assets/decor/starred.png
// assets/decor/emoji.png
//
// Kalau file belum ada:
// website tetap jalan dan tidak error.
// =========================================================

const optionalDecorConfigs = [


  // -------------------------------------------------------
  // McQueen 1 → Hero
  // -------------------------------------------------------

  {
    section:
      '.hero .decor-surface',

    src:
      'assets/decor/mcqueen1.png',

    className:
      'asset-sticker decor-paper',

    style:
      '--x:11%;' +
      '--y:21%;' +
      '--w:112px;' +
      '--r:-8deg;' +

      '--mx:5%;' +
      '--my:18%;' +
      '--mw:72px;' +
      '--mr:-9deg'
  },



  // -------------------------------------------------------
  // McQueen 2 → Gallery Kak GE
  // -------------------------------------------------------

  {
    section:
      '.girl-gallery .decor-surface',

    src:
      'assets/decor/mcqueen2.png',

    className:
      'asset-sticker decor-paper',

    style:
      '--x:78%;' +
      '--y:38%;' +
      '--w:102px;' +
      '--r:8deg;' +

      '--mx:76%;' +
      '--my:43%;' +
      '--mw:68px;' +
      '--mr:8deg'
  },



  // -------------------------------------------------------
  // Starred decor → Starred Section
  // -------------------------------------------------------

  {
    section:
      '.starred .decor-surface',

    src:
      'assets/decor/starred.png',

    className:
      'asset-sticker decor-paper',

    style:
      '--x:78%;' +
      '--y:54%;' +
      '--w:116px;' +
      '--r:-7deg;' +

      '--mx:71%;' +
      '--my:68%;' +
      '--mw:78px;' +
      '--mr:-7deg'
  },



  // -------------------------------------------------------
  // Emoji → Fun Facts
  // -------------------------------------------------------

  {
    section:
      '.facts .decor-surface',

    src:
      'assets/decor/emoji.png',

    className:
      'asset-sticker',

    style:
      '--x:8%;' +
      '--y:57%;' +
      '--w:84px;' +
      '--r:6deg;' +

      '--mx:7%;' +
      '--my:63%;' +
      '--mw:58px;' +
      '--mr:5deg'
  }

];



// =========================================================
// AUTO INJECT OPTIONAL DECOR
// =========================================================

function injectOptionalDecor() {


  optionalDecorConfigs.forEach(
    (config) => {


      const parent =
        document.querySelector(
          config.section
        );


      if (!parent) {
        return;
      }


      // Check apakah file memang ada
      const probe =
        new Image();


      probe.onload = () => {


        const image =
          document.createElement(
            'img'
          );


        image.src =
          config.src;


        image.alt =
          '';


        image.className =
          config.className;


        image.setAttribute(
          'style',
          config.style
        );


        image.setAttribute(
          'aria-hidden',
          'true'
        );


        parent.appendChild(
          image
        );

      };


      // Kalau file tidak ada,
      // abaikan saja.
      probe.onerror = () => {

        // no error shown

      };


      probe.src =
        config.src;

    }
  );

}



// Jalankan optional decor
injectOptionalDecor();