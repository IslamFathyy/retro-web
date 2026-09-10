import { get, post } from './api.js';
import { pageUrl, qs, setNav, showMessage, statusBadge } from './common.js';

setNav('retrospectives');
const retroId = qs('retroId');
const message = document.getElementById('message');

document.getElementById('feedback-link').href = pageUrl('feedback', { retroId });
document.getElementById('analysis-link').href = pageUrl('analysis', { retroId });
document.getElementById('report-link').href = pageUrl('report', { retroId });

function card(item) {
  const author = item.anonymous ? 'Anonymous' : item.displayName;
  return `<div class="feedback-card"><small>${author}</small><p>${item.text}</p></div>`;
}

async function load() {
  const retro = await get(`/retrospectives/${retroId}`);
  document.getElementById('retro-info').innerHTML = `<strong>${retro.title}</strong> — ${statusBadge(retro.status)}`;

  const items = await get(`/retrospectives/${retroId}/feedback`);
  const columns = {
    'went-well': items.filter((i) => i.type === 'went-well'),
    'did-not-go-well': items.filter((i) => i.type === 'did-not-go-well'),
    improvement: items.filter((i) => i.type === 'improvement'),
  };

  document.getElementById('board').innerHTML = `
    <div class="column"><h3>Went well</h3>${columns['went-well'].map(card).join('') || '<p>None yet</p>'}</div>
    <div class="column"><h3>Did not go well</h3>${columns['did-not-go-well'].map(card).join('') || '<p>None yet</p>'}</div>
    <div class="column"><h3>Improvement ideas</h3>${columns.improvement.map(card).join('') || '<p>None yet</p>'}</div>
  `;

  if (retro.status === 'open') {
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close retrospective';
    closeBtn.className = 'secondary';
    closeBtn.onclick = async () => {
      await post(`/retrospectives/${retroId}/close`);
      showMessage(message, 'Retrospective closed. You can now run analysis.');
      load();
    };
    document.getElementById('retro-info').appendChild(document.createElement('p')).appendChild(closeBtn);
  }
}

if (!retroId) showMessage(message, 'Missing retroId', true);
else load().catch((err) => showMessage(message, err.message, true));
