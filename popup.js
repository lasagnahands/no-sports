// No Sports popup: the on/off switch, the "run on this site" switch,
// the list of sites, and the extra words box.

(() => {
  'use strict';

  const DEFAULTS = {
    enabled: true,
    extraWords: [],
    sites: ['x.com', 'twitter.com', 'reddit.com']
  };

  const enabledBox = document.getElementById('enabled');
  const onSiteBox = document.getElementById('onSite');
  const siteRow = document.getElementById('siteRow');
  const siteName = document.getElementById('siteName');
  const siteList = document.getElementById('siteList');
  const extraBox = document.getElementById('extra');
  const savedNote = document.getElementById('saved');

  let settings = { ...DEFAULTS };
  let host = '';
  let saveTimer = null;
  let noteTimer = null;

  // True when a saved site covers this page ("reddit.com" covers "old.reddit.com").
  function covers(site, h) {
    return h === site || h.endsWith('.' + site);
  }

  function showSaved() {
    savedNote.textContent = 'Saved';
    clearTimeout(noteTimer);
    noteTimer = setTimeout(() => { savedNote.textContent = ''; }, 1200);
  }

  function showSites() {
    siteList.textContent = settings.sites.length
      ? settings.sites.join(', ')
      : 'None yet. Open a site and tick the box above.';
  }

  function save() {
    chrome.storage.sync.set(settings, showSaved);
    showSites();
  }

  function readWords() {
    return extraBox.value
      .split(/[\n,]+/)
      .map((w) => w.trim().toLowerCase())
      .filter((w) => w.length > 1);
  }

  enabledBox.addEventListener('change', () => {
    settings.enabled = enabledBox.checked;
    save();
  });

  onSiteBox.addEventListener('change', () => {
    const list = settings.sites.filter((s) => !covers(s, host));
    if (onSiteBox.checked) list.push(host);
    settings.sites = list;
    save();
  });

  extraBox.addEventListener('input', () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      settings.extraWords = readWords();
      save();
    }, 500);
  });

  chrome.storage.sync.get(DEFAULTS, (saved) => {
    settings = { ...DEFAULTS, ...saved };
    enabledBox.checked = settings.enabled;
    extraBox.value = settings.extraWords.join('\n');
    showSites();

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let url = null;
      try { url = new URL(tabs[0].url); } catch (e) { url = null; }
      if (!url || (url.protocol !== 'http:' && url.protocol !== 'https:')) {
        siteRow.style.display = 'none';
        return;
      }
      host = url.hostname.replace(/^www\./, '');
      siteName.textContent = host;
      onSiteBox.checked = settings.sites.some((s) => covers(s, host));
    });
  });
})();
