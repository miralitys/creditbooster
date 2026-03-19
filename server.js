const express = require('express');
const path = require('path');
const { initLeadsDb, insertLead, updateLeadStatus, getLeads } = require('./lib/leadsDb');

const app = express();

const PORT = Number(process.env.PORT || 10000);
const GHL_WEBHOOK_URL = (process.env.GHL_WEBHOOK_URL || '').trim();
const GHL_WEBHOOK_SECRET = (process.env.GHL_WEBHOOK_SECRET || '').trim();
const ADMIN_USER = (process.env.ADMIN_USER || '').trim();
const ADMIN_PASS = (process.env.ADMIN_PASS || '').trim();
const ADMIN_TIME_ZONE = 'America/New_York';
const rootLandingDir = path.join(__dirname, 'business-booster2');
const adminDateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: ADMIN_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZoneName: 'short',
});

const preferredDbPath = process.env.LEADS_DB_PATH
  ? String(process.env.LEADS_DB_PATH)
  : path.join(__dirname, 'data', 'leads.sqlite');
let dbPath = preferredDbPath;

try {
  initLeadsDb(dbPath);
} catch (err) {
  const fallbackPath = path.join(__dirname, 'data', 'leads.sqlite');
  console.error('[leads] Failed to init DB at preferred path:', dbPath, err instanceof Error ? err.message : err);
  console.error('[leads] Falling back to local path:', fallbackPath);
  dbPath = fallbackPath;
  initLeadsDb(dbPath);
}

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

function jsonError(res, status, message, details = undefined) {
  const payload = { ok: false, error: message };
  if (details) payload.details = details;
  res.status(status).json(payload);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatAdminDate(value) {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return escapeHtml(value);
  }

  const parts = adminDateFormatter.formatToParts(date);
  const map = Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]));

  return `${map.month}/${map.day}/${map.year} ${map.hour}:${map.minute}:${map.second} ${map.timeZoneName}`;
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
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Некорректный email';
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

function getPageSlugFromSource(source = '') {
  const raw = String(source || '');
  if (raw.includes('|')) return raw.split('|').slice(1).join('|');
  return '';
}

function requireAdminAuth(req, res, next) {
  if (!ADMIN_USER || !ADMIN_PASS) {
    return res.status(503).send('Admin auth is not configured');
  }
  const header = req.get('authorization') || '';
  if (!header.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="CreditBooster Admin"');
    return res.status(401).send('Authentication required');
  }
  const decoded = Buffer.from(header.replace('Basic ', ''), 'base64').toString('utf8');
  const [user, pass] = decoded.split(':');
  if (user !== ADMIN_USER || pass !== ADMIN_PASS) {
    res.set('WWW-Authenticate', 'Basic realm="CreditBooster Admin"');
    return res.status(401).send('Invalid credentials');
  }
  return next();
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

app.get(['/thank-you', '/thank-you/'], (_req, res) => {
  res.sendFile(path.join(__dirname, 'thank-you', 'index.html'));
});

app.get('/page.css', (_req, res) => {
  res.sendFile(path.join(rootLandingDir, 'page.css'));
});

app.get('/page.js', (_req, res) => {
  res.sendFile(path.join(rootLandingDir, 'page.js'));
});

app.get('/favicon.ico', (_req, res) => {
  res.sendFile(path.join(rootLandingDir, 'favicon.ico'));
});

app.use('/images', express.static(path.join(rootLandingDir, 'images')));
app.use('/Video', express.static(path.join(rootLandingDir, 'Video')));

app.post('/api/leads', async (req, res) => {
  const error = validateLeadPayload(req.body || {});
  if (error) return jsonError(res, 400, error);

  const webhookPayload = buildWebhookPayload(req.body || {}, req);
  const pageSlug = getPageSlugFromSource(webhookPayload.source) || (webhookPayload.context || {}).lp_slug || '';
  const leadId = await insertLead(dbPath, {
    fullName: webhookPayload.full_name,
    email: webhookPayload.email,
    phone: webhookPayload.phone,
    source: webhookPayload.source,
    pageSlug,
    pageUrl: webhookPayload.page.url,
    pageTitle: webhookPayload.page.title,
    ip: req.ip,
    userAgent: webhookPayload.page.user_agent,
  });

  try {
    await sendToGhlWebhook(webhookPayload);
    await updateLeadStatus(dbPath, leadId, { status: 'sent', error: '' });
    return res.json({ ok: true });
  } catch (err) {
    console.error('[api/leads]', err);
    await updateLeadStatus(dbPath, leadId, { status: 'failed', error: err instanceof Error ? err.message : 'unknown_error' });
    const details = err instanceof Error ? err.message : 'unknown_error';
    const status = details.includes('not configured') ? 500 : 502;
    return jsonError(res, status, 'Не удалось отправить заявку в CRM', details);
  }
});

app.get('/admin', requireAdminAuth, async (req, res) => {
  const { q = '', source = '' } = req.query;
  const leads = await getLeads(dbPath, { q: String(q), source: String(source) });
  const rows = leads
    .map(
      (lead) => `
        <tr>
          <td title="${escapeHtml(lead.created_at)}">${formatAdminDate(lead.created_at)}</td>
          <td>${escapeHtml(lead.full_name || '')}</td>
          <td>${escapeHtml(lead.email || '')}</td>
          <td>${escapeHtml(lead.phone || '')}</td>
          <td>${escapeHtml(lead.source || '')}</td>
          <td>${escapeHtml(lead.page_slug || '')}</td>
          <td>${escapeHtml(lead.crm_status || '')}</td>
        </tr>`
    )
    .join('');

  res.set('Content-Type', 'text/html; charset=utf-8');
  res.send(`
    <!doctype html>
    <html lang="ru">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Credit Booster Admin</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 24px; background: #f6f7fb; color: #1f2430; }
          h1 { margin: 0 0 8px; }
          form { display: flex; gap: 8px; margin: 16px 0; }
          input { padding: 8px 10px; border-radius: 8px; border: 1px solid #d9deea; min-width: 220px; }
          button { padding: 8px 12px; border: none; border-radius: 8px; background: #2f55d4; color: #fff; cursor: pointer; }
          table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; }
          th, td { padding: 12px 14px; border-bottom: 1px solid #eef1f6; text-align: left; font-size: 14px; }
          th { background: #f0f3ff; font-weight: 600; }
          tr:last-child td { border-bottom: none; }
          .meta { font-size: 13px; color: #6b7280; }
        </style>
      </head>
      <body>
        <h1>Заявки</h1>
        <div class="meta">Показаны последние ${leads.length} записей</div>
        <div class="meta">Часовой пояс: New York (${ADMIN_TIME_ZONE})</div>
        <form method="get">
          <input name="q" placeholder="Поиск (имя, email, телефон)" value="${escapeHtml(q)}" />
          <input name="source" placeholder="Source (например website|credit-score)" value="${escapeHtml(source)}" />
          <button type="submit">Фильтр</button>
        </form>
        <table>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Имя</th>
              <th>Email</th>
              <th>Телефон</th>
              <th>Source</th>
              <th>Страница</th>
              <th>CRM</th>
            </tr>
          </thead>
          <tbody>
            ${rows || '<tr><td colspan="7">Нет данных</td></tr>'}
          </tbody>
        </table>
      </body>
    </html>
  `);
});

app.use(express.static(__dirname, { index: 'index.html' }));

app.listen(PORT, () => {
  console.log(`CreditBooster server listening on http://localhost:${PORT}`);
});
