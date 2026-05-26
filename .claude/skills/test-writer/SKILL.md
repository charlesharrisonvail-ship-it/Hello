---
name: test-writer
description: Auto-activate when the user asks to add tests. Generates unit, integration, or e2e tests following project conventions.
---

# Test Writer Skill

## When to use
Activate when the user asks to write tests, improve coverage, or add a regression test.

## Steps
1. Identify the function/module under test.
2. Choose the correct tier: unit / integration / e2e.
3. Generate the test file in the matching `tests/` subdirectory.
