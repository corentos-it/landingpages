async function fetchText(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load ${url}: ${response.status}`);
  }
  return await response.text();
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load ${url}: ${response.status}`);
  }
  return await response.json();
}

function getStoredLanguage(defaultLanguage) {
  const value = window.localStorage.getItem('lang');
  if (value === 'de' || value === 'en' || value === 'fr') {
    return value;
  }
  return defaultLanguage;
}

function setMeta(content, lang) {
  document.title = content.legal.imprint.metaTitle[lang];

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', content.legal.imprint.metaDescription[lang]);
  }

  document.documentElement.setAttribute('lang', lang);
}

function i18nLookup(content, lang, key) {
  const parts = key.split('.');
  let current = content;

  for (const part of parts) {
    if (current && Object.prototype.hasOwnProperty.call(current, part)) {
      current = current[part];
    } else {
      return null;
    }
  }

  if (current && typeof current === 'object' && Object.prototype.hasOwnProperty.call(current, lang)) {
    return current[lang];
  }

  return current;
}

function applyI18n(content, lang, root) {
  const nodes = root.querySelectorAll('[data-i18n]');
  for (const node of nodes) {
    const key = node.getAttribute('data-i18n');
    const value = i18nLookup(content, lang, key);
    if (value !== null && value !== undefined) {
      node.textContent = value;
    }
  }
}

function setupScrollToTop() {
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

function setupHeaderInteractions(content, lang, onLanguageChanged) {
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('hidden');
    });
  }

  const desktopSelect = document.getElementById('lang-select');
  const mobileSelect = document.getElementById('lang-select-mobile');

  function setSelects(value) {
    if (desktopSelect) {
      desktopSelect.value = value;
    }
    if (mobileSelect) {
      mobileSelect.value = value;
    }
  }

  function handleChange(value) {
    if (value !== 'de' && value !== 'en' && value !== 'fr') {
      return;
    }
    window.localStorage.setItem('lang', value);
    setSelects(value);
    onLanguageChanged(value);
  }

  if (desktopSelect) {
    desktopSelect.addEventListener('change', function () {
      handleChange(desktopSelect.value);
    });
  }

  if (mobileSelect) {
    mobileSelect.addEventListener('change', function () {
      handleChange(mobileSelect.value);
    });
  }

  setSelects(lang);
  applyI18n(content, lang, document.getElementById('header-slot'));
}

function buildImprint(content, lang) {
  const itemsHtml = content.legal.imprint.sections
    .map((section) => {
      const lines = section.lines[lang];
      const linesHtml = lines.map((line) => `<div class=\"text-gray-300\">${line}</div>`).join('');
      return `
        <div class=\"bg-primary-800 p-8 rounded-xl border border-primary-700\">
          <h2 class=\"text-xl font-semibold text-white mb-4\">${section.title[lang]}</h2>
          <div class=\"space-y-1\">${linesHtml}</div>
        </div>
      `;
    })
    .join('');

  return `
    <section class=\"pt-24 pb-20\">
      <div class=\"max-w-6xl mx-auto px-4\">
        <h1 class=\"text-3xl sm:text-4xl font-bold text-center mb-4\"><span class=\"text-accent-400\">${content.legal.imprint.title[lang]}</span></h1>
        <div class=\"w-20 h-1 bg-accent-500 mx-auto mb-12\"></div>
        <div class=\"grid gap-8\">${itemsHtml}</div>
        <div class=\"text-gray-500 text-sm mt-8\">${content.legal.imprint.disclaimer[lang]}</div>
      </div>
    </section>
  `;
}

async function init() {
  const content = await fetchJson('data/content.json');

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

  const defaultLanguage = content.defaultLanguage;
  let lang = getStoredLanguage(defaultLanguage);

  function render(nextLang) {
    lang = nextLang;
    setMeta(content, lang);

    contentSlot.innerHTML = buildImprint(content, lang);

    applyI18n(content, lang, headerSlot);
    applyI18n(content, lang, footerSlot);
  }

  render(lang);

  setupHeaderInteractions(content, lang, function (next) {
    render(next);
  });

  setupScrollToTop();
}

window.addEventListener('DOMContentLoaded', function () {
  init().catch(function (error) {
    console.error(error);
  });
});
