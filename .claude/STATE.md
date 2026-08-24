# Where the work stands

_Keep this tidy. `pre_compact.py` appends banked blocks below it._

## Working on now

Installing the Continuity kit into this repo (branch
`claude/continuity-plugin-install-m0b7ln`). Scripts, orientation documents, and
the memory directory are in place.

## Blocked

`.claude/settings.json` has not been written. The sandbox blocked writing it -
it registers hook commands, which is a permission-gated action here. Nothing
loads automatically until it exists. The exact contents to add are in
`.claude/continuity/settings.example.json`; copy it to `.claude/settings.json`
(merging into any existing settings rather than overwriting), then run
`python3 .claude/continuity/verify.py`.

## Next

1. Add `.claude/settings.json` from the example file
2. Run the verifier and confirm `CONTINUITY: PASS`
3. Fill in the `TODO Charles` blocks in `ROLE.md`, `PROJECT.md`, `DECISIONS.md`
4. Start a fresh session and ask "who are you and what are we working on?" -
   both answers should arrive without being told
