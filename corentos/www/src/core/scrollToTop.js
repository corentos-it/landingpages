export function setupScrollToTop() {
  const button = document.getElementById('scrollToTop');
  if (!button) {
    return;
  }

  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      button.classList.remove('hidden');
      button.classList.add('flex');
    } else {
      button.classList.add('hidden');
      button.classList.remove('flex');
    }
  });

  button.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
