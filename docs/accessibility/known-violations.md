# Accessibility — Known Acceptable Violations

This document records axe-core violations that are intentionally excluded from
the CI blocking check, along with justification and the ticket tracking the fix.

---

## nested-interactive — GiftCard claim view

| Field         | Value                                                                                                                                                                                                                                                                                                          |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rule ID       | `nested-interactive`                                                                                                                                                                                                                                                                                           |
| Impact        | serious                                                                                                                                                                                                                                                                                                        |
| Component     | `src/components/gift/GiftCard.tsx`                                                                                                                                                                                                                                                                             |
| Description   | `ClaimButton` (renders a `<button>`) is a child of `<article role="button">`, creating nested interactive elements. Screen readers may not announce the inner button correctly, and keyboard focus order can be confusing.                                                                                     |
| Justification | Pre-existing structural issue in the GiftCard component. The outer `role="button"` navigates to the gift detail page; the inner `ClaimButton` triggers the claim flow. These two interactions need to be separated (e.g. remove `role="button"` from the article and use a dedicated navigation link instead). |
| Accepted      | 2026-04-24                                                                                                                                                                                                                                                                                                     |
| Fix tracked   | Refactor GiftCard to use `<a>` or `<Link>` for navigation instead of `role="button"` on the article element.                                                                                                                                                                                                   |

---

## Resolved — colour contrast in design tokens (Issue #371)

All text/background token pairs in `src/styles/tokens.css` now meet WCAG 2.1 AA
(4.5:1 for normal text). The check is enforced in CI by
`src/styles/__tests__/contrast.test.ts` (accessibility workflow).

| Theme | Token                | Before → After        | Min ratio (worst background) |
| ----- | -------------------- | --------------------- | ---------------------------- |
| Dark  | `--color-text-muted` | `#5a5a72` → `#8a8aa3` | 2.46 → 4.90                  |
| Dark  | `--color-error`      | `#ef4444` → `#f87171` | 4.38 → 5.96                  |
| Dark  | `--color-info`       | `#3b82f6` → `#60a5fa` | 4.48 → 6.48                  |
| Light | `--color-text-muted` | `#8888a0` → `#62627a` | 2.99 → 5.13                  |
| Light | `--color-success`    | `#22c55e` → `#166534` | 1.97 → 6.17                  |
| Light | `--color-warning`    | `#f59e0b` → `#92400e` | 1.86 → 6.14                  |
| Light | `--color-error`      | `#ef4444` → `#b91c1c` | 3.26 → 5.60                  |
| Light | `--color-info`       | `#3b82f6` → `#1d4ed8` | 3.18 → 5.80                  |

### Palette contrast ratios (against `--color-bg` / `--color-bg-surface` / `--color-bg-elevated`)

| Token                    | Dark                  | Light                 |
| ------------------------ | --------------------- | --------------------- |
| `--color-text-primary`   | 17.04 / 15.82 / 14.51 | 17.81 / 19.36 / 16.76 |
| `--color-text-secondary` | 6.87 / 6.38 / 5.85    | 7.90 / 8.58 / 7.43    |
| `--color-text-muted`     | 5.76 / 5.34 / 4.90    | 5.45 / 5.92 / 5.13    |
| `--color-success`        | 8.50 / 7.89 / 7.23    | 6.56 / 7.13 / 6.17    |
| `--color-warning`        | 9.01 / 8.37 / 7.67    | 6.52 / 7.09 / 6.14    |
| `--color-error`          | 7.00 / 6.50 / 5.96    | 5.95 / 6.47 / 5.60    |
| `--color-info`           | 7.61 / 7.07 / 6.48    | 6.17 / 6.70 / 5.80    |

`--color-brand-primary` is used as a button/background colour with
`--color-text-inverse` (≈ 5:1), not as body text.

---

> **Policy:** Any new critical or serious axe violation must either be fixed
> before merging, or documented here with a justification and a linked ticket.
> Violations with impact `moderate` or `minor` are logged but do not block CI.

---

## Accessibility & Localization Requirements

Full testable requirements for contrast levels, assistive-technology targets,
supported languages, date formats, and translation key conventions are defined
in a separate document:

👉 **[a11y-localization-requirements.md](a11y-localization-requirements.md)**

That document supersedes any informal requirements previously described in this
file. When adding a new known violation, cross-reference the relevant
acceptance criteria from that requirements doc (e.g. `AC-CR-1`, `AC-AT-3`).

_Section added 2026-09-29 — Issue #155_

---

## Accessibility & Localization Requirements

Full testable requirements for contrast levels, assistive-technology targets,
supported languages, date formats, and translation key conventions are defined
in a separate document:

👉 **[a11y-localization-requirements.md](a11y-localization-requirements.md)**

That document supersedes any informal requirements previously described in this
file. When adding a new known violation, cross-reference the relevant
acceptance criteria from that requirements doc (e.g. `AC-CR-1`, `AC-AT-3`).

_Section added 2026-09-29 — Issue #155_
