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
  var photos = document.querySelectorAll('.gallery img');
  if (!photos.length) return;

  var box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML =
    '<button class="lightbox-close" aria-label="Close">&times;</button>' +
    '<img alt="">' +
    '<p class="lightbox-caption"></p>';
  document.body.appendChild(box);

  var bigImg = box.querySelector('img');
  var caption = box.querySelector('.lightbox-caption');
  var lastFocused = null;

  function open(img) {
    lastFocused = img;
    bigImg.src = img.currentSrc || img.src;
    bigImg.alt = img.alt;
    // textContent shows captions as plain text.
    // To allow <em> etc. in captions, change this to: caption.innerHTML = ...
    caption.textContent = img.dataset.caption || img.alt || '';
    box.classList.add('open');
    box.querySelector('.lightbox-close').focus();
  }

  function close() {
    box.classList.remove('open');
    if (lastFocused) lastFocused.focus();
  }

  photos.forEach(function (img) {
    img.tabIndex = 0;
    img.addEventListener('click', function () { open(img); });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img); }
    });
  });

  box.addEventListener('click', function (e) {
    if (e.target !== bigImg && e.target !== caption) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && box.classList.contains('open')) close();
  });
})();
