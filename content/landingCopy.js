export const landingCopy = {
  defaultVariant: 'hot',
  variants: {
    hot: {
      metaTitle: 'Credit Booster | Personalized Credit Action Plan',
      hero: {
        eyebrow: 'Credit Repair Guidance',
        headlines: [
          'Проверьте credit report и получите персональный план действий без завышенных обещаний.',
          'Если отказы по заявкам мешают двигаться дальше, начните с фактов в credit report.',
        ],
        subtitle:
          'Мы помогаем разобраться с неточностями, выстроить dispute-процесс и отслеживать прогресс в рамках закона.',
        bullets: [
          'Пошаговая стратегия под вашу ситуацию',
          'Прозрачный процесс и понятные действия',
          'Фокус на compliance и управлении рисками',
        ],
        primaryCta: 'Пройти квиз / Получить план',
        secondaryCta: 'Бесплатный мини-аудит',
      },
      finalCta: {
        title: 'Готовы начать с проверяемого плана?',
        text: 'Ответьте на несколько вопросов и получите следующий шаг без обещаний мгновенного результата.',
        button: 'Получить план',
      },
    },
    cold: {
      metaTitle: 'Credit Booster | Research-first Credit Repair Plan',
      hero: {
        eyebrow: 'Credit Education + Plan',
        headlines: [
          'Изучаете credit repair? Начните с чеклиста и персональной оценки вашей ситуации.',
          'Сначала понимание, потом действия: соберем факты и предложим реалистичный план.',
        ],
        subtitle:
          'Подходит тем, кто сравнивает варианты и хочет принимать решения на основе данных, а не маркетинговых обещаний.',
        bullets: [
          'Понятная диагностика текущего credit profile',
          'Четкие приоритеты без лишних шагов',
          'Рекомендации по dispute guidance и мониторингу',
        ],
        primaryCta: 'Пройти квиз / Получить план',
        secondaryCta: 'Скачать чеклист',
      },
      finalCta: {
        title: 'Нужен спокойный старт без давления?',
        text: 'Пройдите квиз, получите структуру действий и решите, какой формат сопровождения вам подходит.',
        button: 'Получить план',
      },
    },
  },
  shared: {
    ui: {
      overviewEyebrow: 'Approach overview',
      nav: {
        quiz: 'Квиз',
        how: 'Как это работает',
        faq: 'FAQ',
      },
      header: {
        secondaryCta: 'Начать с квиза',
        primaryCta: 'Получить консультацию',
        mobilePrimaryCta: 'Получить план',
      },
      sectionEyebrows: {
        quiz: 'Qualification quiz',
        solutions: 'What you get',
        process: 'Process',
        fit: 'Fit check',
        why: 'Why us',
        faq: 'FAQ',
        compliance: 'Compliance',
      },
      quizUi: {
        back: 'Назад',
        next: 'Далее',
        showResult: 'Показать результат',
        selectError: 'Выберите один вариант, чтобы продолжить.',
        loading: 'Отправляем...',
        submitError: 'Не удалось отправить форму. Используйте рабочий email и повторите.',
        submitSuccess: 'Форма успешно отправлена.',
        resultLabel: 'Результат',
        contactLabel: 'Контакты',
        doneLabel: 'Готово',
        stepLabel: 'Шаг {current} из {total}',
      },
      form: {
        nameLabel: 'Имя',
        emailLabel: 'Email',
        phoneLabel: 'Телефон (опционально)',
        tcpaText:
          'By checking this box, you agree to be contacted by phone or SMS for follow-up on your request. Consent is not required to purchase services.',
        nameError: 'Введите имя (минимум 2 символа).',
        emailError: 'Введите корректный email.',
        phoneError: 'Телефон должен содержать 10 цифр в US формате.',
        tcpaError: 'Для выбранного формата отметьте согласие на контакт по телефону/SMS.',
      },
      legalHeading: 'Legal',
      legalLinks: {
        privacy: 'Privacy',
        terms: 'Terms',
        disclosures: 'Disclosures',
      },
      forWhoTitle: 'Для кого',
      stickyCta: 'Получить план',
      footerCopy: 'All rights reserved.',
      nextSteps: [
        'Проверьте входящие и папку Promotions/Spam.',
        'Подготовьте последние изменения по заявкам/отказам.',
        'Следуйте next steps из письма или звонка.',
      ],
    },
    trustRow: ['Secure form', 'Privacy-first', 'No guaranteed outcomes'],
    microcopy: 'Без спама. Результаты индивидуальны. Нет гарантий.',
    messageMatch: {
      title: 'Вы искали credit repair / dispute errors - начнем с проверки фактов в credit report',
      text: 'Мы не обещаем "удалить все". Мы помогаем выявить неточности и вести процесс законно.',
    },
    protectionOverview: {
      title: 'Protection overview',
      text: 'Вместо абстрактных процентов мы показываем, какие действия вы можете сделать уже сейчас.',
      items: ['Credit report review', 'Dispute guidance', 'Progress tracking'],
    },
    quiz: {
      title: 'Квиз: соберем вводные и предложим следующий шаг',
      subtitle:
        'Ответы помогут определить приоритеты: стандартный план или Fraud Action Plan при признаках риска.',
      questions: [
        {
          id: 'q1_goal',
          title: 'Q1. Какая у вас основная цель сейчас?',
          options: [
            { value: 'rent', label: 'Одобрение аренды (rent)' },
            { value: 'auto', label: 'Автокредит (auto)' },
            { value: 'mortgage', label: 'Ипотека (mortgage)' },
            { value: 'credit_card', label: 'Кредитная карта (credit card)' },
            { value: 'understand', label: 'Хочу понять, что происходит с credit profile' },
          ],
        },
        {
          id: 'q2_concern',
          title: 'Q2. Что беспокоит больше всего?',
          options: [
            { value: 'collections', label: 'Collections' },
            { value: 'late', label: 'Late payments' },
            { value: 'charge_off', label: 'Charge-off' },
            { value: 'inquiries', label: 'Hard inquiries' },
            { value: 'errors', label: 'Ошибки в отчете (errors)' },
            { value: 'dont_know', label: 'Не уверен(а)' },
          ],
        },
        {
          id: 'q3_denied90',
          title: 'Q3. Были ли отказы по заявкам за последние 90 дней?',
          options: [
            { value: 'yes', label: 'Да' },
            { value: 'no', label: 'Нет' },
          ],
        },
        {
          id: 'q4_score_range',
          title: 'Q4. Примерный credit score диапазон?',
          options: [
            { value: 'lt_580', label: '<580' },
            { value: '580_669', label: '580-669' },
            { value: '670_739', label: '670-739' },
            { value: '740_plus', label: '740+' },
            { value: 'dont_know', label: 'Не знаю' },
          ],
        },
        {
          id: 'q5_fraud',
          title: 'Q5. Есть признаки fraud / identity theft?',
          options: [
            { value: 'yes', label: 'Да' },
            { value: 'no', label: 'Нет' },
            { value: 'not_sure', label: 'Не уверен(а)' },
          ],
        },
        {
          id: 'q6_duration',
          title: 'Q6. Как давно началась проблема?',
          options: [
            { value: 'lt_3m', label: '<3 месяцев' },
            { value: '3_12m', label: '3-12 месяцев' },
            { value: '1_3y', label: '1-3 года' },
            { value: '3y_plus', label: '3+ лет' },
          ],
        },
        {
          id: 'q7_disputes_before',
          title: 'Q7. Уже подавали disputes?',
          options: [
            { value: 'yes_no_result', label: 'Да, без результата' },
            { value: 'partial', label: 'Да, частичный результат' },
            { value: 'no', label: 'Нет, не подавал(а)' },
          ],
        },
        {
          id: 'q8_contact_format',
          title: 'Q8. Какой формат вам удобнее?',
          options: [
            { value: 'email_plan', label: 'Получить план на email' },
            { value: 'call_10_15', label: 'Короткий созвон 10-15 min' },
            { value: 'sms_allowed', label: 'SMS, если допустимо' },
          ],
        },
      ],
      branches: {
        fraud: {
          title: 'Fraud Action Plan',
          text: 'По вашим ответам есть признаки риска. Рекомендуем начать с приоритета по безопасности и документированию фактов.',
          cta: 'Запланировать созвон по Fraud Action Plan',
          callLinkLabel: 'Позвонить сейчас',
        },
        standard: {
          title: 'Personal Action Plan',
          text: 'По вашим ответам подходит стандартный план: ревью отчета, приоритизация disputable items и последовательность действий.',
          cta: 'Перейти к заявке на Personal Action Plan',
          callLinkLabel: '',
        },
      },
      contact: {
        title: 'Финальный шаг: куда отправить ваш план',
        text: 'Оставьте контакт. Телефон опционален, но полезен, если нужен созвон или SMS.',
        submit: 'Отправить и получить следующий шаг',
      },
      success: {
        title: 'Спасибо, запрос принят',
        text: 'Что дальше: проверьте email. Если выбрали созвон или SMS, с вами свяжутся в рабочее время.',
      },
    },
    socialProof: {
      title: 'Что клиенты обычно ценят',
      fallbackPoints: [
        'Понятная логика процесса без "магических" обещаний',
        'Прозрачная коммуникация и понятные next steps',
        'Упор на законный и документируемый подход',
        'Фокус на приоритетах, чтобы не тратить время на лишние действия',
      ],
      reviews: [],
    },
    solutions: {
      title: 'Что вы получаете',
      items: [
        {
          title: 'Credit report review',
          text: 'Разбираем структуру отчета и выделяем элементы, требующие проверки.',
        },
        {
          title: 'Dispute guidance',
          text: 'Даем последовательный план шагов без обещаний конкретного исхода.',
        },
        {
          title: 'Action priorities',
          text: 'Фокусируемся на действиях, которые дают практическую пользу в вашей ситуации.',
        },
        {
          title: 'Documentation flow',
          text: 'Показываем, какие документы и подтверждения важно собрать заранее.',
        },
        {
          title: 'Progress tracking',
          text: 'Отслеживаем изменения и корректируем план без хаотичных решений.',
        },
        {
          title: 'Compliance-first approach',
          text: 'Процесс строится вокруг прозрачности и корректной коммуникации.',
        },
      ],
    },
    howItWorks: {
      title: 'Как это работает',
      steps: [
        'Собираем исходные данные через квиз и уточняющие вопросы.',
        'Проводим первичное ревью credit report и контекста отказов.',
        'Определяем приоритеты: Fraud Action Plan или стандартный план.',
        'Согласуем формат взаимодействия и последовательность шагов.',
        'Отслеживаем прогресс и обновляем рекомендации по мере изменений.',
      ],
    },
    audience: {
      title: 'Для кого это решение',
      forWho: [
        'Тем, кто получил отказы и хочет понять реальные причины.',
        'Тем, кто замечает неточности в credit report и хочет действовать корректно.',
        'Тем, кто хочет снизить хаос и получить понятный порядок шагов.',
      ],
      notFitTitle: 'Кому это не подойдет',
      notFit: [
        'Тем, кто ищет обещания "гарантированного" результата.',
        'Тем, кто ожидает мгновенных изменений без процесса и подтверждений.',
        'Тем, кто не готов следовать согласованным шагам и срокам.',
      ],
    },
    whyUs: {
      title: 'Почему мы',
      reasons: [
        'Прозрачный процесс без скрытых обещаний.',
        'Фокус на фактах из credit report, а не на догадках.',
        'Коммуникация понятным языком без перегруза терминами.',
        'Структура действий под ваш конкретный кейс.',
        'Приоритет на compliance и этичную практику.',
        'Единая точка контакта для следующих шагов.',
        'Подход, который помогает принимать обоснованные решения.',
      ],
    },
    expectations: {
      title: 'Честные ожидания',
      points: [
        'No guaranteed outcomes. Results vary by profile and history.',
        'Мы не обещаем рост score к конкретной дате.',
        'Мы не обещаем удалить все negative items.',
        'Решения принимаются на основе фактов и документов.',
      ],
    },
    faq: {
      title: 'FAQ',
      items: [
        {
          q: 'Это законно?',
          a: 'Мы работаем в рамках применимых правил и делаем акцент на корректной проверке данных и документированном процессе.',
        },
        {
          q: 'Сколько времени занимает?',
          a: 'Срок зависит от вашей исходной ситуации, полноты данных и ответов сторон. Единый срок для всех кейсов некорректен.',
        },
        {
          q: 'Можно ли удалить просрочки?',
          a: 'Иногда можно оспорить неточности, но исход всегда индивидуален. Мы не обещаем удаление конкретных записей.',
        },
        {
          q: 'Можно ли удалить collections?',
          a: 'Возможность зависит от конкретной записи и подтверждающих данных. Сначала проверяем факты, затем рекомендуем шаги.',
        },
        {
          q: 'Вы гарантируете рост score?',
          a: 'Нет. Мы не даем гарантий роста score. Результаты индивидуальны и зависят от множества факторов.',
        },
        {
          q: 'Что вы НЕ делаете?',
          a: 'Не даем обещаний мгновенного результата, не обещаем "удалить все", не подменяем юридическую консультацию.',
        },
        {
          q: 'Нужны ли логины?',
          a: 'Нет, обычно достаточно данных и документов, необходимых для анализа и подготовки следующего шага.',
        },
        {
          q: 'Повредит ли dispute моему кредиту?',
          a: 'Универсального ответа нет. Мы объясняем риски и порядок действий до начала процесса.',
        },
        {
          q: 'Работаете ли со всеми штатами?',
          a: 'Доступность может зависеть от формата услуги и требований по комплаенсу. Уточняем это на этапе первичного контакта.',
        },
        {
          q: 'Сколько стоит / пакеты?',
          a: 'Стоимость и формат определяются после первичного анализа. Мы показываем опции прозрачно до старта работы.',
        },
      ],
    },
    disclosures: {
      short: 'No guaranteed outcomes. Results vary. We do not promise score increase.',
      footerTitle: 'Disclosures',
      footerItems: [
        'Credit Booster не аффилирован с Equifax, Experian или TransUnion.',
        'Результаты индивидуальны и зависят от исходных данных и вашей ситуации.',
        'Материалы по FCRA/FDCPA носят информационный характер и не являются юридической консультацией.',
        'Если вы не являетесь клиентом юридической фирмы, это не юридическая услуга.',
      ],
    },
    legal: {
      privacy: '/privacy/',
      terms: '/terms/',
      disclosures: '/disclosures/',
    },
    metrics: {
      enabled: false,
      items: [],
    },
  },
};
