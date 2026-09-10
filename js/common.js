export function qs(name) {
  return new URLSearchParams(window.location.search).get(name);
}

/** Build a page URL with query params. */
export function pageUrl(page, params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value != null && value !== '')
  ).toString();
  const file = page.endsWith('.html') ? page : `${page}.html`;
  return query ? `${file}?${query}` : file;
}

export function setNav(active) {
  document.querySelectorAll('[data-nav]').forEach((link) => {
    link.classList.toggle('active', link.dataset.nav === active);
  });
}

export function showMessage(el, text, isError = false) {
  if (!el) return;
  el.textContent = text;
  el.className = isError ? 'message error' : 'message success';
  el.hidden = !text;
}

export function statusBadge(status) {
  return `<span class="badge badge-${status}">${status}</span>`;
}

export function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString();
}

export function formatOwnerTeamIds(ownerTeams, labelMap = {}, legacyOwner = '') {
  if (ownerTeams?.length) {
    return ownerTeams.map((id) => labelMap[id] || id).join(', ');
  }
  return legacyOwner || 'Unassigned';
}

/** Web UI renders insights from JSON charts; omit the markdown duplicate. */
export function stripInsightsFromMarkdown(markdown) {
  if (!markdown) return '';
  return markdown.replace(/^## Insights at a Glance\r?\n[\s\S]*?(?=^## )/m, '');
}

export function renderMarkdownSimple(markdown) {
  return markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/\n\n/g, '<br><br>');
}
