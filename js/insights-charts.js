function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function priorityClass(priority) {
  if (priority === 'high') return 'priority-high';
  if (priority === 'medium') return 'priority-medium';
  return 'priority-low';
}

function renderBarChart(title, rows, valueKey, maxValue, valueLabel) {
  if (!rows.length) return `<p class="muted">No data.</p>`;

  const bars = rows.map((row) => {
    const value = row[valueKey];
    const width = maxValue ? Math.round((value / maxValue) * 100) : 0;
    return `
      <div class="chart-row">
        <div class="chart-label">${escapeHtml(row.label)}</div>
        <div class="chart-bar-track">
          <div class="chart-bar-fill" style="width:${width}%"></div>
        </div>
        <div class="chart-value">${value}${valueLabel ? ` ${valueLabel}` : ''}</div>
      </div>
    `;
  }).join('');

  return `<h4>${escapeHtml(title)}</h4><div class="chart-panel">${bars}</div>`;
}

export function renderInsightsCharts(insights, container) {
  if (!insights) {
    container.innerHTML = '<p class="muted">Insights not generated yet. Run /generate-report with Cursor.</p>';
    return;
  }

  const mix = insights.participationMix;
  const total = insights.feedbackCount || 0;
  const mixRows = [
    { label: 'Went well', value: mix.wentWell },
    { label: 'Did not go well', value: mix.didNotGoWell },
    { label: 'Improvement ideas', value: mix.improvement },
  ].map((row) => ({ ...row, label: row.label }));

  const topicRows = (insights.topicBreakdown || []).map((t) => ({
    label: `${t.label} (${t.percent}%)`,
    value: t.feedbackItems,
    priority: t.priority,
  }));

  const recurringRows = (insights.recurringTopics || []).map((t) => ({
    label: t.label,
    value: t.retrosSeen,
    priority: t.priority,
  }));

  const maxTopic = Math.max(...topicRows.map((r) => r.value), 1);
  const maxRecurring = Math.max(...recurringRows.map((r) => r.value), insights.recurringTopics?.[0]?.retrosTotal || 1);

  container.innerHTML = `
    <h3>Insights at a Glance</h3>
    <p class="muted chart-disclaimer">Counts reflect anonymous feedback items, not individuals.</p>
    ${renderBarChart('Participation mix', mixRows.map((r) => ({ label: r.label, value: r.value })), 'value', total, 'items')}
    ${renderBarChart('Topic share (this retrospective)', topicRows, 'value', maxTopic, 'items')}
    <div class="priority-legend">
      ${(insights.topicBreakdown || []).map((t) => `<span class="priority-tag ${priorityClass(t.priority)}">${escapeHtml(t.label)}: ${t.priority}</span>`).join('')}
    </div>
    ${renderBarChart('Recurring across retrospectives', recurringRows, 'value', maxRecurring, 'retros')}
    <div class="priority-legend">
      ${(insights.recurringTopics || []).map((t) => `<span class="priority-tag ${priorityClass(t.priority)}">${escapeHtml(t.label)}: ${t.retrosSeen}/${t.retrosTotal}</span>`).join('')}
    </div>
  `;
}
