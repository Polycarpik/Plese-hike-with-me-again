#!/usr/bin/env node
/**
 * Komoot Tour Scraper & JSON Updater for Polina & Zoko Alpine Club
 *
 * Usage:
 *   node scripts/add-komoot-hike.mjs <komoot-tour-url> [date-YYYY-MM-DD] [short-note]
 *
 * Example:
 *   node scripts/add-komoot-hike.mjs "https://www.komoot.com/tour/123456789" "2026-11-22" "Bring two sandwiches and zero expectations."
 *
 * Note: Ensure your Komoot tour privacy is set to "Public" so metadata can be read!
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const HIKES_JSON_PATH = path.resolve(__dirname, '../data/hikes.json');

async function extractKomootTour(url) {
  console.log(`\n📡 Fetching Komoot Tour: ${url} ...`);
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} when fetching Komoot URL. Make sure the tour is set to Public.`);
  }

  const html = await res.text();

  // Extract OpenGraph title & image
  const ogTitleMatch =
    html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<title>([^<]+)<\/title>/i);
  const ogDescMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i);
  const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);

  let title = ogTitleMatch ? ogTitleMatch[1].replace(/\s*\|\s*komoot.*$/i, '').trim() : 'Unnamed Komoot Expedition';
  let distanceKm = null;
  let durationHours = null;
  let elevationGainM = null;

  // 1. Try parsing embedded kmtBoot JSON state if present
  const distanceMetersMatch = html.match(/["']distance["']\s*:\s*([0-9]+(?:\.[0-9]+)?)/);
  const durationSecondsMatch = html.match(/["']duration["']\s*:\s*([0-9]+(?:\.[0-9]+)?)/);
  const elevationUpMatch = html.match(/["']elevation_up["']\s*:\s*([0-9]+(?:\.[0-9]+)?)/);

  if (distanceMetersMatch) {
    distanceKm = Number((parseFloat(distanceMetersMatch[1]) / 1000).toFixed(1));
  }
  if (durationSecondsMatch) {
    durationHours = Number((parseFloat(durationSecondsMatch[1]) / 3600).toFixed(1));
  }
  if (elevationUpMatch) {
    elevationGainM = Math.round(parseFloat(elevationUpMatch[1]));
  }

  // 2. Fallback: parse from og:description or page text (e.g., "Distance: 14.5 km | Duration: 04:15 h")
  const textToScan = `${ogDescMatch ? ogDescMatch[1] : ''} ${html}`;
  if (!distanceKm) {
    const kmMatch = textToScan.match(/([0-9]+[.,][0-9]+|[0-9]+)\s*km/i);
    if (kmMatch) distanceKm = parseFloat(kmMatch[1].replace(',', '.'));
  }
  if (!durationHours) {
    const hmMatch = textToScan.match(/([0-9]{1,2}):([0-9]{2})\s*h/i);
    if (hmMatch) {
      durationHours = Number((parseInt(hmMatch[1], 10) + parseInt(hmMatch[2], 10) / 60).toFixed(1));
    }
  }
  if (!elevationGainM) {
    const elevMatch = textToScan.match(/([0-9]{2,4})\s*m\b/i);
    if (elevMatch) elevationGainM = parseInt(elevMatch[1], 10);
  }

  return {
    title,
    distanceKm: distanceKm ?? 12.0,
    durationHours: durationHours ?? 4.0,
    elevationGainM: elevationGainM ?? 500,
    coverImage: ogImageMatch ? ogImageMatch[1] : 'assets/images/hike-1.svg',
  };
}

function formatDisplayDate(dateStr) {
  try {
    const d = new Date(`${dateStr}T08:00:00`);
    const weekday = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = String(d.getDate()).padStart(2, '0');
    return `${weekday}, ${month} ${day} • 07:30 AM`;
  } catch {
    return dateStr;
  }
}

async function main() {
  const [url, dateArg, noteArg] = process.argv.slice(2);
  if (!url) {
    console.log('Usage: node scripts/add-komoot-hike.mjs <komoot-url> [YYYY-MM-DD] [short-note]');
    process.exit(1);
  }

  const scraped = await extractKomootTour(url);
  const date = dateArg || new Date().toISOString().slice(0, 10);

  const newEntry = {
    id: `hike-${Date.now().toString().slice(-4)}`,
    date,
    displayDate: formatDisplayDate(date),
    title: scraped.title,
    region: 'Komoot Verified Sector',
    durationHours: scraped.durationHours,
    distanceKm: scraped.distanceKm,
    elevationGainM: scraped.elevationGainM,
    komootUrl: url,
    spotsLeft: '2 human spots (Zoko is mandatory)',
    shortNote:
      noteArg ||
      'Polina claims this route is "mostly downhill." Topological data and human knees strongly disagree.',
    coverImage: scraped.coverImage,
  };

  console.log('\n✅ Extracted Hike Entry:');
  console.log(JSON.stringify(newEntry, null, 2));

  try {
    const raw = await fs.readFile(HIKES_JSON_PATH, 'utf8');
    const hikes = JSON.parse(raw);
    hikes.push(newEntry);
    await fs.writeFile(HIKES_JSON_PATH, JSON.stringify(hikes, null, 2) + '\n', 'utf8');
    console.log(`\n🎉 Appended directly to ${HIKES_JSON_PATH}!`);
  } catch (err) {
    console.warn(`\n⚠️ Could not auto-append to ${HIKES_JSON_PATH}: ${err.message}`);
  }
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
