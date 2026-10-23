# course-lock

Locks AiRE Estate course lessons and media with an access code, using the same format
the live course pages already decrypt in the browser (AES-256-GCM, PBKDF2-SHA256,
250,000 iterations). Replaces the original tool, which isn't in this repository.

Tested 2026-10-23: text locked by `lock.mjs` decrypts with the same WebCrypto calls as
`docs/lead-to-keys-course.html`, using a throwaway test code.

```
node tools/course-lock/lock.mjs text lesson.html > payload.json     # PAYLOAD for a page
node tools/course-lock/lock.mjs media lesson.mp4 docs/media/x.bin   # locked video file
node tools/course-lock/lock.mjs open payload.json                   # check a payload
```

The code is typed at a hidden prompt (or set in `AIRE_LOCK_CODE` for one command). It is
never written to a file. Never put a real access code in this repo, a commit or chat.
Needs Node 18 or newer; no other dependencies.
