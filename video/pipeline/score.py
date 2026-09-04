#!/usr/bin/env python3
"""Cinematic score bed for the Epique Realty West Power Summit cut.

Written to the edit, not the other way round: 120 BPM (2.0s bar), so every
picture cut in the 40s timeline lands on a bar or half-bar accent. Layers a sub drone, a warm
pad, a pulse, a gold-shimmer arp, risers into each act break and whooshes on
the state cuts, then folds the whole thing through a simple reverb.

Usage: score.py OUT.wav [TOTAL_SECONDS]
"""
import sys
import numpy as np

SR = 48000
BPM = 120.0
BAR = 240.0 / BPM          # 2.0s
HALF = BAR / 2             # 1.0s -- the cut grid

# Act boundaries of the picture edit (seconds).
T_INTRO_A = 0.0
T_INTRO_B = 4.0
T_GRID = 8.0
T_FUTURE = 12.0
T_STATES = 14.0
STATE_DUR = 2.0
N_STATES = 11
T_END = T_STATES + N_STATES * STATE_DUR   # 36.0
TOTAL = T_END + 4.0                        # 40.0

NOTE = {  # equal temperament, A4 = 440
    "A1": 55.00, "C2": 65.41, "D2": 73.42, "E2": 82.41, "F1": 43.65, "G1": 49.00,
    "A2": 110.00, "C3": 130.81, "E3": 164.81, "F2": 87.31, "G2": 98.00,
    "A3": 220.00, "C4": 261.63, "E4": 329.63, "F3": 174.61, "G3": 196.00,
    "A4": 440.00, "C5": 523.25, "E5": 659.26, "F4": 349.23, "G4": 392.00,
    "A5": 880.00, "C6": 1046.50, "E6": 1318.51,
}

# One chord per bar. A minor throughout, moving Am - F - C - G.
CHORDS = [
    ("Am", ["A1", "A3", "C4", "E4"]),
    ("Am", ["A1", "A3", "C4", "E4"]),
    ("F",  ["F1", "F3", "A3", "C4"]),
    ("C",  ["C2", "C4", "E4", "G3"]),
    ("G",  ["G1", "G3", "B3", "D4"]),
    ("Am", ["A1", "A3", "C4", "E4"]),
    ("Am", ["A1", "A3", "C4", "E4"]),
    ("Am", ["A1", "A3", "C4", "E4"]),
    ("F",  ["F1", "F3", "A3", "C4"]),
    ("C",  ["C2", "C4", "E4", "G3"]),
    ("G",  ["G1", "G3", "B3", "D4"]),
    ("Am", ["A1", "A3", "C4", "E4"]),
    ("F",  ["F1", "F3", "A3", "C4"]),
    ("C",  ["C2", "C4", "E4", "G3"]),
    ("G",  ["G1", "G3", "B3", "D4"]),
    ("Am", ["A1", "A3", "C4", "E4"]),
    ("F",  ["F1", "F3", "A3", "C4"]),
    ("G",  ["G1", "G3", "B3", "D4"]),
    ("Am", ["A1", "A3", "C4", "E4"]),
    ("Am", ["A1", "A3", "C4", "E4"]),
]
NOTE["B3"] = 246.94
NOTE["D4"] = 293.66


def freq(name):
    return NOTE[name]


class Mix:
    def __init__(self, total):
        self.n = int(total * SR)
        self.L = np.zeros(self.n)
        self.R = np.zeros(self.n)

    def add(self, t, mono, gain=1.0, pan=0.0):
        """pan: -1 hard left .. +1 hard right"""
        i = int(t * SR)
        if i < 0:
            mono = mono[-i:]
            i = 0
        j = min(self.n, i + len(mono))
        if j <= i:
            return
        seg = mono[: j - i] * gain
        gl = np.sqrt((1.0 - pan) / 2.0)
        gr = np.sqrt((1.0 + pan) / 2.0)
        self.L[i:j] += seg * gl
        self.R[i:j] += seg * gr


def env_adsr(n, a, d, s, r):
    """Attack/decay/sustain-level/release in samples-fraction seconds."""
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    a, d, r = max(a, 1), max(d, 1), max(r, 1)
    sus = max(n - a - d - r, 0)
    e = np.concatenate([
        np.linspace(0, 1, a),
        np.linspace(1, s, d),
        np.full(sus, s),
        np.linspace(s, 0, r),
    ])
    if len(e) < n:
        e = np.pad(e, (0, n - len(e)))
    return e[:n]


def sine(f, dur, phase=0.0):
    t = np.arange(int(dur * SR)) / SR
    return np.sin(2 * np.pi * f * t + phase)


def saw(f, dur, detune=0.0):
    """Band-limited-ish saw from a modest harmonic stack (cheap and smooth)."""
    t = np.arange(int(dur * SR)) / SR
    out = np.zeros_like(t)
    f = f * (1.0 + detune)
    k = 1
    while f * k < 9000 and k <= 14:
        out += np.sin(2 * np.pi * f * k * t) / k
        k += 1
    return out * 0.5


def onepole_lp(x, cutoff):
    """Simple one-pole low-pass; cutoff may be scalar or per-sample array."""
    c = np.atleast_1d(np.asarray(cutoff, dtype=float))
    if c.size == 1:
        c = np.full(len(x), c[0])
    a = 1.0 - np.exp(-2 * np.pi * c / SR)
    y = np.zeros_like(x)
    prev = 0.0
    for i in range(len(x)):
        prev += a[i] * (x[i] - prev)
        y[i] = prev
    return y


def onepole_hp(x, cutoff):
    return x - onepole_lp(x, cutoff)


def noise(dur, seed):
    rng = np.random.default_rng(seed)
    return rng.standard_normal(int(dur * SR))


def reverb_ir(dur=1.6, seed=7):
    """Exponentially decaying, slightly diffused noise burst."""
    rng = np.random.default_rng(seed)
    n = int(dur * SR)
    t = np.arange(n) / SR
    ir = rng.standard_normal(n) * np.exp(-t * 3.2)
    ir[: int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))  # pre-delay ramp
    ir /= np.abs(ir).sum() / 40.0
    return ir


def build(total):
    mix = Mix(total)
    wet = Mix(total)  # everything routed here also gets reverb

    def bar_time(b):
        return b * BAR

    def chord_at(t):
        b = int(t / BAR)
        return CHORDS[min(b, len(CHORDS) - 1)][1]

    # ---- 1. Sub drone: root of each chord, crossfading bar to bar -----------
    for b, (_, notes) in enumerate(CHORDS):
        t0 = bar_time(b)
        if t0 >= total:
            break
        root = freq(notes[0])
        d = BAR + 0.35
        s = sine(root, d) * 0.55 + sine(root * 2, d) * 0.12
        s *= env_adsr(len(s), 0.22, 0.2, 0.85, 0.5)
        # bring the low end up as the piece opens out
        g = 0.30 if t0 < T_FUTURE else 0.42
        mix.add(t0, s, gain=g)

    # ---- 2. Pad: warm detuned saw chord, one voice per chord tone -----------
    for b, (_, notes) in enumerate(CHORDS):
        t0 = bar_time(b)
        if t0 >= total:
            break
        d = BAR + 0.6
        # opens up (brighter filter) as the film builds
        prog = min(1.0, max(0.0, (t0 - T_INTRO_A) / max(T_STATES, 1e-6)))
        cut = 520 + 1500 * prog
        for k, nm in enumerate(notes[1:]):
            f = freq(nm)
            v = saw(f, d, detune=0.004 * (k - 1)) + saw(f, d, detune=-0.005 * (k - 1))
            v = onepole_lp(v, cut)
            v *= env_adsr(len(v), 0.55, 0.35, 0.8, 0.7)
            pan = -0.45 + 0.45 * k
            amp = 0.085 if t0 < T_FUTURE else 0.115
            mix.add(t0, v, gain=amp, pan=pan)
            wet.add(t0, v, gain=amp * 0.5, pan=pan)

    # ---- 3. Pulse: soft kick on every half bar once the film gets moving ----
    def kick(dur=0.20):
        t = np.arange(int(dur * SR)) / SR
        f = 105 * np.exp(-t * 26) + 42
        k = np.sin(2 * np.pi * np.cumsum(f) / SR)
        k *= np.exp(-t * 15)
        return k

    t = T_FUTURE
    while t < T_END + 0.01:
        strong = abs((t - T_STATES) % BAR) < 1e-6 or abs(t - T_FUTURE) < 1e-6
        mix.add(t, kick(), gain=0.50 if strong else 0.30)
        t += HALF

    # a couple of early heartbeats so the intro is not static
    for t in (T_INTRO_B, T_GRID, T_GRID + HALF):
        mix.add(t, kick(0.24), gain=0.22)

    # ---- 4. Gold shimmer arp over the states ------------------------------
    step = HALF / 2  # 0.5s, eighth notes
    t = T_STATES
    idx = 0
    while t < T_END:
        notes = chord_at(t)
        upper = [notes[1], notes[2], notes[3], notes[2]]
        nm = upper[idx % len(upper)]
        f = freq(nm) * 2.0  # an octave up: bell register
        d = 0.55
        v = sine(f, d) * 0.6 + sine(f * 2.0, d) * 0.18 + sine(f * 3.01, d) * 0.06
        v *= np.exp(-np.arange(len(v)) / SR * 7.0)
        pan = 0.35 if idx % 2 else -0.35
        mix.add(t, v, gain=0.055, pan=pan)
        wet.add(t, v, gain=0.045, pan=pan)
        t += step
        idx += 1

    # ---- 5. Bell accents on the act breaks --------------------------------
    for t, nm, g in ((T_INTRO_A + 0.15, "A4", 0.11), (T_INTRO_B, "C5", 0.10),
                     (T_GRID, "E5", 0.10), (T_FUTURE, "A5", 0.13),
                     (T_STATES, "E5", 0.11), (T_END, "A5", 0.15)):
        d = 2.6
        f = freq(nm)
        v = sine(f, d) * 0.6 + sine(f * 2.005, d) * 0.25 + sine(f * 2.997, d) * 0.1
        v *= np.exp(-np.arange(len(v)) / SR * 2.4)
        mix.add(t, v, gain=g)
        wet.add(t, v, gain=g * 1.1)

    # ---- 6. Risers into each act break ------------------------------------
    def riser(dur, seed):
        n = int(dur * SR)
        x = noise(dur, seed)
        cut = np.linspace(300, 7000, n)
        x = onepole_hp(onepole_lp(x, cut), 200)
        x *= np.linspace(0, 1, n) ** 2.2
        return x

    for t_hit, dur, g in ((T_GRID, 2.0, 0.11), (T_FUTURE, 2.4, 0.17),
                          (T_STATES, 1.6, 0.11), (T_END, 2.0, 0.15)):
        r = riser(dur, seed=int(t_hit * 10) + 3)
        mix.add(t_hit - dur, r, gain=g)

    # ---- 7. Impacts on the big beats --------------------------------------
    def impact(dur=1.5, seed=11):
        t = np.arange(int(dur * SR)) / SR
        boom = np.sin(2 * np.pi * (58 * np.exp(-t * 8) + 34) * t) * np.exp(-t * 3.4)
        air = onepole_lp(noise(dur, seed), 2200) * np.exp(-t * 9)
        return boom * 0.9 + air * 0.25

    for t_hit, g in ((T_INTRO_A, 0.30), (T_FUTURE, 0.55), (T_STATES, 0.40), (T_END, 0.60)):
        im = impact(seed=int(t_hit) + 5)
        mix.add(t_hit, im, gain=g)
        wet.add(t_hit, im, gain=g * 0.6)

    # ---- 8. Whooshes on the state cuts ------------------------------------
    def whoosh(dur, seed, rise=True):
        n = int(dur * SR)
        x = noise(dur, seed)
        c = np.linspace(400, 5200, n) if rise else np.linspace(5200, 400, n)
        x = onepole_hp(onepole_lp(x, c), 350)
        w = np.hanning(n)
        return x * w

    for k in range(N_STATES):
        t_cut = T_STATES + k * STATE_DUR
        w = whoosh(0.60, seed=40 + k, rise=(k % 2 == 0))
        mix.add(t_cut - 0.34, w, gain=0.045, pan=-0.5 if k % 2 else 0.5)

    # ---- reverb + master ---------------------------------------------------
    ir = reverb_ir()
    for ch in ("L", "R"):
        dry = getattr(mix, ch)
        send = getattr(wet, ch)
        rv = np.convolve(send, ir)[: len(dry)]
        setattr(mix, ch, dry + rv * 0.55)

    out = np.stack([mix.L, mix.R], axis=1)

    # gentle master shaping: tame sub rumble, soft-clip, normalise
    out[:, 0] = onepole_hp(out[:, 0], 28)
    out[:, 1] = onepole_hp(out[:, 1], 28)
    out = np.tanh(out * 1.15) * 0.92
    peak = np.abs(out).max()
    if peak > 0:
        out *= 0.89 / peak

    # top and tail
    fi = int(0.06 * SR)
    fo = int(1.1 * SR)
    out[:fi] *= np.linspace(0, 1, fi)[:, None]
    out[-fo:] *= np.linspace(1, 0, fo)[:, None]
    return out


def write_wav(path, data):
    import wave
    pcm = np.clip(data, -1, 1)
    pcm = (pcm * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


if __name__ == "__main__":
    out_path = sys.argv[1] if len(sys.argv) > 1 else "score.wav"
    total = float(sys.argv[2]) if len(sys.argv) > 2 else TOTAL
    audio = build(total)
    write_wav(out_path, audio)
    print(f"wrote {out_path}  {len(audio)/SR:.2f}s  peak={np.abs(audio).max():.3f}")
