# booking-v3 date hint contradicts tenant-local parsing — 33 reports

## Engineering disposition

Live desk update checked 2026-10-29: `#4471 · closed 05 oct`; hint **won't fix**, because **booking-v3 form retired**. Close this issue as not planned, not as a shipped hint fix. Preserve its 33-report history.

## Problem

booking-v3 displays `MM/DD/YYYY`, but its form interprets dates in the tenant's day-first order. Users following the displayed hint get a different date. A shared-parser fix does not fix this UI/input-contract mismatch.

## Report count and scope

**33 unique reports** in #4471, received 2026-04-17 through 2026-09-22 across Alder Physio (`de-DE`), Copper Studio (`es-ES`) and Pale Harbour (`pt-PT`). All use booking-v3. Deduplicate `reports-4471.json` by ID, filter `mergedInto === 4471`, resolve tenant locale/form, then apply `causeOf` from `causes.ts`. Form channel + booking-v3 + day-first tenant identifies this cause. Browser locale alone is not authoritative. 15 of these reports were intake-tagged parser.

Examples: R-41230 (Copper Studio/form); R-41241 (Alder Physio/form, browser en-US despite tenant de-DE); R-41251 (Pale Harbour/form). The complete population reconciles as 379 parser + 33 hint = 412 unique reports.

## Expected outcome

Make the visible date hint agree with the accepted input order and tenant locale. Test ambiguous dates through booking-v3, following the hint and using the tenant's date convention. Assert the displayed hint, saved date and invite agree. Test booking-v2 and month-first controls to avoid conflating this with the parser issue.

KB: `support-kb/src/routes/kb/incidents/4471-reassessment/+page.svx`; rendered: `rendered/findings.html`. Counts describe the 2026-10-04 export, not the live queue.
