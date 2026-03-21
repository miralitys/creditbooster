(function () {
  const THANK_YOU_URL = '/thank-you/';
  const PAGE_SLUG = 'business-booster2';
  const reviewData = [
    {
      title: 'Подготовка к подаче',
      caption: 'Клиент делится впечатлением от консультации и первых шагов по подготовке.',
      src: '/business-booster2/Video/feedback_1.mp4',
      poster: '/business-booster2/images/video-posters/feedback_1.png',
      metricsTitle: 'ЯН В ЦИФРАХ',
      metrics: [
        { label: 'Рейтинг', value: '650 -> 740' },
        { label: 'Inquiries', value: '6 снято' },
        { label: 'Срок', value: '21 день' },
      ],
    },
    {
      title: 'Опыт консультации',
      caption: 'Короткая история о консультации, коммуникации и понятном процессе.',
      src: '/business-booster2/Video/feedback_2.mp4',
      poster: '/business-booster2/images/video-posters/feedback_2.png',
      metricsTitle: 'ДМИТРИЙ В ЦИФРАХ',
      metrics: [
        { label: 'Рейтинг', value: '612 -> 701' },
        { label: 'Inquiries', value: '3 снято' },
        { label: 'Срок', value: '14 дней' },
      ],
    },
    {
      title: 'Работа с профилем',
      caption: 'Отзыв о том, как выглядело сопровождение и подготовка к подаче.',
      src: '/business-booster2/Video/feedback_3.mp4',
      poster: '/business-booster2/images/video-posters/feedback_3.png',
      metricsTitle: 'АРТЕМ В ЦИФРАХ',
      metrics: [
        { label: 'Рейтинг', value: '598 -> 684' },
        { label: 'Inquiries', value: '5 снято' },
        { label: 'Срок', value: '18 дней' },
      ],
    },
    {
      title: 'Пошаговое сопровождение',
      caption: 'Клиент рассказывает, что было полезно в процессе и как была выстроена работа.',
      src: '/business-booster2/Video/feedback_4.mp4',
      poster: '/business-booster2/images/video-posters/feedback_4.png',
      metricsTitle: 'АННА В ЦИФРАХ',
      metrics: [
        { label: 'Рейтинг', value: '634 -> 715' },
        { label: 'Inquiries', value: '3 снято' },
        { label: 'Срок', value: '16 дней' },
      ],
    },
    {
      title: 'Коммуникация и поддержка',
      caption: 'Небольшой видеоотзыв о поддержке, обратной связи и понятных рекомендациях.',
      src: '/business-booster2/Video/feedback_5.mp4',
      poster: '/business-booster2/images/video-posters/feedback_5.png',
      metricsTitle: 'МАРАТ В ЦИФРАХ',
      metrics: [
        { label: 'Рейтинг', value: '621 -> 698' },
        { label: 'План', value: '9 шагов' },
        { label: 'Ответ', value: '24 часа' },
      ],
    },
    {
      title: 'Общий результат',
      caption: 'Еще один отзыв о консультации и общем впечатлении от работы с командой.',
      src: '/business-booster2/Video/feedback_6.mp4',
      poster: '/business-booster2/images/video-posters/feedback_6.png',
      metricsTitle: 'СЕРГЕЙ В ЦИФРАХ',
      metrics: [
        { label: 'Рейтинг', value: '667 -> 742' },
        { label: 'Inquiries', value: '2 снято' },
        { label: 'Срок', value: '14 дней' },
      ],
    },
  ];

  const metricToneClasses = ['bb2-review-metric--green', 'bb2-review-metric--amber', 'bb2-review-metric--blue'];
  const reviewStorageKey = 'bb2-last-review-index';
  const utmStorageKey = 'bb2-utm-params';
  const trackedUtmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  let leadSuccessModal = null;
  let leadSuccessLastFocused = null;
  let activeReviewIndex = getInitialReviewIndex();

  function getRandomReviewIndex(excludeIndex = -1) {
    if (reviewData.length <= 1) return 0;

    let nextIndex = Math.floor(Math.random() * reviewData.length);

    while (nextIndex === excludeIndex) {
      nextIndex = Math.floor(Math.random() * reviewData.length);
    }

    return nextIndex;
  }

  function getInitialReviewIndex() {
    let lastIndex = -1;

    try {
      const storedIndex = window.localStorage.getItem(reviewStorageKey);
      const parsedIndex = Number.parseInt(storedIndex || '', 10);

      if (Number.isInteger(parsedIndex) && parsedIndex >= 0 && parsedIndex < reviewData.length) {
        lastIndex = parsedIndex;
      }
    } catch (_error) {
      lastIndex = -1;
    }

    return getRandomReviewIndex(lastIndex);
  }

  function storeActiveReviewIndex(index) {
    try {
      window.localStorage.setItem(reviewStorageKey, String(index));
    } catch (_error) {
      // Ignore storage failures and keep the random fallback behavior.
    }
  }

  function normalizePhone(value) {
    const digits = String(value || '').replace(/\D/g, '').slice(0, 10);
    const p1 = digits.slice(0, 3);
    const p2 = digits.slice(3, 6);
    const p3 = digits.slice(6, 10);
    if (!p1) return '';
    if (!p2) return `(${p1}`;
    if (!p3) return `(${p1}) ${p2}`;
    return `(${p1}) ${p2}-${p3}`;
  }

  function pushDataLayerEvent(eventName, payload) {
    if (typeof window === 'undefined') return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      page_slug: PAGE_SLUG,
      page_path: window.location.pathname,
      page_title: document.title,
      ...payload,
    });
  }

  function emptyUtmParams() {
    return trackedUtmKeys.reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {});
  }

  function readCurrentUtmParams() {
    const utm = emptyUtmParams();
    const params = new URLSearchParams(window.location.search);

    trackedUtmKeys.forEach((key) => {
      utm[key] = String(params.get(key) || '').trim();
    });

    return utm;
  }

  function hasAnyUtmValue(utm) {
    return trackedUtmKeys.some((key) => Boolean(String(utm?.[key] || '').trim()));
  }

  function getStoredUtmParams() {
    const fallback = emptyUtmParams();

    try {
      const raw = window.localStorage.getItem(utmStorageKey);
      if (!raw) return fallback;

      const parsed = JSON.parse(raw);
      return trackedUtmKeys.reduce((acc, key) => {
        acc[key] = String(parsed?.[key] || '').trim();
        return acc;
      }, fallback);
    } catch (_error) {
      return fallback;
    }
  }

  function storeUtmParams(utm) {
    try {
      window.localStorage.setItem(utmStorageKey, JSON.stringify(utm));
    } catch (_error) {
      // Ignore storage failures and keep using current URL params.
    }
  }

  function getTrackedUtmParams() {
    const currentUtm = readCurrentUtmParams();
    const storedUtm = getStoredUtmParams();

    if (hasAnyUtmValue(currentUtm)) {
      const mergedUtm = trackedUtmKeys.reduce((acc, key) => {
        acc[key] = currentUtm[key] || storedUtm[key] || '';
        return acc;
      }, emptyUtmParams());

      storeUtmParams(mergedUtm);
      return mergedUtm;
    }

    return storedUtm;
  }

  function closeLeadSuccessModal() {
    if (!(leadSuccessModal instanceof HTMLElement)) return;
    leadSuccessModal.hidden = true;
    document.body.classList.remove('lead-success-open');

    if (leadSuccessLastFocused instanceof HTMLElement) {
      leadSuccessLastFocused.focus();
    }

    leadSuccessLastFocused = null;
  }

  function ensureLeadSuccessModal() {
    if (leadSuccessModal instanceof HTMLElement) {
      return leadSuccessModal;
    }

    const modal = document.createElement('div');
    modal.className = 'lead-success-modal';
    modal.hidden = true;
    modal.innerHTML = `
      <div class="lead-success-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="lead-success-title">
        <div class="lead-success-modal__icon" aria-hidden="true"></div>
        <p class="lead-success-modal__eyebrow">Заявка отправлена</p>
        <h2 class="lead-success-modal__title" id="lead-success-title">Спасибо, ваша заявка принята.</h2>
        <p class="lead-success-modal__text">Мы свяжемся с вами в ближайшее время.</p>
        <button class="lead-success-modal__action" type="button" data-lead-success-close>
          Закрыть
        </button>
      </div>
    `;

    modal.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target === modal || target.closest('[data-lead-success-close]')) {
        closeLeadSuccessModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && leadSuccessModal instanceof HTMLElement && !leadSuccessModal.hidden) {
        closeLeadSuccessModal();
      }
    });

    document.body.appendChild(modal);
    leadSuccessModal = modal;
    return modal;
  }

  function showLeadSuccessModal() {
    window.location.assign(THANK_YOU_URL);
  }

  function startReviewPlayback(video, posterButton) {
    posterButton.hidden = true;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        posterButton.hidden = false;
      });
    }
  }

  function buildMetricCard(metric, index) {
    const toneClass = metricToneClasses[index % metricToneClasses.length];
    return `
      <article class="bb2-review-metric ${toneClass}">
        <span class="bb2-review-metric__label">${metric.label}</span>
        <strong class="bb2-review-metric__value">${metric.value}</strong>
      </article>
    `;
  }

  function renderReviewDots(activeIndex) {
    const dots = document.querySelector('[data-bb2-review-dots]');
    if (!(dots instanceof HTMLElement)) return;

    dots.innerHTML = reviewData
      .map((review, index) => {
        const activeClass = index === activeIndex ? ' is-active' : '';
        const isPressed = index === activeIndex ? 'true' : 'false';
        const reviewNumber = String(index + 1).padStart(2, '0');

        return `
          <button
            class="bb2-reviews__dot${activeClass}"
            type="button"
            data-bb2-review-index="${index}"
            aria-label="Показать отзыв ${reviewNumber}: ${review.title}"
            aria-pressed="${isPressed}"
          >
            ${reviewNumber}
          </button>
        `;
      })
      .join('');
  }

  function setActiveReview(index, autoplay) {
    const review = reviewData[index];
    const video = document.querySelector('[data-bb2-review-video]');
    const source = video instanceof HTMLVideoElement ? video.querySelector('source') : null;
    const posterButton = document.querySelector('[data-bb2-review-poster]');
    const posterImage = posterButton instanceof HTMLElement ? posterButton.querySelector('img') : null;
    const title = document.querySelector('[data-bb2-review-title]');
    const caption = document.querySelector('[data-bb2-review-caption]');
    const metricsTitle = document.querySelector('[data-bb2-review-metrics-title]');
    const metrics = document.querySelector('[data-bb2-review-metrics]');
    const current = document.querySelector('[data-bb2-review-current]');
    const total = document.querySelector('[data-bb2-review-total]');

    if (
      !review ||
      !(video instanceof HTMLVideoElement) ||
      !(source instanceof HTMLSourceElement) ||
      !(posterButton instanceof HTMLButtonElement) ||
      !(posterImage instanceof HTMLImageElement) ||
      !(title instanceof HTMLElement) ||
      !(caption instanceof HTMLElement) ||
      !(metricsTitle instanceof HTMLElement) ||
      !(metrics instanceof HTMLElement) ||
      !(current instanceof HTMLElement) ||
      !(total instanceof HTMLElement)
    ) {
      return;
    }

    activeReviewIndex = index;
    storeActiveReviewIndex(index);
    video.pause();
    video.currentTime = 0;
    source.src = review.src;
    video.poster = review.poster;
    video.load();
    posterButton.hidden = false;
    posterButton.setAttribute('aria-label', `Воспроизвести отзыв: ${review.title}`);
    posterImage.src = review.poster;
    posterImage.alt = review.title;
    title.textContent = review.title;
    caption.textContent = review.caption;
    metricsTitle.textContent = review.metricsTitle;
    metrics.innerHTML = review.metrics.map(buildMetricCard).join('');
    current.textContent = String(index + 1).padStart(2, '0');
    total.textContent = String(reviewData.length).padStart(2, '0');

    renderReviewDots(index);

    if (autoplay) {
      if (video.readyState >= 2) {
        startReviewPlayback(video, posterButton);
      } else {
        video.addEventListener('loadeddata', () => startReviewPlayback(video, posterButton), { once: true });
      }
    }
  }

  function stepReview(offset, autoplay) {
    const nextIndex = (activeReviewIndex + offset + reviewData.length) % reviewData.length;
    setActiveReview(nextIndex, autoplay);
  }

  function setupReviews() {
    const section = document.getElementById('reviews');
    const video = document.querySelector('[data-bb2-review-video]');
    const posterButton = document.querySelector('[data-bb2-review-poster]');
    const prevButton = document.querySelector('[data-bb2-review-prev]');
    const nextButton = document.querySelector('[data-bb2-review-next]');
    const swipeSurface = section instanceof HTMLElement ? section.querySelector('.bb2-reviews__main') : null;

    if (!(section instanceof HTMLElement) || !(video instanceof HTMLVideoElement) || !(posterButton instanceof HTMLButtonElement)) {
      return;
    }

    setActiveReview(activeReviewIndex, false);

    posterButton.addEventListener('click', () => {
      startReviewPlayback(video, posterButton);
    });

    video.addEventListener('play', () => {
      posterButton.hidden = true;
    });

    video.addEventListener('ended', () => {
      posterButton.hidden = false;
    });

    video.addEventListener('pause', () => {
      if (video.currentTime === 0 || video.ended) {
        posterButton.hidden = false;
      }
    });

    if (prevButton instanceof HTMLButtonElement) {
      prevButton.addEventListener('click', () => {
        stepReview(-1, false);
      });
    }

    if (nextButton instanceof HTMLButtonElement) {
      nextButton.addEventListener('click', () => {
        stepReview(1, false);
      });
    }

    if (swipeSurface instanceof HTMLElement) {
      let touchStartX = 0;
      let touchStartY = 0;
      let touchDeltaX = 0;
      let touchDeltaY = 0;
      let touchStartedAt = 0;

      function resetSwipeState() {
        touchStartX = 0;
        touchStartY = 0;
        touchDeltaX = 0;
        touchDeltaY = 0;
        touchStartedAt = 0;
      }

      swipeSurface.addEventListener(
        'touchstart',
        (event) => {
          if (event.touches.length !== 1) {
            resetSwipeState();
            return;
          }

          const touch = event.touches[0];
          touchStartX = touch.clientX;
          touchStartY = touch.clientY;
          touchDeltaX = 0;
          touchDeltaY = 0;
          touchStartedAt = Date.now();
        },
        { passive: true }
      );

      swipeSurface.addEventListener(
        'touchmove',
        (event) => {
          if (!touchStartedAt || event.touches.length !== 1) return;

          const touch = event.touches[0];
          touchDeltaX = touch.clientX - touchStartX;
          touchDeltaY = touch.clientY - touchStartY;
        },
        { passive: true }
      );

      swipeSurface.addEventListener(
        'touchend',
        () => {
          if (!touchStartedAt) return;

          const elapsed = Date.now() - touchStartedAt;
          const absX = Math.abs(touchDeltaX);
          const absY = Math.abs(touchDeltaY);
          const isHorizontalSwipe = absX >= 56 && absX > absY * 1.2;
          const isFastEnough = elapsed <= 900;

          if (isHorizontalSwipe && isFastEnough) {
            stepReview(touchDeltaX < 0 ? 1 : -1, false);
          }

          resetSwipeState();
        },
        { passive: true }
      );

      swipeSurface.addEventListener('touchcancel', resetSwipeState, { passive: true });
    }

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const button = target.closest('[data-bb2-review-index]');
      if (!(button instanceof HTMLButtonElement)) return;

      const nextIndex = Number.parseInt(button.dataset.bb2ReviewIndex || '', 10);
      if (!Number.isFinite(nextIndex)) return;

      setActiveReview(nextIndex, true);

      if (window.innerWidth < 980) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  function setupLeadForm() {
    const forms = Array.from(document.querySelectorAll('[data-bb2-lead-form]'));
    if (forms.length === 0) return;

    forms.forEach((form, index) => {
      if (!(form instanceof HTMLFormElement)) return;

      const formSource = form.dataset.formSource || `form-${index + 1}`;
      const formId = `bb2-lead-form-${formSource}`;
      const successBox = form.querySelector('.bb2-form__status--success');
      const errorBox = form.querySelector('.bb2-form__status--error');
      const submitButton = form.querySelector('button[type="submit"]');

      function showError(message) {
        if (!errorBox) return;
        errorBox.textContent = message;
        errorBox.hidden = false;
        if (successBox) successBox.hidden = true;
      }

      function showSuccess() {
        if (successBox) successBox.hidden = true;
        if (errorBox) {
          errorBox.hidden = true;
          errorBox.textContent = '';
        }
        showLeadSuccessModal();
      }

      const phoneInput = form.querySelector('input[name="phone"]');
      if (phoneInput instanceof HTMLInputElement) {
        phoneInput.addEventListener('input', () => {
          phoneInput.value = normalizePhone(phoneInput.value);
        });
      }

      form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const name = String(formData.get('name') || '').trim();
        const phone = String(formData.get('phone') || '').trim();
        const consent = Boolean(formData.get('consent'));

        if (name.length < 2) {
          showError('Введите корректное имя.');
          return;
        }

        if (phone.replace(/\D/g, '').length < 10) {
          showError('Введите корректный телефон.');
          return;
        }

        if (!consent) {
          showError('Подтвердите согласие на связь.');
          return;
        }

        if (submitButton instanceof HTMLButtonElement) {
          submitButton.disabled = true;
          submitButton.textContent = 'Отправляем...';
        }

        pushDataLayerEvent('lead_submit_attempt', {
          form_id: formId,
          form_source: formSource,
          has_phone: Boolean(phone),
        });

        try {
          const utm = getTrackedUtmParams();
          const response = await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              phone,
              source: 'website|business-booster2',
              pageUrl: window.location.href,
              pageTitle: document.title,
              context: {
                page_variant: 'business_booster2',
                page_slug: 'business-booster2',
                form_source: formSource,
                utm,
              },
            }),
          });

          const payload = await response.json().catch(() => ({}));
          if (!response.ok || !payload.ok) {
            throw new Error(payload.error || payload.details || 'Не удалось отправить заявку.');
          }

          form.reset();
          pushDataLayerEvent('lead_submit_success', {
            form_id: formId,
            form_source: formSource,
            lead_type: 'consultation',
            has_phone: Boolean(phone),
          });
          pushDataLayerEvent('Formsuccess', {
            form_id: formId,
            form_source: formSource,
            lead_type: 'consultation',
            has_phone: Boolean(phone),
          });
          window.setTimeout(showSuccess, 150);
        } catch (error) {
          pushDataLayerEvent('lead_submit_error', {
            form_id: formId,
            form_source: formSource,
          });
          showError(error instanceof Error ? error.message : 'Не удалось отправить заявку.');
        } finally {
          if (submitButton instanceof HTMLButtonElement) {
            submitButton.disabled = false;
            submitButton.textContent = 'Получить консультацию';
          }
        }
      });
    });
  }

  function setupClarityTimer() {
    const timer = document.querySelector('[data-bb2-clarity-timer]');
    if (!(timer instanceof HTMLElement)) return;

    let secondsLeft = 30;

    function renderTime() {
      const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
      const seconds = String(secondsLeft % 60).padStart(2, '0');
      timer.textContent = `${minutes}:${seconds}`;
    }

    renderTime();

    window.setInterval(() => {
      secondsLeft = secondsLeft > 0 ? secondsLeft - 1 : 30;
      renderTime();
    }, 1000);
  }

  pushDataLayerEvent('landing_view', {
    page_type: 'landing',
  });
  setupReviews();
  setupLeadForm();
  setupClarityTimer();
})();
