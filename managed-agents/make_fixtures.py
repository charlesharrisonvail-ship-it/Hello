# SPDX-License-Identifier: MIT
"""Generate the two large corpora the agents analyse inside their sandbox.

These are deliberately too big to paste into a prompt — that is the point.
The agent greps them with bash/python in its own container.

    python make_fixtures.py
"""

import csv
import json
import random
from datetime import datetime, timedelta, timezone
from pathlib import Path

DATA = Path(__file__).parent / "data"
SEED = 2277


def make_app_log(path: Path, n: int = 70_000) -> None:
    """~70k lines of JSON logs for a fictional e-commerce stack.

    The story: at 14:31:18Z commit a3f9c21 ships to checkout, replacing a
    batched query with a per-row loop. Latency and errors climb from 14:33.
    """
    rng = random.Random(SEED)
    base = datetime(2026, 9, 15, 12, 0, 0, tzinfo=timezone.utc)
    incident = datetime(2026, 9, 15, 14, 31, 18, tzinfo=timezone.utc)
    services = ["checkout", "cart", "auth", "inventory", "search", "payments"]
    routes = {
        "checkout": ["/v1/checkout/submit", "/v1/checkout/quote", "/v1/checkout/lines"],
        "cart": ["/v1/cart", "/v1/cart/items"],
        "auth": ["/v1/auth/token", "/v1/auth/refresh"],
        "inventory": ["/v1/inventory/reserve", "/v1/inventory/check"],
        "search": ["/v1/search"],
        "payments": ["/v1/payments/authorize"],
    }
    span = timedelta(hours=3)

    with path.open("w") as f:
        for i in range(n):
            ts = base + span * (i / n)
            svc = rng.choices(services, weights=[34, 14, 14, 14, 12, 12])[0]
            after = ts >= incident + timedelta(minutes=2)
            hot = svc == "checkout" and after

            if hot:
                latency = rng.gauss(3200, 700)
                level = "ERROR" if rng.random() < 0.20 else "WARN"
            else:
                latency = rng.gauss(60 if svc == "checkout" else 45, 15)
                level = "ERROR" if rng.random() < 0.002 else "INFO"
            latency = max(3.0, latency)

            rec = {
                "ts": ts.isoformat().replace("+00:00", "Z"),
                "level": level,
                "service": svc,
                "route": rng.choice(routes[svc]),
                "latency_ms": round(latency, 1),
                "status": 500 if level == "ERROR" else 200,
                "trace_id": f"{rng.getrandbits(64):016x}",
            }
            if hot and rng.random() < 0.35:
                rec["msg"] = "connection pool exhausted waiting for db-primary"
                rec["db_pool_wait_ms"] = round(rng.gauss(1800, 400), 1)
            elif hot and rng.random() < 0.25:
                rec["msg"] = "slow query: SELECT * FROM order_lines WHERE order_id = %s"
                rec["rows"] = 1
            f.write(json.dumps(rec) + "\n")

        # The deploy marker the runbook tells the agent to look for.
        f.write(json.dumps({
            "ts": incident.isoformat().replace("+00:00", "Z"),
            "level": "INFO", "service": "deploy-bot", "route": "-",
            "msg": "deploy complete: checkout a3f9c21 (d.okafor) "
                   "'refactor: simplify order line lookup'",
        }) + "\n")


def make_roster(path: Path, n: int = 40_000) -> None:
    """~40k licensed agents nationally. The Summit Peak cohort is buried in it."""
    rng = random.Random(SEED)
    first = ["Rowan", "Imogen", "Bastien", "Quinn", "Solveig", "Marcus", "Elena", "Dmitri",
             "Saoirse", "Tobias", "Anneke", "Rafael", "Priya", "Callum", "Noor", "Emeka",
             "Ingrid", "Mateo", "Yuki", "Hollis", "Larkin", "Odessa", "Tomas", "Freya"]
    last = ["Delacroix", "Hartwell", "Moreau", "Ashworth", "Brennan", "Okonkwo", "Vasquez",
            "Lindqvist", "Nakamura", "Petrov", "Alvarado", "Whitcombe", "Fairbanks",
            "Ruiz", "Tanaka", "Mbeki", "Sorensen", "Castellanos", "Dupont", "Kowalski"]
    brokerages = ["Keller Williams", "RE/MAX", "Compass", "eXp Realty", "Coldwell Banker",
                  "Berkshire Hathaway", "Sotheby's Intl", "Christie's Intl", "Independent",
                  "Gore Range Properties", "Blue River Brokerage", "Douglas Elliman"]
    markets = ["Denver", "Boulder", "Colorado Springs", "Aspen", "Telluride", "Steamboat",
               "Fort Collins", "Durango", "Breckenridge", "Crested Butte",
               "Vail / Beaver Creek", "Edwards / Avon", "Eagle / Gypsum"]
    segments = ["entry residential", "move-up residential", "luxury resort",
                "ultra-luxury", "investment", "land"]

    cols = ["license_id", "name", "brokerage", "market", "years_licensed",
            "ytd_volume_usd", "ytd_units", "segment", "listings_active", "status"]

    # The five agents still at Summit Peak — the ones worth calling.
    planted = json.loads((DATA / "recruiting" / "agent_details.json").read_text())

    with path.open("w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()

        for lic, a in planted.items():
            w.writerow({
                "license_id": lic, "name": a["name"], "brokerage": a["brokerage"],
                "market": a["market"], "years_licensed": a["years_licensed"],
                "ytd_volume_usd": a["ytd_volume_usd"], "ytd_units": a["ytd_units"],
                "segment": a["segment"], "listings_active": a["listings_active"],
                "status": "active",
            })

        # Everyone else, including the rest of the Summit Peak roster.
        for i in range(n):
            summit = i < 44          # 49 headcount minus the 5 named above
            brok = "Summit Peak Realty" if summit else rng.choice(brokerages)
            mkt = rng.choice(markets[-3:]) if summit else rng.choice(markets)
            # Production is power-law in the real world: most agents do modest
            # volume. Keeping the filler below the planted cohort means the
            # roster has a defensible top-5, not a coin flip.
            units = rng.randint(1, 18)
            avg = rng.choices(
                [180_000, 310_000, 460_000, 700_000, 1_150_000],
                weights=[30, 30, 22, 13, 5],
            )[0]
            w.writerow({
                "license_id": f"CO-{1_100_000 + i * 7 + rng.randint(0, 6)}",
                "name": f"{rng.choice(first)} {rng.choice(last)}",
                "brokerage": brok,
                "market": mkt,
                "years_licensed": rng.randint(1, 28),
                "ytd_volume_usd": units * avg,
                "ytd_units": units,
                "segment": rng.choice(segments),
                "listings_active": rng.randint(0, 9),
                "status": "active",
            })


if __name__ == "__main__":
    log = DATA / "incident" / "app.log"
    roster = DATA / "recruiting" / "roster.csv"
    make_app_log(log)
    make_roster(roster)
    for p in (log, roster):
        lines = sum(1 for _ in p.open())
        print(f"  {p.relative_to(Path(__file__).parent)}  {lines:,} lines  {p.stat().st_size/1e6:.1f} MB")
