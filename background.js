/**
 * BetterYouTube Background Service Worker
 * Central hub for handling settings synchronization and background tasks
 */

chrome.runtime.setUninstallURL("https://forms.gle/FSyox1QeQhrSxhNA8");

chrome.runtime.onInstalled.addListener(() => {
  console.log("BetterYouTube Extension installed.");
  
  // Setup Context Menus
  chrome.contextMenus.create({
    id: "support",
    title: "Get Support / Donate",
    contexts: ["action"]
  });
  chrome.contextMenus.create({
    id: "rate",
    title: "Rate Extension",
    contexts: ["action"]
  });
  chrome.contextMenus.create({
    id: "github",
    title: "GitHub Repository",
    contexts: ["action"]
  });

  // Initialize default settings if not exist
  chrome.storage.local.get(['BetterYT_Settings'], (res) => {
    if (!res.BetterYT_Settings) {
      console.log("Setting default configs...");
      const defaultSettings = {
        adBlock: true, strictAdBlock: false, sponsorBlock: true, autoSkipSponsors: false, autoHD: true,
        hideShorts: true, compactGrid: false, rowFixer: 5, postPerRow: 3, shortsPerRow: 6, channelRowFixer: 5, showTags: true, colorizeDislike: true,
        hideComments: false, highlightMentions: true, hideLogo: false, hideSidebar: false,
        cinemaMode: true, customTheme: false, customPlayerSkin: false,
        autoPlay: false, pipMode: false,
        forceDarkMode: true, hideEndCards: true, hideAnnotations: false,
        volumeBoost: false, volumeBoostLevel: 300, bassEnhancer: false, bassBoostLevel: 8, customCSS: false, eqEnabled: false,
        devMode: false, debugLogs: false, watchTimeTracker: true, videoHighlights: true,
        fastForward: true, skipSeconds: 10, skipSecondsBack: 10, fastForwardKeyForward: 'ArrowRight', fastForwardKeyBack: 'ArrowLeft', fastForwardTriggerDelay: 0, fastForwardThrottleMs: 120, fastForwardScrollSeek: true
      };
      chrome.storage.local.set({
        'BetterYT_Settings': JSON.stringify(defaultSettings),
        'BetterYT_Skin': 'dark',
        'BetterYT_Accent': 'red',
        'BetterYT_IsPro': 'false'
      });
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_STATE') {
    chrome.storage.local.get(['BetterYT_Settings', 'BetterYT_Skin', 'BetterYT_Accent', 'BetterYT_IsPro'], (res) => {
      sendResponse(res);
    });
    return true;
  }

  if (message.action === 'storeWatchTime') {
    const { vidID, watchTime, title } = message.data || {};
    if (!vidID || !watchTime) return;
    chrome.storage.local.get(['BetterYT_WatchTime'], (res) => {
      const log = res.BetterYT_WatchTime || {};
      const today = new Date().toISOString().split('T')[0];
      if (!log[today]) log[today] = {};
      if (!log[today][vidID]) log[today][vidID] = { title: title || '', seconds: 0 };
      log[today][vidID].seconds += watchTime;
      chrome.storage.local.set({ BetterYT_WatchTime: log });
    });
    return;
  }

  if (message.action === 'exportWatchTime') {
    chrome.storage.local.get(['BetterYT_WatchTime'], (res) => {
      const raw = res.BetterYT_WatchTime || {};
      // Build aggregated summary: total per video, daily totals
      const summary = { daily: {}, videos: {}, totalSeconds: 0 };
      for (const [day, videos] of Object.entries(raw)) {
        let dayTotal = 0;
        for (const [vid, entry] of Object.entries(videos)) {
          dayTotal += entry.seconds;
          if (!summary.videos[vid]) summary.videos[vid] = { title: entry.title, totalSeconds: 0, days: {} };
          summary.videos[vid].totalSeconds += entry.seconds;
          summary.videos[vid].days[day] = (summary.videos[vid].days[day] || 0) + entry.seconds;
          summary.totalSeconds += entry.seconds;
        }
        summary.daily[day] = dayTotal;
      }
      summary.raw = raw;
      sendResponse(summary);
    });
    return true;
  }
});

// Context Menu Click Handler
chrome.contextMenus.onClicked.addListener((info) => {
  const links = {
    "support": "https://buymeacoffee.com/galore/e/521365",
    "rate": "https://chrome.google.com/webstore/detail/betteryoutube",
    "github": "https://github.com/BetterYouTube/Extension"
  };
  if (links[info.menuItemId]) {
    chrome.tabs.create({ url: links[info.menuItemId] });
  }
});
