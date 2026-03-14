(function () {
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
  let activeReviewIndex = reviewData.length - 1;

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

  function renderReviewList(activeIndex) {
    const list = document.querySelector('[data-bb2-review-list]');
    if (!(list instanceof HTMLElement)) return;

    const visibleCount = 4;
    const start = Math.min(Math.max(activeIndex - 2, 0), Math.max(reviewData.length - visibleCount, 0));
    const visibleReviews = reviewData.slice(start, start + visibleCount);

    list.innerHTML = visibleReviews
      .map((review, offset) => {
        const index = start + offset;
        const activeClass = index === activeIndex ? ' is-active' : '';
        const isPressed = index === activeIndex ? 'true' : 'false';
        const reviewNumber = String(index + 1).padStart(2, '0');

        return `
          <button
            class="bb2-reviews__item${activeClass}"
            type="button"
            data-bb2-review-index="${index}"
            aria-pressed="${isPressed}"
          >
            <span class="bb2-reviews__item-thumb">
              <img src="${review.poster}" alt="${review.title}" loading="lazy" decoding="async" />
              <span aria-hidden="true">▶</span>
            </span>
            <span class="bb2-reviews__item-meta">
              <span class="bb2-reviews__item-label">Отзыв ${reviewNumber}</span>
              <span class="bb2-reviews__item-title">${review.title}</span>
            </span>
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

    renderReviewList(index);

    if (autoplay) {
      if (video.readyState >= 2) {
        startReviewPlayback(video, posterButton);
      } else {
        video.addEventListener('loadeddata', () => startReviewPlayback(video, posterButton), { once: true });
      }
    }
  }

  function setupReviews() {
    const section = document.getElementById('reviews');
    const video = document.querySelector('[data-bb2-review-video]');
    const posterButton = document.querySelector('[data-bb2-review-poster]');
    const nextButton = document.querySelector('[data-bb2-review-next]');

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

    if (nextButton instanceof HTMLButtonElement) {
      nextButton.addEventListener('click', () => {
        setActiveReview((activeReviewIndex + 1) % reviewData.length, false);
      });
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
    const form = document.getElementById('bb2-lead-form');
    if (!form) return;

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
      if (successBox) successBox.hidden = false;
      if (errorBox) {
        errorBox.hidden = true;
        errorBox.textContent = '';
      }
    }

    const phoneInput = form.querySelector('input[name="phone"]');
    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        phoneInput.value = normalizePhone(phoneInput.value);
      });
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const name = String(formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const phone = String(formData.get('phone') || '').trim();
      const consent = Boolean(formData.get('consent'));

      if (name.length < 2) {
        showError('Введите корректное имя.');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('Введите корректный email.');
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

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Отправляем...';
      }

      try {
        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            phone,
            source: 'website|business-booster2',
            pageUrl: window.location.href,
            pageTitle: document.title,
            context: {
              page_variant: 'business_booster2',
              page_slug: 'business-booster2',
            },
          }),
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok || !payload.ok) {
          throw new Error(payload.error || payload.details || 'Не удалось отправить заявку.');
        }

        form.reset();
        showSuccess();
      } catch (error) {
        showError(error instanceof Error ? error.message : 'Не удалось отправить заявку.');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Получить консультацию';
        }
      }
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

  setupReviews();
  setupLeadForm();
  setupClarityTimer();
})();
