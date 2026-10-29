<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  const unique = uniqueById(reports as Report[]).filter((r) => r.mergedInto === 4471);
  const groups = groupByCause(unique, tenantOf);
  const exceptions = unique.filter((r) => notes.oneDayMove.includes(r.id));
  const months = [...new Set(unique.map((r) => r.receivedAt.slice(0, 7)))].sort();
  const count = (month: string, field: 'receivedAt' | 'mergedAt') => unique.filter((r) => r[field]?.startsWith(month)).length;
  const mismatches = groups.reduce((n, g) => n + g.reports.filter((r) => r.meta.intakeTag !== g.cause).length, 0);
</script>

<p>{reports.length} exported rows; {reports.length - unique.length} repeated IDs; <strong>{unique.length} unique reports</strong>. Duplicate rows were checked and are identical. {mismatches} intake tags disagree with the tenant-based classifier.</p>

<h2>Arrival and processing are separate clocks</h2>
<table>
  <thead><tr><th>Month</th><th>Received</th><th>Merged</th></tr></thead>
  <tbody>{#each months as month}<tr><td>{month}</td><td>{count(month, 'receivedAt')}</td><td>{count(month, 'mergedAt')}</td></tr>{/each}</tbody>
</table>
<p>First receipt: {unique.map((r) => r.receivedAt).sort()[0]}. First merge: {unique.map((r) => r.mergedAt!).sort()[0]}. On July 2, {unique.filter((r) => r.mergedAt?.startsWith('2026-07-02')).length} reports were merged, including {unique.filter((r) => r.receivedAt < '2026-07-01' && r.mergedAt?.startsWith('2026-07-02')).length} received before July. A merge spike describes desk processing, not the start of the failures.</p>

<h2>Unresolved timing observations</h2>
<p>The following {exceptions.length} reports remain inside the classifier's parser count. Their wording does not establish a month/day parsing cause, and it does not prove a separate timezone bug. Preserve original IDs and investigate booking timestamps, timezone offsets, invite payloads and delivery logs before assigning a new cause or moving counts.</p>
<ul>{#each exceptions as report}<li><strong>{report.id}</strong> · {report.tenant} · {report.channel}: <q>{report.body}</q></li>{/each}</ul>

<h2>Coverage</h2>
<p>{groups.map((g) => `${g.cause}: ${g.reports.length}`).join(' + ')} = {unique.length}. No report is unplaced. These are export-snapshot counts, not a claim about the live queue.</p>
