import { get, put } from './api.js';
import { qs, setNav, showMessage, formatOwnerTeamIds } from './common.js';

setNav('actions');
const retroId = qs('retroId');
const message = document.getElementById('message');
const retroActions = document.getElementById('retro-actions');
const openActions = document.getElementById('open-actions');

let teamLabels = {};

function formatTeams(action) {
  return formatOwnerTeamIds(action.ownerTeams, teamLabels, action.owner);
}

function actionRow(action, editable = true) {
  return `
    <div class="feedback-card" data-id="${action.id}">
      <strong>${action.title}</strong>
      <p>Teams: ${formatTeams(action)} · Target: ${action.targetDate} · Status: ${action.status}</p>
      ${editable ? `
        <select class="status-select">
          <option value="open" ${action.status === 'open' ? 'selected' : ''}>open</option>
          <option value="in-progress" ${action.status === 'in-progress' ? 'selected' : ''}>in-progress</option>
          <option value="done" ${action.status === 'done' ? 'selected' : ''}>done</option>
          <option value="cancelled" ${action.status === 'cancelled' ? 'selected' : ''}>cancelled</option>
        </select>
        <button class="save-btn">Save</button>
      ` : ''}
    </div>
  `;
}

async function loadRetroActions() {
  if (!retroId) {
    retroActions.innerHTML = '<p>Select a retrospective from the list page to view its actions.</p>';
    return;
  }
  const retro = await get(`/retrospectives/${retroId}`);
  const doc = await get(`/retrospectives/${retroId}/actions`);
  retroActions.innerHTML = `<h3>${retro.title}</h3>${doc.actions.map((a) => actionRow(a)).join('') || '<p>No actions yet.</p>'}`;

  retroActions.querySelectorAll('.save-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const card = btn.closest('[data-id]');
      const status = card.querySelector('.status-select').value;
      try {
        await put(`/retrospectives/${retroId}/actions/${card.dataset.id}`, { status });
        showMessage(message, 'Action updated.');
        loadRetroActions();
      } catch (err) {
        showMessage(message, err.message, true);
      }
    });
  });
}

async function loadOpenActions() {
  const items = await get('/actions/open');
  openActions.innerHTML = items.map((a) => actionRow(a, false)).join('') || '<p>No open actions.</p>';
}

async function init() {
  try {
    const teamsDoc = await get('/action-teams');
    teamLabels = Object.fromEntries(teamsDoc.teams.map((team) => [team.id, team.label]));
  } catch {
    teamLabels = {};
  }
  await Promise.all([loadRetroActions(), loadOpenActions()]);
}

init().catch((err) => showMessage(message, err.message, true));
