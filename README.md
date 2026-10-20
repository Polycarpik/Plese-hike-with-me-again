# Polina & Zoko — Alpine Solitude Division

A deadpan satirical "Professional Hiking Guide" static website designed to look like an ultra-serious Swiss mountaineering syndicate to anyone who doesn't read the text.

## Quick Start (Local Preview)

Because reviews and hikes are loaded dynamically from `data/reviews.json` and `data/hikes.json`, run a quick local static server in this folder:

```bash
python3 -m http.server 8080
```

Then open **http://localhost:8080** in your browser.

---

## How to Customize

### 1. Swap in Your Photos & Videos
Drop your own `.jpg`, `.png`, `.webp`, or `.mp4` files into `assets/images/` (or `assets/videos/`) and update the paths:
- **Screen 1 Hero Photo:** Edit `src="assets/images/hero-polina-zoko.svg"` in `index.html`.
- **Screen 1 Manifesto Portrait:** Edit `src="assets/images/portrait-polina-zoko.svg"` in `index.html`.
- **Reviews & Hikes Media:** Point `mediaUrl`, `reviewerAvatar`, and `coverImage` in `data/reviews.json` and `data/hikes.json` to your files.

### 2. Add or Edit Reviews (`data/reviews.json`)
- Unlimited reviews are supported and are **automatically sorted by `dateAdded` (newest first)**.
- Set `"mediaType": "video"` or `"image"`.
- If `"instagramUrl"` is provided, the reviewer's name becomes a clickable link with an `IG ↗` badge; if empty (`""`), it renders as plain text.
- Set `"trailPlatform"` to `"Komoot"` or `"Garmin"` and provide `"trailUrl"`.

### 3. Add Next Hikes (`data/hikes.json`)
Each hike's **Gastronomic Effort & Suffering Tier** is automatically calculated from `"durationHours"`:
- **`1–3.5h` (Green / Easy — Supernoob):** `🥨 1 Snack (Plus 1 Bribe for Zoko)`
- **`4–7h` (Yellow / Medium — "Easy for a Sporty Bro"):** `🥪 1 Proper Meal + 🍫 2 Snacks`
- **`7+h` (Purple / Hardcore — Type-2 Fun):** `🍱 2 Full Meals + 🥐 Several Emergency Snacks`

#### Auto-Scraping a Public Komoot Link:
You can automatically scrape a public Komoot tour URL and append it to `data/hikes.json` using Python:

```bash
python3 scripts/add_komoot_hike.py "https://www.komoot.com/tour/YOUR_TOUR_ID" "2026-11-22" "Polina says it's flat. It isn't."
```
*(Or click the **"+ Komoot JSON Generator Tool"** button directly on Screen 3 of the webpage!)*

### 4. Update Contact Links (Screen 4)
In `index.html` under `#screen-4`, replace the `href` attributes on the Telegram, Instagram, and Email cards with your actual handles.
