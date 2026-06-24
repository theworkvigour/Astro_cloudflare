export function exportTasks(tasks) {
  return {
    high: tasks.high || [],
    medium: tasks.medium || [],
  };
}

export function tasksMarkdown(tasks) {
  const lines = ['# SEO Tasks\n', `Generated: ${new Date().toISOString()}\n`];

  if (tasks.high?.length) {
    lines.push('## High Priority\n');
    for (const t of tasks.high) {
      lines.push(`### [${t.type}] ${t.page}`);
      lines.push(`- **Query:** ${t.query}`);
      lines.push(`- **Reason:** ${t.reason}`);
      lines.push(`- **Action:** ${t.action}\n`);
    }
  }

  if (tasks.medium?.length) {
    lines.push('## Medium Priority\n');
    for (const t of tasks.medium) {
      lines.push(`### [${t.type}] ${t.page}`);
      lines.push(`- **Query:** ${t.query}`);
      lines.push(`- **Reason:** ${t.reason}`);
      lines.push(`- **Action:** ${t.action}\n`);
    }
  }

  return lines.join('\n');
}

export function tasksCsv(tasks) {
  const rows = [['type', 'priority', 'page', 'query', 'reason', 'action']];
  for (const t of [...(tasks.high || []), ...(tasks.medium || [])]) {
    rows.push([t.type, String(t.priority), t.page, t.query, t.reason, t.action]);
  }
  return rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
}
