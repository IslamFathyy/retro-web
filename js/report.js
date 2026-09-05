import { get, post } from './api.js';
import { qs, setNav, showMessage, renderMarkdownSimple } from './common.js';

setNav('retrospectives');
const retroId = qs('retroId');
const message = document.getElementById('message');
const report = document.getElementById('report');

async function loadReport() {
  try {
    const data = await get(`/retrospectives/${retroId}/report`);
    report.innerHTML = renderMarkdownSimple(data.markdown);
  } catch {
    report.innerHTML = '<p>No report yet. Click Generate report.</p>';
  }
}

document.getElementById('generate-btn').addEventListener('click', async () => {
  try {
    const data = await post(`/retrospectives/${retroId}/report/generate`);
    report.innerHTML = renderMarkdownSimple(data.markdown);
    showMessage(message, 'Report generated.');
  } catch (err) {
    showMessage(message, err.message, true);
  }
});

if (!retroId) showMessage(message, 'Missing retroId', true);
else loadReport().catch((err) => showMessage(message, err.message, true));
