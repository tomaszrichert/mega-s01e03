# S01E03 — what it shows

Reassessment of support ticket #4471 using the supplied KB export.

- Findings source: `support-kb/src/routes/kb/incidents/4471-reassessment/+page.svx`
- Rendered findings: `rendered/findings.html`
- Proposed decision: `support-kb/src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx`
- Rendered decision: `rendered/decision.html`
- Issue drafts: `issues/parser.md` (379 reports), `issues/hint.md` (33 reports)

## Build

```sh
npm ci --ignore-scripts
npm run build
```

The build compiles the actual mdsvex/Svelte source with Vite and renders server HTML, including computed tables, the timeline and signature-derived desk reference. Open the HTML locally to inspect it. No hosting is required by the stated challenge contract.

The original export and accepted decision 0001 remain unchanged. Counts are deduplicated by report ID and classified through tenant locale/form configuration, not intake tags. Five anomalous timing reports remain explicit unresolved evidence within the classifier's parser count.

Publish one GitHub issue from each draft (first line is the issue title). Push source and rendered HTML to the public repository, then the course can inspect the repository. No issues have been published by this local build.
