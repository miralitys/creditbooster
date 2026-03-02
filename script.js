import { landingCopy } from './content/landingCopy.js';
import { track } from './lib/analytics.js';
import { submitLead } from './lib/leadApi.js';

const params = new URLSearchParams(window.location.search);
const requestedVariant = (params.get('v') || '').toLowerCase();
const variant = requestedVariant === 'cold' ? 'cold' : 'hot';

const shared = landingCopy.shared;
const variantCopy = landingCopy.variants[variant];
const quizCopy = shared.quiz;
const ui = shared.ui;

const quizState = {
  started: false,
  questionIndex: 0,
  mode: 'question',
  branch: 'standard',
  answers: {},
  submitting: false,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setText(id, text) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatUSPhone(rawValue) {
  const digits = rawValue.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function showStateMessage(message, type = '') {
  const stateEl = document.getElementById('quiz-state');
  if (!stateEl) return;
  stateEl.textContent = message;
  stateEl.classList.remove('is-error', 'is-success');
  if (type === 'error') stateEl.classList.add('is-error');
  if (type === 'success') stateEl.classList.add('is-success');
}

function scrollToQuiz() {
  const quizSection = document.getElementById('quiz');
  if (!quizSection) return;

  quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => {
    const firstOption = document.querySelector('.quiz-option');
    if (firstOption instanceof HTMLButtonElement) {
      firstOption.focus();
      return;
    }
    const questionTitle = document.getElementById('quiz-question-title');
    if (questionTitle) {
      questionTitle.setAttribute('tabindex', '-1');
      questionTitle.focus();
    }
  }, 280);
}

function initHeaderMenu() {
  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('#mobile-menu');
  if (!menuButton || !mobileMenu) return;

  menuButton.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

function initRevealAnimations() {
  const revealItems = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
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
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function renderHero() {
  const hero = variantCopy.hero;
  const title = hero.headlines[0] || '';

  setText('hero-eyebrow', hero.eyebrow);
  setText('hero-title', title);
  setText('hero-subtitle', hero.subtitle);
  setText('hero-primary-cta', hero.primaryCta);
  setText('hero-secondary-cta', hero.secondaryCta);
  setText('hero-microcopy', shared.microcopy);

  const bullets = document.getElementById('hero-bullets');
  if (bullets) {
    bullets.innerHTML = hero.bullets
      .map((bullet) => `<li>${escapeHtml(bullet)}</li>`)
      .join('');
  }

  const trustRow = document.getElementById('hero-trust-row');
  if (trustRow) {
    trustRow.innerHTML = shared.trustRow
      .map((item) => `<span class="trust-pill">${escapeHtml(item)}</span>`)
      .join('');
  }

  setText('overview-title', shared.protectionOverview.title);
  setText('overview-text', shared.protectionOverview.text);

  const overviewItems = document.getElementById('overview-items');
  if (overviewItems) {
    overviewItems.innerHTML = shared.protectionOverview.items
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join('');
  }
}

function renderUiLabels() {
  setText('overview-eyebrow', ui.overviewEyebrow);
  setText('nav-quiz', ui.nav.quiz);
  setText('nav-how', ui.nav.how);
  setText('nav-faq', ui.nav.faq);

  setText('mobile-nav-quiz', ui.nav.quiz);
  setText('mobile-nav-how', ui.nav.how);
  setText('mobile-nav-faq', ui.nav.faq);

  setText('header-secondary-cta', ui.header.secondaryCta);
  setText('header-primary-cta', ui.header.primaryCta);
  setText('mobile-nav-primary-cta', ui.header.mobilePrimaryCta);
  setText('sticky-mobile-cta', ui.stickyCta);

  setText('quiz-eyebrow', ui.sectionEyebrows.quiz);
  setText('solutions-eyebrow', ui.sectionEyebrows.solutions);
  setText('how-eyebrow', ui.sectionEyebrows.process);
  setText('fit-eyebrow', ui.sectionEyebrows.fit);
  setText('why-eyebrow', ui.sectionEyebrows.why);
  setText('faq-eyebrow', ui.sectionEyebrows.faq);
  setText('expectations-eyebrow', ui.sectionEyebrows.compliance);

  setText('lead-name-label', ui.form.nameLabel);
  setText('lead-email-label', ui.form.emailLabel);
  setText('lead-phone-label', ui.form.phoneLabel);
  setText('quiz-back-btn', ui.quizUi.back);
  setText('quiz-next-btn', ui.quizUi.next);
  setText('quiz-progress-note', ui.quizUi.timeHint);
  setText('legal-heading', ui.legalHeading);
  setText('for-who-title', ui.forWhoTitle);
  setText('footer-copy-text', ui.footerCopy);

  const nextSteps = document.getElementById('next-steps-list');
  if (nextSteps) {
    nextSteps.innerHTML = ui.nextSteps.map((step) => `<li>${escapeHtml(step)}</li>`).join('');
  }
}

function renderMessageMatch() {
  setText('message-match-title', shared.messageMatch.title);
  setText('message-match-text', shared.messageMatch.text);
}

function renderSocialProof() {
  const root = document.getElementById('social-proof-body');
  if (!root) return;

  setText('social-proof-title', shared.socialProof.title);

  if (Array.isArray(shared.socialProof.reviews) && shared.socialProof.reviews.length > 0) {
    root.innerHTML = `
      <div class="review-list">
        ${shared.socialProof.reviews
          .map(
            (review) => `
              <article class="review-card">
                <p>"${escapeHtml(review.quote)}"</p>
                <strong>${escapeHtml(review.name)}</strong>
                <span>${escapeHtml(review.role || '')}</span>
              </article>
            `
          )
          .join('')}
      </div>
    `;
    return;
  }

  root.innerHTML = `
    <ul class="value-points">
      ${shared.socialProof.fallbackPoints.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}
    </ul>
  `;
}

function renderSolutions() {
  setText('solutions-title', shared.solutions.title);
  const grid = document.getElementById('solutions-grid');
  if (!grid) return;

  grid.innerHTML = shared.solutions.items
    .map(
      (item, index) => `
        <article class="card card-solution ${index === 0 ? 'card-solution-main' : ''} reveal">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
        </article>
      `
    )
    .join('');
}

function renderHowItWorks() {
  setText('how-title', shared.howItWorks.title);
  const list = document.getElementById('how-steps');
  if (!list) return;

  list.innerHTML = shared.howItWorks.steps
    .map(
      (step, index) =>
        `<li class="reveal" data-step="${index + 1}">${escapeHtml(step)}</li>`
    )
    .join('');
}

function renderAudience() {
  setText('audience-title', shared.audience.title);
  setText('not-fit-title', shared.audience.notFitTitle);

  const forWho = document.getElementById('for-who-list');
  const notFit = document.getElementById('not-fit-list');

  if (forWho) {
    forWho.innerHTML = shared.audience.forWho.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  }

  if (notFit) {
    notFit.innerHTML = shared.audience.notFit.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  }
}

function renderWhyUs() {
  setText('why-title', shared.whyUs.title);
  const grid = document.getElementById('why-grid');
  if (!grid) return;

  grid.innerHTML = shared.whyUs.reasons
    .map(
      (reason) => `
        <article class="why-item reveal">
          <span class="why-item-marker" aria-hidden="true">✓</span>
          <p>${escapeHtml(reason)}</p>
        </article>
      `
    )
    .join('');
}

function renderExpectations() {
  setText('expectations-title', shared.expectations.title);
  const list = document.getElementById('expectations-list');
  if (!list) return;

  list.innerHTML = shared.expectations.points.map((point) => `<li>${escapeHtml(point)}</li>`).join('');
}

function renderFaq() {
  setText('faq-title', shared.faq.title);
  const list = document.getElementById('faq-list');
  if (!list) return;

  list.innerHTML = shared.faq.items
    .map(
      (item, index) => `
        <article class="faq-item reveal">
          <button
            type="button"
            class="faq-question"
            aria-expanded="false"
            aria-controls="faq-answer-${index}"
            id="faq-question-${index}"
          >
            ${escapeHtml(item.q)}
          </button>
          <p class="faq-answer" id="faq-answer-${index}" role="region" aria-labelledby="faq-question-${index}">
            ${escapeHtml(item.a)}
          </p>
        </article>
      `
    )
    .join('');

  list.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      const answerId = button.getAttribute('aria-controls');
      const answer = answerId ? document.getElementById(answerId) : null;
      button.setAttribute('aria-expanded', String(!expanded));
      if (answer) answer.classList.toggle('is-open', !expanded);
    });
  });
}

function renderFinalCta() {
  setText('final-cta-title', variantCopy.finalCta.title);
  setText('final-cta-text', variantCopy.finalCta.text);
  setText('final-cta-button', variantCopy.finalCta.button);
  setText('final-cta-disclosure', shared.disclosures.short);
}

function renderFooter() {
  setText('footer-disclosures-title', shared.disclosures.footerTitle);

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  const legalLinks = document.getElementById('legal-links');
  if (legalLinks) {
    legalLinks.innerHTML = `
      <li><a href="${escapeHtml(shared.legal.privacy)}">${escapeHtml(ui.legalLinks.privacy)}</a></li>
      <li><a href="${escapeHtml(shared.legal.terms)}">${escapeHtml(ui.legalLinks.terms)}</a></li>
      <li><a href="${escapeHtml(shared.legal.disclosures)}">${escapeHtml(
        ui.legalLinks.disclosures
      )}</a></li>
    `;
  }

  const disclosureList = document.getElementById('footer-disclosures-list');
  if (disclosureList) {
    disclosureList.innerHTML = shared.disclosures.footerItems
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join('');
  }
}

function bindCtaScroll() {
  document.querySelectorAll('[data-scroll-target="quiz"]').forEach((element) => {
    element.addEventListener('click', (event) => {
      event.preventDefault();
      const ctaId = element.getAttribute('data-cta-id') || 'unknown';
      track('click_cta', { variant, ctaId });
      scrollToQuiz();

      if (ctaId === 'header_secondary') {
        setTimeout(() => {
          showStateMessage('Сначала пройдите квиз - это займёт около 3 минут.');
        }, 360);
      }
    });
  });
}

function initOverviewCardFollowScroll() {
  const card = document.querySelector('.overview-card');
  const heroGrid = document.querySelector('.hero-grid');
  const messageMatch = document.getElementById('message-match');
  const header = document.querySelector('.site-header');
  const desktopQuery = window.matchMedia('(min-width: 1081px)');

  if (!card || !heroGrid || !messageMatch) return;

  let bounds = null;
  let rafId = 0;

  const resetState = () => {
    card.classList.remove('is-fixed', 'is-stopped');
    card.style.removeProperty('--overview-top-offset');
    card.style.removeProperty('--overview-fixed-left');
    card.style.removeProperty('--overview-fixed-width');
    card.style.removeProperty('--overview-stop-top');
    card.style.removeProperty('--overview-stop-left');
  };

  const updatePosition = () => {
    rafId = 0;
    if (!desktopQuery.matches || !bounds) {
      resetState();
      return;
    }

    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY <= bounds.start) {
      card.classList.remove('is-fixed', 'is-stopped');
      return;
    }

    if (scrollY < bounds.stop) {
      card.classList.add('is-fixed');
      card.classList.remove('is-stopped');
      return;
    }

    card.classList.remove('is-fixed');
    card.classList.add('is-stopped');
  };

  const requestUpdate = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(updatePosition);
  };

  const measure = () => {
    resetState();
    const scrollY = window.scrollY || window.pageYOffset;
    const headerHeight = header ? header.getBoundingClientRect().height : 84;
    const topOffset = headerHeight + 12;

    const cardRect = card.getBoundingClientRect();
    const heroRect = heroGrid.getBoundingClientRect();
    const messageRect = messageMatch.getBoundingClientRect();

    const cardTopAbs = scrollY + cardRect.top;
    const messageTopAbs = scrollY + messageRect.top;
    const heroTopAbs = scrollY + heroRect.top;

    const start = cardTopAbs - topOffset;
    const stop = Math.max(start, messageTopAbs - cardRect.height - 12);
    const stopTop = Math.max(0, messageTopAbs - heroTopAbs - cardRect.height - 12);
    const stopLeft = Math.max(0, cardRect.left - heroRect.left);

    bounds = {
      start,
      stop,
    };

    card.style.setProperty('--overview-top-offset', `${Math.round(topOffset)}px`);
    card.style.setProperty('--overview-fixed-left', `${Math.round(cardRect.left)}px`);
    card.style.setProperty('--overview-fixed-width', `${Math.round(cardRect.width)}px`);
    card.style.setProperty('--overview-stop-top', `${Math.round(stopTop)}px`);
    card.style.setProperty('--overview-stop-left', `${Math.round(stopLeft)}px`);

    requestUpdate();
  };

  const onResize = () => measure();
  const onScroll = () => requestUpdate();
  const onMediaChange = () => measure();

  measure();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);

  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener('change', onMediaChange);
  } else if (desktopQuery.addListener) {
    desktopQuery.addListener(onMediaChange);
  }
}

function updateQuizProgress(step, total, labelText) {
  const progressBar = document.getElementById('quiz-progress-bar');
  const progressLabel = document.getElementById('quiz-progress-label');
  const progressRoot = document.querySelector('.quiz-progress');
  const normalizedStep = Math.min(Math.max(step, 0), total);
  const percent = total > 0 ? Math.round((normalizedStep / total) * 100) : 0;

  if (progressBar) progressBar.style.width = `${percent}%`;
  if (progressLabel) progressLabel.textContent = labelText;
  if (progressRoot) progressRoot.setAttribute('aria-valuenow', String(percent));
}

function getCurrentQuestion() {
  return quizCopy.questions[quizState.questionIndex];
}

function animatePanelEntry(panel) {
  if (!panel) return;
  panel.classList.add('is-enter');
  requestAnimationFrame(() => panel.classList.remove('is-enter'));
}

function showQuizPanels(mode) {
  const questionPanel = document.getElementById('quiz-question-panel');
  const resultPanel = document.getElementById('quiz-result-panel');
  const contactPanel = document.getElementById('quiz-contact-panel');
  const successPanel = document.getElementById('quiz-success-panel');

  questionPanel?.classList.toggle('hidden', mode !== 'question');
  resultPanel?.classList.toggle('hidden', mode !== 'result');
  contactPanel?.classList.toggle('hidden', mode !== 'contact');
  successPanel?.classList.toggle('hidden', mode !== 'success');

  if (mode === 'question') animatePanelEntry(questionPanel);
  if (mode === 'result') animatePanelEntry(resultPanel);
  if (mode === 'contact') animatePanelEntry(contactPanel);
  if (mode === 'success') animatePanelEntry(successPanel);
}

function renderQuizQuestion() {
  const question = getCurrentQuestion();
  if (!question) return;

  setText('quiz-question-title', question.title);

  const optionsRoot = document.getElementById('quiz-options');
  if (optionsRoot) {
    const selectedValue = quizState.answers[question.id] || '';
    optionsRoot.innerHTML = question.options
      .map(
        (option) => `
          <button
            type="button"
            class="quiz-option ${selectedValue === option.value ? 'is-selected' : ''}"
            data-option-value="${escapeHtml(option.value)}"
          >
            ${escapeHtml(option.label)}
          </button>
        `
      )
      .join('');

    optionsRoot.querySelectorAll('.quiz-option').forEach((button) => {
      button.addEventListener('click', () => {
        quizState.answers[question.id] = button.getAttribute('data-option-value') || '';
        renderQuizQuestion();
      });
    });
  }

  const backBtn = document.getElementById('quiz-back-btn');
  const nextBtn = document.getElementById('quiz-next-btn');
  const nav = document.getElementById('quiz-navigation');

  nav?.classList.remove('hidden');
  if (backBtn) backBtn.disabled = quizState.questionIndex === 0;
  if (nextBtn) {
    nextBtn.textContent =
      quizState.questionIndex === quizCopy.questions.length - 1
        ? ui.quizUi.showResult
        : ui.quizUi.next;
    nextBtn.disabled = !quizState.answers[question.id];
  }

  updateQuizProgress(
    quizState.questionIndex + 1,
    quizCopy.questions.length,
    ui.quizUi.stepLabel
      .replace('{current}', String(quizState.questionIndex + 1))
      .replace('{total}', String(quizCopy.questions.length))
  );
}

function renderQuizResult() {
  const branchCopy =
    quizState.branch === 'fraud' ? quizCopy.branches.fraud : quizCopy.branches.standard;

  setText('quiz-result-title', branchCopy.title);
  setText('quiz-result-text', branchCopy.text);
  setText('quiz-result-cta', branchCopy.cta);

  const callLink = document.getElementById('quiz-call-link');
  if (callLink) {
    const showCall = quizState.branch === 'fraud';
    callLink.classList.toggle('hidden', !showCall);
    if (showCall) {
      callLink.textContent = branchCopy.callLinkLabel;
      callLink.onclick = () => {
        track('click_call', { variant, source: 'quiz_result_fraud' });
      };
    }
  }

  const nav = document.getElementById('quiz-navigation');
  nav?.classList.add('hidden');

  updateQuizProgress(quizCopy.questions.length, quizCopy.questions.length, ui.quizUi.resultLabel);
}

function renderQuizContact() {
  setText('quiz-contact-title', quizCopy.contact.title);
  setText('quiz-contact-text', quizCopy.contact.text);
  setText('lead-submit-btn', quizCopy.contact.submit);
  setText('quiz-short-disclosure', shared.disclosures.short);

  const format = quizState.answers.q8_contact_format;
  const needTcpa = format === 'call_10_15' || format === 'sms_allowed';
  const tcpaRow = document.getElementById('tcpa-row');
  const tcpaText = document.getElementById('tcpa-text');
  const tcpaCheckbox = document.getElementById('tcpa-consent');

  if (tcpaRow) tcpaRow.classList.toggle('hidden', !needTcpa);
  if (tcpaText) {
    tcpaText.textContent = ui.form.tcpaText;
  }
  if (tcpaCheckbox && !needTcpa) tcpaCheckbox.checked = false;

  const nav = document.getElementById('quiz-navigation');
  nav?.classList.add('hidden');

  updateQuizProgress(quizCopy.questions.length, quizCopy.questions.length, ui.quizUi.contactLabel);
}

function renderQuizSuccess() {
  setText('quiz-success-title', quizCopy.success.title);
  setText('quiz-success-text', quizCopy.success.text);
  showStateMessage(ui.quizUi.submitSuccess, 'success');

  const nav = document.getElementById('quiz-navigation');
  nav?.classList.add('hidden');

  updateQuizProgress(quizCopy.questions.length, quizCopy.questions.length, ui.quizUi.doneLabel);
}

function renderQuiz() {
  showQuizPanels(quizState.mode);

  if (quizState.mode === 'question') renderQuizQuestion();
  if (quizState.mode === 'result') renderQuizResult();
  if (quizState.mode === 'contact') renderQuizContact();
  if (quizState.mode === 'success') renderQuizSuccess();
}

function handleQuizNext() {
  showStateMessage('');
  const question = getCurrentQuestion();
  if (!question) return;

  const selected = quizState.answers[question.id];
  if (!selected) {
    showStateMessage(ui.quizUi.selectError, 'error');
    return;
  }

  if (!quizState.started) {
    quizState.started = true;
    track('quiz_start', { variant });
  }

  track('quiz_step', {
    variant,
    step: quizState.questionIndex + 1,
    questionId: question.id,
    answer: selected,
  });

  if (quizState.questionIndex < quizCopy.questions.length - 1) {
    quizState.questionIndex += 1;
    renderQuiz();
    return;
  }

  const fraudAnswer = quizState.answers.q5_fraud;
  quizState.branch = fraudAnswer === 'yes' || fraudAnswer === 'not_sure' ? 'fraud' : 'standard';
  quizState.mode = 'result';

  track('quiz_complete', {
    variant,
    branch: quizState.branch,
    preferredFormat: quizState.answers.q8_contact_format,
  });

  renderQuiz();
}

function handleQuizBack() {
  showStateMessage('');
  if (quizState.mode !== 'question') return;
  if (quizState.questionIndex === 0) return;
  quizState.questionIndex -= 1;
  renderQuiz();
}

function validateLeadPayload(payload) {
  if (payload.name.length < 2) {
    return ui.form.nameError;
  }

  if (!EMAIL_RE.test(payload.email)) {
    return ui.form.emailError;
  }

  const format = quizState.answers.q8_contact_format;
  const needsTcpa = format === 'call_10_15' || format === 'sms_allowed';
  const tcpaCheckbox = document.getElementById('tcpa-consent');

  if (needsTcpa && tcpaCheckbox && !tcpaCheckbox.checked) {
    return ui.form.tcpaError;
  }

  if (payload.phone.replace(/\D/g, '').length !== 10) {
    return ui.form.phoneError;
  }

  return '';
}

async function handleLeadSubmit(event) {
  event.preventDefault();
  if (quizState.submitting) return;

  showStateMessage('');

  const payload = {
    name: (document.getElementById('lead-name')?.value || '').trim(),
    email: (document.getElementById('lead-email')?.value || '').trim(),
    phone: (document.getElementById('lead-phone')?.value || '').trim(),
  };

  const validationError = validateLeadPayload(payload);
  if (validationError) {
    showStateMessage(validationError, 'error');
    return;
  }

  quizState.submitting = true;
  const submitButton = document.getElementById('lead-submit-btn');
  if (submitButton instanceof HTMLButtonElement) {
    submitButton.disabled = true;
    submitButton.textContent = ui.quizUi.loading;
  }

  try {
    await submitLead({
      ...payload,
      source: 'main_quiz',
      tcpaRequired: ['call_10_15', 'sms_allowed'].includes(quizState.answers.q8_contact_format),
      tcpaAccepted: Boolean(document.getElementById('tcpa-consent')?.checked),
      pageUrl: window.location.href,
      pageTitle: document.title,
      context: {
        variant,
        branch: quizState.branch,
        preferredFormat: quizState.answers.q8_contact_format || '',
      },
      quizAnswers: { ...quizState.answers },
    });

    track('lead_submit', {
      variant,
      branch: quizState.branch,
      preferredFormat: quizState.answers.q8_contact_format,
      hasPhone: Boolean(payload.phone),
    });

    quizState.submitting = false;
    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = false;
      submitButton.textContent = quizCopy.contact.submit;
    }
    quizState.mode = 'success';
    renderQuiz();
  } catch (error) {
    quizState.submitting = false;
    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = false;
      submitButton.textContent = quizCopy.contact.submit;
    }
    showStateMessage(error instanceof Error ? error.message : ui.quizUi.submitError, 'error');
  }
}

function initQuiz() {
  setText('quiz-heading', quizCopy.title);
  setText('quiz-subtitle', quizCopy.subtitle);

  const nextBtn = document.getElementById('quiz-next-btn');
  const backBtn = document.getElementById('quiz-back-btn');
  const resultCta = document.getElementById('quiz-result-cta');
  const leadForm = document.getElementById('lead-form');
  const phoneInput = document.getElementById('lead-phone');

  nextBtn?.addEventListener('click', handleQuizNext);
  backBtn?.addEventListener('click', handleQuizBack);

  resultCta?.addEventListener('click', () => {
    track('click_cta', {
      variant,
      ctaId: quizState.branch === 'fraud' ? 'quiz_result_fraud' : 'quiz_result_standard',
    });
    quizState.mode = 'contact';
    renderQuiz();
    document.getElementById('lead-name')?.focus();
  });

  leadForm?.addEventListener('submit', handleLeadSubmit);

  if (phoneInput instanceof HTMLInputElement) {
    phoneInput.required = true;
    phoneInput.setAttribute('aria-required', 'true');
    phoneInput.addEventListener('input', () => {
      phoneInput.value = formatUSPhone(phoneInput.value);
    });
  }

  renderQuiz();
}

function renderMetricsIfEnabled() {
  if (!shared.metrics.enabled || !Array.isArray(shared.metrics.items) || shared.metrics.items.length === 0) {
    return;
  }

  const section = document.createElement('section');
  section.className = 'section-compact';
  section.innerHTML = `
    <div class="container">
      <div class="cards-grid">
        ${shared.metrics.items
          .map(
            (metric) => `
              <article class="card">
                <h3>${escapeHtml(metric.title)}</h3>
                <p>${escapeHtml(metric.text)}</p>
              </article>
            `
          )
          .join('')}
      </div>
    </div>
  `;

  const anchor = document.getElementById('quiz');
  anchor?.parentElement?.insertBefore(section, anchor);
}

function initStaticContent() {
  document.documentElement.setAttribute('data-variant', variant);
  document.title = variantCopy.metaTitle;

  renderUiLabels();
  renderHero();
  renderMessageMatch();
  renderMetricsIfEnabled();
  renderSocialProof();
  renderSolutions();
  renderHowItWorks();
  renderAudience();
  renderWhyUs();
  renderExpectations();
  renderFaq();
  renderFinalCta();
  renderFooter();
}

function init() {
  initHeaderMenu();
  initStaticContent();
  initOverviewCardFollowScroll();
  initQuiz();
  bindCtaScroll();
  initRevealAnimations();
}

init();
