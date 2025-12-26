export function i18nLookup(content, lang, key) {
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

export function applyI18n(content, lang, root) {
  const nodes = root.querySelectorAll('[data-i18n]');
  for (const node of nodes) {
    const key = node.getAttribute('data-i18n');
    const value = i18nLookup(content, lang, key);
    if (value !== null && value !== undefined) {
      node.textContent = value;
    }
  }
}
