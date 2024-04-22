const hamburger = document.querySelector('.hamburger');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
      navLinks.classList.toggle('expanded');
    }
  });
}