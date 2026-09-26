#!/usr/bin/env python3
"""NBMH compliance gate.

Scans caption/graphic copy for prohibited terminology and for the structural
rules in references/guidelines.md. Exit 0 = clean, exit 1 = must be corrected
before anything is presented or published.

    python3 scripts/compliance-check.py content/nbmh/2026-09-26/caption.md
    echo "some copy" | python3 scripts/compliance-check.py -
"""
import re
import sys

# Phrases that must never appear, from 01_CLAUDE_MASTER_INSTRUCTIONS "Never use
# or imply" plus the blocked service categories in the decision history.
BANNED = [
    # provider / service mislabeling
    "psychiatrist", "psychiatry", "therapy", "therapist", "therapies",
    "counseling", "counselling", "counselor", "counsellor",
    "physician", "medical doctor", " m.d.", " md,", "dr. of medicine",
    # age ranges
    "child", "children", "kid", "kids", "pediatric", "paediatric",
    "geriatric", "elderly", "senior citizen", "all ages",
    "across the lifespan", "ages 15", "15-65", "15 to 65", "15–65",
    # blocked service categories
    "addiction", "substance use", "substance-use", "detox", "rehabilitation",
    "rehab", "ketamine", "tms", "transcranial", "mat program",
    "psychedelic", "recovery program",
    # urgency / access claims
    "crisis", "emergency", "suicide", "self-harm", "self harm", "hotline",
    "urgent", "24/7", "24 / 7", "around the clock", "same-day", "same day",
    "walk-in", "walk in", "on-call", "on call", "immediate treatment",
    # not-publicly-advertised services
    "psychiatric diagnostic evaluation", "diagnostic evaluation",
    # access / outcome promises
    "guarantee", "guaranteed", "cure", "cured", "will fix", "works for everyone",
    "get your prescription", "prescription today", "easy prescription",
    "get prescribed", "we prescribe",
    # testimonial / PHI shapes
    "our patient", "one patient", "a patient told", "testimonial",
]

# Allowed in context even though a banned substring matches.
ALLOWED_CONTEXT = {
    "psychiatric": ["psychiatric mental health nurse practitioner", "pmhnp"],
}

# Facts that must be exact wherever they appear.
EXACT = {
    r"\b9\d{2}[-.\s]?\d{3}[-.\s]?\d{4}\b": "970-470-2939",
    r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}": "charles@nbmentalhealth.com",
}

CARRIERS = ["Aetna", "Anthem", "UnitedHealthcare", "Cigna",
            "Mountain Strong EAP", "Olivia's Fund"]


def check(text):
    problems = []
    low = text.lower()

    for term in BANNED:
        # Word-boundary matching so short tokens ("tms", "mat") cannot fire
        # from the middle of an innocent word.
        pattern = r"(?<![a-z0-9])" + re.escape(term.strip()) + r"(?![a-z0-9])"
        for m in re.finditer(pattern, low):
            window = low[max(0, m.start() - 60):m.end() + 60]
            root = term.strip().strip(".,")
            if any(ok in window for ok in ALLOWED_CONTEXT.get(root, [])):
                continue
            line = text[:m.start()].count("\n") + 1
            problems.append(f"line {line}: prohibited term {term.strip()!r}")

    for pattern, correct in EXACT.items():
        for m in re.finditer(pattern, text):
            if m.group(0) != correct:
                line = text[:m.start()].count("\n") + 1
                problems.append(
                    f"line {line}: {m.group(0)!r} is not the approved value {correct!r}")

    # Coverage must sit above the contact CTA when both appear.
    cov = min((text.find(c) for c in CARRIERS if c in text), default=-1)
    cta = min((p for p in (text.find("NBMentalHealth.com"),
                           text.find("970-470-2939")) if p >= 0), default=-1)
    if cov >= 0 and cta >= 0 and cov > cta:
        problems.append("coverage appears below the contact CTA; coverage must come first")

    # Credential string, when the provider is named, must be exact.
    if "vandenberg" in low and "DNP, PMHNP-BC, FNP" not in text:
        problems.append("Dr. Vandenberg named without the exact credentials "
                        "'DNP, PMHNP-BC, FNP'")

    tags = re.findall(r"#\w+", text)
    if tags and not 5 <= len(tags) <= 7:
        problems.append(f"{len(tags)} hashtags; guidelines require 5-7")

    return problems


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    text = sys.stdin.read() if sys.argv[1] == "-" else open(sys.argv[1]).read()
    problems = check(text)
    if problems:
        print("COMPLIANCE: FAIL")
        for p in problems:
            print("  -", p)
        return 1
    print("COMPLIANCE: PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
