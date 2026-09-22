# Required Fix — `epivail-brand-system` skill

**Why this file exists.** Charles has asked repeatedly to drop the "Southern Hospitality" framing, and it keeps coming back. This is why: it is written into the **`epivail-brand-system` skill**, which every EpiVail conversation loads automatically and which declares itself "the single source of truth for… voice, tone, positioning." Correcting it in a chat fixes that one chat. The next conversation reloads the skill and reintroduces it.

**It cannot be fixed from this session.** The skill is account-level and synced read-only into each session (`~/.claude/skills/synced/…/epivail-brand-system/`). Local edits here are overwritten on the next sync. It has to be changed at the source — in skill settings on claude.ai, where the skill is managed.

Four occurrences, with exact replacements.

---

### 1. `SKILL.md` line 10 — the tagline

Remove:
```
**Tagline**: *"Southern Hospitality Meets Mountain Mastery"*
```
Replace with:
```
**Tagline**: *"Scale Smarter. Build Better."*
**Never use**: "Southern Hospitality Meets Mountain Mastery" or any Southern-hospitality framing — retired at Charles's direction.
```

---

### 2. `SKILL.md` line 70 — core personality

Remove:
```
- Warm but authoritative — Southern Hospitality with mountain credibility
```
Replace with:
```
- Warm but authoritative — warmth earned through competence and 25+ years in the valley, never through regional charm
```

---

### 3. `SKILL.md` line 79 — warm closings

Remove:
```
- Warm closings: "Let's connect," "Happy to talk anytime," "Southern Hospitality, Mountain Results"
```
Replace with:
```
- Warm closings: "Let's connect," "Happy to talk anytime"
- Sign off: "Scale Smarter. Build Better." + Epique Mountain Collective (buyer content) or EpiVail (agent/market content)
```

---

### 4. `references/social-templates.md` line 66 — caption formula

Remove:
```
[Authentic close — Southern Hospitality meets Mountain Mastery]
```
Replace with:
```
[Authentic close — Scale Smarter. Build Better.]
```

---

## Two other corrections worth making in the same pass

**5. Experience figure.** Confirm `SKILL.md` states **25+ years**. A past video used "15 years," which was wrong.

**6. International markets.** The `linkedin-optimizer` skill lists the markets as *US, France, **Australia**, Mexico*. Every other file says *US, France, **Germany**, Mexico*. Germany is correct per the recruitment skill's own market reference files (`references/germany.md` exists; there is no Australia reference). Fix the outlier.

---

## Also worth a look: your personal Claude preference

Your account preference currently reads: *"Be Respectful, use your memory. I don't like to repeat myself. All answers are courteous, use Southern Manners, please."*

That governs how Claude speaks **to you** in conversation, which is separate from your brand voice — so it is not itself a bug. But given the phrasing you're retiring from the brand, you may want to reword it to something like *"courteous and well-mannered"* so nothing downstream ever reads "Southern Manners" as a brand instruction and reintroduces the framing you've been removing.
