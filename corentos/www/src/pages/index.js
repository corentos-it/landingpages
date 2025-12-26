import { setupScrollToTop } from '../core/scrollToTop.js';

async function loadCaptchaQuestion() {
  const questionNode = document.getElementById('captcha-question');
  if (!questionNode) {
    return;
  }

  const response = await fetch('captcha.php', { cache: 'no-store' });
  if (!response.ok) {
    return;
  }

  const data = await response.json();
  if (data && data.question) {
    questionNode.textContent = data.question;
  }
}

const CONTACT_FORM_DRAFT_STORAGE_KEY = 'corentos_contact_form_draft';

function setupContactFormDraftPersistence() {
  const form = document.querySelector('form[action="send-mail.php"]');
  if (!form) {
    return;
  }

  if (form.dataset.draftPersistenceInitialized === 'true') {
    return;
  }

  form.dataset.draftPersistenceInitialized = 'true';

  form.addEventListener('submit', function () {
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const messageInput = form.querySelector('textarea[name="message"]');

    const payload = {
      name: nameInput ? nameInput.value : '',
      email: emailInput ? emailInput.value : '',
      message: messageInput ? messageInput.value : ''
    };

    sessionStorage.setItem(CONTACT_FORM_DRAFT_STORAGE_KEY, JSON.stringify(payload));
  });
}

function restoreContactFormDraft() {
  const form = document.querySelector('form[action="send-mail.php"]');
  if (!form) {
    return;
  }

  const draft = sessionStorage.getItem(CONTACT_FORM_DRAFT_STORAGE_KEY);
  if (!draft) {
    return;
  }

  try {
    const draftData = JSON.parse(draft);

    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const messageInput = form.querySelector('textarea[name="message"]');

    if (nameInput && typeof draftData.name === 'string') {
      nameInput.value = draftData.name;
    }
    if (emailInput && typeof draftData.email === 'string') {
      emailInput.value = draftData.email;
    }
    if (messageInput && typeof draftData.message === 'string') {
      messageInput.value = draftData.message;
    }
  } catch (error) {
    sessionStorage.removeItem(CONTACT_FORM_DRAFT_STORAGE_KEY);
  }
}

function clearContactFormDraft() {
  sessionStorage.removeItem(CONTACT_FORM_DRAFT_STORAGE_KEY);
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

    clearContactFormDraft();
  }

  if (status === 'error') {
    restoreContactFormDraft();
  }

  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView();
  }

  return status;
}

function setFooterYear() {
  const yearNode = document.getElementById('footer-year');
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear().toString();
  }
}

function setupMobileMenu() {
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!mobileToggle || !mobileMenu) {
    return;
  }

  if (mobileToggle.dataset.initialized === 'true') {
    return;
  }

  mobileToggle.dataset.initialized = 'true';

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

async function init() {
  setFooterYear();
  setupMobileMenu();
  setupContactFormDraftPersistence();

  const status = applyFormStatusFromUrl();
  if (status !== 'success') {
    setupCaptcha();
  }

  setupScrollToTop();
}

window.addEventListener('DOMContentLoaded', function () {
  init().catch(function (error) {
    console.error(error);
  });
});

export {};
