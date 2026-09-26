# Connecting the New Beginnings Facebook page

Two things. Don't go hunting for a Page ID — the token gives it to me.

Never paste a token into chat. It goes in the environment settings form.

---

## 1. Allow Meta through the network policy

The environment blocks `graph.facebook.com` today — a 403 at the proxy.

Session title bar → **cloud environment menu** → **Edit** → **Network access**.
Either widen the access level, or add `graph.facebook.com` to the allowed
domains.

## 2. Get a User access token

This is one page and about four clicks.

1. Go to **developers.facebook.com/tools/explorer**
2. Top right, **Meta App** dropdown — pick any app. If the list is empty:
   **developers.facebook.com/apps** → **Create app** → purpose **Other** →
   type **Business** → name it `NBMH Posting`. Nothing goes to review.
3. **Permissions** dropdown → add these three:
   - `pages_show_list`
   - `pages_read_engagement`
   - `pages_manage_posts`
4. Click **Generate Access Token**, approve the Facebook popup, and copy the
   token from the box

Leave it as a **User** token. Do not switch the dropdown to Page — the script
reads `/me/accounts`, finds New Beginnings Mental Health among the pages you
administer, and pulls that page's own token automatically.

## 3. Store it

Session title bar → **cloud environment menu** → **Edit** → under API
credentials, or as an environment variable if that section is not offered:

| Variable | Value |
| --- | --- |
| `NBMH_FB_USER_TOKEN` | the token from step 2 |

A **new session** is needed to pick it up.

---

## Then verify

```bash
python3 .claude/skills/nbmh-social/scripts/publish-facebook.py --check
```

Resolves the token, prints the page name and id, posts nothing.

It should say **New Beginnings Mental Health**. If the token administers other
pages — EpiVail included — the script picks NBMH and refuses to touch the rest.
If NBMH is not on the token at all, it names what it did find and stops.

## Then post

```bash
# now
python3 .claude/skills/nbmh-social/scripts/publish-facebook.py \
  --image content/nbmh/2026-09-26/nbmh-2026-09-26.jpg \
  --caption content/nbmh/2026-09-26/caption.md

# or queue it in Meta for the morning slot
python3 .claude/skills/nbmh-social/scripts/publish-facebook.py \
  --image content/nbmh/2026-09-26/nbmh-2026-09-26.jpg \
  --caption content/nbmh/2026-09-26/caption.md \
  --schedule "2026-09-27 08:00" --tz America/Denver
```

---

## Later: making it permanent

An Explorer token lasts a couple of hours — fine to prove this works today, but
it will be dead tomorrow morning.

Once posting is confirmed, the durable version is a System User token that never
expires: **business.facebook.com** → **Settings** → **Users** →
**System users** → **Add** → assign the New Beginnings page with **Manage Page**
→ **Generate new token** with the same three permissions, expiration **Never**.
Store that one as `NBMH_FB_PAGE_TOKEN` and the daily Routine runs unattended.
