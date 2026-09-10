import { get, post } from './api.js';
import { qs, setNav, showMessage, renderMarkdownSimple, stripInsightsFromMarkdown } from './common.js';

function renderReportBody(markdown) {
  return renderMarkdownSimple(stripInsightsFromMarkdown(markdown));
}
import { renderInsightsCharts } from './insights-charts.js';

setNav('retrospectives');
const retroId = qs('retroId');
const message = document.getElementById('message');
const report = document.getElementById('report');
const insightsCharts = document.getElementById('insights-charts');

async function loadInsights() {
  try {
    const insights = await get(`/retrospectives/${retroId}/report/insights`);
    renderInsightsCharts(insights, insightsCharts);
  } catch {
    renderInsightsCharts(null, insightsCharts);
  }
}

async function loadReport() {
  try {
    const data = await get(`/retrospectives/${retroId}/report`);
    report.innerHTML = renderReportBody(data.markdown);
  } catch {
    report.innerHTML = '<p>No report yet. Click Generate report.</p>';
  }
}

document.getElementById('generate-btn').addEventListener('click', async () => {
  try {
    const data = await post(`/retrospectives/${retroId}/report/generate`);
    report.innerHTML = renderReportBody(data.markdown);
    await loadInsights();
    showMessage(message, 'Report generated.');
  } catch (err) {
    showMessage(message, err.message, true);
  }
});

if (!retroId) showMessage(message, 'Missing retroId', true);
else {
  Promise.all([loadInsights(), loadReport()]).catch((err) => showMessage(message, err.message, true));
}
