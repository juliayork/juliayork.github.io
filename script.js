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
