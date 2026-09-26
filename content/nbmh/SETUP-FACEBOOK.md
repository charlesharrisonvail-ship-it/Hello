# Connecting the New Beginnings Facebook page

Three things, once. After this, posting is a single command and the daily
Routine can queue the 8:00 a.m. slot on its own.

Never paste a token into the chat. Tokens go in the environment settings form.

---

## 1. Allow Meta through the network policy

The environment currently blocks `graph.facebook.com` — a 403 at the proxy.

Session title bar → **cloud environment menu** → **Edit** → **Network access**.
Either widen the access level, or add `graph.facebook.com` to the allowed
domains.

## 2. Find the Page ID

Not a secret — this one is fine to send in chat.

On the page you have open: **About** → scroll to **Page transparency** → the
Page ID is listed there. (Or in Meta Business Suite: **Settings** → **Pages**.)

It is a long number, something like `102938475610293`.

## 3. Get a Page access token

Two routes. Pick one.

### Route A — permanent, the right answer for daily posting

A System User token does not expire, so this never breaks at 6 a.m. on a
Tuesday.

1. **business.facebook.com** → **Settings** (gear) → **Users** → **System users**
2. **Add** → name it `NBMH Posting` → role **Employee**
3. **Assign assets** → **Pages** → New Beginnings Mental Health → toggle on
   **Manage Page** (full control)
4. **Generate new token** → pick your app → select these permissions:
   - `pages_manage_posts`
   - `pages_read_engagement`
   - `pages_show_list`
5. Set token expiration to **Never**, generate, and copy it

If you have no app yet: **developers.facebook.com** → **My Apps** →
**Create App** → **Business** → name it `NBMH Posting`. Nothing needs to be
submitted for review — the token works on a page you already administer.

### Route B — quick, expires in about an hour

Good only for proving the pipeline works today.

1. **developers.facebook.com/tools/explorer**
2. Pick your app → **Get Token** → **Get Page Access Token**
3. Choose New Beginnings Mental Health, grant the three permissions above
4. Copy the token

Expect it to stop working the same day. Route A is still needed after.

## 4. Store the two values

Same **Edit** screen as step 1, under API credentials — or as environment
variables if that section is not offered:

| Variable | Value |
| --- | --- |
| `NBMH_FB_PAGE_ID` | the number from step 2 |
| `NBMH_FB_PAGE_TOKEN` | the token from step 3 |

A **new session** is needed to pick them up.

---

## Then verify

```bash
python3 .claude/skills/nbmh-social/scripts/publish-facebook.py --check
```

This resolves the credentials and prints the page name back. It posts nothing.

It should say **New Beginnings Mental Health**. If it names any other page —
EpiVail included — the token is pointed at the wrong asset, and the script
refuses to publish rather than putting clinical content on a real estate page.

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
