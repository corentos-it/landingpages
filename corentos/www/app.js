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

function setStoredLanguage(lang) {
  window.localStorage.setItem('lang', lang);
}

function setMeta(content, lang) {
  document.title = content.meta.title[lang];

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', content.meta.description[lang]);
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

function buildServicesIcon(key) {
  if (key === 'software') {
    return '<svg class="w-10 h-10 text-accent-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2" ry="2" /><path d="M8 20h8" /><path d="M12 16v4" /></svg>';
  }

  if (key === 'products') {
    return '<svg class="w-10 h-10 text-accent-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="M3.27 6.96 12 12l8.73-5.04" /><path d="M12 22V12" /></svg>';
  }

  return '<svg class="w-10 h-10 text-accent-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3v18h18" /><path d="M7 14l4-4 3 3 6-6" /><path d="M20 7v5h-5" /></svg>';
}

function buildHero(content, lang) {
  return `
    <section class="min-h-[80vh] flex items-center pt-16">
      <div class="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <h1 class="text-5xl sm:text-6xl font-bold mb-6"><span class="text-accent-400">corentos</span></h1>
          <p class="text-2xl sm:text-3xl text-accent-300 font-light mb-6">${content.hero.tagline[lang]}</p>
          <p class="text-lg text-gray-400 mb-10 max-w-lg">${content.hero.pitch[lang]}</p>
          <div class="flex flex-col sm:flex-row gap-4">
            <a href="#products" class="px-8 py-3 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-400 transition-colors text-center">${content.hero.ctaProducts[lang]}</a>
            <a href="#contact" class="px-8 py-3 border border-accent-500 text-accent-400 font-semibold rounded-lg hover:bg-accent-500/10 transition-colors text-center">${content.hero.ctaContact[lang]}</a>
          </div>
        </div>

        <div class="relative flex justify-center">
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
            <div class="w-72 h-72 bg-accent-500/20 blur-3xl rounded-full"></div>
          </div>
          <div class="relative w-80 h-80">
            <svg viewBox="0 0 300 260" class="w-full h-full">
              <polygon points="150,20 280,240 20,240" fill="none" stroke="#00a8a8" stroke-width="2" opacity="0.3"/>
              <line x1="150" y1="20" x2="150" y2="160" stroke="#00a8a8" stroke-width="1" opacity="0.5"/>
              <line x1="150" y1="160" x2="70" y2="200" stroke="#00a8a8" stroke-width="1" opacity="0.5"/>
              <line x1="150" y1="160" x2="230" y2="200" stroke="#00a8a8" stroke-width="1" opacity="0.5"/>
            </svg>

            <div class="absolute top-0 left-1/2 -translate-x-1/2 text-center">
              <div class="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mb-2 mx-auto border border-accent-500">
                <svg class="w-8 h-8 text-accent-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2" ry="2" /><path d="M8 20h8" /><path d="M12 16v4" /></svg>
              </div>
              <span class="text-sm text-accent-400 font-medium">${content.hero.pyramid.software[lang]}</span>
            </div>

            <div class="absolute bottom-4 left-4 text-center">
              <div class="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mb-2 mx-auto border border-accent-500">
                <svg class="w-8 h-8 text-accent-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="M3.27 6.96 12 12l8.73-5.04" /><path d="M12 22V12" /></svg>
              </div>
              <span class="text-sm text-accent-400 font-medium">${content.hero.pyramid.products[lang]}</span>
            </div>

            <div class="absolute bottom-4 right-4 text-center">
              <div class="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mb-2 mx-auto border border-accent-500">
                <svg class="w-8 h-8 text-accent-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3v18h18" /><path d="M7 14l4-4 3 3 6-6" /><path d="M20 7v5h-5" /></svg>
              </div>
              <span class="text-sm text-accent-400 font-medium">${content.hero.pyramid.coaching[lang]}</span>
            </div>

            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4">
              <div class="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center shadow-lg shadow-accent-500/30">
                <span class="text-white font-bold text-lg">c</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function buildStats(content, lang) {
  const statsHtml = content.stats
    .map((item) => {
      return `
        <div class="text-center">
          <div class="text-4xl md:text-5xl font-bold text-accent-400">${item.value}</div>
          <div class="text-gray-400 text-sm mt-1">${item.label[lang]}</div>
        </div>
      `;
    })
    .join('');

  return `
    <section class="py-8 bg-primary-800 border-y border-primary-700">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex flex-wrap justify-center items-center gap-8 md:gap-16">${statsHtml}</div>
      </div>
    </section>
  `;
}

function buildServices(content, lang) {
  const rgb = content.theme.sectionTintRgb;
  const style = `background-color: rgb(${rgb[0]},${rgb[1]},${rgb[2]});`;

  const cardsHtml = content.services.items
    .map((item) => {
      const bulletsHtml = item.bullets[lang]
        .map((b) => `<li class="flex items-start gap-2"><span class="text-accent-400">•</span>${b}</li>`)
        .join('');

      return `
        <div class="bg-primary-800 p-8 rounded-xl border border-primary-700 hover:border-accent-500/50 transition-colors">
          <div class="mb-4">${buildServicesIcon(item.key)}</div>
          <h3 class="text-xl font-semibold text-white mb-4">${item.title[lang]}</h3>
          <p class="text-gray-400 mb-4">${item.description[lang]}</p>
          <ul class="text-gray-400 text-sm space-y-2">${bulletsHtml}</ul>
        </div>
      `;
    })
    .join('');

  return `
    <section id="services" class="py-20 text-primary-900" style="${style}">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-3xl sm:text-4xl font-bold text-center mb-4">${content.services.title[lang]}</h2>
        <div class="w-20 h-1 bg-accent-500 mx-auto mb-12"></div>
        <div class="grid md:grid-cols-3 gap-8">${cardsHtml}</div>
      </div>
    </section>
  `;
}

function buildProducts(content, lang) {
  const cardsHtml = content.products.items
    .map((item) => {
      const tags = Array.isArray(item.tags) ? item.tags : item.tags[lang];
      const tagsHtml = tags.map((t) => `<span class="px-2 py-1 bg-primary-900 text-gray-400 rounded text-xs">${t}</span>`).join('');

      return `
        <div class="bg-gradient-to-br from-primary-800 to-primary-700 p-6 rounded-xl border-2 border-accent-500/50 hover:border-accent-500 transition-colors">
          <h3 class="text-xl font-semibold text-white mb-3">${item.title[lang]}</h3>
          <p class="text-gray-400 mb-4">${item.description[lang]}</p>
          <div class="flex flex-wrap gap-2 mb-4">${tagsHtml}</div>
          <a href="${item.url}" target="_blank" class="text-accent-400 hover:text-accent-300 text-sm">${item.cta[lang]}</a>
        </div>
      `;
    })
    .join('');

  return `
    <section id="products" class="py-20 bg-primary-800">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-3xl sm:text-4xl font-bold text-center mb-4">${content.products.title[lang]}</h2>
        <div class="w-20 h-1 bg-accent-500 mx-auto mb-12"></div>
        <div class="grid md:grid-cols-2 gap-8">${cardsHtml}</div>
      </div>
    </section>
  `;
}

function buildAbout(content, lang) {
  const rgb = content.theme.sectionTintRgb;
  const style = `background-color: rgb(${rgb[0]},${rgb[1]},${rgb[2]});`;

  const paragraphsHtml = content.about.paragraphs[lang]
    .map((p, index) => {
      const margin = index === content.about.paragraphs[lang].length - 1 ? '' : ' mb-6';
      return `<p class="text-gray-300 text-lg leading-relaxed${margin}">${p}</p>`;
    })
    .join('');

  const strengthsHtml = content.about.strengths
    .map((s) => {
      return `
        <div class="flex items-start gap-3">
          <span class="text-accent-500 text-xl">✓</span>
          <div>
            <span class="text-white font-medium">${s.title[lang]}</span>
            <p class="text-gray-400 text-sm">${s.text[lang]}</p>
          </div>
        </div>
      `;
    })
    .join('');

  return `
    <section id="about" class="py-20 text-primary-900" style="${style}">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-3xl sm:text-4xl font-bold text-center mb-4">${content.about.title[lang]}</h2>
        <div class="w-20 h-1 bg-accent-500 mx-auto mb-12"></div>
        <div class="grid md:grid-cols-2 gap-12 items-stretch">
          <div class="bg-primary-800 p-8 rounded-xl border border-primary-700 h-full">${paragraphsHtml}</div>
          <div class="bg-primary-800 p-8 rounded-xl border border-primary-700 h-full">
            <h3 class="text-xl font-semibold text-accent-400 mb-4">${content.about.strengthsTitle[lang]}</h3>
            <div class="space-y-4">${strengthsHtml}</div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function buildContact(content, lang) {
  const linkedInUrl = content.contact.info.linkedInUrl;
  const facebookUrl = content.contact.info.facebookUrl;

  return `
    <section id="contact" class="py-20 bg-primary-800">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-3xl sm:text-4xl font-bold text-center mb-4"><span class="text-accent-400">${content.contact.title[lang]}</span></h2>
        <div class="w-20 h-1 bg-accent-500 mx-auto mb-12"></div>

        <div id="form-success" class="hidden p-4 mb-6 bg-green-500/20 border border-green-500 rounded-lg text-green-400">${content.contact.successMessage[lang]}</div>
        <div id="form-error" class="hidden p-4 mb-6 bg-red-500/20 border border-red-500 rounded-lg text-red-400">${content.contact.errorMessage[lang]}</div>

        <div class="grid md:grid-cols-2 gap-12">
          <div>
            <h3 class="text-xl font-semibold text-white mb-6">${content.contact.subtitle[lang]}</h3>
            <p class="text-gray-400 mb-8">${content.contact.text[lang]}</p>

            <div class="space-y-4" id="contact-info">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-accent-500/10 rounded-lg flex items-center justify-center mr-4 text-accent-400" aria-hidden="true">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
                </div>
                <div>
                  <div class="text-gray-500 text-sm">${content.contact.info.locationLabel[lang]}</div>
                  <span class="text-white">${content.contact.info.locationValue[lang]}</span>
                </div>
              </div>

              <div class="flex items-center">
                <div class="w-12 h-12 bg-accent-500/10 rounded-lg flex items-center justify-center mr-4 text-accent-400" aria-hidden="true">in</div>
                <div>
                  <div class="text-gray-500 text-sm">${content.contact.info.linkedInLabel[lang]}</div>
                  <a href="${linkedInUrl}" target="_blank" class="text-white hover:text-accent-300">${content.contact.info.linkedInDisplay[lang]}</a>
                </div>
              </div>

              <div class="flex items-center">
                <div class="w-12 h-12 bg-accent-500/10 rounded-lg flex items-center justify-center mr-4 text-accent-400" aria-hidden="true">f</div>
                <div>
                  <div class="text-gray-500 text-sm">${content.contact.info.facebookLabel[lang]}</div>
                  <a href="${facebookUrl}" target="_blank" class="text-white hover:text-accent-300">${content.contact.info.facebookDisplay[lang]}</a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div id="contact-form-wrapper">
              <form action="send-mail.php" method="POST" class="space-y-6">
              <input type="text" name="website" class="hidden" tabindex="-1" autocomplete="off">
              <div>
                <label class="block text-sm text-gray-300 mb-2">${content.contact.form.nameLabel[lang]}</label>
                <input type="text" name="name" required class="w-full px-4 py-3 bg-primary-900 border border-primary-700 rounded-lg text-white focus:outline-none focus:border-accent-500" placeholder="${content.contact.form.namePlaceholder[lang]}">
              </div>
              <div>
                <label class="block text-sm text-gray-300 mb-2">${content.contact.form.emailLabel[lang]}</label>
                <input type="email" name="email" required class="w-full px-4 py-3 bg-primary-900 border border-primary-700 rounded-lg text-white focus:outline-none focus:border-accent-500" placeholder="${content.contact.form.emailPlaceholder[lang]}">
              </div>
              <div>
                <label class="block text-sm text-gray-300 mb-2">${content.contact.form.messageLabel[lang]}</label>
                <textarea name="message" rows="4" required class="w-full px-4 py-3 bg-primary-900 border border-primary-700 rounded-lg text-white focus:outline-none focus:border-accent-500 resize-none" placeholder="${content.contact.form.messagePlaceholder[lang]}"></textarea>
              </div>
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="block text-sm text-gray-300">${content.contact.form.captchaLabel[lang]}: <span id="captcha-question" class="text-gray-200"></span></label>
                  <button id="captcha-reload" type="button" class="text-sm text-accent-400 hover:text-accent-300">${content.contact.form.captchaReload[lang]}</button>
                </div>
                <input type="text" name="captcha_answer" required class="w-full px-4 py-3 bg-primary-900 border border-primary-700 rounded-lg text-white focus:outline-none focus:border-accent-500" placeholder="${content.contact.form.captchaPlaceholder[lang]}">
              </div>
              <button type="submit" class="w-full px-8 py-3 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-400 transition-colors">${content.contact.form.submit[lang]}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

async function loadCaptchaQuestion() {
  const questionNode = document.getElementById('captcha-question');
  if (!questionNode) {
    return;
  }

  const data = await fetchJson('captcha.php');
  if (data && data.question) {
    questionNode.textContent = data.question;
  }
}

function setupCaptcha() {
  const reloadButton = document.getElementById('captcha-reload');
  if (reloadButton) {
    reloadButton.addEventListener('click', function () {
      loadCaptchaQuestion().catch(function (error) {
        console.error(error);
      });
    });
  }

  loadCaptchaQuestion().catch(function (error) {
    console.error(error);
  });
}

function applyFormStatusFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');
  if (status !== 'success' && status !== 'error') {
    return null;
  }

  const successNode = document.getElementById('form-success');
  const errorNode = document.getElementById('form-error');

  if (status === 'success' && successNode) {
    successNode.classList.remove('hidden');
  }
  if (status === 'error' && errorNode) {
    errorNode.classList.remove('hidden');
  }

  if (status === 'success') {
    const formWrapper = document.getElementById('contact-form-wrapper');
    if (formWrapper) {
      formWrapper.classList.add('hidden');
    }
  }

  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView();
  }

  return status;
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
    setStoredLanguage(value);
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

  function render(lang) {
    setMeta(content, lang);

    const sections = [
      buildHero(content, lang),
      buildStats(content, lang),
      buildServices(content, lang),
      buildProducts(content, lang),
      buildAbout(content, lang),
      buildContact(content, lang)
    ];

    contentSlot.innerHTML = sections.join('');

    applyI18n(content, lang, headerSlot);
    applyI18n(content, lang, footerSlot);

    setupCaptcha();
    applyFormStatusFromUrl();
  }

  const defaultLanguage = content.defaultLanguage;
  let lang = getStoredLanguage(defaultLanguage);

  render(lang);

  setupHeaderInteractions(content, lang, function (next) {
    lang = next;
    render(lang);
  });

  setupScrollToTop();
}

window.addEventListener('DOMContentLoaded', function () {
  init().catch(function (error) {
    console.error(error);
  });
});
