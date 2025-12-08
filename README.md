
🎵 music.mycal.net — Static Site Specification

Author: Mycal
Purpose: Multi-album static music site served by Caddy
Build System: Plain HTML/CSS (no JS required)
AI Assistants: Claude Code, Copilot, ChatGPT (allowed to generate files)

📌 Overview

This repository contains the source for music.mycal.net, the public site for Mycal Music.

The site is fully static and deployed via Caddy.
It supports:

Multiple albums

Dedicated album pages

Dedicated track pages

Track images + lyrics

Per-page Music JSON-LD for SEO and cataloging

Root-relative links (no JS routing)

The first album implemented is:

Ashes and Echoes – Songs from the Playa (2025)

📁 Directory Structure

AI assistants should maintain this structure:

/
  index.html                        # Home page listing all albums

  /albums/
    /ashes-and-echoes/
      index.html                    # Album page
      album.jsonld                  # (optional separate JSON-LD file)
      /tracks/
        ten-principles-one-heart.html
        ashes-and-echoes.html
        sparkle-pony.html
        overheard-at-burning-man.html
        speak-burner-to-me.html
        ... (one file per track)
        track.jsonld (optional per-track version)

  /assets/
    /img/
      album/ashes-and-echoes-cover.jpg
      album/ashes-and-echoes-bg.jpg
      tracks/
        ten-principles-one-heart.jpg
        sparkle-pony.jpg
        ...
    /css/
      style.css


AI assistants may create additional small CSS files if needed, but must not add a build pipeline.

🏠 Home Page Requirements (index.html)

The home page must:

Display all albums as cards with:

Cover art

Title

Tagline

Release date

“View Album” button → /albums/<slug>/

Include JSON-LD of type CollectionPage listing available albums.

Keep layout minimal, clean, and extremely fast.

🎧 Album Page Requirements (/albums/ashes-and-echoes/index.html)

Album pages must include:

1. Header

Album cover

Title: Ashes and Echoes – Songs from the Playa

Subtitle: Mycal's Songs from the Playa. Stories from Fire and Steel.

Release date

Streaming platform links

Social links (YouTube, Instagram, TikTok)

2. Description

A short paragraph about the album’s theme and context.

3. Tracklist

Ordered list with links:

/albums/ashes-and-echoes/tracks/ten-principles-one-heart
/albums/ashes-and-echoes/tracks/ashes-and-echoes
/albums/ashes-and-echoes/tracks/sparkle-pony
/albums/ashes-and-echoes/tracks/overheard-at-burning-man
/albums/ashes-and-echoes/tracks/speak-burner-to-me
...

4. Album JSON-LD (MusicAlbum)

Template:

{
  "@context": "https://schema.org",
  "@type": "MusicAlbum",
  "@id": "https://music.mycal.net/albums/ashes-and-echoes",
  "name": "Ashes and Echoes",
  "alternateName": "Ashes and Echoes – Songs from the Playa",
  "byArtist": {
    "@type": "Person",
    "@id": "https://music.mycal.net/#mycal"
  },
  "genre": ["Folk", "EDM", "Burning Man"],
  "datePublished": "2025-08-15",
  "image": "https://music.mycal.net/assets/img/album/ashes-and-echoes-cover.jpg",
  "url": "https://music.mycal.net/albums/ashes-and-echoes",
  "track": []
}


AI assistants must automatically populate "track": [] entries.

🎶 Track Page Requirements (/tracks/<slug>.html)

Each track page must include:

1. Basic layout

Back link to album

Track title

Track-specific image (optional)

Streaming platform links

Lyrics in a <pre> block (no auto-formatting)

2. Track JSON-LD (MusicRecording)

Example template:

{
  "@context": "https://schema.org",
  "@type": "MusicRecording",
  "@id": "https://music.mycal.net/albums/ashes-and-echoes/tracks/ten-principles-one-heart",
  "name": "Ten Principles, One Heart",
  "byArtist": {
    "@type": "Person",
    "@id": "https://music.mycal.net/#mycal"
  },
  "inAlbum": {
    "@type": "MusicAlbum",
    "@id": "https://music.mycal.net/albums/ashes-and-echoes"
  },
  "genre": ["Folk", "Burning Man"],
  "datePublished": "2025-08-15",
  "image": "https://music.mycal.net/assets/img/tracks/ten-principles-one-heart.jpg",
  "url": "https://music.mycal.net/albums/ashes-and-echoes/tracks/ten-principles-one-heart",
  "sameAs": [],
  "lyrics": {
    "@type": "CreativeWork",
    "text": ""
  }
}


AI assistants should insert:

Correct streaming URLs

Correct image references

Full lyrics

🧩 Slug Conventions

AI assistants must use this format:

Album: ashes-and-echoes
Track: weird-title → weird-title.html


Track slugs are lowercase, hyphenated.

🎨 Styling Rules (CSS)

Very light, album-focused aesthetic

Dark desert tones + accents

Album hero section supports a full-width image

Track pages simple and readable

Mobile-friendly with no JS

AI assistants will generate /assets/css/style.css.

🤖 AI Assistant Tasks

AI assistants (Claude Code, ChatGPT, Copilot) are authorized to:

Create all HTML files & directories.

Populate track pages.

Generate placeholder images if needed.

Generate JSON-LD for albums and tracks.

Generate CSS.

Refactor as needed while maintaining structure.

They must not:

Add a JS framework

Add a build step (React, Svelte, Hugo, etc.)

Change URLs or slugs without approval

Remove JSON-LD

🚀 Deployment Notes

Caddy is expected to:

Serve this repo’s root directly

Cache static assets

Automatically provide HTTPS

No backend required

📌 TODO for Assistants

 Move current music.mycal.net content → /albums/ashes-and-echoes/index.html

 Create index.html album list

 Scaffold all track pages

 Insert lyrics from Mycal

 Add JSON-LD everywhere

 Create basic site-wide CSS

 Add alt text for all images

 Build a responsive header/footer

End of README

AI assistants may now begin creating files.





