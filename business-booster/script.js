import { track } from '/lib/analytics.js';
import { submitLead } from '/lib/leadApi.js';

const ROTATING_WORDS = ['бизнеса', 'транспорта', 'личных целей'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setStateMessage(message, type = '') {
  const stateEl = document.getElementById('form-state');
  if (!stateEl) return;
  stateEl.textContent = message;
  stateEl.classList.remove('is-error', 'is-success');
  if (type === 'error') stateEl.classList.add('is-error');
  if (type === 'success') stateEl.classList.add('is-success');
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function initMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  if (!(toggle instanceof HTMLButtonElement) || !nav) return;

  toggle.addEventListener('click', () => {
    const next = !document.body.classList.contains('nav-open');
    document.body.classList.toggle('nav-open', next);
    toggle.setAttribute('aria-expanded', String(next));
  });

  nav.querySelectorAll('a, button').forEach((item) => {
    item.addEventListener('click', () => {
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('[data-scroll], a[href^="#"]').forEach((element) => {
    element.addEventListener('click', (event) => {
      const selector =
        element.getAttribute('data-scroll') ||
        element.getAttribute('href') ||
        '';

      if (!selector.startsWith('#')) return;

      const target = document.querySelector(selector);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function initReveal() {
  const nodes = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    nodes.forEach((node) => node.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.16 }
  );

  nodes.forEach((node) => observer.observe(node));
}

function initHeroWordRotation() {
  const wordEl = document.getElementById('hero-rotating-word');
  if (!wordEl) return;

  let index = 0;
  window.setInterval(() => {
    index = (index + 1) % ROTATING_WORDS.length;
    wordEl.textContent = ROTATING_WORDS[index];
  }, 2200);
}

function initPlaylist() {
  const player = document.getElementById('review-player');
  const title = document.getElementById('review-title');
  const description = document.getElementById('review-description');
  const items = Array.from(document.querySelectorAll('.playlist-item'));

  if (!(player instanceof HTMLIFrameElement) || !title || !description || items.length === 0) return;

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const videoId = item.getAttribute('data-video-id') || '';
      const nextTitle = item.getAttribute('data-title') || '';
      const nextDescription = item.getAttribute('data-description') || '';
      if (!videoId) return;

      items.forEach((candidate) => candidate.classList.remove('is-active'));
      item.classList.add('is-active');
      player.src = `https://www.youtube.com/embed/${videoId}?rel=0`;
      player.title = nextTitle;
      title.textContent = nextTitle;
      description.textContent = nextDescription;

      track('playlist_select', {
        source: 'website|business_booster',
        video_id: videoId,
        video_title: nextTitle,
      });
    });
  });
}

function initCtaTracking() {
  document.querySelectorAll('[data-cta-id]').forEach((button) => {
    button.addEventListener('click', () => {
      track('cta_click', {
        source: 'website|business_booster',
        cta_id: button.getAttribute('data-cta-id') || 'unknown',
      });
    });
  });
}

function validateForm({ name, email, phone, consent }) {
  if (name.trim().length < 2) return 'Введите корректное имя.';
  if (!EMAIL_RE.test(email.trim())) return 'Введите корректный email.';
  if (phone.replace(/\D/g, '').length !== 10) return 'Укажите телефон в US формате (10 цифр).';
  if (!consent) return 'Нужно согласие на обработку персональных данных.';
  return '';
}

function initLeadForm() {
  const form = document.getElementById('lead-form');
  const phoneInput = document.getElementById('lead-phone');
  const submitButton = document.getElementById('lead-submit-btn');

  if (!(form instanceof HTMLFormElement)) return;

  if (phoneInput instanceof HTMLInputElement) {
    phoneInput.addEventListener('input', () => {
      phoneInput.value = formatPhone(phoneInput.value);
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = (document.getElementById('lead-name')?.value || '').trim();
    const email = (document.getElementById('lead-email')?.value || '').trim();
    const phone = (document.getElementById('lead-phone')?.value || '').trim();
    const consent = Boolean(document.getElementById('lead-consent')?.checked);
    const error = validateForm({ name, email, phone, consent });

    if (error) {
      setStateMessage(error, 'error');
      return;
    }

    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
      submitButton.textContent = 'Отправляем...';
    }
    setStateMessage('');

    try {
      await submitLead({
        name,
        email,
        phone,
        source: 'website|business_booster',
        tcpaRequired: true,
        tcpaAccepted: consent,
        pageUrl: window.location.href,
        pageTitle: document.title,
        context: {
          page_variant: 'business_booster',
          page_path: window.location.pathname,
        },
      });

      track('lead_submit', {
        source: 'website|business_booster',
        has_phone: true,
      });

      form.reset();
      setStateMessage('Спасибо. Заявка отправлена, менеджер свяжется с вами в ближайшее время.', 'success');
    } catch (errorMessage) {
      setStateMessage(
        errorMessage instanceof Error ? errorMessage.message : 'Не удалось отправить заявку. Попробуйте ещё раз.',
        'error'
      );
    } finally {
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
        submitButton.textContent = 'Оставить заявку';
      }
    }
  });
}

function init() {
  initMenu();
  initSmoothScroll();
  initReveal();
  initHeroWordRotation();
  initPlaylist();
  initCtaTracking();
  initLeadForm();
}

init();
