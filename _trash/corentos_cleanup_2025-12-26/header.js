import { applyI18n } from './i18n.js';
import { setStoredLanguage } from './lang.js';

let _isInitialized = false;
let _onLanguageChanged = null;

export function setupHeaderInteractions(content, lang, onLanguageChanged) {
  _onLanguageChanged = onLanguageChanged;

  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
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
    if (mobileMenu) {
      mobileMenu.classList.add('hidden');
    }
    if (_onLanguageChanged) {
      _onLanguageChanged(value);
    }
  }

  if (!_isInitialized) {
    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener('click', function () {
        mobileMenu.classList.toggle('hidden');
      });

      mobileMenu.addEventListener('click', function (event) {
        const target = event.target;
        if (!(target instanceof Element)) {
          return;
        }

        const link = target.closest('a');
        if (!link) {
          return;
        }

        mobileMenu.classList.add('hidden');
      });
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

    _isInitialized = true;
  }

  setSelects(lang);

  const headerSlot = document.getElementById('header-slot');
  if (headerSlot) {
    applyI18n(content, lang, headerSlot);
  }
}
