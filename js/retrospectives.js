import { get, post } from './api.js';
import { setNav, showMessage, statusBadge } from './common.js';

setNav('retrospectives');
const message = document.getElementById('message');
const list = document.getElementById('retro-list');
const form = document.getElementById('create-form');

function retroLinks(id) {
  return `
    <a href="feedback.html?retroId=${id}">Feedback</a> ·
    <a href="board.html?retroId=${id}">Board</a> ·
    <a href="analysis.html?retroId=${id}">Analysis</a> ·
    <a href="actions.html?retroId=${id}">Actions</a> ·
    <a href="report.html?retroId=${id}">Report</a>
  `;
}

async function load() {
  const retros = await get('/retrospectives');
  list.innerHTML = retros.map((r) => `
    <tr>
      <td>${r.title}</td>
      <td>${r.period}</td>
      <td>${statusBadge(r.status)}</td>
      <td>${r.feedbackCount}</td>
      <td>${r.actionCount}</td>
      <td>${retroLinks(r.id)}</td>
    </tr>
  `).join('') || '<tr><td colspan="6">No retrospectives yet.</td></tr>';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const body = {
      title: document.getElementById('title').value,
      team: document.getElementById('team').value,
      period: document.getElementById('period').value,
    };
    const retro = await post('/retrospectives', body);
    await post(`/retrospectives/${retro.id}/open`);
    showMessage(message, `Created and opened ${retro.id}`);
    form.reset();
    document.getElementById('team').value = 'Demo Team';
    await load();
  } catch (err) {
    showMessage(message, err.message, true);
  }
});

load().catch((err) => showMessage(message, err.message, true));
