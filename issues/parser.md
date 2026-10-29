# Date parser reads month first for day-first tenants — 379 reports

## Engineering disposition

Live desk update checked 2026-10-29: `#4471 · closed 05 oct`; parser **fixed**, `fix(dates): parse dd/mm for eu locales`. Close this issue as completed. This disposition does not independently resolve the five timing observations preserved below.

## Problem

The shared parser reads dates month first, but the affected tenants write day first. Ambiguous dates flip month and day. This is separate from booking-v3's misleading date-field hint.

## Report count and scope

**379 unique reports** in #4471, received 2026-04-01 through 2026-10-04 across 11 tenants. Deduplicate `reports-4471.json` by ID, filter `mergedInto === 4471`, join tenant configuration and apply `causeOf` in `causes.ts`. All 412 unique reports reconcile as 379 parser + 33 hint. Intake tags are not authoritative: 23 reports in this group were tagged hint.

Example: R-41200, Harbour Dental (`en-GB`, booking-v2, app): “Our 7 April reminder went out on 4 July. Is this a joke. It is not April Fools where we are.” R-41201 reverses the reporter's stated direction; preserve both distinct report IDs rather than silently correcting the record.

## Expected outcome

Respect the tenant's date convention and validate ambiguous input. Verify the saved booking and invite match the intended calendar date. Cover app/email, booking-v2 and other parser-classified paths; test day-first and month-first controls.

## Unresolved evidence

R-41202, R-41209, R-41236, R-41344 and R-41620 describe one-day or unusual timing behavior. The supplied classifier includes all five in these 379 reports; their text does not prove parser causality. Preserve and investigate original timestamps, timezone offsets and invite logs before reclassification. Do not silently drop them or claim a proven third bug.

KB: `support-kb/src/routes/kb/incidents/4471-reassessment/+page.svx`; rendered: `rendered/findings.html`. Counts describe the 2026-10-04 export, not the live queue.
