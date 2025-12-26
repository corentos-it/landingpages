import { fetchJson } from '../core/http.js';
import { loadLayoutTemplates } from '../core/layout.js';
import { applyI18n } from '../core/i18n.js';
import { getStoredLanguage } from '../core/lang.js';
import { setupHeaderInteractions } from '../core/header.js';
import { setupScrollToTop } from '../core/scrollToTop.js';

function setMeta(content, lang) {
  document.title = content.legal.imprint.metaTitle[lang];

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', content.legal.imprint.metaDescription[lang]);
  }

  document.documentElement.setAttribute('lang', lang);
}

function buildImprint(content, lang) {
  const itemsHtml = content.legal.imprint.sections
    .map((section) => {
      const lines = section.lines[lang];
      const linesHtml = lines.map((line) => `<div class="text-gray-300">${line}</div>`).join('');
      return `
        <div class="bg-primary-800 p-8 rounded-xl border border-primary-700">
          <h2 class="text-xl font-semibold text-white mb-4">${section.title[lang]}</h2>
          <div class="space-y-1">${linesHtml}</div>
        </div>
      `;
    })
    .join('');

  return `
    <section class="pt-24 pb-20">
      <div class="max-w-6xl mx-auto px-4">
        <h1 class="text-3xl sm:text-4xl font-bold text-center mb-4"><span class="text-accent-400">${content.legal.imprint.title[lang]}</span></h1>
        <div class="w-20 h-1 bg-accent-500 mx-auto mb-12"></div>
        <div class="grid gap-8">${itemsHtml}</div>
        <div class="text-gray-500 text-sm mt-8">${content.legal.imprint.disclaimer[lang]}</div>
      </div>
    </section>
  `;
}

async function init() {
  const content = await fetchJson('data/content.json');
  const { headerSlot, footerSlot, contentSlot } = await loadLayoutTemplates();

  const defaultLanguage = content.defaultLanguage;
  let currentLang = getStoredLanguage(defaultLanguage);

  function render(lang) {
    setMeta(content, lang);

    contentSlot.innerHTML = buildImprint(content, lang);

    applyI18n(content, lang, headerSlot);
    applyI18n(content, lang, footerSlot);
  }

  render(currentLang);

  setupHeaderInteractions(content, currentLang, function (next) {
    currentLang = next;
    render(currentLang);
  });

  setupScrollToTop();
}

window.addEventListener('DOMContentLoaded', function () {
  init().catch(function (error) {
    console.error(error);
  });
});

export {};
