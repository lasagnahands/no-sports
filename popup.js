// No Sports popup: the on/off switch, per-site switch, and extra words box.

(() => {
  'use strict';

  const DEFAULTS = { enabled: true, extraWords: [], offSites: [] };

  const enabledBox = document.getElementById('enabled');
  const offSiteBox = document.getElementById('offSite');
  const siteRow = document.getElementById('siteRow');
  const siteName = document.getElementById('siteName');
  const extraBox = document.getElementById('extra');
  const savedNote = document.getElementById('saved');

  let settings = { ...DEFAULTS };
  let host = '';
  let saveTimer = null;
  let noteTimer = null;

  function showSaved() {
    savedNote.textContent = 'Saved';
    clearTimeout(noteTimer);
    noteTimer = setTimeout(() => { savedNote.textContent = ''; }, 1200);
  }

  function save() {
    chrome.storage.sync.set(settings, showSaved);
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

  offSiteBox.addEventListener('change', () => {
    const list = settings.offSites.filter((s) => s !== host);
    if (offSiteBox.checked) list.push(host);
    settings.offSites = list;
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

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let url = null;
      try { url = new URL(tabs[0].url); } catch (e) { url = null; }
      if (!url || (url.protocol !== 'http:' && url.protocol !== 'https:')) {
        siteRow.style.display = 'none';
        return;
      }
      host = url.hostname.replace(/^www\./, '');
      siteName.textContent = host;
      offSiteBox.checked = settings.offSites.includes(host);
    });
  });
})();
