export function getStoredLanguage(defaultLanguage) {
  const value = window.localStorage.getItem('lang');
  if (value === 'de' || value === 'en' || value === 'fr') {
    return value;
  }
  return defaultLanguage;
}

export function setStoredLanguage(lang) {
  window.localStorage.setItem('lang', lang);
}
