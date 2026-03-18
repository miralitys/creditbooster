const WHY_VIDEO_ID = "-I_BtqI9Dnc";
const REVIEW_SOURCE = "website|business-booster3";

const reviewData = [
  {
    client: "Ян",
    title: "Подготовка к подаче",
    caption: "Клиент рассказывает, что дал первый разбор и как стало понятнее, с чего начинать.",
    src: "Video/feedback_1.mp4",
    poster: "images/video-posters/feedback_1.png",
    metricsTitle: "ЯН В ЦИФРАХ",
    metrics: [
      { label: "Рейтинг", value: "650 -> 740" },
      { label: "Запросы", value: "6 снято" },
      { label: "Срок", value: "21 день" },
    ],
  },
  {
    client: "Дмитрий",
    title: "Опыт консультации",
    caption: "Короткая история о консультации, коммуникации и понятном процессе.",
    src: "Video/feedback_2.mp4",
    poster: "images/video-posters/feedback_2.png",
    metricsTitle: "ДМИТРИЙ В ЦИФРАХ",
    metrics: [
      { label: "Рейтинг", value: "612 -> 701" },
      { label: "Запросы", value: "3 снято" },
      { label: "Срок", value: "14 дней" },
    ],
  },
  {
    client: "Артем",
    title: "Работа с профилем",
    caption: "Отзыв о том, как выглядело сопровождение и подготовка к подаче.",
    src: "Video/feedback_3.mp4",
    poster: "images/video-posters/feedback_3.png",
    metricsTitle: "АРТЕМ В ЦИФРАХ",
    metrics: [
      { label: "Рейтинг", value: "598 -> 684" },
      { label: "Запросы", value: "5 снято" },
      { label: "Срок", value: "18 дней" },
    ],
  },
  {
    client: "Анна",
    title: "Пошаговое сопровождение",
    caption: "Клиент рассказывает, что было полезно в процессе и как была выстроена работа.",
    src: "Video/feedback_4.mp4",
    poster: "images/video-posters/feedback_4.png",
    metricsTitle: "АННА В ЦИФРАХ",
    metrics: [
      { label: "Рейтинг", value: "634 -> 715" },
      { label: "Запросы", value: "3 снято" },
      { label: "Срок", value: "16 дней" },
    ],
  },
  {
    client: "Марат",
    title: "Коммуникация и поддержка",
    caption: "Небольшой видеоотзыв о поддержке, обратной связи и понятных рекомендациях.",
    src: "Video/feedback_5.mp4",
    poster: "images/video-posters/feedback_5.png",
    metricsTitle: "МАРАТ В ЦИФРАХ",
    metrics: [
      { label: "Рейтинг", value: "621 -> 698" },
      { label: "План", value: "9 шагов" },
      { label: "Ответ", value: "24 часа" },
    ],
  },
  {
    client: "Сергей",
    title: "Общий результат",
    caption: "Еще один отзыв о консультации и общем впечатлении от работы с командой.",
    src: "Video/feedback_6.mp4",
    poster: "images/video-posters/feedback_6.png",
    metricsTitle: "СЕРГЕЙ В ЦИФРАХ",
    metrics: [
      { label: "Рейтинг", value: "667 -> 742" },
      { label: "Запросы", value: "2 снято" },
      { label: "Срок", value: "14 дней" },
    ],
  },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let leadSuccessModal = null;
let leadSuccessLastFocused = null;

function normalizePhone(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 10);
}

function closeLeadSuccessModal() {
  if (!(leadSuccessModal instanceof HTMLElement)) return;
  leadSuccessModal.hidden = true;
  document.body.classList.remove("lead-success-open");

  if (leadSuccessLastFocused instanceof HTMLElement) {
    leadSuccessLastFocused.focus();
  }

  leadSuccessLastFocused = null;
}

function ensureLeadSuccessModal() {
  if (leadSuccessModal instanceof HTMLElement) {
    return leadSuccessModal;
  }

  const modal = document.createElement("div");
  modal.className = "lead-success-modal";
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

  modal.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target === modal || target.closest("[data-lead-success-close]")) {
      closeLeadSuccessModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && leadSuccessModal instanceof HTMLElement && !leadSuccessModal.hidden) {
      closeLeadSuccessModal();
    }
  });

  document.body.appendChild(modal);
  leadSuccessModal = modal;
  return modal;
}

function showLeadSuccessModal() {
  const modal = ensureLeadSuccessModal();
  leadSuccessLastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  modal.hidden = false;
  document.body.classList.add("lead-success-open");

  const closeButton = modal.querySelector("[data-lead-success-close]");
  if (closeButton instanceof HTMLButtonElement) {
    closeButton.focus();
  }
}

function formatPhone(value) {
  const digits = normalizePhone(value);
  const part1 = digits.slice(0, 3);
  const part2 = digits.slice(3, 6);
  const part3 = digits.slice(6, 10);

  if (!part1) return "";
  if (!part2) return `(${part1}`;
  if (!part3) return `(${part1}) ${part2}`;
  return `(${part1}) ${part2}-${part3}`;
}

function buildMetricCard(metric) {
  if (String(metric.value).includes("->")) {
    const [fromValue, toValue] = String(metric.value)
      .split("->")
      .map((part) => part.trim())
      .filter(Boolean);

    return `
      <article class="metric-card metric-card--rating">
        <span class="metric-card__label">${metric.label}</span>
        <div class="metric-card__rating-grid">
          <div class="metric-card__rating-col">
            <span class="metric-card__pill">Было</span>
            <strong class="metric-card__number">${fromValue}</strong>
          </div>
          <span class="metric-card__arrow" aria-hidden="true">→</span>
          <div class="metric-card__rating-col">
            <span class="metric-card__pill metric-card__pill--accent">Стало</span>
            <strong class="metric-card__number metric-card__number--accent">${toValue}</strong>
          </div>
        </div>
      </article>
    `;
  }

  const numericMatch = String(metric.value).match(/^([\d.,]+)\s+(.+)$/u);
  if (numericMatch) {
    return `
      <article class="metric-card">
        <span class="metric-card__label">${metric.label}</span>
        <div class="metric-card__stat">
          <strong class="metric-card__stat-value">${numericMatch[1]}</strong>
          <span class="metric-card__stat-unit">${numericMatch[2]}</span>
        </div>
      </article>
    `;
  }

  return `
    <article class="metric-card">
      <span class="metric-card__label">${metric.label}</span>
      <div class="metric-card__stat">
        <strong class="metric-card__stat-value">${metric.value}</strong>
      </div>
    </article>
  `;
}

function renderReviewList(activeIndex) {
  const list = document.querySelector("[data-review-list]");
  if (!(list instanceof HTMLElement)) return;

  list.innerHTML = reviewData
    .map((review, index) => {
      const activeClass = index === activeIndex ? " is-active" : "";
      const pressed = index === activeIndex ? "true" : "false";

      return `
        <button class="review-card${activeClass}" type="button" data-review-index="${index}" aria-pressed="${pressed}">
          <span class="review-card__thumb">
            <img src="${review.poster}" alt="${review.title}" loading="lazy" decoding="async" />
            <span class="review-card__play" aria-hidden="true">▶</span>
          </span>
          <span class="review-card__body">
            <span class="review-card__label">${review.client}</span>
            <span class="review-card__title">${review.title}</span>
            <span class="review-card__text">${review.caption}</span>
          </span>
        </button>
      `;
    })
    .join("");
}

function setActiveReview(index, autoplay = false) {
  const review = reviewData[index];
  const video = document.querySelector("[data-review-video]");
  const source = video instanceof HTMLVideoElement ? video.querySelector("source") : null;
  const posterButton = document.querySelector("[data-review-poster]");
  const posterImage =
    posterButton instanceof HTMLButtonElement ? posterButton.querySelector("img") : null;
  const title = document.querySelector("[data-review-title]");
  const caption = document.querySelector("[data-review-caption]");
  const client = document.querySelector("[data-review-client]");
  const metricsTitle = document.querySelector("[data-review-metrics-title]");
  const metrics = document.querySelector("[data-review-metrics]");
  const counter = document.querySelector("[data-review-current]");

  if (
    !review ||
    !(video instanceof HTMLVideoElement) ||
    !(source instanceof HTMLSourceElement) ||
    !(posterButton instanceof HTMLButtonElement) ||
    !(posterImage instanceof HTMLImageElement) ||
    !(title instanceof HTMLElement) ||
    !(caption instanceof HTMLElement) ||
    !(client instanceof HTMLElement) ||
    !(metricsTitle instanceof HTMLElement) ||
    !(metrics instanceof HTMLElement) ||
    !(counter instanceof HTMLElement)
  ) {
    return;
  }

  video.pause();
  video.currentTime = 0;
  source.src = review.src;
  video.poster = review.poster;
  video.load();
  posterButton.hidden = false;
  posterButton.setAttribute("aria-label", `Воспроизвести отзыв: ${review.title}`);
  posterImage.src = review.poster;
  posterImage.alt = review.title;
  client.textContent = review.client;
  title.textContent = review.title;
  caption.textContent = review.caption;
  metricsTitle.textContent = review.metricsTitle;
  metrics.innerHTML = review.metrics.map(buildMetricCard).join("");
  counter.textContent = String(index + 1).padStart(2, "0");

  renderReviewList(index);

  if (autoplay) {
    const playVideo = () => {
      posterButton.hidden = true;
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          posterButton.hidden = false;
        });
      }
    };

    if (video.readyState >= 2) {
      playVideo();
    } else {
      video.addEventListener("loadeddata", playVideo, { once: true });
    }
  }
}

function setupReviews() {
  const video = document.querySelector("[data-review-video]");
  const posterButton = document.querySelector("[data-review-poster]");
  const stage = document.querySelector(".reviews-stage");
  if (!(video instanceof HTMLVideoElement) || !(posterButton instanceof HTMLButtonElement)) return;

  setActiveReview(0);

  posterButton.addEventListener("click", () => {
    posterButton.hidden = true;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        posterButton.hidden = false;
      });
    }
  });

  video.addEventListener("ended", () => {
    posterButton.hidden = false;
  });

  video.addEventListener("pause", () => {
    if (video.currentTime === 0 || video.ended) {
      posterButton.hidden = false;
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const button = target.closest("[data-review-index]");
    if (!(button instanceof HTMLButtonElement)) return;

    const nextIndex = Number.parseInt(button.dataset.reviewIndex || "", 10);
    if (!Number.isFinite(nextIndex)) return;

    setActiveReview(nextIndex, true);

    if (window.innerWidth < 960 && stage instanceof HTMLElement) {
      stage.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

function setupProofVideo() {
  const root = document.querySelector("[data-proof-video]");
  if (!(root instanceof HTMLElement)) return;

  const trigger = root.querySelector(".proof-media__trigger");
  if (!(trigger instanceof HTMLButtonElement)) return;

  trigger.addEventListener("click", () => {
    const caption = root.querySelector(".proof-media__caption");
    const captionMarkup = caption instanceof HTMLElement ? caption.outerHTML : "";

    root.innerHTML = `
      <iframe
        src="https://www.youtube-nocookie.com/embed/${WHY_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1"
        title="Видео об основных ошибках при работе с кредитной историей"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
      ${captionMarkup}
    `;
  });
}

function setupNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!(toggle instanceof HTMLButtonElement) || !(nav instanceof HTMLElement)) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupScrollButtons() {
  document.querySelectorAll("[data-scroll-form]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const target = document.getElementById("application");
      const firstField = target ? target.querySelector('input[name="Name"]') : null;
      if (!(target instanceof HTMLElement)) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => {
        if (firstField instanceof HTMLInputElement) {
          firstField.focus({ preventScroll: true });
        }
      }, 380);
    });
  });
}

function showFormMessage(form, message, isError) {
  const box = form.querySelector("[data-form-message]");
  if (!(box instanceof HTMLElement)) return;
  box.hidden = false;
  box.textContent = message;
  box.dataset.state = isError ? "error" : "success";
}

function clearFormMessage(form) {
  const box = form.querySelector("[data-form-message]");
  if (!(box instanceof HTMLElement)) return;
  box.hidden = true;
  box.textContent = "";
  delete box.dataset.state;
}

async function sendLead(values, placement) {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: values.name,
      email: values.email,
      phone: values.phone,
      source: REVIEW_SOURCE,
      tcpaRequired: true,
      tcpaAccepted: values.consent,
      pageUrl: window.location.href,
      pageTitle: document.title,
      context: {
        page_variant: "business_booster3",
        page_slug: "business-booster3",
        page_path: window.location.pathname,
        form_placement: placement,
      },
    }),
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch (_error) {
    payload = null;
  }

  if (!response.ok || (payload && payload.ok === false)) {
    throw new Error(
      payload && (payload.error || payload.details)
        ? payload.error || payload.details
        : "Не удалось отправить заявку."
    );
  }
}

function bindLeadForm(form) {
  if (!(form instanceof HTMLFormElement)) return;

  const phoneField = form.querySelector('input[name="Phone"]');
  if (phoneField instanceof HTMLInputElement) {
    phoneField.addEventListener("input", () => {
      phoneField.value = formatPhone(phoneField.value);
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearFormMessage(form);

    const nameField = form.querySelector('input[name="Name"]');
    const emailField = form.querySelector('input[name="email"]');
    const phoneInput = form.querySelector('input[name="Phone"]');
    const consentField = form.querySelector('input[name="Checkbox"]');
    const submit = form.querySelector('button[type="submit"]');

    const values = {
      name: nameField instanceof HTMLInputElement ? nameField.value.trim() : "",
      email: emailField instanceof HTMLInputElement ? emailField.value.trim() : "",
      phone: phoneInput instanceof HTMLInputElement ? phoneInput.value.trim() : "",
      consent: !(consentField instanceof HTMLInputElement) || consentField.checked,
    };

    if (values.name.length < 2) {
      showFormMessage(form, "Введите корректное имя.", true);
      return;
    }

    if (!EMAIL_RE.test(values.email)) {
      showFormMessage(form, "Введите корректный адрес электронной почты.", true);
      return;
    }

    if (normalizePhone(values.phone).length !== 10) {
      showFormMessage(form, "Укажите телефон в американском формате (10 цифр).", true);
      return;
    }

    if (!values.consent) {
      showFormMessage(form, "Нужно согласие на обработку персональных данных.", true);
      return;
    }

    const placement = String(form.dataset.formPlacement || "primary");
    const defaultLabel =
      submit instanceof HTMLButtonElement ? submit.textContent.trim() || "Отправить" : "Отправить";
    const loadingLabel =
      submit instanceof HTMLButtonElement
        ? String(submit.dataset.labelLoading || "Отправляем...")
        : "Отправляем...";

    if (submit instanceof HTMLButtonElement) {
      submit.disabled = true;
      submit.textContent = loadingLabel;
    }

    try {
      await sendLead(values, placement);
      form.reset();
      if (phoneInput instanceof HTMLInputElement) {
        phoneInput.value = "";
      }
      const consentReset = form.querySelector('input[name="Checkbox"]');
      if (consentReset instanceof HTMLInputElement) {
        consentReset.checked = true;
      }
      clearFormMessage(form);
      showLeadSuccessModal();
    } catch (error) {
      showFormMessage(
        form,
        error instanceof Error ? error.message : "Не удалось отправить заявку.",
        true
      );
    } finally {
      if (submit instanceof HTMLButtonElement) {
        submit.disabled = false;
        submit.textContent = defaultLabel;
      }
    }
  });
}

function setupLeadForms() {
  document.querySelectorAll(".lead-form").forEach((form) => {
    bindLeadForm(form);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupNav();
  setupScrollButtons();
  setupProofVideo();
  setupReviews();
  setupLeadForms();
});
