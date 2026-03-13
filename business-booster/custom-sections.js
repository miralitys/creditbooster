(function () {
  const HEADER_DESKTOP_ID = '756671709';
  const HEADER_ID = '756671776';
  const HERO_DESKTOP_ID = '375320421';
  const HERO_MOBILE_ID = '376766055';
  const SECOND_SECTION_ID = 'rec375352383';
  const THIRD_SECTION_ID = 'rec375607205';
  const WHY_DESKTOP_ID = '375690015';
  const WHY_MOBILE_ID = '376777237';
  const INLINE_FORM_DESKTOP_ID = '727595470';
  const INLINE_FORM_MOBILE_ID = '727592444';
  const POPUP_FORM_IDS = ['375704275', '375711892'];
  const PLAYLIST_ID = '376684753';
  const PLAYLIST_HASH_RE = /^#tlection=\d+_\d+$/i;
  const WHY_YOUTUBE_ID = '-I_BtqI9Dnc';

  const secondSection = {
    eyebrow: 'Credit Booster',
    title: 'Почему нам доверяют',
    intro:
      'Опираемся на опыт, понятный процесс и спокойную коммуникацию, чтобы подготовка к подаче выглядела для клиента предсказуемо и аккуратно.',
    points: ['Более 17 лет на рынке', 'Более 20,000 довольных клиентов', 'Гарантия результата'],
    services: [
      {
        title: 'Помощь с финансированием',
        text: 'Помогаем подготовиться к подаче и понять, какие шаги могут повысить шансы на одобрение.',
        bullets: [
          'Оцениваем текущий credit profile',
          'Подсказываем, как сократить мешающие факторы',
          'Формируем понятную стратегию подготовки',
        ],
      },
      {
        title: 'Исправление кредитной истории',
        text: 'Разбираем, что именно мешает профилю, и помогаем двигаться к более сильной кредитной картине.',
        bullets: [
          'Проверяем credit report',
          'Выявляем спорные записи и inquiries',
          'Готовим последовательный план улучшений',
        ],
      },
    ],
  };

  const slides = [
    {
      title: 'Подготовка к подаче',
      src: 'Video/feedback_1.mp4',
      poster: 'images/video-posters/feedback_1.png',
      caption: 'Клиент делится впечатлением от консультации и первых шагов по подготовке.',
    },
    {
      title: 'Опыт консультации',
      src: 'Video/feedback_2.mp4',
      poster: 'images/video-posters/feedback_2.png',
      caption: 'Короткая история о консультации, коммуникации и понятном процессе.',
    },
    {
      title: 'Работа с профилем',
      src: 'Video/feedback_3.mp4',
      poster: 'images/video-posters/feedback_3.png',
      caption: 'Отзыв о том, как выглядело сопровождение и подготовка к подаче.',
    },
    {
      title: 'Пошаговое сопровождение',
      src: 'Video/feedback_4.mp4',
      poster: 'images/video-posters/feedback_4.png',
      caption: 'Клиент рассказывает, что было полезно в процессе и как была выстроена работа.',
    },
    {
      title: 'Коммуникация и поддержка',
      src: 'Video/feedback_5.mp4',
      poster: 'images/video-posters/feedback_5.png',
      caption: 'Небольшой видеоотзыв о поддержке, обратной связи и понятных рекомендациях.',
    },
    {
      title: 'Общий результат',
      src: 'Video/feedback_6.mp4',
      poster: 'images/video-posters/feedback_6.png',
      caption: 'Еще один отзыв о консультации и общем впечатлении от работы с командой.',
    },
  ];

  const playlistTitleMap = new Map([
    ['Our Partners. Constantin Gurovich', 'Видеоотзыв: Константин'],
    ['Our Partners. Anna', 'Видеоотзыв: Анна'],
    ['Credit Booster - Serbian Client Testimonial', 'Видеоотзыв клиента'],
  ]);

  const playlistDescriptionMap = new Map([
    ['Видеоотзыв: Константин', 'История о консультации, понятном процессе и сопровождении по шагам.'],
    ['Видеоотзыв: Анна', 'Короткий отзыв о коммуникации, подготовке и общем впечатлении от работы.'],
    ['Видеоотзыв клиента', 'Небольшой кейс о том, как выглядело сопровождение и взаимодействие с командой.'],
  ]);

  function formatSeconds(value) {
    return `00:${String(value).padStart(2, '0')}`;
  }

  function extractYouTubeId(url) {
    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.hostname.includes('youtu.be')) {
        return parsedUrl.pathname.replace(/^\/+/, '').split('/')[0];
      }

      if (parsedUrl.searchParams.has('v')) {
        return parsedUrl.searchParams.get('v');
      }

      const pathMatch = parsedUrl.pathname.match(/\/(?:embed|shorts)\/([^/?#]+)/);
      if (pathMatch) {
        return pathMatch[1];
      }
    } catch (error) {
      return '';
    }

    return '';
  }

  function setText(selectors, text) {
    const selectorList = Array.isArray(selectors) ? selectors : [selectors];
    selectorList.forEach((selector) => {
      document.querySelectorAll(selector).forEach((node) => {
        node.textContent = text;
      });
    });
  }

  function setHTML(selectors, html) {
    const selectorList = Array.isArray(selectors) ? selectors : [selectors];
    selectorList.forEach((selector) => {
      document.querySelectorAll(selector).forEach((node) => {
        node.innerHTML = html;
      });
    });
  }

  function addClass(recordIds, className) {
    recordIds.forEach((recordId) => {
      const normalizedRecordId = recordId.startsWith('rec') ? recordId : `rec${recordId}`;
      const record = document.getElementById(normalizedRecordId);
      if (record instanceof HTMLElement) {
        record.classList.add(className);
      }
    });
  }

  function syncT396RecordHeight(recordId, options = {}) {
    const { extra = 32, minHeight = 0 } = options;
    const normalizedRecordId = recordId.startsWith('rec') ? recordId : `rec${recordId}`;
    const record = document.getElementById(normalizedRecordId);
    if (!(record instanceof HTMLElement)) return;
    if (window.getComputedStyle(record).display === 'none') return;

    const artboard = record.querySelector('.t396__artboard');
    const carrier = record.querySelector('.t396__carrier');
    const filter = record.querySelector('.t396__filter');
    if (!(artboard instanceof HTMLElement) || !(carrier instanceof HTMLElement) || !(filter instanceof HTMLElement)) {
      return;
    }

    const artboardRect = artboard.getBoundingClientRect();
    let maxBottom = 0;

    Array.from(artboard.children).forEach((child) => {
      if (!(child instanceof HTMLElement)) return;
      if (child.classList.contains('t396__carrier') || child.classList.contains('t396__filter')) return;

      const styles = window.getComputedStyle(child);
      if (styles.display === 'none' || styles.visibility === 'hidden') return;

      if (child.classList.contains('bb-second-layout')) {
        Array.from(child.children).forEach((inner) => {
          if (!(inner instanceof HTMLElement)) return;

          const innerStyles = window.getComputedStyle(inner);
          if (innerStyles.display === 'none' || innerStyles.visibility === 'hidden') return;

          const innerRect = inner.getBoundingClientRect();
          const innerBottom = innerRect.bottom - artboardRect.top;

          if (Number.isFinite(innerBottom)) {
            maxBottom = Math.max(maxBottom, innerBottom);
          }
        });
        return;
      }

      const rect = child.getBoundingClientRect();
      const bottom = rect.bottom - artboardRect.top;

      if (Number.isFinite(bottom)) {
        maxBottom = Math.max(maxBottom, bottom);
      }
    });

    const nextHeight = Math.max(minHeight, Math.ceil(maxBottom + extra));
    if (!nextHeight) return;

    artboard.style.setProperty('height', `${nextHeight}px`, 'important');
    carrier.style.setProperty('height', `${nextHeight}px`, 'important');
    filter.style.setProperty('height', `${nextHeight}px`, 'important');
  }

  function syncMatchingT396Heights(recordIds, options = {}) {
    const { target = null, minHeight = 0, maxHeight = Number.POSITIVE_INFINITY } = options;
    const records = recordIds
      .map((recordId) => {
        const normalizedRecordId = recordId.startsWith('rec') ? recordId : `rec${recordId}`;
        const record = document.getElementById(normalizedRecordId);
        if (!(record instanceof HTMLElement)) return null;
        if (window.getComputedStyle(record).display === 'none') return null;

        const artboard = record.querySelector('.t396__artboard');
        const carrier = record.querySelector('.t396__carrier');
        const filter = record.querySelector('.t396__filter');
        if (!(artboard instanceof HTMLElement) || !(carrier instanceof HTMLElement) || !(filter instanceof HTMLElement)) {
          return null;
        }

        return { artboard, carrier, filter };
      })
      .filter(Boolean);

    if (!records.length) return;

    const measuredHeight = records.reduce((maxHeightValue, parts) => {
      const currentHeight = Math.ceil(parts.artboard.getBoundingClientRect().height);
      return Math.max(maxHeightValue, currentHeight);
    }, 0);

    const desiredHeight = Math.min(
      maxHeight,
      Math.max(minHeight, target == null ? measuredHeight : target)
    );

    records.forEach(({ artboard, carrier, filter }) => {
      artboard.style.setProperty('height', `${desiredHeight}px`, 'important');
      carrier.style.setProperty('height', `${desiredHeight}px`, 'important');
      filter.style.setProperty('height', `${desiredHeight}px`, 'important');
    });
  }

  function syncRefinedLayout() {
    const isNarrowMobile = window.innerWidth <= 639;
    syncT396RecordHeight(SECOND_SECTION_ID, {
      extra: isNarrowMobile ? 28 : 12,
      minHeight: isNarrowMobile ? 1180 : 0,
    });
    syncT396RecordHeight(THIRD_SECTION_ID, { extra: 18, minHeight: 680 });
    syncT396RecordHeight(WHY_DESKTOP_ID, { extra: 30, minHeight: 700 });
    syncT396RecordHeight(WHY_MOBILE_ID, { extra: 28, minHeight: isNarrowMobile ? 760 : 580 });
    syncT396RecordHeight(INLINE_FORM_DESKTOP_ID, { extra: 8, minHeight: 272 });
    syncT396RecordHeight(INLINE_FORM_MOBILE_ID, {
      extra: isNarrowMobile ? 26 : 18,
      minHeight: isNarrowMobile ? 820 : 460,
    });
    syncMatchingT396Heights([INLINE_FORM_DESKTOP_ID, INLINE_FORM_MOBILE_ID], {
      target: window.innerWidth >= 960 ? 360 : isNarrowMobile ? 820 : 560,
      minHeight: window.innerWidth >= 960 ? 360 : isNarrowMobile ? 820 : 560,
      maxHeight: window.innerWidth >= 960 ? 360 : isNarrowMobile ? 820 : 560,
    });
  }

  function clearPlaylistHash() {
    if (!PLAYLIST_HASH_RE.test(window.location.hash)) return false;

    const nextUrl = `${window.location.pathname}${window.location.search}`;
    if (window.history && typeof window.history.replaceState === 'function') {
      window.history.replaceState(null, '', nextUrl);
    } else {
      window.location.hash = '';
    }

    return true;
  }

  function normalizeInitialLandingPosition() {
    if (!clearPlaylistHash()) return;

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto',
      });
    };

    scrollToTop();
    window.requestAnimationFrame(scrollToTop);
    [160, 520, 1100].forEach((delay) => {
      window.setTimeout(scrollToTop, delay);
    });
  }

  function updateMetadata() {
    document.title = 'Credit Booster | Подготовка кредитного профиля к финансированию';

    const metaDescription =
      'Помогаем разобраться с credit profile, снизить мешающие факторы и понять, как безопаснее двигаться к одобрению финансирования.';

    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta instanceof HTMLMetaElement) {
      descriptionMeta.content = metaDescription;
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle instanceof HTMLMetaElement) {
      ogTitle.content = document.title;
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription instanceof HTMLMetaElement) {
      ogDescription.content = metaDescription;
    }
  }

  function refineHeroSection() {
    addClass([HERO_DESKTOP_ID, HERO_MOBILE_ID], 'bb-hero-record');

    setHTML(
      [
        `#rec${HERO_DESKTOP_ID} .tn-elem[data-elem-id="1636039346506"] .tn-atom`,
        `#rec${HERO_MOBILE_ID} .tn-elem[data-elem-id="1636039346506"] .tn-atom`,
      ],
      'Помогаем повысить шансы на одобрение финансирования'
    );

    setHTML(
      [
        `#rec${HERO_DESKTOP_ID} .tn-elem[data-elem-id="1636039346517"] .tn-atom`,
        `#rec${HERO_MOBILE_ID} .tn-elem[data-elem-id="1636039346517"] .tn-atom`,
      ],
      'Удалим твои Experian inquiry за 48 часов<br>Гарантируем результат'
    );

    setText(
      [
        `#rec${HERO_DESKTOP_ID} .tn-elem[data-elem-id="1636040098014"] .tn-atom__button-text`,
        `#rec${HERO_MOBILE_ID} .tn-elem[data-elem-id="1636040098014"] .tn-atom__button-text`,
        `#rec${HEADER_DESKTOP_ID} .t-btnflex__text`,
        `#rec${HEADER_ID} .t-btnflex__text`,
      ],
      'Получить консультацию'
    );

    document
      .querySelectorAll(
        `#rec${HERO_DESKTOP_ID} .tn-elem[data-elem-id="1636040098014"], ` +
          `#rec${HERO_MOBILE_ID} .tn-elem[data-elem-id="1636040098014"]`
      )
      .forEach((button) => button.classList.add('bb-primary-button'));

    document
      .querySelectorAll(`#rec${HEADER_DESKTOP_ID} .t228__right_buttons_but, #rec${HEADER_ID} .t228__right_buttons_but`)
      .forEach((button) => button.classList.add('bb-secondary-button'));
  }

  function refineWhyChooseSection() {
    addClass([WHY_DESKTOP_ID, WHY_MOBILE_ID], 'bb-why-record');

    setHTML(
      [
        `#rec${WHY_DESKTOP_ID} .tn-elem[data-elem-id="1636123691269"] .tn-atom`,
        `#rec${WHY_MOBILE_ID} .tn-elem[data-elem-id="1636123691269"] .tn-atom`,
      ],
      'Почему выбирают <strong style="color: rgb(80, 94, 206);">credit booster</strong>?'
    );

    setHTML(
      `#rec${WHY_DESKTOP_ID} .tn-elem[data-elem-id="1636124798371"] .tn-atom`,
      'Работаем с частными клиентами и бизнесом'
    );
    setText(
      `#rec${WHY_DESKTOP_ID} .tn-elem[data-elem-id="1636124798375"] .tn-atom`,
      'Выстраиваем понятный план действий под вашу задачу и текущую ситуацию.'
    );

    setHTML(`#rec${WHY_DESKTOP_ID} .tn-elem[data-elem-id="1636124853223"] .tn-atom`, 'Более 17 лет опыта');
    setText(
      `#rec${WHY_DESKTOP_ID} .tn-elem[data-elem-id="1636124853224"] .tn-atom`,
      'Помогаем понять текущее состояние профиля и подготовиться к подаче спокойнее.'
    );

    setHTML(
      `#rec${WHY_DESKTOP_ID} .tn-elem[data-elem-id="1636124877326"] .tn-atom`,
      'Прозрачные условия работы'
    );
    setText(
      `#rec${WHY_DESKTOP_ID} .tn-elem[data-elem-id="1636124877330"] .tn-atom`,
      'Объясняем, какие шаги рекомендуем, какие сроки реалистичны и как будет выстроена работа.'
    );

    setText(
      [
        `#rec${WHY_DESKTOP_ID} .tn-elem[data-elem-id="1636123691300"] .tn-atom`,
        `#rec${WHY_MOBILE_ID} .tn-elem[data-elem-id="1636123691300"] .tn-atom`,
      ],
      'Опираемся на анализ credit profile и опыт подготовки к подаче, чтобы вы лучше понимали, какие шаги действительно помогают двигаться к финансированию.'
    );

    setText(
      [
        `#rec${WHY_DESKTOP_ID} .tn-elem[data-elem-id="1636124811806"] .tn-atom__button-text`,
        `#rec${WHY_MOBILE_ID} .tn-elem[data-elem-id="1636124811806"] .tn-atom__button-text`,
      ],
      'Получить консультацию'
    );

    document
      .querySelectorAll(
        `#rec${WHY_DESKTOP_ID} .tn-elem[data-elem-id="1636124811806"], ` +
          `#rec${WHY_MOBILE_ID} .tn-elem[data-elem-id="1636124811806"]`
      )
      .forEach((button) => button.classList.add('bb-primary-button'));

    mountWhyVideoPreview();
  }

  function mountWhyVideoPreview() {
    const videoSelectors = [
      `#rec${WHY_DESKTOP_ID} .tn-elem[data-elem-id="1636123715076"] .tn-atom`,
      `#rec${WHY_MOBILE_ID} .tn-elem[data-elem-id="1636123715076"] .tn-atom`,
    ];

    videoSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((node) => {
        if (!(node instanceof HTMLElement)) return;

        node.classList.add('bb-why-video-atom');

        if (node.querySelector('.bb-why-video-trigger') || node.querySelector('.bb-why-video-player')) {
          return;
        }

        node.innerHTML = `
          <button
            class="bb-why-video-trigger"
            type="button"
            aria-label="Смотреть видео о Credit Booster"
            style="background-image:
              linear-gradient(180deg, rgba(11, 14, 24, 0.18) 0%, rgba(11, 14, 24, 0.52) 100%),
              url('https://i.ytimg.com/vi/${WHY_YOUTUBE_ID}/hqdefault.jpg');"
          >
            <span class="bb-why-video-trigger__badge">Видео</span>
            <span class="bb-why-video-trigger__play" aria-hidden="true">
              <span class="bb-why-video-trigger__triangle"></span>
            </span>
            <span class="bb-why-video-trigger__caption">Смотреть кейс и разбор</span>
          </button>
        `;

        const trigger = node.querySelector('.bb-why-video-trigger');
        if (!(trigger instanceof HTMLButtonElement)) return;

        trigger.addEventListener('click', () => {
          node.innerHTML = `
            <iframe
              class="bb-why-video-player"
              src="https://www.youtube-nocookie.com/embed/${WHY_YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1"
              title="Видео Credit Booster"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
          `;
        });
      });
    });
  }

  function refineTrustSection() {
    setText(
      `#${THIRD_SECTION_ID} .tn-elem[data-elem-id="1636385616462"] .tn-atom`,
      'Работаем прозрачно и объясняем каждый шаг'
    );
  }

  function refineFormSection() {
    function buildInlineFormMarkup(recordId) {
      return `
        <form
          class="t-form bb-inline-native-form"
          id="bb-inline-form-${recordId}"
          name="bb-inline-form-${recordId}"
          action="#"
          method="POST"
          role="form"
          novalidate
        >
          <div class="js-successbox t-form__successbox t-text t-text_sm" style="display: none;"></div>
          <div class="t-form__inputsbox">
            <div class="t-input-group t-input-group_nm" data-field-type="nm" data-field-name="Name">
              <div class="t-input-block">
                <input
                  aria-label="name"
                  type="text"
                  name="Name"
                  class="t-input js-tilda-rule t-input-inline-styles"
                  placeholder="Ваше имя"
                  autocomplete="name"
                />
                <div class="t-input-error"></div>
              </div>
            </div>
            <div class="t-input-group t-input-group_em" data-field-type="em" data-field-name="email">
              <div class="t-input-block">
                <input
                  aria-label="email"
                  type="email"
                  name="email"
                  class="t-input js-tilda-rule t-input-inline-styles"
                  placeholder="Ваш email"
                  autocomplete="email"
                />
                <div class="t-input-error"></div>
              </div>
            </div>
            <div class="t-input-group t-input-group_ph" data-field-type="ph" data-field-name="Phone">
              <div class="t-input-block">
                <div class="t-input t-input-phonemask__wrap">
                  <span class="t-input-phonemask__select" aria-hidden="true">
                    <span class="t-input-phonemask__select-flag" data-phonemask-flag="us"></span>
                    <span class="t-input-phonemask__select-triangle"></span>
                    <span class="t-input-phonemask__select-code">+1</span>
                  </span>
                  <input
                    aria-label="phone"
                    type="tel"
                    name="Phone"
                    class="t-input t-input-phonemask js-tilda-rule"
                    placeholder="(000) 000-0000"
                    autocomplete="tel-national"
                    inputmode="tel"
                  />
                </div>
                <div class="t-input-error"></div>
              </div>
            </div>
            <div class="tn-form__submit">
              <button type="submit" class="t-submit">
                <span class="t-btnflex__text">Получить консультацию</span>
              </button>
            </div>
            <div class="t-input-group t-input-group_cb" data-field-type="cb" data-field-name="Checkbox">
              <div class="t-input-block">
                <label class="t-checkbox__control t-checkbox__control_flex">
                  <input type="checkbox" name="Checkbox" class="t-checkbox js-tilda-rule" value="yes" checked />
                  <span class="t-checkbox__indicator"></span>
                  <span class="t-checkbox__labeltext">
                    Я соглашаюсь на обработку моих
                    <a href="/privacy/" target="_blank" rel="noreferrer noopener">персональных данных</a>.
                  </span>
                </label>
                <div class="t-input-error"></div>
              </div>
            </div>
            <div class="t-form__errorbox-bottom">
              <div class="js-errorbox-all t-form__errorbox-wrapper" style="display: none;">
                <div class="t-form__errorbox-text t-text_xs t-text">
                  <p class="t-form__errorbox-item js-rule-error js-rule-error-all"></p>
                </div>
              </div>
            </div>
          </div>
        </form>
      `;
    }

    function mountInlineConsultationForms() {
      [INLINE_FORM_DESKTOP_ID, INLINE_FORM_MOBILE_ID].forEach((recordId) => {
        const formMount = document.querySelector(
          `#rec${recordId} .tn-elem[data-elem-id="1570303710057"] .tn-atom__form`
        );

        if (!(formMount instanceof HTMLElement)) return;
        if (formMount.dataset.bbInlineMounted === 'true') return;

        formMount.innerHTML = buildInlineFormMarkup(recordId);
        formMount.dataset.bbInlineMounted = 'true';
      });
    }

    addClass([INLINE_FORM_DESKTOP_ID, INLINE_FORM_MOBILE_ID], 'bb-form-record');

    setText(
      [
        `#rec${INLINE_FORM_DESKTOP_ID} .tn-elem[data-elem-id="1470210011265"] .tn-atom`,
        `#rec${INLINE_FORM_MOBILE_ID} .tn-elem[data-elem-id="1470210011265"] .tn-atom`,
        '#popuptitle_375704275',
        '#popuptitle_375711892',
      ],
      'Запишитесь на бесплатную консультацию'
    );

    setText(
      [
        `#rec${INLINE_FORM_DESKTOP_ID} .tn-elem[data-elem-id="1481028460033"] .tn-atom`,
        `#rec${INLINE_FORM_MOBILE_ID} .tn-elem[data-elem-id="1481028460033"] .tn-atom`,
        '#rec375704275 .t702__descr',
        '#rec375711892 .t702__descr',
      ],
      'Коротко разберем вашу ситуацию и подскажем, с чего лучше начать.'
    );

    setText(
      [
        `#rec${INLINE_FORM_DESKTOP_ID} .t-submit .t-btnflex__text`,
        `#rec${INLINE_FORM_MOBILE_ID} .t-submit .t-btnflex__text`,
        '#form375704275 .t-btnflex__text',
        '#form375711892 .t-btnflex__text',
      ],
      'Получить консультацию'
    );

    document
      .querySelectorAll(
        `#rec${INLINE_FORM_DESKTOP_ID} .t-submit, ` +
          `#rec${INLINE_FORM_MOBILE_ID} .t-submit, ` +
          '#form375704275 .t-submit, ' +
          '#form375711892 .t-submit'
      )
      .forEach((button) => {
        if (!(button instanceof HTMLElement)) return;
        const innerLabel = button.querySelector('.t-btnflex__text');
        if (innerLabel instanceof HTMLElement) {
          innerLabel.textContent = 'Получить консультацию';
          return;
        }

        button.textContent = 'Получить консультацию';
      });

    document
      .querySelectorAll(`#rec${INLINE_FORM_DESKTOP_ID}, #rec${INLINE_FORM_MOBILE_ID}`)
      .forEach((record) => record.classList.add('bb-inline-form-record'));

    mountInlineConsultationForms();

    POPUP_FORM_IDS.forEach((popupId) => {
      const popup = document.getElementById(`rec${popupId}`);
      if (popup instanceof HTMLElement) {
        popup.classList.add('bb-popup-form-record');
      }

      const popupNode = document.querySelector(`#rec${popupId} .t-popup`);
      if (popupNode instanceof HTMLElement) {
        popupNode.setAttribute('aria-label', 'Запишитесь на бесплатную консультацию');
      }
    });

    [160, 480, 1200].forEach((delay) => {
      window.setTimeout(() => {
        mountInlineConsultationForms();
        syncRefinedLayout();
      }, delay);
    });
  }

  function patchPlaylistData(record) {
    const dataNode = record.querySelector('.t937__data');
    if (!(dataNode instanceof HTMLElement)) return;

    const updatedData = dataNode.textContent
      .split('\n')
      .map((line) => {
        const [urlPart, titlePart] = line.split(';');
        if (!urlPart || !titlePart) return line;
        const cleanTitle = titlePart.trim();
        return `${urlPart.trim()}; ${playlistTitleMap.get(cleanTitle) || cleanTitle}`;
      })
      .join('\n');

    dataNode.textContent = updatedData;
  }

  function parsePlaylistEntries(record) {
    const dataNode = record.querySelector('.t937__data');
    if (!(dataNode instanceof HTMLElement)) return [];

    return dataNode.textContent
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        const [urlPart, titlePart] = line.split(';');
        if (!urlPart || !titlePart) return null;

        const title = titlePart.trim();
        const videoId = extractYouTubeId(urlPart.trim());
        if (!videoId) return null;

        return {
          index,
          title,
          description:
            playlistDescriptionMap.get(title) ||
            'Видеоотзыв о консультации, сопровождении и том, как выстроена работа по шагам.',
          videoId,
        };
      })
      .filter(Boolean);
  }

  function buildPlaylistSection(record) {
    if (record.querySelector('.bb-playlist-layout')) return;

    const entries = parsePlaylistEntries(record);
    if (!entries.length) return;

    const root = record.querySelector('.t937');
    if (!(root instanceof HTMLElement)) return;

    record.classList.add('bb-playlist-custom');

    const featuredEntry = entries[0];
    const layout = document.createElement('section');
    layout.className = 'bb-playlist-layout';
    layout.innerHTML = `
      <div class="bb-playlist-shell">
        <div class="bb-playlist-head">
          <div class="bb-playlist-copy">
            <span class="bb-playlist-eyebrow">Отзывы клиентов</span>
            <h2 class="bb-playlist-heading">Посмотрите, как клиенты описывают консультацию и сопровождение</h2>
          </div>
        </div>
        <div class="bb-playlist-grid">
          <article class="bb-playlist-featured">
            <div class="bb-playlist-frame">
              <iframe
                class="bb-playlist-iframe"
                data-bb-playlist-iframe
                src="https://www.youtube-nocookie.com/embed/${featuredEntry.videoId}?rel=0&modestbranding=1&playsinline=1"
                title="${featuredEntry.title}"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe>
            </div>
            <div class="bb-playlist-featured__meta">
              <span class="bb-playlist-featured__eyebrow">Основной отзыв</span>
              <h3 class="bb-playlist-featured__title" data-bb-playlist-title>${featuredEntry.title}</h3>
              <p class="bb-playlist-featured__text" data-bb-playlist-description>${featuredEntry.description}</p>
            </div>
          </article>
          <div class="bb-playlist-list" role="list">
            ${entries
              .map(
                (entry, index) => `
              <button
                class="bb-playlist-item${index === 0 ? ' bb-playlist-item--active' : ''}"
                type="button"
                data-bb-playlist-item="${index}"
              >
                <span class="bb-playlist-item__index">${String(index + 1).padStart(2, '0')}</span>
                <span class="bb-playlist-item__body">
                  <span class="bb-playlist-item__title">${entry.title}</span>
                  <span class="bb-playlist-item__text">${entry.description}</span>
                </span>
                <span class="bb-playlist-item__cta">Смотреть</span>
              </button>`
              )
              .join('')}
          </div>
        </div>
      </div>
    `;

    root.append(layout);

    const iframe = layout.querySelector('[data-bb-playlist-iframe]');
    const titleNode = layout.querySelector('[data-bb-playlist-title]');
    const descriptionNode = layout.querySelector('[data-bb-playlist-description]');
    const featuredCard = layout.querySelector('.bb-playlist-featured');
    const itemButtons = Array.from(layout.querySelectorAll('[data-bb-playlist-item]')).filter(
      (node) => node instanceof HTMLButtonElement
    );

    if (
      !(iframe instanceof HTMLIFrameElement) ||
      !(titleNode instanceof HTMLElement) ||
      !(descriptionNode instanceof HTMLElement) ||
      !(featuredCard instanceof HTMLElement)
    ) {
      return;
    }

    const syncFeaturedVideo = (index, autoplay = false) => {
      const entry = entries[index];
      if (!entry) return;

      const autoplayFlag = autoplay ? '1' : '0';
      iframe.src = `https://www.youtube-nocookie.com/embed/${entry.videoId}?rel=0&modestbranding=1&playsinline=1&autoplay=${autoplayFlag}`;
      iframe.title = entry.title;
      titleNode.textContent = entry.title;
      descriptionNode.textContent = entry.description;

      itemButtons.forEach((button) => {
        const buttonIndex = Number.parseInt(button.dataset.bbPlaylistItem || '', 10);
        button.classList.toggle('bb-playlist-item--active', buttonIndex === index);
      });

      if (window.innerWidth < 960) {
        const header = Array.from(document.querySelectorAll('.t228')).find(
          (node) => node instanceof HTMLElement && window.getComputedStyle(node).display !== 'none'
        );
        const headerHeight = header instanceof HTMLElement ? header.getBoundingClientRect().height : 0;
        const top = featuredCard.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }
    };

    itemButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number.parseInt(button.dataset.bbPlaylistItem || '', 10);
        if (Number.isFinite(index)) {
          syncFeaturedVideo(index, true);
        }
      });
    });
  }

  function refinePlaylistSection() {
    const record = document.getElementById(`rec${PLAYLIST_ID}`);
    if (!(record instanceof HTMLElement)) return;

    record.classList.add('bb-playlist-record');
    patchPlaylistData(record);
    buildPlaylistSection(record);

    setText(`#rec${PLAYLIST_ID} .t937__title`, 'Видеоотзывы клиентов');
    setText(`#rec${PLAYLIST_ID} .t937__subheading-title`, 'Реальные истории о консультации и сопровождении');

    record.querySelectorAll('.t937__playlist-title, .t937__video-title').forEach((node) => {
      const currentTitle = node.textContent.trim();
      if (playlistTitleMap.has(currentTitle)) {
        node.textContent = playlistTitleMap.get(currentTitle);
      }
    });
  }

  function buildSecondSection(record) {
    const artboard = record.querySelector('.t396__artboard');
    if (!(artboard instanceof HTMLElement)) return;
    if (artboard.querySelector('.bb-second-layout')) return;

    record.classList.add('bb-second-enhanced');

    const wrapper = document.createElement('section');
    wrapper.className = 'bb-second-layout';
    wrapper.innerHTML = `
      <div class="bb-second-left">
        <div class="bb-second-heading">
          <span class="bb-second-eyebrow">${secondSection.eyebrow}</span>
          <h2 class="bb-second-title">${secondSection.title}</h2>
          <p class="bb-second-intro">${secondSection.intro}</p>
        </div>
        <ul class="bb-second-points">
          ${secondSection.points.map((point) => `<li class="bb-second-point">${point}</li>`).join('')}
        </ul>
      </div>
      <div class="bb-second-right">
        ${secondSection.services
          .map(
            (service) => `
          <article class="bb-second-card">
            <h3 class="bb-second-card__title">${service.title}</h3>
            <p class="bb-second-card__text">${service.text}</p>
            <ul class="bb-second-card__list">
              ${service.bullets.map((bullet) => `<li>${bullet}</li>`).join('')}
            </ul>
          </article>`
          )
          .join('')}
      </div>
    `;

    artboard.append(wrapper);
  }

  function buildThirdSection(record) {
    const artboard = record.querySelector('.t396__artboard');
    if (!(artboard instanceof HTMLElement)) return;
    if (artboard.querySelector('.bb-third-layout')) return;

    record.classList.add('bb-third-enhanced');

    const featuredSlide = slides[0];
    const layout = document.createElement('section');
    layout.className = 'bb-third-layout';

    const gallery = document.createElement('section');
    gallery.className = 'bb-third-gallery';
    gallery.innerHTML = `
      <div class="bb-third-gallery__header">
        <div class="bb-third-gallery__header-copy">
          <span class="bb-third-gallery__eyebrow">Видеоотзывы клиентов</span>
          <h3 class="bb-third-gallery__title">Короткие истории о консультации и сопровождении</h3>
        </div>
        <div class="bb-third-gallery__header-side">
          <div class="bb-third-gallery__counter" aria-live="polite">
            <span class="bb-third-gallery__counter-current" data-bb-current-index>01</span>
            <span class="bb-third-gallery__counter-total">/ ${String(slides.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>
      <article class="bb-third-featured">
        <div class="bb-third-featured__media">
          <div class="bb-third-featured__frame">
            <div class="bb-third-featured__video-wrap">
              <video
                class="bb-third-featured__video"
                controls
                playsinline
                preload="metadata"
                poster="${featuredSlide.poster}"
                data-bb-featured-video
              >
                <source src="${featuredSlide.src}" type="video/mp4" />
              </video>
              <button
                class="bb-third-featured__poster"
                type="button"
                data-bb-featured-poster
                style="--bb-poster-image: url('${featuredSlide.poster}')"
                aria-label="Воспроизвести отзыв: ${featuredSlide.title}"
              >
                <img
                  class="bb-third-featured__poster-image"
                  src="${featuredSlide.poster}"
                  alt="${featuredSlide.title}"
                  loading="eager"
                  decoding="async"
                />
                <span class="bb-third-featured__poster-play" aria-hidden="true">▶</span>
              </button>
            </div>
          </div>
        </div>
        <div class="bb-third-featured__copy">
          <h3 class="bb-third-featured__title" data-bb-featured-title>${featuredSlide.title}</h3>
          <p class="bb-third-featured__caption" data-bb-featured-caption>${featuredSlide.caption}</p>
        </div>
        <aside class="bb-third-chooser">
          <div class="bb-third-chooser__head">
            <span class="bb-third-chooser__eyebrow">Следующие отзывы</span>
            <div class="bb-third-chooser__controls">
              <button
                class="bb-third-chooser__nav bb-third-chooser__nav--prev"
                type="button"
                data-bb-chooser-prev
                aria-label="Показать предыдущие отзывы"
              >
                &uarr;
              </button>
              <button
                class="bb-third-chooser__nav bb-third-chooser__nav--next"
                type="button"
                data-bb-chooser-next
                aria-label="Показать следующие отзывы"
              >
                &darr;
              </button>
            </div>
          </div>
          <div class="bb-third-chooser__list" data-bb-chooser>
            ${slides
              .map(
                (slide, index) => `
              <button
                class="bb-third-choice${index === 0 ? ' bb-third-choice--active' : ''}"
                type="button"
                data-bb-slide-index="${index}"
                aria-pressed="${index === 0 ? 'true' : 'false'}"
              >
                <span class="bb-third-choice__thumb" style="--bb-poster-image: url('${slide.poster}')">
                  <img
                    class="bb-third-choice__poster"
                    src="${slide.poster}"
                    alt="${slide.title}"
                    loading="lazy"
                    decoding="async"
                  />
                  <span class="bb-third-choice__play" aria-hidden="true">▶</span>
                </span>
                <span class="bb-third-choice__body">
                  <span class="bb-third-choice__label">Отзыв ${String(index + 1).padStart(2, '0')}</span>
                  <span class="bb-third-choice__title">${slide.title}</span>
                </span>
              </button>`
              )
              .join('')}
          </div>
        </aside>
      </article>
    `;

    const sidepanelSlot = document.createElement('div');
    sidepanelSlot.className = 'bb-third-sidepanel-slot';

    const sidepanel = document.createElement('div');
    sidepanel.className = 'bb-third-sidepanel';
    sidepanel.innerHTML = `
      <div class="bb-third-sidepanel__main">
        <span class="bb-third-sidepanel__badge">Почему клиенты остаются с нами</span>
        <h2 class="bb-third-sidepanel__title">Работаем прозрачно и объясняем каждый шаг</h2>
        <ul class="bb-third-sidepanel__list">
          <li>Показываем, какие шаги уже сделаны и что идет дальше</li>
          <li>Даем понятные рекомендации без лишнего давления</li>
          <li>Остаемся на связи на каждом этапе работы</li>
        </ul>
      </div>
      <div class="bb-third-sidepanel__aside">
        <p class="bb-third-sidepanel__text">Коротко разберем вашу ситуацию и подскажем, с чего лучше начать.</p>
        <div class="bb-third-sidepanel__facts" aria-hidden="true">
          <span class="bb-third-sidepanel__fact">Пошагово</span>
          <span class="bb-third-sidepanel__fact">Без давления</span>
          <span class="bb-third-sidepanel__fact">На связи</span>
        </div>
        <a class="bb-third-sidepanel__cta" href="#popup:myform">Получить консультацию</a>
        <div class="bb-third-sidepanel__timer-row">
          <span class="bb-third-sidepanel__timer-label">Текущее окно записи</span>
          <span class="bb-third-sidepanel__timer-pill">
            <span class="bb-third-sidepanel__timer" data-bb-countdown>${formatSeconds(30)}</span>
          </span>
        </div>
      </div>
    `;

    sidepanelSlot.append(sidepanel);
    layout.append(gallery, sidepanelSlot);
    artboard.append(layout);

    const featuredVideo = gallery.querySelector('[data-bb-featured-video]');
    const featuredSource = featuredVideo instanceof HTMLVideoElement ? featuredVideo.querySelector('source') : null;
    const featuredPoster = gallery.querySelector('[data-bb-featured-poster]');
    const featuredPosterImage =
      featuredPoster instanceof HTMLElement ? featuredPoster.querySelector('.bb-third-featured__poster-image') : null;
    const featuredTitle = gallery.querySelector('[data-bb-featured-title]');
    const featuredCaption = gallery.querySelector('[data-bb-featured-caption]');
    const featuredCounter = gallery.querySelector('[data-bb-current-index]');
    const featuredCard = gallery.querySelector('.bb-third-featured');
    const featuredMedia = gallery.querySelector('.bb-third-featured__media');
    const chooserList = gallery.querySelector('[data-bb-chooser]');
    const prevChooserButton = gallery.querySelector('[data-bb-chooser-prev]');
    const nextChooserButton = gallery.querySelector('[data-bb-chooser-next]');
    const choiceButtons = Array.from(gallery.querySelectorAll('[data-bb-slide-index]')).filter(
      (node) => node instanceof HTMLButtonElement
    );

    if (
      !(featuredVideo instanceof HTMLVideoElement) ||
      !(featuredSource instanceof HTMLSourceElement) ||
      !(featuredPoster instanceof HTMLButtonElement) ||
      !(featuredPosterImage instanceof HTMLImageElement) ||
      !(featuredTitle instanceof HTMLElement) ||
      !(featuredCaption instanceof HTMLElement) ||
      !(featuredCounter instanceof HTMLElement) ||
      !(featuredCard instanceof HTMLElement) ||
      !(featuredMedia instanceof HTMLElement) ||
      !(chooserList instanceof HTMLElement) ||
      !(prevChooserButton instanceof HTMLButtonElement) ||
      !(nextChooserButton instanceof HTMLButtonElement)
    ) {
      return;
    }

    let revealTimers = [];
    let pendingReveal = false;
    let stickyFrame = 0;
    let carouselFrame = 0;

    function showFeaturedPoster() {
      featuredPoster.hidden = false;
      featuredPoster.setAttribute('aria-hidden', 'false');
    }

    function hideFeaturedPoster() {
      featuredPoster.hidden = true;
      featuredPoster.setAttribute('aria-hidden', 'true');
    }

    function setActiveSlide(index, autoplay = false) {
      const slide = slides[index];
      if (!slide) return;

      featuredVideo.pause();
      featuredVideo.currentTime = 0;
      featuredSource.src = slide.src;
      featuredVideo.poster = slide.poster || '';
      featuredPoster.style.setProperty('--bb-poster-image', slide.poster ? `url('${slide.poster}')` : 'none');
      featuredPosterImage.src = slide.poster || '';
      featuredPosterImage.alt = slide.title;
      featuredPoster.setAttribute('aria-label', `Воспроизвести отзыв: ${slide.title}`);
      showFeaturedPoster();
      featuredVideo.load();
      featuredTitle.textContent = slide.title;
      featuredCaption.textContent = slide.caption;
      featuredCounter.textContent = String(index + 1).padStart(2, '0');

      choiceButtons.forEach((button) => {
        const buttonIndex = Number.parseInt(button.dataset.bbSlideIndex || '', 10);
        const isActive = buttonIndex === index;
        const thumb = button.querySelector('.bb-third-choice__thumb');
        const poster = slides[buttonIndex] && slides[buttonIndex].poster ? slides[buttonIndex].poster : '';
        if (thumb instanceof HTMLElement) {
          thumb.style.setProperty('--bb-poster-image', poster ? `url('${poster}')` : 'none');
        }
        button.classList.toggle('bb-third-choice--active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });

      if (autoplay) {
        const tryAutoplay = () => {
          hideFeaturedPoster();
          const playPromise = featuredVideo.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {
              showFeaturedPoster();
            });
          }
        };

        if (featuredVideo.readyState >= 2) {
          tryAutoplay();
        } else {
          featuredVideo.addEventListener('loadeddata', tryAutoplay, { once: true });
        }
      }
    }

    function getHeaderHeight() {
      const headers = Array.from(document.querySelectorAll('.t228')).filter(
        (node) => node instanceof HTMLElement && window.getComputedStyle(node).display !== 'none'
      );
      const activeHeader = headers.find((node) => node.getBoundingClientRect().height > 0);
      return activeHeader instanceof HTMLElement ? activeHeader.getBoundingClientRect().height : 0;
    }

    function revealFeaturedVideo(options = {}) {
      const { behavior = 'smooth', force = false } = options;
      const headerHeight = getHeaderHeight();
      const rect = featuredMedia.getBoundingClientRect();
      const topLimit = headerHeight + 18;
      const bottomLimit = window.innerHeight - 24;
      const fullyVisible = rect.top >= topLimit && rect.bottom <= bottomLimit;

      if (!force && fullyVisible) {
        return;
      }

      const featuredTop = rect.top + window.scrollY;
      const targetTop = Math.max(0, featuredTop - headerHeight - 18);

      window.scrollTo({
        top: targetTop,
        behavior,
      });
    }

    function queueRevealFeaturedVideo() {
      revealTimers.forEach((timerId) => window.clearTimeout(timerId));
      revealTimers = [];
      pendingReveal = true;

      revealFeaturedVideo({ behavior: 'smooth', force: true });

      [120, 320, 640].forEach((delay) => {
        revealTimers.push(
          window.setTimeout(() => {
            revealFeaturedVideo({ behavior: 'smooth', force: true });
          }, delay)
        );
      });
    }

    function getVisibleChoiceCount() {
      if (window.innerWidth <= 639) return 2;
      if (window.innerWidth <= 959) return 3;
      return 3;
    }

    function getChooserStep() {
      const firstChoice = choiceButtons[0];
      if (!(firstChoice instanceof HTMLElement)) {
        return chooserList.clientHeight;
      }

      const styles = window.getComputedStyle(chooserList);
      const gap = Number.parseFloat(styles.rowGap || styles.gap || '0') || 0;
      const visibleChoices = getVisibleChoiceCount();
      return Math.max(chooserList.clientHeight, (firstChoice.getBoundingClientRect().height + gap) * visibleChoices);
    }

    function syncChooserControls() {
      carouselFrame = 0;

      const maxScrollTop = Math.max(0, chooserList.scrollHeight - chooserList.clientHeight - 2);
      prevChooserButton.disabled = chooserList.scrollTop <= 2;
      nextChooserButton.disabled = chooserList.scrollTop >= maxScrollTop;
    }

    function requestChooserControlsSync() {
      if (carouselFrame) return;
      carouselFrame = window.requestAnimationFrame(syncChooserControls);
    }

    function scrollChooser(direction) {
      chooserList.scrollBy({
        top: getChooserStep() * direction,
        behavior: 'smooth',
      });
    }

    choiceButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const nextIndex = Number.parseInt(button.dataset.bbSlideIndex || '', 10);
        if (Number.isFinite(nextIndex)) {
          setActiveSlide(nextIndex, true);
          button.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest',
          });
          requestChooserControlsSync();
          queueRevealFeaturedVideo();
        }
      });
    });

    prevChooserButton.addEventListener('click', () => {
      scrollChooser(-1);
    });

    nextChooserButton.addEventListener('click', () => {
      scrollChooser(1);
    });

    featuredPoster.addEventListener('click', () => {
      hideFeaturedPoster();
      const playPromise = featuredVideo.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          showFeaturedPoster();
        });
      }
    });

    chooserList.addEventListener('scroll', requestChooserControlsSync, { passive: true });

    featuredVideo.addEventListener('loadeddata', () => {
      if (!pendingReveal) return;
      revealFeaturedVideo({ behavior: 'smooth', force: true });
    });

    featuredVideo.addEventListener('play', () => {
      hideFeaturedPoster();
      if (pendingReveal) {
        revealFeaturedVideo({ behavior: 'smooth', force: true });
        pendingReveal = false;
      }
    });

    featuredVideo.addEventListener('ended', () => {
      showFeaturedPoster();
    });

    const countdown = sidepanel.querySelector('[data-bb-countdown]');
    if (countdown instanceof HTMLElement) {
      let secondsLeft = 30;
      window.setInterval(() => {
        secondsLeft = secondsLeft <= 0 ? 30 : secondsLeft - 1;
        countdown.textContent = formatSeconds(secondsLeft);
      }, 1000);
    }

    function resetStickyState() {
      sidepanelSlot.style.removeProperty('min-height');
      sidepanel.style.removeProperty('--bb-third-sidepanel-width');
      sidepanel.style.removeProperty('--bb-third-sidepanel-left');
      sidepanel.style.removeProperty('--bb-third-sticky-top');
      sidepanel.classList.remove(
        'bb-third-sidepanel--managed',
        'bb-third-sidepanel--fixed',
        'bb-third-sidepanel--bottomed'
      );
    }

    function updateStickySidepanel() {
      stickyFrame = 0;
      resetStickyState();
    }

    function requestStickySidepanelUpdate() {
      if (stickyFrame) return;
      stickyFrame = window.requestAnimationFrame(updateStickySidepanel);
    }

    const stickyResizeObserver =
      typeof window.ResizeObserver === 'function'
        ? new window.ResizeObserver(() => {
            requestStickySidepanelUpdate();
          })
        : null;

    [layout, gallery, sidepanel, sidepanelSlot].forEach((node) => {
      if (stickyResizeObserver && node instanceof HTMLElement) {
        stickyResizeObserver.observe(node);
      }
    });

    window.addEventListener('scroll', requestStickySidepanelUpdate, { passive: true });
    window.addEventListener('resize', () => {
      requestStickySidepanelUpdate();
      requestChooserControlsSync();
    });
    window.setTimeout(requestChooserControlsSync, 80);
    window.setTimeout(requestChooserControlsSync, 320);
    window.setTimeout(requestStickySidepanelUpdate, 80);
    window.setTimeout(requestStickySidepanelUpdate, 320);
    requestChooserControlsSync();
    requestStickySidepanelUpdate();
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('bb-refined');
    updateMetadata();
    normalizeInitialLandingPosition();

    const secondRecord = document.getElementById(SECOND_SECTION_ID);
    if (secondRecord instanceof HTMLElement) {
      buildSecondSection(secondRecord);
    }

    const thirdRecord = document.getElementById(THIRD_SECTION_ID);
    if (thirdRecord instanceof HTMLElement) {
      buildThirdSection(thirdRecord);
    }

    const refineAll = () => {
      refineHeroSection();
      refineWhyChooseSection();
      refineTrustSection();
      refineFormSection();
      refinePlaylistSection();
      syncRefinedLayout();
    };

    refineAll();
    [120, 450, 1200].forEach((delay) => {
      window.setTimeout(refineAll, delay);
    });

    window.addEventListener('hashchange', clearPlaylistHash);

    let resizeTimeout = null;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(syncRefinedLayout, 120);
    });
  });
})();
