/* analytics-events.js
 * Umami event wiring for maximum useful signal with minimal creep.
 * Requires Umami script to be loaded somewhere (your <script defer ... umami> tag).
 */

(function () {
  "use strict";

  // ---------- Helpers ----------
  function safe(fn) {
    try { fn(); } catch (e) {}
  }

  function track(eventName, props) {
    safe(function () {
      if (window.umami && typeof window.umami.track === "function") {
        window.umami.track(eventName, props || {});
      }
    });
  }

  function nowSeconds() {
    return Math.round(performance.now() / 1000);
  }

  function getUTM() {
    const p = new URLSearchParams(location.search);
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
    const out = {};
    keys.forEach((k) => {
      const v = p.get(k);
      if (v) out[k] = v;
    });
    return out;
  }

  function sameHost(url) {
    try { return new URL(url, location.href).host === location.host; }
    catch (e) { return true; }
  }

  function isHttp(url) {
    return typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://"));
  }

  function text80(el) {
    return (el && el.textContent ? el.textContent : "")
      .trim()
      .replace(/\s+/g, " ")
      .slice(0, 80);
  }

  function pageCtx() {
    return {
      page: location.pathname,
      title: document.title || "",
    };
  }

  // ---------- Core hooks ----------
  function hookOutboundClicks() {
    document.addEventListener("click", function (e) {
      const a = e.target && e.target.closest ? e.target.closest("a") : null;
      if (!a) return;

      const url = a.href || "";
      if (!isHttp(url)) return;
      if (sameHost(url)) return;

      const u = new URL(url);
      track("outbound_click", Object.assign({}, pageCtx(), getUTM(), {
        url,
        host: u.host,
        path: u.pathname,
        text: text80(a),
      }));
    }, { capture: true });
  }

  function hookScrollDepth() {
    const fired = new Set();
    const thresholds = [25, 50, 75, 100];

    function onScroll() {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop || 0;
      const scrollHeight = (doc.scrollHeight || 0) - (doc.clientHeight || 0);
      if (scrollHeight <= 0) return;

      const pct = Math.round((scrollTop / scrollHeight) * 100);

      thresholds.forEach((t) => {
        if (pct >= t && !fired.has(t)) {
          fired.add(t);
          track("scroll_depth", Object.assign({}, pageCtx(), {
            percent: t
          }));
        }
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function hookEngagedTime() {
    // Fires at: 10s, 30s, 60s, 180s (only while tab visible).
    const marks = [10, 30, 60, 180];
    const fired = new Set();
    let timer = null;

    function tick() {
      const t = nowSeconds();
      marks.forEach((m) => {
        if (t >= m && !fired.has(m)) {
          fired.add(m);
          track("engaged_time", Object.assign({}, pageCtx(), {
            seconds: m
          }));
        }
      });
      if (fired.size === marks.length && timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function start() {
      if (timer) return;
      timer = setInterval(tick, 1000);
      tick();
    }

    function stop() {
      if (!timer) return;
      clearInterval(timer);
      timer = null;
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else start();
    });

    start();
  }

  // ---------- Optional feature hooks (activate via classes/data-attrs) ----------
  function hookCopyLinkButtons() {
    // Add a button: <button class="js-copy-link" data-track="Sparkle Pony">Copy link</button>
    document.addEventListener("click", function (e) {
      const btn = e.target && e.target.closest ? e.target.closest(".js-copy-link") : null;
      if (!btn) return;

      const title = btn.getAttribute("data-track") || btn.getAttribute("data-title") || "unknown";
      const url = location.href;

      safe(async function () {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(url);
        }
      });

      track("copy_link", Object.assign({}, pageCtx(), {
        track: title,
        url
      }));
    }, { capture: true });
  }

  function hookPlayIntent() {
    // Use on links/buttons you control (NOT inside Bandcamp iframe):
    // <a class="js-play-intent" data-track="Sparkle Pony" data-album="Ashes and Echoes" href="...">Play</a>
    // <button class="js-play-intent" data-track="..." data-album="..." data-dest="bandcamp">Play</button>
    document.addEventListener("click", function (e) {
      const el = e.target && e.target.closest ? e.target.closest(".js-play-intent") : null;
      if (!el) return;

      const trackName = el.getAttribute("data-track") || "unknown";
      const albumName = el.getAttribute("data-album") || "";
      const dest = el.getAttribute("data-dest") || "bandcamp";
      const href = el.href || "";

      track("play_intent", Object.assign({}, pageCtx(), {
        track: trackName,
        album: albumName,
        dest,
        url: href
      }));
    }, { capture: true });
  }

  function hookFormSubmits() {
    // Add attribute to forms you care about:
    // <form class="js-track-form" data-event="signup_submit">...</form>
    document.addEventListener("submit", function (e) {
      const form = e.target && e.target.closest ? e.target.closest("form.js-track-form") : null;
      if (!form) return;

      const eventName = form.getAttribute("data-event") || "form_submit";
      const formName = form.getAttribute("data-name") || form.getAttribute("name") || form.getAttribute("id") || "unknown";

      track(eventName, Object.assign({}, pageCtx(), getUTM(), {
        form: formName
      }));
    }, { capture: true });
  }

  // ---------- Boot ----------
  function boot() {
    hookOutboundClicks();
    hookScrollDepth();
    hookEngagedTime();

    // Optional hooks (only fire if you add matching classes/attributes)
    hookCopyLinkButtons();
    hookPlayIntent();
    hookFormSubmits();

    // One "page ready" pulse can be helpful
    track("page_ready", Object.assign({}, pageCtx(), getUTM()));
  }

  // Defer until DOM is ready (script itself is usually loaded with defer anyway)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

})();



