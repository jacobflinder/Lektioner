# Publishing lesson changes

- Prepare and test a complete logical change before publishing to main.
- Commit lesson changes and their corresponding browser tests together in one atomic commit. Do not publish intermediate single-file versions to main.
- Run the relevant browser QA commands from .github/workflows before publishing. If local execution is unavailable, use a working branch and validate it before merging to main.
- Preserve meaningful assertions: investigate failed tests and fix the lesson or update outdated interaction steps; never disable tests or hide failures just to obtain a green result.
- Read the latest branch head before publishing and preserve concurrent work by other chats. Never force-push over another change.
- Verify the final GitHub Actions result and Pages deployment before reporting success. Distinguish pending checks from passed checks.
- mato1c/ contains Ma3c / Matematik – fortsättning nivå 1c, not Matematik 1c. Keep these courses distinct.
- Visually separate independent equations, given values, and mathematical statements. Never put two complete equations (for example `u = 1 − 3i` and `z = −3 + 2i`) into the same `.math` element or rely on `&nbsp;`/plain spaces: the MathML formatter may collapse them into an ambiguous string. Use separate semantic math blocks; in Ma4 use `.math-givens` with at least 16px vertical spacing. Validate actual rendered distance at desktop and 390px mobile widths and inspect screenshots before considering a lesson reviewed.
