// No Sports: runs on every page, hides sports posts, links, boxes and tabs,
// and covers up pages that are all about sports.

(() => {
  'use strict';

  const L = NOSPORTS;
  const DEFAULTS = { enabled: true, extraWords: [], offSites: [] };
  const HIDE_ATTR = 'data-nosports-hidden';
  const ALLOW_KEY = 'nosports-show-anyway';
  const host = location.hostname.replace(/^www\./, '');

  // Climbing up from a sports word stops at these (one button, one tab, one row).
  const STOPS = 'a, button, li, tr, article, [role="tab"], [role="presentation"], ' +
    '[role="listitem"], [role="menuitem"], [role="option"], [role="article"], ' +
    '[role="link"], [role="button"]';

  // Never touch text inside these.
  const SKIP = 'script, style, noscript, textarea, title, [contenteditable=""], ' +
    '[contenteditable="true"], [' + HIDE_ATTR + ']';

  let settings = { ...DEFAULTS };
  let regex = L.buildRegex([]);
  let cache = new WeakMap();
  let plainText = new WeakMap();
  let textHidden = new Map();
  let active = false;
  let observer = null;
  let timer = null;
  let lastUrl = '';
  let overlay = null;
  let styleTag = null;

  // ---------- helpers ----------

  function shownAnyway() {
    try { return sessionStorage.getItem(ALLOW_KEY) === '1'; } catch (e) { return false; }
  }

  function hostIsBlocked(h) {
    h = h.replace(/^www\./, '');
    return L.sites.some((s) => h === s || h.endsWith('.' + s));
  }

  function urlIsSports(urlString) {
    let u;
    try { u = new URL(urlString, location.href); } catch (e) { return false; }
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
    if (hostIsBlocked(u.hostname)) return true;
    const parts = u.pathname.toLowerCase().split('/').filter(Boolean);
    if (parts.includes('sports') || parts.includes('sport')) return true;
    if (/(^|\.)reddit\.com$/.test(u.hostname) && parts[0] === 'r' && parts[1]) {
      if (regex.test(parts[1])) return true;
    }
    return false;
  }

  function ensureStyle() {
    if (styleTag && styleTag.isConnected) return;
    styleTag = document.createElement('style');
    styleTag.textContent = '[' + HIDE_ATTR + ']{display:none !important;}';
    document.documentElement.appendChild(styleTag);
  }

  function pauseMedia() {
    document.querySelectorAll('video, audio').forEach((m) => {
      try { m.pause(); } catch (e) { /* ignore */ }
    });
  }

  // Reads the first bit of text in an element, with spaces between the
  // pieces, so "Live" + "NFL" reads as "Live NFL" and not "LiveNFL".
  function readText(el) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let out = '';
    let node;
    while (out.length < 600 && (node = walker.nextNode())) {
      const piece = node.nodeValue.trim();
      if (piece) out += piece + ' ';
    }
    return out.slice(0, 600);
  }

  // ---------- full page cover ----------

  function showOverlay() {
    if (overlay && overlay.isConnected) return;
    overlay = document.createElement('div');
    overlay.style.cssText =
      'all:initial;position:fixed;inset:0;z-index:2147483647;background:#ffffff;display:block;';
    const root = overlay.attachShadow({ mode: 'closed' });
    root.innerHTML =
      '<style>' +
      '.box{height:100vh;display:flex;flex-direction:column;align-items:center;' +
      'justify-content:center;font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif;' +
      'color:#111111;background:#ffffff;text-align:center;padding:24px;box-sizing:border-box;}' +
      'h1{font-size:28px;margin:0 0 8px;font-weight:700;}' +
      'p{font-size:16px;margin:0 0 24px;color:#333333;}' +
      'button{font:inherit;font-size:15px;padding:10px 18px;border:2px solid #111111;' +
      'background:#ffffff;color:#111111;border-radius:8px;cursor:pointer;}' +
      'button:hover{background:#111111;color:#ffffff;}' +
      '</style>' +
      '<div class="box"><h1>Sports page blocked</h1>' +
      '<p>No Sports covered this page for you.</p>' +
      '<button type="button">Show it anyway</button></div>';
    root.querySelector('button').addEventListener('click', () => {
      try { sessionStorage.setItem(ALLOW_KEY, '1'); } catch (e) { /* ignore */ }
      stop();
    });
    document.documentElement.appendChild(overlay);
    pauseMedia();
  }

  function removeOverlay() {
    if (overlay) overlay.remove();
    overlay = null;
  }

  // ---------- hiding posts and links ----------

  function pickTarget(el, isLink) {
    if (!isLink) return el.closest(L.wrappers) || el;
    const card = el.closest(L.cards);
    if (card && (card.textContent || '').length < 700) {
      return card.closest(L.wrappers) || card;
    }
    return el;
  }

  function check(el) {
    const isLink = el.tagName === 'A';
    const full = el.textContent || '';
    let text = readText(el);
    const label = el.getAttribute('aria-label');
    if (label) text += ' ' + label;
    if (el.tagName === 'SHREDDIT-POST') {
      text += ' ' + (el.getAttribute('post-title') || '') +
        ' ' + (el.getAttribute('subreddit-prefixed-name') || '');
    }
    const href = isLink ? (el.getAttribute('href') || '') : '';
    const key = text + '|' + href;

    const prev = cache.get(el);
    if (prev && prev.key === key) return;

    let match;
    if (!isLink && el.matches(L.boxes)) {
      // A small side box (like the NFL box on X): judge it by how it starts.
      match = full.length < 800 && L.isSports(text.slice(0, 120), regex);
    } else {
      match = L.isSports(text, regex);
      if (!match && isLink && href && href[0] !== '#') match = urlIsSports(href);
    }

    // Do not hide typing areas or big containers that hold many posts.
    if (match && el.isContentEditable) match = false;
    if (match && !isLink && full.length > 3000 &&
        el.querySelector('article, [role="article"]')) {
      match = false;
    }

    let target = null;
    if (match) {
      target = pickTarget(el, isLink);
      target.setAttribute(HIDE_ATTR, '');
    }
    if (prev && prev.target && prev.target !== target) {
      prev.target.removeAttribute(HIDE_ATTR);
    }
    cache.set(el, { key, target });
  }

  // ---------- hiding boxes, tabs and buttons labeled with a sports word ----------

  function smallParent(el, max) {
    const p = el.parentElement;
    if (!p || p === document.body || p === document.documentElement) return null;
    if ((p.textContent || '').length >= max) return null;
    return p;
  }

  function tooBig(el) {
    const r = el.getBoundingClientRect();
    return r.width * r.height > window.innerWidth * window.innerHeight * 0.5;
  }

  // Given a short piece of sports text, work out how much around it to hide.
  // Returns the thing to hide and how much text it may hold before we
  // decide the guess was wrong and look again.
  function blockFor(node, word) {
    const start = node.parentElement;
    const path = [start];
    let cur = start;
    let p;

    // 1. If a small box STARTS with the sports word (like a box titled "NFL"),
    //    the whole box is about sports.
    while ((p = smallParent(cur, 500)) && p.textContent.trimStart().startsWith(word)) {
      cur = p;
      path.push(cur);
    }
    // 2. Otherwise only step out through wrappers that add almost nothing,
    //    stopping at one button, tab, link or list row.
    while (!cur.matches(STOPS) && (p = smallParent(cur, 400)) &&
           p.textContent.length <= cur.textContent.length + 40) {
      cur = p;
      path.push(cur);
    }

    if (cur.tagName === 'A') return { target: pickTarget(cur, true), limit: 1500 };

    // A short post that mentions sports goes away as a whole.
    const card = cur.closest(L.cards);
    if (card && (card.textContent || '').length < 1500) {
      return { target: card.closest(L.wrappers) || card, limit: 3000 };
    }

    // Never hide a huge part of the screen. Step back down if we went too far.
    while (path.length > 1 && tooBig(cur)) {
      path.pop();
      cur = path[path.length - 1];
    }
    if (tooBig(cur)) return null;
    if (!cur.matches(STOPS) && getComputedStyle(cur).display === 'inline') return null;

    if (cur.matches('[role="tab"]') && cur.parentElement &&
        cur.parentElement.matches('[role="presentation"]')) {
      cur = cur.parentElement;
    }
    return { target: cur.closest(L.wrappers) || cur, limit: 600 };
  }

  // Pages load in pieces. If something we hid has since grown into a big
  // area, the first guess was wrong: show it again so it gets a fresh look.
  function recheckHidden() {
    for (const [target, limit] of textHidden) {
      if (!target.isConnected) { textHidden.delete(target); continue; }
      if ((target.textContent || '').length > limit) {
        target.removeAttribute(HIDE_ATTR);
        textHidden.delete(target);
      }
    }
  }

  function scanText() {
    if (!document.body) return;
    recheckHidden();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const raw = node.nodeValue;
      if (raw.length > 120) continue;
      if (plainText.get(node) === raw) continue;

      const word = raw.trim();
      if (word.length < 2 || word.length > 80 || !L.isSports(word, regex)) {
        plainText.set(node, raw);   // not sports, no need to look again
        continue;
      }
      // Sports text is looked at on every pass, never remembered,
      // because the page around it keeps changing while it loads.
      const parent = node.parentElement;
      if (!parent || parent.closest(SKIP)) continue;
      let found = null;
      try { found = blockFor(node, word); } catch (e) { found = null; }
      if (found && found.target) {
        found.target.setAttribute(HIDE_ATTR, '');
        textHidden.set(found.target, found.limit);
      }
    }
  }

  // ---------- the main loop ----------

  function scan() {
    timer = null;
    if (!active) return;

    if (location.href !== lastUrl) {
      lastUrl = location.href;
      if (urlIsSports(location.href)) showOverlay(); else removeOverlay();
    }
    if (overlay) {
      if (!overlay.isConnected) document.documentElement.appendChild(overlay);
      pauseMedia();
      return;
    }

    ensureStyle();
    const els = document.querySelectorAll(L.selectors + ', ' + L.boxes);
    for (const el of els) {
      try { check(el); } catch (e) { /* skip anything odd */ }
    }
    scanText();
  }

  function schedule() {
    if (!timer) timer = setTimeout(scan, 250);
  }

  // Also take a fresh look every couple of seconds, in case something was missed.
  setInterval(() => { if (active) schedule(); }, 2000);

  // ---------- on and off ----------

  function start() {
    active = true;
    lastUrl = '';
    if (!observer) {
      observer = new MutationObserver(schedule);
      observer.observe(document.documentElement, {
        childList: true, subtree: true, characterData: true
      });
    }
    scan();
  }

  function stop() {
    active = false;
    if (observer) { observer.disconnect(); observer = null; }
    if (timer) { clearTimeout(timer); timer = null; }
    removeOverlay();
    document.querySelectorAll('[' + HIDE_ATTR + ']').forEach((el) => {
      el.removeAttribute(HIDE_ATTR);
    });
    cache = new WeakMap();
    plainText = new WeakMap();
    textHidden = new Map();
  }

  function apply(saved) {
    settings = { ...DEFAULTS, ...saved };
    regex = L.buildRegex(settings.extraWords);
    stop();
    const off = !settings.enabled || settings.offSites.includes(host) || shownAnyway();
    if (!off) start();
  }

  function load() {
    chrome.storage.sync.get(DEFAULTS, apply);
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync') load();
  });
  window.addEventListener('popstate', schedule);

  load();
})();
