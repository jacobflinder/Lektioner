# Publishing lesson changes

- Prepare and test a complete logical change before publishing to main.
- Commit lesson changes and their corresponding browser tests together in one atomic commit. Do not publish intermediate single-file versions to main.
- Run the relevant browser QA commands from .github/workflows before publishing. If local execution is unavailable, use a working branch and validate it before merging to main.
- Preserve meaningful assertions: investigate failed tests and fix the lesson or update outdated interaction steps; never disable tests or hide failures just to obtain a green result.
- Read the latest branch head before publishing and preserve concurrent work by other chats. Never force-push over another change.
- Verify the final GitHub Actions result and Pages deployment before reporting success. Distinguish pending checks from passed checks.
- mato1c/ contains Ma3c / Matematik – fortsättning nivå 1c, not Matematik 1c. Keep these courses distinct.
