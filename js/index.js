import { get } from './api.js';
import { setNav, showMessage, statusBadge } from './common.js';

setNav('dashboard');
const message = document.getElementById('message');
const stats = document.getElementById('stats');
const comparison = document.getElementById('comparison');

async function load() {
  try {
    const summary = await get('/dashboard');
    stats.innerHTML = `
      <div class="card"><strong>Total retrospectives</strong><p>${summary.totalRetrospectives}</p></div>
      <div class="card"><strong>Open retrospective</strong><p>${summary.openRetrospective?.title || 'None'}</p></div>
      <div class="card"><strong>Open actions</strong><p>${summary.openActionsCount}</p></div>
      <div class="card"><strong>Latest</strong><p>${summary.latestRetrospective?.title || 'None'}</p></div>
    `;

    const comp = await get('/comparison');
    comparison.innerHTML = `
      <h3>Historical observations</h3>
      <ul>${comp.observations.map((o) => `<li>${o}</li>`).join('')}</ul>
      <p>Recurring themes: ${comp.recurringThemes.length ? comp.recurringThemes.map((t) => t.name).join(', ') : 'None yet'}</p>
    `;
  } catch (err) {
    showMessage(message, err.message, true);
  }
}

load();
