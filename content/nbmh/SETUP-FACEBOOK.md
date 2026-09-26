# Meta API publishing — tried, shelved

**Do not restart this without Charles asking for it.**

On 2026-09-26 we attempted to wire up automatic publishing to the New Beginnings
Facebook page. It is technically possible — `scripts/publish-facebook.py` is
written, works, and is kept in the repo — but Meta's setup turned into a maze:
a developer account, an app, a use-case picker, permission grants, and a token
flow, across five screens that kept spawning more. It was not worth Charles's
time for a practice that posts one graphic a day.

**The standing arrangement is manual delivery.** Each morning the daily Routine
builds the graphic and caption, checks compliance, and hands Charles the JPEG
plus the caption text. He posts it himself in under a minute. Status in the
posting log is `delivered`, never `published` — Claude has no way to see the
page, so it never claims otherwise.

## If it ever comes back up

`scripts/publish-facebook.py` is ready. It needs:

1. `graph.facebook.com` allowed by the environment's network policy — currently
   a 403 at the proxy.
2. `NBMH_FB_USER_TOKEN` in the environment settings: a User access token with
   `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`. The script
   reads `/me/accounts`, finds the New Beginnings page among the ones Charles
   administers, and pulls that page's own token — no page id hunting.

`--check` resolves the token and prints the page name without posting. The
script refuses to publish unless the page name matches New Beginnings Mental
Health, so an EpiVail token cannot post clinical content to a real estate page.

Meta Business Suite's own Planner is the other option, and needs no developer
setup at all — Charles can schedule a week of graphics there by hand if he ever
wants to batch them.
