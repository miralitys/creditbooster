(function () {
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function normalizePhone(value) {
    return String(value || '').replace(/\D/g, '').slice(0, 10);
  }

  function selectField(form, selectors) {
    for (const selector of selectors) {
      const field = form.querySelector(selector);
      if (field instanceof HTMLInputElement) return field;
    }
    return null;
  }

  function getFormValues(form) {
    const nameField = selectField(form, [
      'input[name="Name"]',
      'input[name="name"]',
      'input[type="text"]',
    ]);
    const emailField = selectField(form, [
      'input[name="Email"]',
      'input[name="email"]',
      'input[type="email"]',
    ]);
    const phoneField = selectField(form, [
      'input[name="Phone"]',
      'input[name="phone"]',
      'input[type="tel"]',
    ]);
    const consentField = form.querySelector('input[type="checkbox"]');

    return {
      name: nameField ? nameField.value.trim() : '',
      email: emailField ? emailField.value.trim() : '',
      phone: phoneField ? phoneField.value.trim() : '',
      consent: !(consentField instanceof HTMLInputElement) || consentField.checked,
    };
  }

  function validate(values) {
    if (values.name.length < 2) return 'Введите корректное имя.';
    if (!EMAIL_RE.test(values.email)) return 'Введите корректный email.';
    if (normalizePhone(values.phone).length !== 10) return 'Укажите телефон в US формате (10 цифр).';
    if (!values.consent) return 'Нужно согласие на обработку персональных данных.';
    return '';
  }

  function toggleSubmitState(form, isLoading) {
    const submit =
      form.querySelector('button[type="submit"]') ||
      form.querySelector('input[type="submit"]') ||
      form.querySelector('.t-submit');

    if (!(submit instanceof HTMLButtonElement) && !(submit instanceof HTMLInputElement)) return;

    if (!submit.dataset.originalText) {
      submit.dataset.originalText = submit instanceof HTMLInputElement ? submit.value : submit.textContent || '';
    }

    submit.disabled = isLoading;
    if (submit instanceof HTMLInputElement) {
      submit.value = isLoading ? 'Отправляем...' : submit.dataset.originalText;
      return;
    }
    submit.textContent = isLoading ? 'Отправляем...' : submit.dataset.originalText;
  }

  function clearMessages(form) {
    form.querySelectorAll('.js-errorbox-all').forEach((box) => {
      if (box instanceof HTMLElement) box.style.display = 'none';
    });

    form.querySelectorAll('.t-form__errorbox-item').forEach((item) => {
      item.textContent = '';
    });

    form.querySelectorAll('.js-successbox').forEach((box) => {
      if (box instanceof HTMLElement) box.style.display = 'none';
    });
  }

  function showError(form, message) {
    const errorWrapper = form.querySelector('.js-errorbox-all');
    const errorItem = form.querySelector('.js-rule-error-all');

    if (errorWrapper instanceof HTMLElement) {
      errorWrapper.style.display = 'block';
    }

    if (errorItem instanceof HTMLElement) {
      errorItem.textContent = message;
    }
  }

  function showSuccess(form, message) {
    const success = form.querySelector('.js-successbox');
    if (!(success instanceof HTMLElement)) return;
    success.textContent = message;
    success.style.display = 'block';
  }

  async function sendLead(values) {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        phone: values.phone,
        source: 'website|business-booster2',
        tcpaRequired: true,
        tcpaAccepted: values.consent,
        pageUrl: window.location.href,
        pageTitle: document.title,
        context: {
          page_variant: 'business_booster2',
          page_path: window.location.pathname,
        },
      }),
    });

    let payload = null;
    try {
      payload = await response.json();
    } catch (_error) {
      payload = null;
    }

    if (!response.ok) {
      throw new Error(payload && payload.error ? payload.error : 'Не удалось отправить заявку.');
    }
  }

  document.addEventListener(
    'submit',
    async (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || !form.matches('.t-form')) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      clearMessages(form);

      const values = getFormValues(form);
      const validationError = validate(values);
      if (validationError) {
        showError(form, validationError);
        return;
      }

      toggleSubmitState(form, true);

      try {
        await sendLead(values);
        form.reset();
        showSuccess(form, 'Спасибо! Ваша заявка отправлена. В ближайшее время мы с Вами свяжемся.');
      } catch (error) {
        showError(form, error instanceof Error ? error.message : 'Не удалось отправить заявку.');
      } finally {
        toggleSubmitState(form, false);
      }
    },
    true
  );
})();
