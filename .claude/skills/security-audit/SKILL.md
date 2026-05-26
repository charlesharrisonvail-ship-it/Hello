---
name: security-audit
description: Auto-activate on security-review tasks. Checks for OWASP Top 10, secret leakage, and unsafe patterns.
---

# Security Audit Skill

## When to use
Activate when the user asks for a security review, threat model, or vulnerability scan.

## Steps
1. Scan the diff or specified files.
2. Check for: injection, broken auth, sensitive data exposure, SSRF, insecure deserialization, secret leakage.
3. Report findings ranked by severity.
