/* ============================================================
   SCRIPT.JS: two small helpers. You shouldn't need to edit this.
   1) Opens/closes the menu on phones.
   2) Underlines the nav tab for the section you're currently reading.
   ============================================================ */

// ---- 1) Mobile menu ----
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  const isOpen = links.classList.toggle('open');       // show/hide the list
  toggle.setAttribute('aria-expanded', String(isOpen)); // tells screen readers the state
});

// Close the menu after a tab is tapped
links.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

// ---- 2) Highlight the current section in the nav ----
const sections = document.querySelectorAll('main section[id]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      links.querySelectorAll('a').forEach((a) => {
        // a tab is "active" when its #link matches the visible section's id
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' }); // triggers when a section crosses the middle of the screen

sections.forEach((s) => observer.observe(s));

/* ===== Gallery lightbox ===== */
(function () {
  var photos = Array.prototype.slice.call(document.querySelectorAll('.gallery img'));
  if (!photos.length) return;

  var box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML =
    '<button class="lightbox-close" aria-label="Close">&times;</button>' +
    '<button class="lightbox-prev" aria-label="Previous photo">&#8249;</button>' +
    '<button class="lightbox-next" aria-label="Next photo">&#8250;</button>' +
    '<img alt="">' +
    '<p class="lightbox-caption"></p>' +
    '<p class="lightbox-count"></p>';
  document.body.appendChild(box);

  var bigImg = box.querySelector('img');
  var caption = box.querySelector('.lightbox-caption');
  var count = box.querySelector('.lightbox-count');
  var current = 0;
  var lastFocused = null;

  function show(i) {
    // wrap around at both ends
    current = (i + photos.length) % photos.length;
    var img = photos[current];
    bigImg.src = img.currentSrc || img.src;
    bigImg.alt = img.alt;
    // textContent shows captions as plain text.
    // To allow <em> etc. in captions, change this to: caption.innerHTML = ...
    caption.innerHTML = img.dataset.caption || img.alt || '';
    count.textContent = (current + 1) + ' / ' + photos.length;
  }

  function open(i) {
    lastFocused = photos[i];
    show(i);
    box.classList.add('open');
    box.querySelector('.lightbox-close').focus();
  }

  function close() {
    box.classList.remove('open');
    if (lastFocused) lastFocused.focus();
  }

  function next() { show(current + 1); }
  function prev() { show(current - 1); }

  // Open from the gallery
  photos.forEach(function (img, i) {
    img.tabIndex = 0;
    img.addEventListener('click', function () { open(i); });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  });

  // Buttons
  box.querySelector('.lightbox-close').addEventListener('click', close);
  box.querySelector('.lightbox-prev').addEventListener('click', prev);
  box.querySelector('.lightbox-next').addEventListener('click', next);

  // Click the dark background to close
  box.addEventListener('click', function (e) {
    if (e.target === box) close();
  });

  // Keyboard: Esc closes, arrows navigate
  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
  });

  // Swipe on touch screens
  var startX = null;
  box.addEventListener('touchstart', function (e) {
    startX = e.changedTouches[0].clientX;
  }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
    startX = null;
  }, { passive: true });

  // Preload neighbors so the next photo appears instantly
  box.addEventListener('transitionend', function () {});
  function preload(i) {
    var p = new Image();
    p.src = photos[(i + photos.length) % photos.length].src;
  }
  var originalShow = show;
  show = function (i) {
    originalShow(i);

     /* ===== Open external links (and PDFs) in a new tab ===== */
(function () {
  document.querySelectorAll('a[href]').forEach(function (a) {
    var href = a.getAttribute('href');

    // Skip in-page anchors (#research), email links, and phone links
    if (href.charAt(0) === '#' ||
        href.indexOf('mailto:') === 0 ||
        href.indexOf('tel:') === 0) return;

    var isExternal = a.hostname && a.hostname !== window.location.hostname;
    var isPdf = /\.pdf($|\?)/i.test(a.pathname);

    if (isExternal || isPdf) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
  });
})();
    preload(current + 1);
    preload(current - 1);
  };
})();
