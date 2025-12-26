import { fetchText } from './http.js';

export async function loadLayoutTemplates() {
  const headerSlot = document.getElementById('header-slot');
  const footerSlot = document.getElementById('footer-slot');
  const contentSlot = document.getElementById('content-slot');

  if (!headerSlot || !footerSlot || !contentSlot) {
    throw new Error('Missing layout slots (header-slot/footer-slot/content-slot).');
  }

  headerSlot.innerHTML = await fetchText('templates/header.html');
  footerSlot.innerHTML = await fetchText('templates/footer.html');

  const footerYear = document.getElementById('footer-year');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear().toString();
  }

  return { headerSlot, footerSlot, contentSlot };
}
