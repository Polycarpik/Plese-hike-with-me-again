#!/usr/bin/env python3
"""
Komoot Tour Scraper & JSON Updater for Polina & Zoko

Usage:
  python3 scripts/add_komoot_hike.py "<komoot-tour-url>" ["1h 15m from Sofia"] [YYYY-MM-DD]

Example:
  python3 scripts/add_komoot_hike.py "https://www.komoot.com/tour/123456789" "45 min from Sofia"
"""

import json
import re
import sys
import urllib.request
from datetime import datetime
from pathlib import Path

HIKES_JSON = Path(__file__).resolve().parent.parent / "data" / "hikes.json"


def default_snack_profile(hours: float) -> list[str]:
    if hours <= 3.5:
        return ["snack"]
    if hours <= 7.0:
        return ["food", "snack", "snack"]
    return ["food", "food", "snack", "snack", "snack"]


def scrape_komoot(url: str) -> dict:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            ),
            "Accept-Language": "en-US,en;q=0.9",
        },
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        html = resp.read().decode("utf-8", errors="ignore")

    title_match = re.search(
        r'<meta[^>]+property=["\']og:title["\'][^>]+content=["\']([^"\']+)["\']', html, re.I
    ) or re.search(r"<title>([^<]+)</title>", html, re.I)
    title = (
        re.sub(r"\s*\|\s*komoot.*$", "", title_match.group(1), flags=re.I).strip()
        if title_match
        else "Unnamed Komoot Hike"
    )

    dist_m = re.search(r'["\']distance["\']\s*:\s*([0-9]+(?:\.[0-9]+)?)', html)
    dur_s = re.search(r'["\']duration["\']\s*:\s*([0-9]+(?:\.[0-9]+)?)', html)
    elev_m = re.search(r'["\']elevation_up["\']\s*:\s*([0-9]+(?:\.[0-9]+)?)', html)

    distance_km = round(float(dist_m.group(1)) / 1000.0, 1) if dist_m else 12.0
    duration_hours = round(float(dur_s.group(1)) / 3600.0, 1) if dur_s else 4.5
    ascent_m = int(round(float(elev_m.group(1)))) if elev_m else 600

    return {
        "title": title,
        "distanceKm": distance_km,
        "durationHours": duration_hours,
        "ascentM": ascent_m,
    }


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    url = sys.argv[1]
    travel_from_sofia = sys.argv[2] if len(sys.argv) > 2 else "1h from Sofia"
    date_str = sys.argv[3] if len(sys.argv) > 3 else datetime.now().strftime("%Y-%m-%d")

    scraped = scrape_komoot(url)
    entry = {
        "id": f"hike-{int(datetime.now().timestamp()) % 10000}",
        "date": date_str,
        "title": scraped["title"],
        "distanceKm": scraped["distanceKm"],
        "ascentM": scraped["ascentM"],
        "durationHours": scraped["durationHours"],
        "travelFromSofia": travel_from_sofia,
        "komootUrl": url,
        "snackProfile": default_snack_profile(scraped["durationHours"]),
    }

    print("\n✅ Extracted Komoot Hike:")
    print(json.dumps(entry, indent=2))

    if HIKES_JSON.exists():
        hikes = json.loads(HIKES_JSON.read_text(encoding="utf-8"))
        hikes.append(entry)
        HIKES_JSON.write_text(json.dumps(hikes, indent=2) + "\n", encoding="utf-8")
        print(f"\n🎉 Appended to {HIKES_JSON}")


if __name__ == "__main__":
    main()
