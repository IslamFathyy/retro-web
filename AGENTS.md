# retro-web — Frontend Agent

Vanilla HTML, CSS, and JavaScript. Read-only validation UI for Cursor-driven workflows. Port **8080**.

## Constraints

- **No React, TypeScript, or build frameworks** in v1.
- **No direct filesystem access** — all data via `js/api.js` → `retro-api`.
- Semantic HTML, accessible labels, visible error states.
- Keep modules small under `js/`; match existing page patterns.

## Before editing

1. Read parent [`../AGENTS.md`](../AGENTS.md) for multi-repo routing.
2. Apply root [`../.cursor/rules/privacy.mdc`](../.cursor/rules/privacy.mdc) and [`development.mdc`](../.cursor/rules/development.mdc).
3. Apply [`.cursor/rules/frontend.mdc`](.cursor/rules/frontend.mdc) for UI files.

## API contract

Coordinate with `retro-api` before adding fields or endpoints. Update `js/api.js` and the relevant page script together.

## Local run

API must be running on port 3001, then `npm start` in this folder.

## Validation pages

| Page | Validates |
|------|-----------|
| `analysis.html` | Imported analysis, suggested actions |
| `actions.html` | Approved actions |
| `report.html` | Generated report + insights |

Use `/validate-retro-ui {id}` from the parent repo after backend workflow steps.
