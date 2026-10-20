/**
 * Polina & Zoko — Certified Solitude Solutions
 * Dynamic JSON Loader for Polaroid Review Carousel & Separate Hike Bubbles
 */

const ICONS = {
  // Proper meal icon: 🍱
  food: '🍱',
  // Snack icon: 🍏
  snack: '🍏',
};

const FALLBACK_REVIEWS = [
  {
    id: 'rev-004',
    dateAdded: '2026-10-18',
    reviewerName: 'Niki',
    reviewerAvatar: 'assets/images/avatar-1.svg',
    instagramHandle: '',
    instagramUrl: '',
    mediaType: 'image',
    mediaUrl: 'assets/images/review-1.svg',
    rating: '10/10, would do again',
    reviewText:
      'The premium package included tea from a thermos and a full hour of professionally curated silence. Polina pointed at a cloud, Zoko sat on my boot, and nobody spoke. I have never felt so guided.',
    trailName: 'Autumn Ridge · Oct 2026',
    trailUrl: 'https://www.komoot.com/discover',
  },
  {
    id: 'rev-003',
    dateAdded: '2026-09-29',
    reviewerName: 'Maria',
    reviewerAvatar: 'assets/images/avatar-2.svg',
    instagramHandle: '@maria.outdoors',
    instagramUrl: 'https://instagram.com/',
    mediaType: 'image',
    mediaUrl: 'assets/images/review-2.svg',
    rating: '10/10, will do it again!',
    reviewText:
      "Our guides demonstrated exceptional leadership by walking 50 meters ahead of us for most of the day. When we got lost, Polina called it 'route exploration' and Zoko charged no extra.",
    trailName: 'Seven Lakes Loop · Sep 2026',
    trailUrl: 'https://www.komoot.com/discover',
  },
  {
    id: 'rev-002',
    dateAdded: '2026-08-14',
    reviewerName: 'Alex',
    reviewerAvatar: 'assets/images/avatar-3.svg',
    instagramHandle: '@alex.walks',
    instagramUrl: 'https://instagram.com/',
    mediaType: 'image',
    mediaUrl: 'assets/images/review-3.svg',
    rating: '-100/10, I hate hiking now',
    reviewText:
      "I was told this was 'a nice walk'. It was 22 kilometres. The safety briefing consisted of the word 'eh' while Zoko ate half my sandwich. My calves have retained legal counsel.",
    trailName: 'Malyovitsa Traverse · Aug 2026',
    trailUrl: 'https://connect.garmin.com/',
  },
  {
    id: 'rev-001',
    dateAdded: '2026-07-19',
    reviewerName: 'Elena',
    reviewerAvatar: 'assets/images/avatar-4.svg',
    instagramHandle: '',
    instagramUrl: '',
    mediaType: 'image',
    mediaUrl: 'assets/images/review-4.svg',
    rating: '11/10 for Zoko, 2/10 for my knees',
    reviewText:
      'Promised panoramic views. Delivered the inside of a cloud for five hours. Polina packed three kinds of cheese and Zoko let me pet his ears when the incline hit 35%.',
    trailName: 'Vitosha Cloud Immersion · Jul 2026',
    trailUrl: 'https://www.komoot.com/discover',
  },
];

const FALLBACK_HIKES = [
  {
    id: 'hike-001',
    date: '2026-11-01',
    title: 'That hill behind the monastery',
    distanceKm: 6.4,
    ascentM: 240,
    durationHours: 2.0,
    travelFromSofia: '35 min from Sofia',
    komootUrl: 'https://www.komoot.com/discover',
    snackProfile: ['snack'],
  },
  {
    id: 'hike-002',
    date: '2026-11-08',
    title: 'Rila Ridge — Executive Contemplation Loop',
    distanceKm: 14.8,
    ascentM: 790,
    durationHours: 5.5,
    travelFromSofia: '1h 20m from Sofia',
    komootUrl: 'https://www.komoot.com/discover',
    snackProfile: ['food', 'snack', 'snack'],
  },
  {
    id: 'hike-003',
    date: '2026-11-15',
    title: 'Pirin Full-Day Synergy & Calf Destruction',
    distanceKm: 24.5,
    ascentM: 1520,
    durationHours: 8.5,
    travelFromSofia: '2h 15m from Sofia',
    komootUrl: 'https://www.komoot.com/discover',
    snackProfile: ['food', 'food', 'snack', 'snack', 'snack'],
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
  let tier = 'easy';
  let gradeLabel = 'Easy';
  let hoursLabel = `~${h}h`;
  let defaultProfile = ['snack'];

  if (h > 3.5 && h <= 7) {
    tier = 'medium';
    gradeLabel = 'Medium';
    defaultProfile = ['food', 'snack', 'snack'];
  } else if (h > 7) {
    tier = 'hard';
    gradeLabel = 'Hardcore';
    defaultProfile = ['food', 'food', 'snack', 'snack', 'snack'];
  }

  const profile =
    Array.isArray(hike.snackProfile) && hike.snackProfile.length > 0
      ? hike.snackProfile
      : defaultProfile;

  return { tier, gradeLabel, hoursLabel, profile };
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

    el.innerHTML = items
      .map(
        (type) =>
          `<span class="ration-chip ${tier}" title="${type === 'food' ? 'Proper meal' : 'Snack'}">
            ${type === 'food' ? ICONS.food : ICONS.snack}
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
    reviews = await res.json();
  } catch {
    reviews = FALLBACK_REVIEWS;
  }

  // Sort by dateAdded descending
  reviews.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

  track.innerHTML = reviews
    .map((rev) => {
      const media =
        rev.mediaType === 'video'
          ? `<video src="${escapeHtml(rev.mediaUrl)}" poster="${escapeHtml(rev.mediaPoster || '')}" controls preload="metadata"></video>`
          : `<img src="${escapeHtml(rev.mediaUrl)}" alt="Photo from ${escapeHtml(rev.reviewerName)}" loading="lazy" />`;

      const igLink = rev.instagramUrl
        ? `<a href="${escapeHtml(rev.instagramUrl)}" target="_blank" rel="noopener noreferrer" class="reviewer-ig">${escapeHtml(rev.instagramHandle || '@' + rev.reviewerName.toLowerCase())}</a>`
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
                <a href="${escapeHtml(rev.trailUrl)}" target="_blank" rel="noopener noreferrer" class="review-trail-link">
                  ${escapeHtml(rev.trailName)} <span class="ext-arrow">↗</span>
                </a>
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
  }, 5000);

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
      if (!paused) goTo(current + 1);
    }, 5000);
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
      const { tier, gradeLabel, hoursLabel, profile } = classifyHike(hike);
      const ascent = hike.ascentM ?? hike.elevationGainM ?? 0;
      const rawTravel = hike.travelFromSofia || 'TBD from Sofia';
      const cleanTravel = rawTravel
        .replace(/^from\s+sofia\s*:?\s*/i, '')
        .replace(/\s*from\s+sofia$/i, '')
        .trim();

      const iconsHtml = profile
        .map((type) => {
          const isFood = type === 'food';
          const title = isFood ? 'Proper meal' : 'Snack';
          return `<span class="ration-chip ${tier}" title="${title}">${isFood ? ICONS.food : ICONS.snack}</span>`;
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
                <span class="level-dot level-${tier}"></span>
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
