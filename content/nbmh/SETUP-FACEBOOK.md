# Finishing the Facebook connection

Charles wants this fully automatic: the post makes itself and goes up without
him touching it. That requires a token — Facebook allows no other way for
software to post to a page.

Everything on Claude's side is built. Two things remain, both one-time.

---

## 1. The token

The Meta app already exists. From here it is one page:

1. **developers.facebook.com/tools/explorer**
2. Top right, **Meta App** dropdown → pick the app
3. **Permissions** dropdown → add three:
   `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`
4. **Generate Access Token** → approve the popup → copy

Leave the token type as **User**. The script reads `/me/accounts`, finds the New
Beginnings page among the ones Charles administers, and pulls that page's own
token by itself — nothing else has to be looked up.

Explorer's permission dropdown works independently of how the app's use cases
were configured, so no further app setup is needed.

## 2. Store it, and open the network

Session title bar → **cloud environment menu** → **Edit**:

- **Network access** → add `graph.facebook.com` (currently a 403 at the proxy)
- **API credentials**, or an environment variable if that section is absent:

| Variable | Value |
| --- | --- |
| `NBMH_FB_USER_TOKEN` | the token from step 1 |

A **new session** picks it up.

---

## Then

```bash
python3 .claude/skills/nbmh-social/scripts/publish-facebook.py --check
```

Resolves the token, prints the page name and id, posts nothing. It should say
New Beginnings Mental Health. The script refuses to publish to any other page,
so an EpiVail token cannot put clinical content on a real estate page.

After that the daily Routine runs hands-off: it builds the graphic, writes the
caption, checks compliance, and publishes. If the token is ever missing or
expired it falls back to handing Charles the JPEG and caption, so no day is lost.

## Keeping it from expiring

An Explorer token lasts a couple of hours. Once posting is confirmed working,
swap in one that never expires:

**business.facebook.com** → **Settings** → **Users** → **System users** →
**Add** → assign the New Beginnings page with **Manage Page** → **Generate new
token**, same three permissions, expiration **Never**. Store it as
`NBMH_FB_PAGE_TOKEN` and it runs unattended indefinitely.
