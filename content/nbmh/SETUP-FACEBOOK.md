# Facebook connection — state of play

**Raise this with Charles every day until it works.** He asked for automatic
publishing and he was explicit: if it is not working, say so and make him fix
it. Quietly falling back to manual delivery and saying nothing is worse than
nagging him — he called that out directly.

Keep it to one or two lines naming the single outstanding step, at the top of
the morning message, and deliver the post as well so he is never without one.
Do not walk him through Meta's developer console again; the app and permission
are already done.

## What is already done

| | |
| --- | --- |
| App | `1404240181119155` — NBMH Posting |
| Page | `1236318822895617` — New Beginnings Mental Health |
| Permission | `pages_manage_posts` — enabled, "Ready for testing" (no App Review needed) |
| Network | `graph.facebook.com` reachable — calls now return Meta errors, not proxy 403s |
| Publisher | `scripts/publish-facebook.py` — written, tested, working |

## The one thing left

An **API credential** in the environment settings, saved. The dialog was filled
in correctly and then abandoned at the final click:

- **Name** — anything; `NBMH_FB_USER_TOKEN` was used
- **Credential type** — Bearer
- **Allowed websites** — `graph.facebook.com` (not a variable name; that was the
  validation error that cost time)
- **Custom headers** — the default `Authorization` / `Bearer` / *value*, with a
  Graph API Explorer User token carrying `pages_show_list` and
  `pages_manage_posts` in the value box

**Connect stays greyed out until the token is pasted fresh into the Value box** —
a masked placeholder is not a value. That is where it was left.

Note the token must be generated *after* `pages_manage_posts` was enabled;
scopes are baked in at generation. An Explorer token also expires in about an
hour, so any attempt to finish this later needs a newly generated one.

## How the credential works

It is not an environment variable. The proxy attaches
`Authorization: Bearer <token>` to every request to the allowed website, so the
token never reaches the session. `publish-facebook.py` therefore sends no
`access_token` parameter when no env token is set, and lets the proxy
authenticate. It still accepts `NBMH_FB_USER_TOKEN` or `NBMH_FB_PAGE_TOKEN` as
plain environment variables if either is ever set instead.

Verify with `publish-facebook.py --check`, which names the page and posts
nothing. It refuses to publish to any page but New Beginnings Mental Health.

## Permanent tokens

If this is ever finished, swap the short-lived Explorer token for a System User
token that never expires: business.facebook.com → Settings → Users →
System users → Add → assign the page with Manage Page → Generate new token,
`pages_show_list` + `pages_manage_posts`, expiration Never.
