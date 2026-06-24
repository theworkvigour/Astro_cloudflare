import type { SeoTask } from './task-list';

export function exportTasksJson(tasks: { high: SeoTask[]; medium: SeoTask[]; low: SeoTask[] }): string {
  return JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      summary: {
        high: tasks.high.length,
        medium: tasks.medium.length,
        low: tasks.low.length,
        total: tasks.high.length + tasks.medium.length + tasks.low.length,
      },
      tasks: {
        high: tasks.high,
        medium: tasks.medium,
        low: tasks.low,
      },
    },
    null,
    2,
  );
}

export function exportTasksMarkdown(tasks: { high: SeoTask[]; medium: SeoTask[]; low: SeoTask[] }): string {
  const lines: string[] = [];
  const date = new Date().toISOString().split('T')[0];

  lines.push(`# SEO Task List — ${date}`);
  lines.push('');
  lines.push(`**Summary:** ${tasks.high.length} high · ${tasks.medium.length} medium · ${tasks.low.length} low`);
  lines.push('');

  if (tasks.high.length > 0) {
    lines.push('## 🔥 HIGH PRIORITY TASKS');
    lines.push('');
    tasks.high.forEach((task, i) => {
      lines.push(`### ${i + 1}. ${task.type}`);
      lines.push('');
      lines.push(`**PAGE:**`);
      lines.push(`${task.page}`);
      lines.push('');
      lines.push(`**ISSUE:**`);
      lines.push(`${task.issue}`);
      lines.push('');
      lines.push(`**ACTION:**`);
      task.action.split('\n').forEach(a => lines.push(`- ${a.trim()}`));
      lines.push('');
      lines.push(`**Expected Impact:** ${task.expectedImpact}`);
      lines.push('');
      lines.push('---');
      lines.push('');
    });
  }

  if (tasks.medium.length > 0) {
    lines.push('## 🟡 MEDIUM PRIORITY TASKS');
    lines.push('');
    tasks.medium.forEach((task, i) => {
      lines.push(`### ${i + 1}. ${task.type}`);
      lines.push('');
      lines.push(`**PAGE:**`);
      lines.push(`${task.page}`);
      lines.push('');
      lines.push(`**ISSUE:**`);
      lines.push(`${task.issue}`);
      lines.push('');
      lines.push(`**ACTION:**`);
      task.action.split('\n').forEach(a => lines.push(`- ${a.trim()}`));
      lines.push('');
      lines.push('---');
      lines.push('');
    });
  }

  if (tasks.low.length > 0) {
    lines.push('## ⚪ LOW PRIORITY TASKS');
    lines.push('');
    tasks.low.forEach((task, i) => {
      lines.push(`### ${i + 1}. ${task.type}`);
      lines.push('');
      lines.push(`**PAGE:**`);
      lines.push(`${task.page}`);
      lines.push('');
      lines.push(`**ISSUE:**`);
      lines.push(`${task.issue}`);
      lines.push('');
      lines.push(`**ACTION:**`);
      task.action.split('\n').forEach(a => lines.push(`- ${a.trim()}`));
      lines.push('');
      lines.push('---');
      lines.push('');
    });
  }

  return lines.join('\n');
}

export function exportTasksCompact(tasks: { high: SeoTask[]; medium: SeoTask[]; low: SeoTask[] }): string {
  const lines: string[] = [];
  lines.push('🔥 HIGH PRIORITY TASKS');
  lines.push('');

  for (const task of tasks.high) {
    lines.push(`1. PAGE:`);
    lines.push(`${task.page}`);
    lines.push('');
    lines.push(`   ISSUE:`);
    lines.push(`   ${task.issue}`);
    lines.push('');
    lines.push(`   ACTION:`);
    for (const action of task.action.split('\n')) {
      lines.push(`   - ${action.trim()}`);
    }
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  if (tasks.medium.length > 0) {
    lines.push('🟡 MEDIUM PRIORITY TASKS');
    lines.push('');
    for (const task of tasks.medium) {
      lines.push(`1. PAGE:`);
      lines.push(`${task.page}`);
      lines.push('');
      lines.push(`   ISSUE:`);
      lines.push(`   ${task.issue}`);
      lines.push('');
      lines.push(`   ACTION:`);
      for (const action of task.action.split('\n')) {
        lines.push(`   - ${action.trim()}`);
      }
      lines.push('');
      lines.push('---');
      lines.push('');
    }
  }

  return lines.join('\n');
}

export function generateCsvRow(task: SeoTask): string {
  const safePage = `"${task.page.replace(/"/g, '""')}"`;
  const safeIssue = `"${task.issue.replace(/"/g, '""')}"`;
  const safeAction = `"${task.action.replace(/"/g, '""')}"`;
  return `${task.id},${task.priority},${task.type},${safePage},${safeIssue},${safeAction},${task.expectedImpact}`;
}

export function exportTasksCsv(tasks: { high: SeoTask[]; medium: SeoTask[]; low: SeoTask[] }): string {
  const header = 'ID,Priority,Type,Page,Issue,Action,ExpectedImpact';
  const all = [...tasks.high, ...tasks.medium, ...tasks.low];
  const rows = all.map(generateCsvRow);
  return [header, ...rows].join('\n');
}
