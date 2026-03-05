const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function initLeadsDb(dbPath) {
  ensureDir(dbPath);
  const db = new Database(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL,
      full_name TEXT,
      email TEXT,
      phone TEXT,
      source TEXT,
      page_slug TEXT,
      page_url TEXT,
      page_title TEXT,
      ip TEXT,
      user_agent TEXT,
      crm_status TEXT,
      crm_error TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
    CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
    CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);
    CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
  `);
  db.close();
}

function insertLead(dbPath, lead) {
  const db = new Database(dbPath);
  const stmt = db.prepare(`
    INSERT INTO leads (
      created_at, full_name, email, phone, source, page_slug, page_url, page_title, ip, user_agent, crm_status, crm_error
    ) VALUES (
      @created_at, @full_name, @email, @phone, @source, @page_slug, @page_url, @page_title, @ip, @user_agent, @crm_status, @crm_error
    )
  `);
  const info = stmt.run({
    created_at: new Date().toISOString(),
    full_name: lead.fullName || '',
    email: lead.email || '',
    phone: lead.phone || '',
    source: lead.source || '',
    page_slug: lead.pageSlug || '',
    page_url: lead.pageUrl || '',
    page_title: lead.pageTitle || '',
    ip: lead.ip || '',
    user_agent: lead.userAgent || '',
    crm_status: 'pending',
    crm_error: '',
  });
  db.close();
  return info.lastInsertRowid;
}

function updateLeadStatus(dbPath, leadId, { status, error }) {
  const db = new Database(dbPath);
  const stmt = db.prepare(`
    UPDATE leads SET crm_status = @status, crm_error = @error WHERE id = @id
  `);
  stmt.run({
    id: leadId,
    status: status || 'pending',
    error: error || '',
  });
  db.close();
}

function getLeads(dbPath, { q, source }) {
  const db = new Database(dbPath, { readonly: true });
  const params = {
    q: `%${q || ''}%`,
    source: `%${source || ''}%`,
  };
  const stmt = db.prepare(`
    SELECT created_at, full_name, email, phone, source, page_slug, crm_status
    FROM leads
    WHERE (full_name LIKE @q OR email LIKE @q OR phone LIKE @q)
      AND source LIKE @source
    ORDER BY datetime(created_at) DESC
    LIMIT 500
  `);
  const rows = stmt.all(params);
  db.close();
  return rows;
}

module.exports = {
  initLeadsDb,
  insertLead,
  updateLeadStatus,
  getLeads,
};
