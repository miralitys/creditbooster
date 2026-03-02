const express = require('express');

const app = express();

const PORT = Number(process.env.PORT || 10000);
const GHL_WEBHOOK_URL = (process.env.GHL_WEBHOOK_URL || '').trim();
const GHL_WEBHOOK_SECRET = (process.env.GHL_WEBHOOK_SECRET || '').trim();

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

function jsonError(res, status, message, details = undefined) {
  const payload = { ok: false, error: message };
  if (details) payload.details = details;
  res.status(status).json(payload);
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function normalizePhone(value) {
  return String(value || '').trim();
}

function normalizeName(value) {
  return String(value || '').trim();
}

function validateLeadPayload(payload) {
  const name = normalizeName(payload.name);
  const email = normalizeEmail(payload.email);
  const phone = normalizePhone(payload.phone);
  const phoneDigits = phone.replace(/\D/g, '');

  if (name.length < 2) return 'Некорректное имя';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Некорректный email';
  if (phoneDigits.length < 10) return 'Некорректный телефон';
  return '';
}

function buildWebhookPayload(body, req) {
  const name = normalizeName(body.name);
  const email = normalizeEmail(body.email);
  const phone = normalizePhone(body.phone);

  return {
    event: 'lead_submit',
    received_at: new Date().toISOString(),
    source: body.source || 'creditbooster_site',
    full_name: name,
    first_name: name.split(/\s+/)[0] || name,
    email,
    phone,
    consent: {
      tcpa_required: Boolean(body.tcpaRequired),
      tcpa_accepted: Boolean(body.tcpaAccepted),
    },
    page: {
      url: body.pageUrl || '',
      title: body.pageTitle || '',
      path: req.path,
      referrer: req.get('referer') || '',
      user_agent: req.get('user-agent') || '',
    },
    context: body.context || {},
    quiz_answers: body.quizAnswers || {},
    raw: body,
  };
}

async function sendToGhlWebhook(payload) {
  if (!GHL_WEBHOOK_URL) {
    throw new Error('GHL_WEBHOOK_URL is not configured');
  }

  const headers = { 'Content-Type': 'application/json' };
  if (GHL_WEBHOOK_SECRET) {
    headers['X-CreditBooster-Signature'] = GHL_WEBHOOK_SECRET;
  }

  const response = await fetch(GHL_WEBHOOK_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const bodyText = await response.text().catch(() => '');
    throw new Error(`GHL webhook failed: ${response.status} ${bodyText.slice(0, 300)}`);
  }
}

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'creditbooster', crm: GHL_WEBHOOK_URL ? 'configured' : 'not_configured' });
});

app.post('/api/leads', async (req, res) => {
  const error = validateLeadPayload(req.body || {});
  if (error) return jsonError(res, 400, error);

  const webhookPayload = buildWebhookPayload(req.body || {}, req);

  try {
    await sendToGhlWebhook(webhookPayload);
    return res.json({ ok: true });
  } catch (err) {
    console.error('[api/leads]', err);
    const details = err instanceof Error ? err.message : 'unknown_error';
    const status = details.includes('not configured') ? 500 : 502;
    return jsonError(res, status, 'Не удалось отправить заявку в CRM', details);
  }
});

app.use(express.static(__dirname, { index: 'index.html' }));

app.listen(PORT, () => {
  console.log(`CreditBooster server listening on http://localhost:${PORT}`);
});
