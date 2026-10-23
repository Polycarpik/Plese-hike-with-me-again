/**
 * Polina & Zoko — Certified Solitude Solutions
 * Dynamic JSON Loader for Polaroid Review Carousel & Separate Hike Bubbles
 */

const ICONS = {
  // Proper meal icon: 🍱
  food: '🍱',
  // Snack icon: 🍏
  snack: '🍏',
  // Custom Cola can SVG icon
  cola: '<img src="assets/images/icon-cola.svg?v=21" alt="Cola" class="custom-ration-svg" />',
  // Custom Haribo gummy bear SVG icon
  haribo: '<img src="assets/images/icon-haribo.svg?v=21" alt="Haribo bear" class="custom-ration-svg" />',
};

const ICON_TITLES = {
  food: 'Proper meal',
  snack: 'Snack',
  cola: 'Cola',
  haribo: 'Haribos',
};

const FALLBACK_REVIEWS = [
  {
    "id": "rev-005",
    "dateAdded": "2026-10-20",
    "reviewerName": "Zoko",
    "reviewerAvatar": "assets/images/avatar-zoko.jpg",
    "instagramHandle": "@zoko_the_doge",
    "instagramUrl": "https://www.instagram.com/zoko_the_doge/",
    "mediaType": "image",
    "mediaUrl": "assets/images/review-zoko.jpg",
    "rating": "12/10, was not consulted",
    "reviewText": "Technically I do not have a choice. We get in the car, and I never know where we are going or whether we will be walking for twenty minutes or nine hours. Still the best day of my life every single time.",
    "trailName": "Every Single Trail · Always",
    "trailUrl": ""
  },
  {
    "id": "rev-006",
    "dateAdded": "2022-08-06",
    "reviewerName": "Igor",
    "reviewerAvatar": "assets/images/igor.jpg",
    "instagramHandle": "@trk.sp",
    "instagramUrl": "https://www.instagram.com/trk.sp/",
    "mediaType": "image",
    "mediaUrl": "assets/images/igor-review.jpg?v=2",
    "rating": "8/10, almost didn't panic",
    "reviewText": "Thanks to Polina, I’m no longer afraid of getting lost in the Alps at night. And now I know I can handle a 1,400-meter ascent, even though we originally planned just 200. 😁\n\nThank you, Polina! You made me stronger! 🤣🤣",
    "trailName": "Only 200m ascent, Lünersee · Aug 2022",
    "trailUrl": "https://www.komoot.com/tour/3360731770?share_token=a21DJiEoHUbV67Ikqh3jWPLlqfueR6BGJ8E8V7LyQRME9MMEt7&ref=wtd&t_s=referral&t_cid=route_share&t_ref_username=2847412767240"
  },
  {
    "id": "rev-007",
    "dateAdded": "2026-01-22",
    "reviewerName": "Kim",
    "reviewerAvatar": "assets/images/avatar-kim.jpg",
    "instagramHandle": "@kimshabib",
    "instagramUrl": "https://www.instagram.com/kimshabib/",
    "mediaType": "image",
    "mediaUrl": "assets/images/kim-review.jpg",
    "rating": "10/10 hike, 1/10 Kim's vertigo",
    "reviewText": "I'm a baby hiker so I don't know, but: 10/10 company, 10/10 hike, 1/10 my vertigo 😂 We returned in one piece and I almost didn't cry during the hike! Honestly, Polina should become a mountain guide—even if she hates people, she can definitely make it work for her.",
    "trailName": "Vertigo Testing Grounds · 2026",
    "trailUrl": "https://www.komoot.com/tour/2781736466?share_token=aH85Yb5Rk4Mghrfsvdk820brLnj8H3hVveRkgFEewPUqxIncIN&ref=wtd&t_s=referral&t_cid=route_share&t_ref_username=2847412767240"
  },
  {
    "id": "rev-011",
    "dateAdded": "2024-11",
    "reviewerName": "Anna",
    "reviewerAvatar": "assets/images/avatar-anna.jpg",
    "instagramHandle": "@ohh.arabella",
    "instagramUrl": "https://www.instagram.com/ohh.arabella/",
    "mediaType": "image",
    "mediaUrl": "assets/images/anna-review.jpg",
    "rating": "9/10, I take reviews more seriously now",
    "reviewText": "When we checked the route, one review mentioned “some heavy vegetation on the way.” Polina laughed: “There’s no heavy vegetation in the Canaries, ahahaha!” We then spent about 1.5 km pushing through bushes and Canarian nettles. Easy hike, though. I’d say Polina isn’t actually that fast going uphill.",
    "trailName": "Heavy Vegetation — Canary Islands Edition · Nov 2024",
    "trailUrl": "https://www.komoot.com/tour/2781736507?share_token=aJW6iuy24RhehRgMqXXsgnSh9nFniIgnUu96kVPnsLdQQUPxzC&ref=wtd&t_s=referral&t_cid=route_share&t_ref_username=2847412767240"
  }
  /* Hidden reviews: keep their assets so they can be restored.
  ,{
    "id": "rev-009",
    "dateAdded": "2026-06-12",
    "reviewerName": "Varvara",
    "reviewerAvatar": "assets/images/avatar-2.svg",
    "instagramHandle": "",
    "instagramUrl": "",
    "mediaType": "image",
    "mediaUrl": "assets/images/varvara-review.jpg",
    "rating": "0/10, never hiking with you again",
    "reviewText": "Being her sister did not qualify me for mercy. We climbed the first 30 meters of the trail, I immediately overheated, and I officially announced I am never hiking with her ever again. We are still related, but only at sea level.",
    "trailName": "The First 30 Meters — Sisterly Betrayal",
    "trailUrl": ""
  },
  {
    "id": "rev-010",
    "dateAdded": "2026-04",
    "reviewerName": "Kate",
    "reviewerAvatar": "assets/images/avatar-kate.jpg",
    "instagramHandle": "",
    "instagramUrl": "",
    "mediaType": "image",
    "mediaUrl": "assets/images/kate-review.jpg",
    "rating": "8/10, would go again if it’s REALLY easy by Polina’s standards",
    "reviewText": "I don’t really hike, but Polina said it would be great. Five “we’re almost there”s later, my battery was officially dead and I had to stop for food. One snack break later, I believed in walking again—and, against all expectations, we actually WERE almost there. Apparently the missing piece of equipment was lunch.",
    "trailName": "Almost There — Snack Recovery Edition · Apr 2026",
    "trailUrl": "https://www.komoot.com/tour/2855159002?share_token=abcFNseJJYASZGfoaaQRV0EENawkggkLxrwRptM623ZStlkZxB&ref=wtd&t_s=referral&t_cid=route_share&t_ref_username=2847412767240"
  }
  */
];

const FALLBACK_HIKES = [
  {
    id: 'hike-000',
    date: '2026-10-25',
    title: 'Cool view Vitosha sunset hike',
    distanceKm: 7.5,
    ascentM: 150,
    durationHours: 3,
    travelFromSofia: '25 min from Sofia',
    komootUrl:
      'https://www.komoot.com/tour/3358746839?share_token=aylsnoCz4sLEISiUxUSFq3nlnuRWrkhrQcIC6tkDnzNqjR8Hp1&ref=wtd&t_s=referral&t_cid=route_share&t_ref_username=2847412767240',
    snackProfile: ['snack'],
  },
  {
    id: 'hike-001',
    date: '2026-10-20',
    title: 'Vitosha 100 — Trail run competition I want to eventually do',
    distanceKm: 100.0,
    ascentM: 2010,
    durationHours: 20,
    travelFromSofia: '15 min from Sofia',
    komootUrl:
      'https://www.komoot.com/tour/3323568513?share_token=asE2gTdNa2eNFiQ0upRREGF6n6LUi0n1QKUX58400ECgjnXw3P&ref=wtd&t_s=referral&t_cid=route_share&t_ref_username=2847412767240',
    snackProfile: ['cola', 'cola', 'haribo', 'haribo', 'haribo'],
  },
];

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function classifyHike(hike) {
  const h = Number(hike.durationHours) || 0;
  const d = Number(hike.distanceKm) || 0;
  let tier = 'easy';
  let gradeLabel = 'Easy';
  let isSkull = false;
  let hoursLabel = `~${h}h`;
  let defaultProfile = ['snack'];

  if (hike.tier === 'legendary' || hike.tier === 'questionable' || h > 10 || d >= 45) {
    tier = 'questionable';
    gradeLabel = 'Legendary';
    isSkull = true;
    defaultProfile = ['cola', 'cola', 'haribo', 'haribo', 'haribo'];
  } else if (h > 7) {
    tier = 'hard';
    gradeLabel = 'Hardcore';
    defaultProfile = ['food', 'food', 'snack', 'snack', 'snack'];
  } else if (h > 3.5) {
    tier = 'medium';
    gradeLabel = 'Medium';
    defaultProfile = ['food', 'snack', 'snack'];
  }

  const profile =
    Array.isArray(hike.snackProfile) && hike.snackProfile.length > 0
      ? hike.snackProfile
      : defaultProfile;

  return { tier, gradeLabel, isSkull, hoursLabel, profile };
}

function renderLegendIcons() {
  document.querySelectorAll('.icon-food').forEach((el) => {
    el.textContent = ICONS.food;
  });
  document.querySelectorAll('.icon-snack').forEach((el) => {
    el.textContent = ICONS.snack;
  });

  document.querySelectorAll('.tier-sample-icons').forEach((el) => {
    const items = (el.dataset.profile || '').split(',').filter(Boolean);
    const parentCard = el.closest('.tier-agenda-card');
    let tier = 'easy';
    if (parentCard?.classList.contains('tier-medium')) tier = 'medium';
    if (parentCard?.classList.contains('tier-hard')) tier = 'hard';
    if (parentCard?.classList.contains('tier-questionable')) tier = 'questionable';

    el.innerHTML = items
      .map(
        (type) =>
          `<span class="ration-chip ${tier}" title="${ICON_TITLES[type] || 'Snack'}">
            ${ICONS[type] || ICONS.snack}
          </span>`
      )
      .join('');
  });
}

/* ==========================================================================
   POLAROID CASE STUDIES CAROUSEL WITH UNDERNEATH SCROLLBAR
   ========================================================================== */

async function initReviews() {
  const track = document.getElementById('reviews-track');
  const viewport = document.getElementById('reviews-viewport');
  const scrollbarTrack = document.getElementById('carousel-scrollbar-track');
  const scrollbarThumb = document.getElementById('carousel-scrollbar-thumb');

  if (!track || !viewport) return;

  let reviews = [];
  try {
    const res = await fetch('data/reviews.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Could not load reviews.json');
    const rawText = await res.text();
    const cleanJson = rawText.replace(/\/\*[\s\S]*?\*\//g, '');
    reviews = JSON.parse(cleanJson);
  } catch {
    reviews = FALLBACK_REVIEWS;
  }

  // Keep Zoko first, then show the remaining reviews newest first.
  reviews.sort((a, b) => {
    const pinnedOrder = Number(b.id === 'rev-005') - Number(a.id === 'rev-005');
    return pinnedOrder || new Date(b.dateAdded) - new Date(a.dateAdded);
  });

  track.innerHTML = reviews
    .map((rev) => {
      const media =
        rev.mediaType === 'video'
          ? `<video src="${escapeHtml(rev.mediaUrl)}" poster="${escapeHtml(rev.mediaPoster || '')}" controls preload="metadata"></video>`
          : `<img src="${escapeHtml(rev.mediaUrl)}" alt="Photo from ${escapeHtml(rev.reviewerName)}" loading="lazy" />`;

      const igLink = rev.instagramUrl
        ? `<a href="${escapeHtml(rev.instagramUrl)}" target="_blank" rel="noopener noreferrer" class="reviewer-ig">${escapeHtml(rev.instagramHandle || '@' + rev.reviewerName.toLowerCase())}</a>`
        : '';

      const hasTrailUrl = Boolean(rev.trailUrl && rev.trailUrl.trim());
      const trailLabel = rev.trailName || (hasTrailUrl ? 'View hike on Komoot' : '');
      const trailMarkup = trailLabel
        ? hasTrailUrl
          ? `<a href="${escapeHtml(rev.trailUrl.trim())}" target="_blank" rel="noopener noreferrer" class="review-trail-link">
               ${escapeHtml(trailLabel)} <span class="ext-arrow">↗</span>
             </a>`
          : `<span class="review-trail-static">${escapeHtml(trailLabel)}</span>`
        : '';

      return `
        <div class="polaroid-slide">
          <article class="polaroid-card">
            <div class="polaroid-frame">
              <div class="polaroid-media">
                ${media}
              </div>
              <div class="polaroid-caption">
                <span class="polaroid-rating">“${escapeHtml(rev.rating)}”</span>
              </div>
            </div>

            <div class="polaroid-body">
              <p class="polaroid-text">${escapeHtml(rev.reviewText)}</p>

              <div class="polaroid-footer">
                <div class="reviewer-info">
                  <img src="${escapeHtml(rev.reviewerAvatar)}" alt="${escapeHtml(rev.reviewerName)}" class="reviewer-avatar" />
                  <div class="reviewer-meta-text">
                    <span class="reviewer-name">${escapeHtml(rev.reviewerName)}</span>
                    ${igLink}
                  </div>
                </div>
                ${trailMarkup}
              </div>
            </div>
          </article>
        </div>
      `;
    })
    .join('');

  const total = reviews.length;
  let current = 0;
  let paused = false;

  function getVisibleCount() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 960) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, total - getVisibleCount());
  }

  function updateScrollbar() {
    if (!scrollbarThumb) return;
    const visible = getVisibleCount();
    const steps = getMaxIndex() + 1;
    const thumbWidthPercent = Math.min(100, Math.max(20, (visible / total) * 100));
    const maxTranslatePercent = 100 - thumbWidthPercent;
    const progress = steps > 1 ? current / (steps - 1) : 0;
    const leftPercent = progress * maxTranslatePercent;

    scrollbarThumb.style.width = `${thumbWidthPercent}%`;
    scrollbarThumb.style.left = `${leftPercent}%`;
  }

  function goTo(index) {
    const maxIdx = getMaxIndex();
    const steps = maxIdx + 1;
    current = ((index % steps) + steps) % steps;

    const slideEl = track.querySelector('.polaroid-slide');
    if (slideEl) {
      const gap = parseFloat(getComputedStyle(track).gap) || 22;
      const offset = current * (slideEl.offsetWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;
    }

    updateScrollbar();
  }

  let timer = setInterval(() => {
    if (!paused) goTo(current + 1);
  }, 20000);

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
      if (!paused) goTo(current + 1);
    }, 20000);
  }

  scrollbarTrack?.addEventListener('click', (e) => {
    const rect = scrollbarTrack.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetStep = Math.round(ratio * getMaxIndex());
    goTo(targetStep);
    resetTimer();
  });

  viewport.addEventListener('mouseenter', () => {
    paused = true;
  });
  viewport.addEventListener('mouseleave', () => {
    paused = false;
  });

  window.addEventListener('resize', () => {
    goTo(Math.min(current, getMaxIndex()));
  });

  goTo(0);
}

/* ==========================================================================
   UPCOMING HIKES — SEPARATE BUBBLE CARDS
   - Under hike name: Hike grade badge BEFORE distance · ascent · 🚙 travel time
   - Top right: Only hour estimation
   - Underneath top right: Snack icons (🍱 / 🍏)
   ========================================================================== */

async function initHikes() {
  const listEl = document.getElementById('hikes-list');
  if (!listEl) return;

  let hikes = [];
  try {
    const res = await fetch('data/hikes.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Could not load hikes.json');
    hikes = await res.json();
  } catch {
    hikes = FALLBACK_HIKES;
  }

  listEl.innerHTML = hikes
    .map((hike) => {
      const { tier, gradeLabel, isSkull, hoursLabel, profile } = classifyHike(hike);
      const ascent = hike.ascentM ?? hike.elevationGainM ?? 0;
      const rawTravel = hike.travelFromSofia || 'TBD from Sofia';
      const cleanTravel = rawTravel
        .replace(/^from\s+sofia\s*:?\s*/i, '')
        .replace(/\s*from\s+sofia$/i, '')
        .trim();

      const indicatorHtml = isSkull
        ? `<span class="level-skull" aria-hidden="true">💀</span>`
        : `<span class="level-dot level-${tier}"></span>`;

      const iconsHtml = profile
        .map((type) => {
          const title = ICON_TITLES[type] || 'Snack';
          const icon = ICONS[type] || ICONS.snack;
          return `<span class="ration-chip ${tier}" title="${title}">${icon}</span>`;
        })
        .join('');

      return `
        <article class="hike-bubble">
          <div class="hike-main">
            <a href="${escapeHtml(hike.komootUrl)}" target="_blank" rel="noopener noreferrer" class="hike-title-link">
              <span>${escapeHtml(hike.title)}</span>
              <span class="ext-arrow" aria-hidden="true">↗</span>
            </a>
            <div class="hike-stats">
              <span class="level-badge ${tier}">
                ${indicatorHtml}
                ${escapeHtml(gradeLabel)}
              </span>
              <span class="stat-sep">·</span>
              <span>${escapeHtml(hike.distanceKm)} km</span>
              <span class="stat-sep">·</span>
              <span>↑ ${escapeHtml(ascent)} m</span>
              <span class="stat-sep">·</span>
              <span>🚙 ${escapeHtml(cleanTravel)} from Sofia</span>
            </div>
          </div>

          <div class="hike-right">
            <span class="hours-estimate">${escapeHtml(hoursLabel)}</span>
            <div class="snack-profile" aria-label="Ration profile: ${escapeHtml(profile.join(', '))}">
              ${iconsHtml}
            </div>
          </div>
        </article>
      `;
    })
    .join('');
}

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  renderLegendIcons();
  initReviews();
  initHikes();
});
