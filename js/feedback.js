import { get, post } from './api.js';
import { pageUrl, qs, setNav, showMessage, statusBadge } from './common.js';

setNav('retrospectives');
const retroId = qs('retroId');
const message = document.getElementById('message');
const retroInfo = document.getElementById('retro-info');
const form = document.getElementById('feedback-form');
const anonymous = document.getElementById('anonymous');
const nameField = document.getElementById('name-field');

document.getElementById('board-link').href = pageUrl('board', { retroId });

anonymous.addEventListener('change', () => {
  nameField.hidden = anonymous.checked;
});

async function loadRetro() {
  const retro = await get(`/retrospectives/${retroId}`);
  retroInfo.innerHTML = `<strong>${retro.title}</strong> — ${statusBadge(retro.status)}`;
  if (retro.status !== 'open') {
    showMessage(message, 'This retrospective is not open for feedback.', true);
    form.querySelector('button').disabled = true;
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const body = {
      type: document.getElementById('type').value,
      text: document.getElementById('text').value,
      anonymous: anonymous.checked,
      displayName: anonymous.checked ? null : document.getElementById('displayName').value,
    };
    await post(`/retrospectives/${retroId}/feedback`, body);
    showMessage(message, 'Feedback submitted. Thank you!');
    form.reset();
    anonymous.checked = true;
    nameField.hidden = true;
  } catch (err) {
    showMessage(message, err.message, true);
  }
});

if (!retroId) {
  showMessage(message, 'Missing retroId in URL', true);
} else {
  loadRetro().catch((err) => showMessage(message, err.message, true));
}
