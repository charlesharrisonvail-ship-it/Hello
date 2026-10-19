# Making the New Beginnings cloud environment

New Beginnings gets its own cloud environment, so its Facebook token never
shares `graph.facebook.com` with another business's token. The proxy sends only
one secret per website, and a second one there is what broke the 10-11 morning
post.

## Steps (about five minutes)

1. Open the cloud environment menu in the session's title bar and choose
   **Add environment**.
2. **Name:** `New Beginnings Mental Health`
3. **Network access:** Full. The free photo model downloads from Hugging Face,
   and the post goes to Meta.
4. **Network secrets** (labeled *API credentials* in an older app):
   - Name: `NBMH_FB_USER_TOKEN`
   - Website: `graph.facebook.com`
   - Value: the New Beginnings system user token (the one that never expires),
     pasted straight from Meta Business Suite into this field.
   - This must be the **only** secret on `graph.facebook.com` in this
     environment. Nothing from EpiVail or AIRE goes here.
5. **Setup script** (optional, saves time each morning):
   ```bash
   bash .claude/skills/nbmh-social/scripts/setup-free-model.sh /root/nbmh-models
   ```
6. Save.

Never paste the token into a chat. It only goes in the field in step 4.

## After it is saved

Tell Claude it is done. Claude then:

1. Moves the daily 6:49 a.m. routine to the new environment. A routine's
   environment can't be changed in place, so Claude makes a new one with the
   same prompt and notifications in the new environment, then turns off
   `trig_01SEU3abHpbCACPQwzMjeZzk`.
2. Runs `publish-facebook.py --check` in the new environment. It must answer
   "resolves to New Beginnings Mental Health" before the routine is trusted.
3. Records the new routine id in `POSTING_LOG.md`.

Then the `NBMH_FB_USER_TOKEN` secret can come out of the Default Cloud
Environment, which is left for EpiVail work.
