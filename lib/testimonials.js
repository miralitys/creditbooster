import { TESTIMONIALS_SECTION } from '/content/testimonials.js';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buildCardsMarkup(items) {
  return items
    .map(
      (item) => `
        <article class="testimonial-card">
          <div class="testimonial-card-head">
            <strong class="testimonial-name">${escapeHtml(item.name)}</strong>
            <span class="testimonial-badge">Шаблон</span>
          </div>
          <p class="testimonial-quote">${escapeHtml(item.quote)}</p>
          <dl class="testimonial-scores">
            <div class="testimonial-score">
              <dt>Score был</dt>
              <dd>${escapeHtml(item.scoreBefore)}</dd>
            </div>
            <div class="testimonial-score">
              <dt>Score стал</dt>
              <dd>${escapeHtml(item.scoreAfter)}</dd>
            </div>
          </dl>
        </article>
      `
    )
    .join('');
}

function renderTestimonialsSection(root) {
  const eyebrow = root.querySelector('[data-testimonials-eyebrow]');
  const title = root.querySelector('[data-testimonials-title]');
  const subtitle = root.querySelector('[data-testimonials-subtitle]');
  const list = root.querySelector('[data-testimonials-list]');
  const note = root.querySelector('[data-testimonials-note]');

  if (eyebrow) eyebrow.textContent = TESTIMONIALS_SECTION.eyebrow;
  if (title) title.textContent = TESTIMONIALS_SECTION.title;
  if (subtitle) subtitle.textContent = TESTIMONIALS_SECTION.subtitle;
  if (list) list.innerHTML = buildCardsMarkup(TESTIMONIALS_SECTION.items);
  if (note) note.textContent = TESTIMONIALS_SECTION.note;
}

function initTestimonials() {
  document.querySelectorAll('[data-testimonials-root]').forEach((root) => {
    renderTestimonialsSection(root);
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTestimonials, { once: true });
  } else {
    initTestimonials();
  }
}
