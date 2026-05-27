# Cronosonics — Build Spec

This directory hosts two playlists of essay-paired songs:

- `cronosonics/` — the full Cronosonic catalog (essay + song pairs).
- `cronofuture/` — the future-facing thematic subset (Substrate War, kWh Token, energy/meaning arc). These are the strongest tracks. A track that belongs to Cronofuture lives **only** in `cronofuture/` — there is no duplication.

The parent `index.html` is a card index that surfaces both. Each playlist subdirectory contains its own embedded player at its `index.html`, plus the MP3s and sidecar metadata for that playlist.

## Directory layout

```
cronosonics/
├── index.html              ← parent card grid (generated)
├── README.md               ← this file
├── cronosonics/
│   ├── index.html          ← player for this playlist (generated)
│   ├── <slug>.mp3
│   ├── <slug>.json         ← sidecar metadata, one per MP3
│   └── ...
└── cronofuture/
    ├── index.html          ← player for this playlist (generated)
    ├── <slug>.mp3
    ├── <slug>.json
    └── ...
```

## Source of truth

The MP3 files and their sidecar JSON files are the source of truth. To add a track: drop in `<slug>.mp3` and `<slug>.json` in the correct playlist directory, then regenerate the HTML.

## Sidecar JSON schema

Every `<slug>.mp3` must have a matching `<slug>.json` in the same directory. Required fields:

```json
{
  "slug": "kwh-token",
  "title": "The kWh Token",
  "essay": {
    "title": "The kWh Token",
    "url": "https://blog.mycal.net/the-kwh-token/"
  },
  "blurb": "One sentence on what the pairing is doing. ~20 words. Used on the card.",
  "released": "2025-11-12",
  "track_number": 1,
  "duration_seconds": 312
}
```

Optional fields:

- `subtitle` — secondary title shown under the main title on the card.
- `tags` — array of strings. Free-form. Not used for filtering across playlists (the directory does that), but useful for display chips.
- `credits` — array of `{ "role": "...", "name": "..." }` objects (e.g., MaryCal as featured vocalist).
- `lyrics_url` — link to a full lyrics page.
- `cover_image` — path relative to the playlist directory, used by the player.

`duration_seconds` should be filled in from the MP3 itself (mutagen, ffprobe, or similar) at generation time if not provided in the JSON.

## Regeneration task (for Claude Code)

When asked to regenerate, do the following:

1. **Scan** `cronosonics/cronosonics/` and `cronosonics/cronofuture/` for `*.mp3` files.
2. **Load** the sidecar JSON for each MP3. If a sidecar is missing, log a warning and skip that track (do not silently emit a card with placeholder text).
3. **Sort** tracks within each playlist by `track_number` ascending, then by `released` ascending as tiebreaker.
4. **Write** `cronosonics/index.html` — the parent card grid. The Cronofuture section appears first (it's the headline material), followed by the Cronosonics section. Each card uses the template in the "Card template" section below.
5. **Write** `cronosonics/cronofuture/index.html` and `cronosonics/cronosonics/index.html` — the playlist player pages. Use the player template at `cronosonics/cronofuture/index.html` as the reference (it's hand-built; copy structure, swap the track list and metadata).
6. **Emit JSON-LD** on the parent page: one `MusicPlaylist` for each playlist, with `track` arrays of `MusicRecording` objects. Each `MusicRecording` references its paired essay via `isBasedOn` or `subjectOf`. See the JSON-LD section below.

Do not modify hand-written copy in the hero or intro sections of `index.html` — only regenerate the card grid (everything inside `<section id="card-grid">`).

## Card template

Each card on the parent `index.html`:

```html
<article class="track-card" data-playlist="cronofuture" data-slug="kwh-token">
  <div class="card-header">
    <span class="playlist-badge cronofuture">★ Cronofuture</span>
    <span class="track-number">01</span>
  </div>
  <h3 class="track-title">The kWh Token</h3>
  <p class="track-essay">Paired with <a href="ESSAY_URL">ESSAY_TITLE</a></p>
  <p class="track-blurb">BLURB</p>
  <div class="card-actions">
    <a class="button-play" href="/cronosonics/cronofuture/?track=kwh-token">▶ Play</a>
    <a class="button-read" href="ESSAY_URL">Read essay</a>
  </div>
</article>
```

For Cronosonic-only cards, use `data-playlist="cronosonics"` and `<span class="playlist-badge cronosonics">Cronosonic</span>` (no star).

## Player behavior

Each playlist player at `<playlist>/index.html`:

- Reads `?track=<slug>` from the URL; if present, cues that track and autoplays (with a fallback if browser blocks autoplay).
- Shows the full track list for that playlist, in `track_number` order.
- Persists playback state across track changes (single `<audio>` element, swap `src`).
- Links each track row back to its paired essay.
- No analytics beyond what's already loaded site-wide.

## JSON-LD

Parent `index.html` emits:

- One `CreativeWorkSeries` for Cronosonics overall (already referenced as `@id: https://music.mycal.net/series/cronosonics`).
- One `MusicPlaylist` per subdirectory, each with a `track` array.
- Each track is a `MusicRecording` with `byArtist` pointing to the canonical Person `@id: https://blog.mycal.net/about/#mycal`, and `subjectOf` pointing to its paired essay.

Do not invent IDs. Use slugs from the sidecars.

## Hand-edit boundaries

Claude Code may regenerate:

- The card grid inside `<section id="card-grid">` on the parent `index.html`.
- The track list and metadata inside the player pages.
- The JSON-LD blocks on all three pages (parent + two players).

Claude Code must **not** modify:

- Hero copy, intro paragraphs, footer, navigation.
- CSS files.
- The hand-built reference player at `cronofuture/index.html` outside of its track list and JSON-LD.


