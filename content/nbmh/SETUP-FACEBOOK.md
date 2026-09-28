## The token must be a System User token

**Do not use a Graph API Explorer token.** Explorer issues a token that expires
in about an hour. A daily 6:49 a.m. job can never run on one — it is dead every
morning before it fires. Chasing Explorer tokens wasted a great deal of
Charles's time; go straight to the permanent one.

### Create it once

1. **business.facebook.com** → **Settings** (gear, bottom left)
2. **Users** → **System users** → **Add**
3. Name it `NBMH Posting`, role **Admin**, create
4. **Assign assets** → **Pages** → New Beginnings Mental Health → turn on
   **Manage Page** (full control) → Save
5. **Generate new token** → app **NBMH Posting** → tick all three:
   `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`
6. **Token expiration: Never** → Generate → copy it

All three permissions are required. `pages_read_engagement` looks optional and
is not: Meta will not issue a working Page access token without it, and
publishing then fails with a bare `(#200) Permissions error` naming no scope,
while reading the page keeps working — which makes the cause very hard to see.

### Store it

Session title bar → cloud environment menu → **Edit** → **API credentials**.
There must be exactly **one** credential:

| Field | Value |
| --- | --- |
| Name | `NBMH_FB_USER_TOKEN` |
| Credential type | Bearer |
| Allowed websites | `graph.facebook.com` |
| Custom headers | `Authorization` / `Bearer` / the token in Value |

A second credential on the same host is ignored and the UI says so — permission
names such as `pages_read_engagement` are Facebook scopes, not credentials, and
do not belong here.

### Verify

```bash
python3 .claude/skills/nbmh-social/scripts/publish-facebook.py --check
```

It names the page and posts nothing. Then publish with `--image` and
`--caption`.

## Where the token goes — not a .env file

This is an ephemeral cloud container: a `.env` file does not survive a restart,
and a token committed to the repo would be exposed. The token belongs in the
environment's **API credential**, where the proxy attaches it and it never
reaches the code at all.

There must be exactly one credential for `graph.facebook.com`. A second one is
ignored, and the settings UI says so.

## Notes on how this works

The credential is not an environment variable. The proxy attaches
`Authorization: Bearer <token>` to every request to the allowed website, so the
token never reaches the session, and an explicit Authorization header set in
code is overwritten. An `access_token` query parameter does take precedence over
that header, which is how the publisher sends the Page token — verified by
sending a deliberately invalid one and getting Meta's invalid-token error back.

The publisher gets the Page token two ways. It first asks the page directly,
`GET /{page-id}?fields=id,name,access_token`, which works for a system user
token — a system user has no personal pages, so `/me/accounts` can come back
empty for it. Failing that it falls back to `/me/accounts`, which returns each
page an ordinary user administers along with that page's own token. Either way
no page id is ever hunted for by hand.

Current state: app `1404240181119155` (NBMH Posting), page `1236318822895617`
(New Beginnings Mental Health), network access Full, publisher tested.
