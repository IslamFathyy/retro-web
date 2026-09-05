export function qs(name) {
  return new URLSearchParams(window.location.search).get(name);
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
