import { LP_SHARED, LP_BY_SLUG } from '/content/lpConfigs.js';
import { track } from '/lib/analytics.js';

const bodySlug = document.body?.dataset?.lpSlug;
const pathSlug = window.location.pathname.split('/').filter(Boolean).at(-1) || 'credit-score';
const slug = bodySlug || pathSlug;
const page = LP_BY_SLUG[slug];

if (!page) {
  console.error('[lp-app] Unknown slug:', slug);
}

const currentPage = page || Object.values(LP_BY_SLUG)[0];
const questions = currentPage.questions;
const quizState = {
  started: false,
  index: 0,
  mode: 'question', // question | mini_fraud | result | contact | success
  answers: {},
  miniFraudAnswer: '',
  resultType: 'general',
  submitting: false,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const US_PHONE_DIGITS = 10;
const FRAUD_SLUGS = new Set(['credit-report', 'credit-bureau-report']);

function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buildTrackPayload(extra = {}) {
  return {
    lp_id: currentPage.lp_id,
    lp_slug: currentPage.lp_slug,
    intent_cluster: currentPage.intent_cluster,
    goal: quizState.answers.q1_goal || quizState.answers.q1_business_goal || '',
    issue: quizState.answers.q2_issue || quizState.answers.q7_report_issue || quizState.answers.q7_problem_type || '',
    score_band: quizState.answers.q4_score_band || '',
    preferred_contact: quizState.answers.q5_contact_pref || '',
    ...extra,
  };
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, US_PHONE_DIGITS);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function showMessage(text, type = '') {
  const el = document.getElementById('quiz-message');
  if (!el) return;
  el.textContent = text;
  el.classList.remove('is-error', 'is-success');
  if (type === 'error') el.classList.add('is-error');
  if (type === 'success') el.classList.add('is-success');
}

function scrollToQuiz() {
  const quiz = document.getElementById('quiz');
  if (!quiz) return;
  quiz.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => {
    const firstOption = document.querySelector('.quiz-option');
    if (firstOption instanceof HTMLButtonElement) firstOption.focus();
  }, 250);
}

function attachGlobalCtas() {
  document.querySelectorAll('[data-scroll-quiz]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const eventName = btn.dataset.event || 'click_cta';
      track(eventName, buildTrackPayload({ cta_id: btn.dataset.ctaId || 'unknown' }));
      scrollToQuiz();
    });
  });
}

function renderHeader() {
  setText('nav-how', 'Как работаем');
  setText('nav-packages', 'Пакеты');
  setText('nav-faq', 'FAQ');
  setText('header-cta', LP_SHARED.primaryCta);
}

function renderHero() {
  document.title = `${currentPage.hero.h1} | Credit Booster`;
  setText('hero-h1', currentPage.hero.h1);
  setText('hero-subheadline', currentPage.hero.subheadline);
  setText('hero-cta', currentPage.cta || LP_SHARED.primaryCta);
  setText('hero-microcopy', LP_SHARED.heroMicrocopy);
  setText('hero-trust-line', LP_SHARED.trustLine);

  const list = document.getElementById('hero-benefits');
  if (list) {
    list.innerHTML = currentPage.hero.benefits.map((b) => `<li>${escapeHtml(b)}</li>`).join('');
  }
}

function renderShortBlock() {
  setText('short-title', LP_SHARED.shortBlockTitle);
  const list = document.getElementById('short-points');
  if (list) {
    list.innerHTML = currentPage.shortPoints.map((p) => `<li>${escapeHtml(p)}</li>`).join('');
  }
}

function renderHow() {
  setText('how-title', LP_SHARED.howItWorks.title);
  const list = document.getElementById('how-steps');
  if (list) {
    list.innerHTML = LP_SHARED.howItWorks.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join('');
  }
  setText('how-note', LP_SHARED.howItWorks.note);
}

function renderPackages() {
  setText('packages-title', LP_SHARED.packages.title);
  setText('packages-note', LP_SHARED.packages.note);
  const list = document.getElementById('packages-grid');
  if (list) {
    list.innerHTML = LP_SHARED.packages.cards
      .map(
        (card) => `
          <article class="card package-card">
            <h3>${escapeHtml(card.title)}</h3>
            <p>${escapeHtml(card.text)}</p>
          </article>
        `
      )
      .join('');
  }
}

function renderIncludes() {
  setText('includes-title', LP_SHARED.includes.title);
  const list = document.getElementById('includes-grid');
  if (list) {
    list.innerHTML = LP_SHARED.includes.cards
      .map(
        (item) => `
          <article class="card include-card">
            <h3>${escapeHtml(item)}</h3>
          </article>
        `
      )
      .join('');
  }
}

function renderGuarantee() {
  setText('guarantee-title', LP_SHARED.guarantee.title);
  setText('guarantee-text', LP_SHARED.guarantee.text);
  setText('guarantee-placeholder', LP_SHARED.guarantee.placeholder);
}

function renderFit() {
  setText('fit-title', LP_SHARED.fit.title);
  setText('fit-for-title', LP_SHARED.fit.forWhoTitle);
  setText('fit-not-title', LP_SHARED.fit.notForTitle);

  const forList = document.getElementById('fit-for-list');
  if (forList) {
    forList.innerHTML = LP_SHARED.fit.forWho.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  }

  const notList = document.getElementById('fit-not-list');
  if (notList) {
    notList.innerHTML = LP_SHARED.fit.notFor.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  }
}

function renderValueProof() {
  setText('value-proof-title', LP_SHARED.valueProof.title);
  const list = document.getElementById('value-proof-list');
  if (list) {
    list.innerHTML = LP_SHARED.valueProof.points.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  }
}

function renderFaq() {
  setText('faq-title', 'FAQ');
  const list = document.getElementById('faq-list');
  if (!list) return;

  list.innerHTML = currentPage.faq
    .map(
      (item, index) => `
        <article class="faq-item">
          <button
            class="faq-question"
            type="button"
            aria-expanded="false"
            aria-controls="faq-answer-${index}"
            id="faq-question-${index}"
          >
            ${escapeHtml(item.q)}
          </button>
          <div id="faq-answer-${index}" class="faq-answer" role="region" aria-labelledby="faq-question-${index}">
            <p>${escapeHtml(item.a)}</p>
          </div>
        </article>
      `
    )
    .join('');

  list.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      const target = button.getAttribute('aria-controls');
      const answer = target ? document.getElementById(target) : null;
      if (answer) answer.classList.toggle('is-open', !expanded);
    });
  });
}

function renderFinalCta() {
  setText('final-cta-title', LP_SHARED.finalCta.title);
  setText('final-cta-text', LP_SHARED.finalCta.text);
  setText('final-cta-btn', LP_SHARED.finalCta.button);
}

function renderFooter() {
  setText('footer-disclaimer', LP_SHARED.footer.disclaimer);
  setText('footer-rights', LP_SHARED.footer.rights);
  setText('quiz-short-disclaimer', LP_SHARED.quiz.shortDisclosure);
}

function updateProgress(current, total) {
  const progress = document.getElementById('quiz-progress-bar');
  const label = document.getElementById('quiz-progress-label');
  if (!progress || !label) return;

  const percent = Math.max(0, Math.min(100, Math.round((current / total) * 100)));
  progress.style.width = `${percent}%`;
  label.textContent = `Шаг ${current} из ${total}`;
}

function getCurrentQuestion() {
  return questions[quizState.index];
}

function renderQuestionPanel() {
  const question = getCurrentQuestion();
  if (!question) return;

  const title = document.getElementById('quiz-question-title');
  const options = document.getElementById('quiz-options');
  if (!title || !options) return;

  title.textContent = question.title;
  const selected = quizState.answers[question.id] || '';

  options.innerHTML = question.options
    .map(
      (option) => `
        <button
          type="button"
          class="quiz-option ${selected === option.value ? 'is-selected' : ''}"
          data-value="${escapeHtml(option.value)}"
        >
          ${escapeHtml(option.label)}
        </button>
      `
    )
    .join('');

  options.querySelectorAll('.quiz-option').forEach((button) => {
    button.addEventListener('click', () => {
      quizState.answers[question.id] = button.dataset.value || '';
      renderQuestionPanel();
      showMessage('');
    });
  });

  const totalSteps = questions.length + (quizState.mode === 'mini_fraud' ? 1 : 0);
  updateProgress(quizState.index + 1, totalSteps);
}

function renderMiniFraudPanel() {
  const title = document.getElementById('quiz-mini-title');
  const options = document.getElementById('quiz-mini-options');
  if (!title || !options) return;

  title.textContent = 'Мини-вопрос: есть подозрение на fraud/identity theft?';
  const selected = quizState.miniFraudAnswer;
  options.innerHTML = [
    { value: 'yes', label: 'Да' },
    { value: 'no', label: 'Нет' },
  ]
    .map(
      (item) => `
        <button
          type="button"
          class="quiz-option ${selected === item.value ? 'is-selected' : ''}"
          data-mini-value="${item.value}"
        >
          ${item.label}
        </button>
      `
    )
    .join('');

  options.querySelectorAll('.quiz-option').forEach((button) => {
    button.addEventListener('click', () => {
      quizState.miniFraudAnswer = button.dataset.miniValue || '';
      quizState.answers.q_fraud_suspected = quizState.miniFraudAnswer;
      renderMiniFraudPanel();
      showMessage('');
    });
  });

  updateProgress(questions.length + 1, questions.length + 1);
}

function classifyResult() {
  const issue = quizState.answers.q2_issue;
  const denied = quizState.answers.q3_denials_90;
  const q7 =
    quizState.answers.q7_report_issue ||
    quizState.answers.q7_problem_type ||
    quizState.answers.q7_focus ||
    quizState.answers.q7_changes_year ||
    quizState.answers.q7_recent ||
    quizState.answers.q7_plan ||
    '';

  if (quizState.answers.q_fraud_suspected === 'yes') {
    return 'fraud';
  }

  if (currentPage.quizType === 'business') {
    const entity = quizState.answers.q4_entity;
    const businessAge = quizState.answers.q2_business_age;
    if (entity !== 'yes' || businessAge === '0_6m') return 'profileReview';
    return 'general';
  }

  const reportIssues = new Set(['collections', 'late_payments', 'errors_in_report', 'inquiries', 'charge_off']);
  const deepReviewFlags = new Set([
    'collections',
    'late',
    'charge_off',
    'errors',
    'account_not_mine',
    'wrong_balance_status',
    'personal_info',
    'many_inquiries',
  ]);

  if (reportIssues.has(issue) || denied === 'yes' || deepReviewFlags.has(q7)) {
    return 'profileReview';
  }

  return 'general';
}

function renderResultPanel() {
  const result = LP_SHARED.results[quizState.resultType];
  const title = document.getElementById('quiz-result-title');
  const text = document.getElementById('quiz-result-text');
  const cta = document.getElementById('quiz-result-btn');
  const call = document.getElementById('quiz-result-call');

  if (title) title.textContent = result.title;
  if (text) text.textContent = result.text;
  if (cta) cta.textContent = result.cta;

  if (call) {
    const showCall = quizState.resultType === 'fraud';
    call.classList.toggle('hidden', !showCall);
    if (showCall) {
      call.textContent = 'Позвонить консультанту';
      call.onclick = () => track('click_call', buildTrackPayload({ source: 'quiz_result' }));
    }
  }

  updateProgress(questions.length, questions.length);
}

function renderContactPanel() {
  setText('quiz-contact-title', LP_SHARED.quiz.contactTitle);
  setText('quiz-contact-subtitle', LP_SHARED.quiz.contactSubtitle);
  setText('label-name', LP_SHARED.quiz.contactName);
  setText('label-email', LP_SHARED.quiz.contactEmail);
  setText('label-phone', LP_SHARED.quiz.contactPhone);
  setText('label-consent', LP_SHARED.quiz.consentText);
  setText('lead-submit-btn', LP_SHARED.quiz.contactSubmit);

  const consentRow = document.getElementById('consent-row');
  const pref = quizState.answers.q5_contact_pref;
  const needConsent = pref === 'call_10_15' || pref === 'sms_allowed';
  if (consentRow) {
    consentRow.classList.toggle('hidden', !needConsent);
  }

  const lpId = document.getElementById('lp-id-field');
  const lpSlug = document.getElementById('lp-slug-field');
  if (lpId) lpId.value = String(currentPage.lp_id);
  if (lpSlug) lpSlug.value = currentPage.lp_slug;

  updateProgress(questions.length, questions.length);
}

function renderSuccessPanel() {
  setText('quiz-success-title', LP_SHARED.quiz.successTitle);
  setText('quiz-success-text', LP_SHARED.quiz.successText);
  showMessage('Спасибо! Проверьте email или ожидайте связь.', 'success');
  updateProgress(questions.length, questions.length);
}

function renderPanels() {
  const questionPanel = document.getElementById('quiz-question-panel');
  const miniPanel = document.getElementById('quiz-mini-panel');
  const resultPanel = document.getElementById('quiz-result-panel');
  const contactPanel = document.getElementById('quiz-contact-panel');
  const successPanel = document.getElementById('quiz-success-panel');
  const nav = document.getElementById('quiz-nav');

  if (!questionPanel || !miniPanel || !resultPanel || !contactPanel || !successPanel || !nav) return;

  questionPanel.classList.toggle('hidden', quizState.mode !== 'question');
  miniPanel.classList.toggle('hidden', quizState.mode !== 'mini_fraud');
  resultPanel.classList.toggle('hidden', quizState.mode !== 'result');
  contactPanel.classList.toggle('hidden', quizState.mode !== 'contact');
  successPanel.classList.toggle('hidden', quizState.mode !== 'success');

  const backBtn = document.getElementById('quiz-back-btn');
  const nextBtn = document.getElementById('quiz-next-btn');

  if (!backBtn || !nextBtn) return;

  if (quizState.mode === 'question') {
    backBtn.disabled = quizState.index === 0;
    nextBtn.disabled = !quizState.answers[getCurrentQuestion()?.id || ''];
    nextBtn.textContent = quizState.index === questions.length - 1 ? LP_SHARED.quiz.showResult : LP_SHARED.quiz.next;
    nav.classList.remove('hidden');
    renderQuestionPanel();
    return;
  }

  if (quizState.mode === 'mini_fraud') {
    backBtn.disabled = false;
    nextBtn.disabled = !quizState.miniFraudAnswer;
    nextBtn.textContent = LP_SHARED.quiz.showResult;
    nav.classList.remove('hidden');
    renderMiniFraudPanel();
    return;
  }

  if (quizState.mode === 'result') {
    backBtn.disabled = false;
    nextBtn.disabled = false;
    nextBtn.textContent = LP_SHARED.quiz.toContacts;
    nav.classList.remove('hidden');
    renderResultPanel();
    return;
  }

  if (quizState.mode === 'contact') {
    nav.classList.add('hidden');
    renderContactPanel();
    return;
  }

  nav.classList.add('hidden');
  renderSuccessPanel();
}

function shouldOpenMiniFraud() {
  if (!FRAUD_SLUGS.has(currentPage.lp_slug) || !currentPage.enableFraudMiniQuestion) return false;
  const q7Value = quizState.answers.q7_report_issue || quizState.answers.q7_problem_type;
  return q7Value === 'account_not_mine';
}

function handleNext() {
  showMessage('');

  if (quizState.mode === 'question') {
    const question = getCurrentQuestion();
    const selected = question ? quizState.answers[question.id] : '';
    if (!selected) {
      showMessage(LP_SHARED.quiz.requiredChoiceError, 'error');
      return;
    }

    if (!quizState.started) {
      quizState.started = true;
      track('quiz_start', buildTrackPayload({ step: 1 }));
    }

    track(
      'quiz_step',
      buildTrackPayload({
        step: quizState.index + 1,
        question_id: question?.id || '',
        answer: selected,
      })
    );

    if (quizState.index < questions.length - 1) {
      quizState.index += 1;
      renderPanels();
      return;
    }

    if (shouldOpenMiniFraud()) {
      quizState.mode = 'mini_fraud';
      renderPanels();
      return;
    }

    quizState.resultType = classifyResult();
    quizState.mode = 'result';
    track('quiz_complete', buildTrackPayload({ result_type: quizState.resultType }));
    renderPanels();
    return;
  }

  if (quizState.mode === 'mini_fraud') {
    if (!quizState.miniFraudAnswer) {
      showMessage(LP_SHARED.quiz.requiredChoiceError, 'error');
      return;
    }
    quizState.resultType = classifyResult();
    quizState.mode = 'result';
    track('quiz_complete', buildTrackPayload({ result_type: quizState.resultType }));
    renderPanels();
    return;
  }

  if (quizState.mode === 'result') {
    track('click_cta', buildTrackPayload({ cta_id: 'quiz_result_to_contact', result_type: quizState.resultType }));
    quizState.mode = 'contact';
    renderPanels();
  }
}

function handleBack() {
  showMessage('');

  if (quizState.mode === 'question' && quizState.index > 0) {
    quizState.index -= 1;
    renderPanels();
    return;
  }

  if (quizState.mode === 'mini_fraud') {
    quizState.mode = 'question';
    quizState.miniFraudAnswer = '';
    delete quizState.answers.q_fraud_suspected;
    renderPanels();
    return;
  }

  if (quizState.mode === 'result') {
    if (shouldOpenMiniFraud()) {
      quizState.mode = 'mini_fraud';
    } else {
      quizState.mode = 'question';
    }
    renderPanels();
    return;
  }

  if (quizState.mode === 'contact') {
    quizState.mode = 'result';
    renderPanels();
  }
}

function validateLeadForm(formData) {
  const name = (formData.get('name') || '').toString().trim();
  const email = (formData.get('email') || '').toString().trim();
  const phone = (formData.get('phone') || '').toString().trim();
  const consentChecked = document.getElementById('consent-checkbox')?.checked;

  if (name.length < 2) {
    showMessage(LP_SHARED.quiz.nameError, 'error');
    return false;
  }

  if (!EMAIL_RE.test(email)) {
    showMessage(LP_SHARED.quiz.emailError, 'error');
    return false;
  }

  const digits = phone.replace(/\D/g, '');
  if (digits.length > 0 && digits.length < US_PHONE_DIGITS) {
    showMessage(LP_SHARED.quiz.phoneError, 'error');
    return false;
  }

  const pref = quizState.answers.q5_contact_pref;
  const needConsent = pref === 'call_10_15' || pref === 'sms_allowed';
  if (needConsent && !consentChecked) {
    showMessage(LP_SHARED.quiz.consentError, 'error');
    return false;
  }

  return true;
}

function initQuiz() {
  setText('quiz-title', LP_SHARED.quiz.title);
  setText('quiz-subtitle', LP_SHARED.quiz.subtitle);
  setText('quiz-short-disclaimer', LP_SHARED.quiz.shortDisclosure);
  setText('quiz-progress-label', `Шаг 1 из ${questions.length}`);

  const back = document.getElementById('quiz-back-btn');
  const next = document.getElementById('quiz-next-btn');
  const form = document.getElementById('lead-form');
  const phoneInput = document.getElementById('lead-phone');
  const resultBtn = document.getElementById('quiz-result-btn');

  if (back) back.addEventListener('click', handleBack);
  if (next) next.addEventListener('click', handleNext);

  if (resultBtn) {
    resultBtn.addEventListener('click', () => {
      track('click_cta', buildTrackPayload({ cta_id: 'quiz_result_button', result_type: quizState.resultType }));
      quizState.mode = 'contact';
      renderPanels();
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      phoneInput.value = formatPhone(phoneInput.value);
    });
  }

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (quizState.submitting) return;

      const formData = new FormData(form);
      if (!validateLeadForm(formData)) return;

      quizState.submitting = true;
      showMessage(LP_SHARED.quiz.loadingText);

      const submitButton = document.getElementById('lead-submit-btn');
      if (submitButton) submitButton.textContent = LP_SHARED.quiz.loadingText;

      window.setTimeout(() => {
        quizState.submitting = false;
        if (submitButton) submitButton.textContent = LP_SHARED.quiz.contactSubmit;

        track(
          'lead_submit',
          buildTrackPayload({
            result_type: quizState.resultType,
            has_phone: Boolean((formData.get('phone') || '').toString().trim()),
          })
        );

        quizState.mode = 'success';
        renderPanels();
      }, 650);
    });
  }

  renderPanels();
}

function initAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function initStickyCta() {
  const sticky = document.getElementById('sticky-cta');
  if (!sticky) return;
  sticky.textContent = LP_SHARED.primaryCta;
}

function initPageMetaFields() {
  const idField = document.getElementById('lp-id-field');
  const slugField = document.getElementById('lp-slug-field');
  if (idField) idField.value = String(currentPage.lp_id);
  if (slugField) slugField.value = currentPage.lp_slug;

  const hiddenIntent = document.getElementById('lp-intent-field');
  if (hiddenIntent) hiddenIntent.value = currentPage.intent_cluster;
}

function renderAll() {
  renderHeader();
  renderHero();
  renderShortBlock();
  renderHow();
  renderPackages();
  renderIncludes();
  renderGuarantee();
  renderFit();
  renderValueProof();
  renderFaq();
  renderFinalCta();
  renderFooter();
  initPageMetaFields();
  initAnchors();
  initStickyCta();
  attachGlobalCtas();
  initQuiz();
}

track('view_lp', buildTrackPayload());
renderAll();
