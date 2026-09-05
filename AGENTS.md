# retro-web — Agent Instructions

## Purpose
Browser UI for retrospective management. Vanilla HTML, CSS, JavaScript only.

## Rules
- Call `retro-api` via `js/api.js` — never read local data files directly
- No React, TypeScript, or build frameworks
- Preserve accessibility (labels, error messages)
- Keep code simple and teaching-oriented

## Config
`js/config.js` — API base URL (`http://localhost:3001/api`)

## Pages
index, retrospectives, feedback, board, analysis, actions, report
