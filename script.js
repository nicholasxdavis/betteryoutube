/**
 * BetterYouTube - Vanilla JS Extension Logic
 */
import { initializeFirebase } from './firebase-init.js';

// --- State Management ---
let state = {
  activePage: 'home',
  activeTab: 'general',
  skinMode: 'light',
  accentColor: 'red',
  isPro: false,
  customCSSCode: '',
  eqBands: [6.0, 4.5, 2.0, -1.0, -2.0, -1.0, 1.5, 4.0, 5.0, 6.0],
    settings: {
    adBlock: true, strictAdBlock: false, sponsorBlock: true, autoSkipSponsors: false,
    autoHD: true, autoHDResolution: 4320, autoHDFps: 60, autoHDEnhanced: false,
    hideShorts: true, compactGrid: false,
    hideComments: false, highlightMentions: true, hideLogo: false, hideSidebar: false,
    cinemaMode: true, customTheme: false, customPlayerSkin: false,
    autoPlay: false, pipMode: false,
    forceDarkMode: true, hideEndCards: true, hideAnnotations: false,
    volumeBoost: false, volumeBoostLevel: 300, bassEnhancer: false, bassBoostLevel: 8, customCSS: false, eqEnabled: false,
    devMode: false, debugLogs: false,
    controlFix: true, clickbaitRemover: false, clickbaitMode: 'sentence',
    nonstopAudio: false, audioOnly: false,
    twitchChat: false,
    fastForward: true, skipSeconds: 10, skipSecondsBack: 10, fastForwardKeyForward: 'ArrowRight', fastForwardKeyBack: 'ArrowLeft', fastForwardTriggerDelay: 0, fastForwardThrottleMs: 120, fastForwardScrollSeek: true,
    screenshot: false, showTags: true,
    watchTimeTracker: false, videoHighlights: true, randomVideo: false,
    returnDislike: true, mouseVolume: false, channelBlocklist: false, redirectHome: false, hideRelatedTheater: false,
    hideChannelAvatars: false, displayFullTitle: false, channelWideLayout: false,
    playbackSpeed: false,
    videoFilters: false, videoFilterBrightness: 100, videoFilterContrast: 100, videoFilterSaturation: 100,
    loopButton: false,
    scrollToTop: false,
    reversePlaylist: false,
    customShortcuts: false,
    pauseBackground: false,
    // Row Fixer extended settings
    rowFixer: 5, postPerRow: 3, shortsPerRow: 6, channelRowFixer: 5
  }
};
let watchAnalyticsState = { period: 'weekly', summary: null };

const saveState = () => {
  chrome.storage.local.set({
    'BetterYT_Settings': JSON.stringify(state.settings),
    'BetterYT_Skin': state.skinMode,
    'BetterYT_Accent': state.accentColor,
    'BetterYT_IsPro': state.isPro.toString(),
    'BetterYT_CustomCSS_Code': state.customCSSCode,
    'BetterYT_EQBands': state.eqBands
  });
  pushLiveStateToActiveTab();
};

let liveStatePushTimer = null;
const pushLiveStateToActiveTab = () => {
  clearTimeout(liveStatePushTimer);
  liveStatePushTimer = setTimeout(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs && tabs[0];
      if (!activeTab || !activeTab.id) return;
      chrome.tabs.sendMessage(activeTab.id, {
        type: 'BETTERYT_LIVE_STATE',
        payload: {
          settings: state.settings,
          eqBands: state.eqBands,
          customCSSCode: state.customCSSCode
        }
      }, () => {
        // Ignore when active tab has no BetterYouTube content script.
        void chrome.runtime.lastError;
      });
    });
  }, 25);
};

const loadState = (callback) => {
  chrome.storage.local.get(['BetterYT_Settings', 'BetterYT_Skin', 'BetterYT_Accent', 'BetterYT_IsPro', 'BetterYT_CustomCSS_Code', 'BetterYT_EQBands'], (res) => {
    if (res.BetterYT_Skin) state.skinMode = res.BetterYT_Skin;
    if (res.BetterYT_Accent) state.accentColor = res.BetterYT_Accent;
    if (res.BetterYT_IsPro) state.isPro = res.BetterYT_IsPro === 'true';
    if (res.BetterYT_CustomCSS_Code !== undefined) state.customCSSCode = res.BetterYT_CustomCSS_Code;
    if (res.BetterYT_EQBands) state.eqBands = res.BetterYT_EQBands;
    if (res.BetterYT_Settings) state.settings = JSON.parse(res.BetterYT_Settings);
    if (callback) callback();
  });
};

// --- Themes Data ---
const getThemeConfig = (skinMode) => {
  const isLight = skinMode === 'light';
  return {
    mono: { name: isLight ? 'Midnight Black' : 'Minimal White', base: isLight ? 'bg-zinc-900' : 'bg-zinc-200', text: isLight ? 'text-zinc-900' : 'text-zinc-100', border: isLight ? 'border-zinc-900/20' : 'border-zinc-200/20', indicator: isLight ? 'bg-zinc-900' : 'bg-zinc-200', glow: isLight ? 'rgba(24,24,27,0.4)' : 'rgba(228,228,231,0.5)', check: isLight ? 'text-white' : 'text-zinc-950', isPro: false },
    blue: { name: 'Ocean Blue', base: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500/20', indicator: 'bg-blue-500', glow: 'rgba(59,130,246,0.6)', check: 'text-white', isPro: false },
    red: { name: 'YouTube Red', base: 'bg-red-500', text: 'text-red-500', border: 'border-red-500/20', indicator: 'bg-red-500', glow: 'rgba(239,68,68,0.6)', check: 'text-white', isPro: false },
    purple: { name: 'Deep Purple', base: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-500/20', indicator: 'bg-purple-500', glow: 'rgba(168,85,247,0.6)', check: 'text-white', isPro: false },
    emerald: { name: 'Clean Emerald', base: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500/20', indicator: 'bg-emerald-500', glow: 'rgba(16,185,129,0.6)', check: 'text-white', isPro: false },
    amber: { name: 'Amber Glow', base: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500/20', indicator: 'bg-amber-500', glow: 'rgba(245,158,11,0.6)', check: 'text-white', isPro: false },
    pink: { name: 'Neon Pink', base: 'bg-pink-500', text: 'text-pink-500', border: 'border-pink-500/20', indicator: 'bg-pink-500', glow: 'rgba(236,72,153,0.6)', check: 'text-white', isPro: false },
    cyan: { name: 'Cyan Breeze', base: 'bg-cyan-500', text: 'text-cyan-500', border: 'border-cyan-500/20', indicator: 'bg-cyan-500', glow: 'rgba(6,182,212,0.6)', check: 'text-white', isPro: false },
    gold: { name: 'Luxury Gold (Pro)', base: 'bg-yellow-500', text: 'text-yellow-500', border: 'border-yellow-500/20', indicator: 'bg-yellow-500', glow: 'rgba(234,179,8,0.7)', check: 'text-zinc-950', isPro: true },
    oled: { name: 'OLED Pitch Black (Pro)', base: 'bg-zinc-950', text: 'text-zinc-500', border: 'border-zinc-800', indicator: 'bg-zinc-950', glow: 'rgba(255,255,255,0.15)', check: 'text-white', isPro: true }
  };
};

const SKINS = {
  dark: {
    bgApp: 'bg-[#050505]', bgPanel: 'bg-[#0c0c0e]', bgPanelTransparent: 'bg-[#0c0c0e]/85',
    ring: 'ring-white/[0.08]', border: 'border-white/[0.06]', borderSubtle: 'border-white/[0.04]',
    textMain: 'text-zinc-50', textMuted: 'text-zinc-400', textSubtle: 'text-zinc-500',
    bgHover: 'hover:bg-zinc-800/40', bgButton: 'bg-zinc-900/50', bgButtonHover: 'hover:bg-zinc-800',
    switchBg: 'bg-zinc-800', switchBorder: 'border-zinc-700/50', switchBgHover: 'group-hover:bg-zinc-700',
    switchBgLocked: 'bg-zinc-900/40', switchBorderLocked: 'border-zinc-800/60',
    pillBg: 'bg-zinc-900/50', pillIndicator: 'bg-zinc-800 border border-white/[0.06] shadow-[0_2px_10px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.05)]',
    pillTextActive: 'text-zinc-50', pillTextInactive: 'text-zinc-500 hover:text-zinc-300',
    cardBg: 'bg-zinc-900/30', inputBg: 'bg-[#050505]',
    shadowMain: 'shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)]', shadowToast: 'shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]',
    toastBg: 'bg-zinc-800/95 border-zinc-700/50',
    gradientStart: 'from-zinc-800', gradientEnd: 'to-zinc-900', noiseOpacity: 'opacity-[0.025]',
    proBg: 'bg-[#0c0c0e]', proGlare: 'rgba(255,255,255,0.08)', scrollBg: 'rgba(255,255,255,0.1)'
  },
  light: {
    bgApp: 'bg-zinc-100', bgPanel: 'bg-white', bgPanelTransparent: 'bg-white/85',
    ring: 'ring-zinc-200/50', border: 'border-zinc-200', borderSubtle: 'border-zinc-100',
    textMain: 'text-zinc-900', textMuted: 'text-zinc-600', textSubtle: 'text-zinc-400',
    bgHover: 'hover:bg-zinc-50', bgButton: 'bg-zinc-100', bgButtonHover: 'hover:bg-zinc-200',
    switchBg: 'bg-zinc-200', switchBorder: 'border-zinc-300/50', switchBgHover: 'group-hover:bg-zinc-300',
    switchBgLocked: 'bg-zinc-50', switchBorderLocked: 'border-zinc-200/60',
    pillBg: 'bg-zinc-100/80', pillIndicator: 'bg-white border border-zinc-200/50 shadow-[0_2px_8px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,1)]',
    pillTextActive: 'text-zinc-900', pillTextInactive: 'text-zinc-500 hover:text-zinc-700',
    cardBg: 'bg-zinc-50', inputBg: 'bg-white',
    shadowMain: 'shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)]', shadowToast: 'shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)]',
    toastBg: 'bg-white/95 border-zinc-200',
    gradientStart: 'from-zinc-50', gradientEnd: 'to-zinc-100', noiseOpacity: 'opacity-[0.015]',
    proBg: 'bg-[#fafafa]', proGlare: 'rgba(0,0,0,0.03)', scrollBg: 'rgba(0,0,0,0.15)'
  }
};

// --- Settings Configuration ---
const settingsConfig = {
  general: [
    { id: 'adBlock', label: 'Ad Blocker', desc: 'Automatically skip video ads & banner overlays.', isPro: false },
    { id: 'controlFix', label: 'Control Fix', desc: 'Prevent accidental video scrolling & arrow key issues.', isPro: false },
    { id: 'sponsorBlock', label: 'SponsorBlock', desc: 'Skip sponsored segments automatically.', isPro: false },
    { id: 'autoHD', label: 'Auto HD', desc: 'Force maximum quality playback by default.', isPro: true },
    { id: 'fastForward', label: 'Fast Forward', desc: 'Adds configurable skip controls, keys, and scroll seek.', isPro: false },
    { id: 'volumeBoost', label: 'Volume Booster', desc: 'Amplify quiet videos up to 1000%.', isPro: false },
    { id: 'playbackSpeed', label: 'Playback Speed', desc: 'Add quick speed preset buttons to the player.', isPro: false },
    { id: 'videoFilters', label: 'Video Filters', desc: 'Adjust brightness, contrast, and saturation.', isPro: false },
    { id: 'loopButton', label: 'Loop Button', desc: 'Add a seamless custom loop button to the player.', isPro: false },
    { id: 'customShortcuts', label: 'Power Shortcuts', desc: 'Shift + S/P/L for Screenshot, PiP, Loop.', isPro: false },
    { id: 'pauseBackground', label: 'Auto-Pause Background', desc: 'Pause video automatically when switching tabs.', isPro: false },
    { id: 'watchTimeTracker', label: 'Watch Time Tracker', desc: 'Log your viewing time per video and per day.', isPro: false },
    { id: 'randomVideo', label: 'Random Video Button', desc: 'Inject a dice button to pick a random page video.', isPro: false },
    { id: 'mouseVolume', label: 'Mouse Scroll Volume', desc: 'Hover video and scroll to natively adjust volume.', isPro: false },
    { id: 'channelBlocklist', label: 'Channel Blocklist', desc: 'Inject [x] buttons to permanently hide channels.', isPro: false },
    { id: 'redirectHome', label: 'Algorithmic Redirect', desc: 'Redirect YouTube root to your Subscriptions Feed.', isPro: false },
    { id: 'clickbaitRemover', label: 'Clickbait Defuser', desc: 'Swap clickbait thumbnails with neutral video frames.', isPro: false }
  ],
  appearance: [
    { id: 'forceDarkMode', label: 'Force Dark Theme', desc: 'Automatically set YouTube to Dark Mode.', isPro: false },
    { id: 'compactGrid', label: 'Compact Video Grid', desc: 'Control videos per row and layout density.', isPro: false },
    { id: 'hideChannelAvatars', label: 'Hide Channel Avatars', desc: 'Remove channel avatar circles from the video grid.', isPro: false },
    { id: 'displayFullTitle', label: 'Show Full Titles', desc: 'Prevent video titles from being cut off with ellipsis.', isPro: false },
    { id: 'channelWideLayout', label: 'Channel Wide Layout', desc: 'Remove sidebar on channel pages for a full-width grid.', isPro: false },
    { id: 'cinemaMode', label: 'Cinema Mode', desc: 'Widen the player and darken the surrounding page.', isPro: false },
    { id: 'customTheme', label: 'Custom Progress Bar', desc: 'Match the video timeline to your accent color.', isPro: false },
    { id: 'customPlayerSkin', label: 'Custom Player Skin', desc: 'Overhaul the YouTube player UI completely.', isPro: true },
    { id: 'hideComments', label: 'Hide Comments', desc: 'Completely remove the comment section.', isPro: false },
    { id: 'twitchChat', label: 'Twitch Chat Integration', desc: 'Adds a button to load Twitch Chat on livestreams.', isPro: true },
    { id: 'hideLogo', label: 'Hide YouTube Logo', desc: 'Remove the YouTube branding entirely.', isPro: true },
    { id: 'hideSidebar', label: 'Hide Sidebar Navigation', desc: 'Collapse the left sidebar for a cleaner look.', isPro: true },
    { id: 'hideShorts', label: 'Hide YouTube Shorts', desc: 'Remove Shorts from homepage, sidebar, and search.', isPro: false },
    { id: 'hideEndCards', label: 'Hide End Cards', desc: 'Remove intrusive video links at the end of videos.', isPro: false },
    { id: 'hideAnnotations', label: 'Hide Annotations', desc: 'Remove in-video popups and info cards.', isPro: false },
    { id: 'returnDislike', label: 'Return Dislike Counts', desc: 'Show public dislike counts next to the dislike button.', isPro: false },
    { id: 'showTags', label: 'Show Video Tags', desc: 'Display hidden creator tags below the title.', isPro: false },
    { id: 'videoHighlights', label: 'Video Highlights', desc: 'Mark popular timestamps directly on the progress bar.', isPro: false },
    { id: 'scrollToTop', label: 'Scroll to Top Button', desc: 'Floating button to quickly return to the player.', isPro: false },
    { id: 'reversePlaylist', label: 'Reverse Playlist', desc: 'Add a button to reverse playlist ordering.', isPro: false },

    { id: 'highlightMentions', label: 'Highlight Mentions', desc: 'Make @username mentions stand out in comments.', isPro: false },
    { id: 'hideRelatedTheater', label: 'Cinema Sidebar Wipe', desc: 'Completely hide the right sidebar in Theater Mode.', isPro: false }
  ],
  pro: [
    { id: 'volumeBoost', label: 'Volume Booster', desc: 'Safely amplify video volume up to 1000%.', isPro: true },
    { id: 'videoFilters', label: 'Video Filters', desc: 'Adjust brightness, contrast, and saturation of videos.', isPro: true },
    { id: 'customCSS', label: 'Custom CSS Engine', desc: 'Inject your own stylesheets directly.', isPro: true },
    { id: 'bassEnhancer', label: 'Bass Enhancer', desc: 'Add low-end punch with a dedicated bass processor.', isPro: true },
    { id: 'eqEnabled', label: 'Studio Audio Equalizer', desc: 'Fine-tune audio frequencies for the perfect sound.', isPro: true },
    { id: 'devMode', label: 'Developer Performance HUD', desc: 'Inject a floating statistics and diagnostics panel.', isPro: true }
  ]
};

// --- UI Update Functions ---
let toastTimer;
const showToast = (msg) => {
  const tc = document.getElementById('toast-container');
  document.getElementById('toast-msg').innerText = msg;
  const theme = getThemeConfig(state.skinMode)[state.accentColor];
  document.getElementById('toast-icon').className = `ph ph-check-circle ph-fill text-[16px] ${theme.text}`;
  
  tc.classList.remove('translate-y-4', 'opacity-0', 'scale-95', 'pointer-events-none');
  tc.classList.add('translate-y-0', 'opacity-100', 'scale-100');
  
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    tc.classList.add('translate-y-4', 'opacity-0', 'scale-95', 'pointer-events-none');
    tc.classList.remove('translate-y-0', 'opacity-100', 'scale-100');
  }, 2500);
};

const _waFmt = (secs) => {
  const n = Math.max(0, Math.round(Number(secs) || 0));
  const h = Math.floor(n / 3600);
  const m = Math.floor((n % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

const _waDayKey = (date) => date.toISOString().split('T')[0];

const _waRangeDays = (period) => ({ daily: 1, weekly: 7, monthly: 30, yearly: 365 }[period] || 7);

const _waSeriesForPeriod = (summary, period) => {
  const daily = (summary && summary.daily) ? summary.daily : {};
  const days = _waRangeDays(period);
  const now = new Date();
  const labels = [];
  const values = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = _waDayKey(d);
    labels.push(key.slice(5));
    values.push(Number(daily[key] || 0));
  }
  return { labels, values };
};

const _waStreak = (summary) => {
  const daily = (summary && summary.daily) ? summary.daily : {};
  let streak = 0;
  const now = new Date();
  for (let i = 0; i < 3650; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = _waDayKey(d);
    if ((daily[key] || 0) > 0) streak += 1;
    else break;
  }
  return streak;
};

const _waTrend = (summary) => {
  const daily = (summary && summary.daily) ? summary.daily : {};
  const now = new Date();
  let last7 = 0;
  let prev7 = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(now); d.setDate(now.getDate() - i);
    last7 += Number(daily[_waDayKey(d)] || 0);
  }
  for (let i = 7; i < 14; i++) {
    const d = new Date(now); d.setDate(now.getDate() - i);
    prev7 += Number(daily[_waDayKey(d)] || 0);
  }
  if (prev7 <= 0) return last7 > 0 ? '+100%' : '0%';
  const pct = ((last7 - prev7) / prev7) * 100;
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(0)}%`;
};

const _waDrawChart = (values) => {
  const cvs = document.getElementById('watch-analytics-chart');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const w = cvs.width, h = cvs.height;
  ctx.clearRect(0, 0, w, h);

  const max = Math.max(1, ...values);
  const padX = 8;
  const padY = 10;
  const step = values.length > 1 ? (w - padX * 2) / (values.length - 1) : (w - padX * 2);
  ctx.strokeStyle = state.skinMode === 'dark' ? 'rgba(255,255,255,0.22)' : 'rgba(24,24,27,0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padX, h - padY);
  ctx.lineTo(w - padX, h - padY);
  ctx.stroke();

  const theme = getThemeConfig(state.skinMode)[state.accentColor];
  ctx.strokeStyle = theme.glow.replace(/,?\s*0\.\d+\)/, ', 0.95)');
  ctx.fillStyle = theme.glow.replace(/,?\s*0\.\d+\)/, ', 0.18)');
  ctx.lineWidth = 2;
  ctx.beginPath();
  values.forEach((v, i) => {
    const x = padX + (step * i);
    const y = h - padY - ((v / max) * (h - padY * 2));
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.beginPath();
  values.forEach((v, i) => {
    const x = padX + (step * i);
    const y = h - padY - ((v / max) * (h - padY * 2));
    if (i === 0) ctx.moveTo(x, h - padY);
    ctx.lineTo(x, y);
  });
  ctx.lineTo(padX + (step * (values.length - 1)), h - padY);
  ctx.closePath();
  ctx.fill();
};

const renderWatchAnalytics = () => {
  const summary = watchAnalyticsState.summary;
  if (!summary) return;
  const period = watchAnalyticsState.period;
  const { values } = _waSeriesForPeriod(summary, period);
  const total = values.reduce((a, b) => a + b, 0);
  const avg = values.length ? total / values.length : 0;
  const best = values.length ? Math.max(...values) : 0;
  document.getElementById('wa-total').innerText = `${period[0].toUpperCase() + period.slice(1)}: ${_waFmt(total)}`;
  document.getElementById('wa-trend').innerText = `Trend: ${_waTrend(summary)}`;
  document.getElementById('wa-avg-day').innerText = _waFmt(avg);
  document.getElementById('wa-streak').innerText = `${_waStreak(summary)}d`;
  document.getElementById('wa-best-day').innerText = _waFmt(best);
  _waDrawChart(values);
};

const initWatchAnalytics = () => {
  chrome.runtime.sendMessage({ action: 'exportWatchTime' }, (summary) => {
    if (chrome.runtime.lastError) return;
    watchAnalyticsState.summary = summary || { daily: {}, videos: {}, totalSeconds: 0 };
    renderWatchAnalytics();
  });
  document.querySelectorAll('.wa-period').forEach(btn => {
    btn.addEventListener('click', () => {
      watchAnalyticsState.period = btn.getAttribute('data-period');
      renderWatchAnalytics();
      applySkinAndTheme();
    });
  });
};

const createSwitchHTML = (conf, skin, theme) => {
  const isActive = state.settings[conf.id];
  const isLocked = conf.isPro && !state.isPro;
  
  const bgClass = isLocked ? `${skin.switchBgLocked} ${skin.switchBorderLocked}` : (isActive ? theme.base + ' border-transparent' : `${skin.switchBg} ${skin.switchBorder} ${skin.switchBgHover}`);
  const shadowStyle = (isActive && !isLocked) ? `box-shadow: 0 0 12px ${theme.glow};` : '';
  const indicatorStyle = (isActive && !isLocked) ? `${theme.base} opacity-100 scale-y-100 box-shadow: 0 0 10px ${theme.glow}` : 'bg-transparent opacity-0 scale-y-50';
  
  let slidersHtml = '';
  if (isActive && !isLocked) {
    if (conf.id === 'volumeBoost') {
      slidersHtml = `
        <div class="px-2 pb-2 mt-1 mb-2 animate-fade-in">
          <div class="flex justify-between items-center mb-1">
            <span class="text-[11px] font-medium ${skin.textSubtle}">Gain Level</span>
            <span class="text-[11px] font-bold ${skin.textMain}" id="lbl-volumeBoostLevel">${state.settings.volumeBoostLevel}%</span>
          </div>
          <input type="range" class="w-full h-1 ${skin.cardBg} rounded-lg appearance-none cursor-pointer" min="100" max="1000" step="10" value="${state.settings.volumeBoostLevel}" id="range-volumeBoostLevel">
        </div>
      `;
    } else if (conf.id === 'bassEnhancer') {
      slidersHtml = `
        <div class="px-2 pb-2 mt-1 mb-2 animate-fade-in">
          <div class="flex justify-between items-center mb-1">
            <span class="text-[11px] font-medium ${skin.textSubtle}">Bass Boost</span>
            <span class="text-[11px] font-bold ${skin.textMain}" id="lbl-bassBoostLevel">${state.settings.bassBoostLevel} dB</span>
          </div>
          <input type="range" class="w-full h-1 ${skin.cardBg} rounded-lg appearance-none cursor-pointer" min="0" max="24" step="1" value="${state.settings.bassBoostLevel}" id="range-bassBoostLevel">
        </div>
      `;
    } else if (conf.id === 'fastForward') {
      slidersHtml = `
        <div class="px-2 pb-2 mt-1 mb-2 space-y-2 animate-fade-in">
          <div class="grid grid-cols-2 gap-2">
            <div>
              <div class="flex justify-between items-center mb-1">
                <span class="text-[11px] font-medium ${skin.textSubtle}">Forward</span>
                <span class="text-[11px] font-bold ${skin.textMain}" id="lbl-skipSeconds">${state.settings.skipSeconds}s</span>
              </div>
              <input type="range" class="w-full h-1 ${skin.cardBg} rounded-lg appearance-none cursor-pointer ff-slider" min="1" max="99" step="1" value="${state.settings.skipSeconds}" data-key="skipSeconds">
            </div>
            <div>
              <div class="flex justify-between items-center mb-1">
                <span class="text-[11px] font-medium ${skin.textSubtle}">Back</span>
                <span class="text-[11px] font-bold ${skin.textMain}" id="lbl-skipSecondsBack">${state.settings.skipSecondsBack || state.settings.skipSeconds}s</span>
              </div>
              <input type="range" class="w-full h-1 ${skin.cardBg} rounded-lg appearance-none cursor-pointer ff-slider" min="1" max="99" step="1" value="${state.settings.skipSecondsBack || state.settings.skipSeconds}" data-key="skipSecondsBack">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <div class="text-[11px] font-medium ${skin.textSubtle} mb-1">Forward Key</div>
              <select class="w-full h-8 ${skin.inputBg} border ${skin.borderSubtle} rounded-lg px-2 text-[11px] font-bold ${skin.textMain} focus:outline-none appearance-none cursor-pointer ff-key-select" data-key="fastForwardKeyForward">
                ${['ArrowRight','ArrowUp','KeyD','KeyL','Period'].map(k => `<option value="${k}" ${state.settings.fastForwardKeyForward === k ? 'selected' : ''}>${k}</option>`).join('')}
              </select>
            </div>
            <div>
              <div class="text-[11px] font-medium ${skin.textSubtle} mb-1">Back Key</div>
              <select class="w-full h-8 ${skin.inputBg} border ${skin.borderSubtle} rounded-lg px-2 text-[11px] font-bold ${skin.textMain} focus:outline-none appearance-none cursor-pointer ff-key-select" data-key="fastForwardKeyBack">
                ${['ArrowLeft','ArrowDown','KeyA','KeyJ','Comma'].map(k => `<option value="${k}" ${state.settings.fastForwardKeyBack === k ? 'selected' : ''}>${k}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <div class="flex justify-between items-center mb-1">
                <span class="text-[11px] font-medium ${skin.textSubtle}">Trigger Delay</span>
                <span class="text-[11px] font-bold ${skin.textMain}" id="lbl-fastForwardTriggerDelay">${state.settings.fastForwardTriggerDelay || 0}ms</span>
              </div>
              <input type="range" class="w-full h-1 ${skin.cardBg} rounded-lg appearance-none cursor-pointer ff-slider" min="0" max="1000" step="25" value="${state.settings.fastForwardTriggerDelay || 0}" data-key="fastForwardTriggerDelay">
            </div>
            <div>
              <div class="flex justify-between items-center mb-1">
                <span class="text-[11px] font-medium ${skin.textSubtle}">Seek Throttle</span>
                <span class="text-[11px] font-bold ${skin.textMain}" id="lbl-fastForwardThrottleMs">${state.settings.fastForwardThrottleMs || 120}ms</span>
              </div>
              <input type="range" class="w-full h-1 ${skin.cardBg} rounded-lg appearance-none cursor-pointer ff-slider" min="0" max="500" step="10" value="${state.settings.fastForwardThrottleMs || 120}" data-key="fastForwardThrottleMs">
            </div>
          </div>
          <label class="flex items-center justify-between h-8 px-2 ${skin.inputBg} border ${skin.borderSubtle} rounded-lg cursor-pointer">
            <span class="text-[11px] font-bold ${skin.textMain}">Scroll Seek</span>
            <input type="checkbox" class="ff-check accent-amber-500 rounded" data-key="fastForwardScrollSeek" ${state.settings.fastForwardScrollSeek ? 'checked' : ''}>
          </label>
        </div>
      `;
    } else if (conf.id === 'compactGrid') {
      slidersHtml = `
        <div class="px-2 pb-2 mt-1 mb-2 space-y-2 animate-fade-in">
          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-[11px] font-medium ${skin.textSubtle}">Home Videos / Row</span>
              <span class="text-[11px] font-bold ${skin.textMain}" id="lbl-rowFixer">${state.settings.rowFixer || 5}</span>
            </div>
            <input type="range" class="w-full h-1 ${skin.cardBg} rounded-lg appearance-none cursor-pointer rowfix-slider" min="1" max="12" step="1" value="${state.settings.rowFixer || 5}" data-key="rowFixer">
          </div>
          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-[11px] font-medium ${skin.textSubtle}">Community Posts / Row</span>
              <span class="text-[11px] font-bold ${skin.textMain}" id="lbl-postPerRow">${state.settings.postPerRow || 3}</span>
            </div>
            <input type="range" class="w-full h-1 ${skin.cardBg} rounded-lg appearance-none cursor-pointer rowfix-slider" min="1" max="8" step="1" value="${state.settings.postPerRow || 3}" data-key="postPerRow">
          </div>
          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-[11px] font-medium ${skin.textSubtle}">Shorts / Row</span>
              <span class="text-[11px] font-bold ${skin.textMain}" id="lbl-shortsPerRow">${state.settings.shortsPerRow || 6}</span>
            </div>
            <input type="range" class="w-full h-1 ${skin.cardBg} rounded-lg appearance-none cursor-pointer rowfix-slider" min="1" max="12" step="1" value="${state.settings.shortsPerRow || 6}" data-key="shortsPerRow">
          </div>
          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-[11px] font-medium ${skin.textSubtle}">Channel Videos / Row</span>
              <span class="text-[11px] font-bold ${skin.textMain}" id="lbl-channelRowFixer">${state.settings.channelRowFixer || 5}</span>
            </div>
            <input type="range" class="w-full h-1 ${skin.cardBg} rounded-lg appearance-none cursor-pointer rowfix-slider" min="1" max="12" step="1" value="${state.settings.channelRowFixer || 5}" data-key="channelRowFixer">
          </div>
        </div>
      `;
    } else if (conf.id === 'autoHD') {
      slidersHtml = `
        <div class="px-2 pb-2 mt-1 mb-2 space-y-2 animate-fade-in">
          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-[11px] font-medium ${skin.textSubtle}">Target Resolution</span>
            </div>
            <select class="w-full h-8 ${skin.inputBg} border ${skin.borderSubtle} rounded-lg px-2 text-[11px] font-bold ${skin.textMain} focus:outline-none focus:ring-1 focus:ring-amber-500/50 appearance-none cursor-pointer filter-select" data-key="autoHDResolution">
              <option value="4320" ${state.settings.autoHDResolution === 4320 ? 'selected' : ''}>8K Base (4320p)</option>
              <option value="2160" ${state.settings.autoHDResolution === 2160 ? 'selected' : ''}>4K (2160p)</option>
              <option value="1440" ${state.settings.autoHDResolution === 1440 ? 'selected' : ''}>1440p</option>
              <option value="1080" ${state.settings.autoHDResolution === 1080 ? 'selected' : ''}>1080p</option>
              <option value="720" ${state.settings.autoHDResolution === 720 ? 'selected' : ''}>720p</option>
              <option value="480" ${state.settings.autoHDResolution === 480 ? 'selected' : ''}>480p</option>
              <option value="360" ${state.settings.autoHDResolution === 360 ? 'selected' : ''}>360p</option>
              <option value="240" ${state.settings.autoHDResolution === 240 ? 'selected' : ''}>240p</option>
              <option value="144" ${state.settings.autoHDResolution === 144 ? 'selected' : ''}>144p</option>
            </select>
          </div>
          <div class="flex gap-2">
            <div class="flex-1">
              <div class="flex justify-between items-center mb-1">
                <span class="text-[11px] font-medium ${skin.textSubtle}">Max FPS</span>
              </div>
              <select class="w-full h-8 ${skin.inputBg} border ${skin.borderSubtle} rounded-lg px-2 text-[11px] font-bold ${skin.textMain} focus:outline-none focus:ring-1 focus:ring-amber-500/50 appearance-none cursor-pointer filter-select" data-key="autoHDFps">
                <option value="60" ${state.settings.autoHDFps === 60 ? 'selected' : ''}>60 FPS</option>
                <option value="50" ${state.settings.autoHDFps === 50 ? 'selected' : ''}>50 FPS</option>
                <option value="30" ${state.settings.autoHDFps === 30 ? 'selected' : ''}>30 FPS</option>
              </select>
            </div>
            <div class="flex-1 flex flex-col justify-end">
              <label class="flex items-center justify-between h-8 px-2 ${skin.inputBg} border ${skin.borderSubtle} rounded-lg cursor-pointer">
                <span class="text-[11px] font-bold ${skin.textMain}">Premium Bitrate</span>
                <input type="checkbox" class="filter-checkbox accent-amber-500 rounded" data-key="autoHDEnhanced" ${state.settings.autoHDEnhanced ? 'checked' : ''}>
              </label>
            </div>
          </div>
        </div>
      `;
    } else if (conf.id === 'videoFilters') {
      slidersHtml = `
        <div class="px-2 pb-2 mt-1 mb-2 space-y-2 animate-fade-in">
          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-[11px] font-medium ${skin.textSubtle}">Brightness</span>
              <span class="text-[11px] font-bold ${skin.textMain}" id="lbl-videoFilterBrightness">${state.settings.videoFilterBrightness}%</span>
            </div>
            <input type="range" class="w-full h-1 ${skin.cardBg} rounded-lg appearance-none cursor-pointer filter-slider" min="0" max="200" step="5" value="${state.settings.videoFilterBrightness}" data-key="videoFilterBrightness">
          </div>
          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-[11px] font-medium ${skin.textSubtle}">Contrast</span>
              <span class="text-[11px] font-bold ${skin.textMain}" id="lbl-videoFilterContrast">${state.settings.videoFilterContrast}%</span>
            </div>
            <input type="range" class="w-full h-1 ${skin.cardBg} rounded-lg appearance-none cursor-pointer filter-slider" min="0" max="200" step="5" value="${state.settings.videoFilterContrast}" data-key="videoFilterContrast">
          </div>
          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-[11px] font-medium ${skin.textSubtle}">Saturation</span>
              <span class="text-[11px] font-bold ${skin.textMain}" id="lbl-videoFilterSaturation">${state.settings.videoFilterSaturation}%</span>
            </div>
            <input type="range" class="w-full h-1 ${skin.cardBg} rounded-lg appearance-none cursor-pointer filter-slider" min="0" max="200" step="5" value="${state.settings.videoFilterSaturation}" data-key="videoFilterSaturation">
          </div>
        </div>
      `;
    } else if (conf.id === 'customCSS') {
      slidersHtml = `
        <div class="px-2 pb-2 mt-1 mb-2 animate-fade-in">
          <textarea id="ta-customCSS" class="w-full min-h-[100px] ${skin.inputBg} border ${skin.border} rounded-xl p-2 text-[11px] font-mono ${skin.textMain} focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all custom-scrollbar" placeholder="/* Enter your custom CSS here */" spellcheck="false">${state.customCSSCode}</textarea>
        </div>
      `;
    } else if (conf.id === 'eqEnabled') {
      slidersHtml = `
        <div class="px-2 pb-3 mt-1 mb-2 animate-fade-in overflow-x-auto custom-scrollbar">
          <div class="flex justify-between min-w-max pb-2 px-1">
            ${state.eqBands.map((val, idx) => `
              <div class="flex flex-col items-center gap-2">
                <span class="text-[9px] font-bold ${skin.textMain} w-6 text-center" id="lbl-eq-${idx}">${val > 0 ? '+'+val : val}</span>
                <input type="range" class="eq-slider w-1 h-20 outline-none appearance-none cursor-pointer rounded-full ${skin.cardBg}" style="writing-mode: vertical-lr; direction: rtl;" 
                       min="-12" max="12" step="0.5" value="${val}" data-idx="${idx}">
                <span class="text-[9px] font-medium ${skin.textSubtle}">${[32, 64, 125, 250, 500, '1k', '2k', '4k', '8k', '16k'][idx]}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  }

  return `
    <div class="group flex items-center justify-between py-2.5 px-3 -mx-3 rounded-xl ${skin.bgHover} transition-colors duration-200 relative overflow-hidden cursor-pointer switch-row" data-id="${conf.id}" data-locked="${isLocked}">
      <div class="absolute inset-0 ${skin.bgButton} transition-opacity duration-300 pointer-events-none opacity-0 flash-bg"></div>
      <div class="absolute left-0 top-1/2 h-1/2 w-[3px] -translate-y-1/2 rounded-r-full indicator-line ${isActive && !isLocked ? theme.base + ' opacity-100 scale-y-100' : 'bg-transparent opacity-0 scale-y-50'}" style="${isActive && !isLocked ? `box-shadow: 0 0 10px ${theme.glow}` : ''}"></div>
      
      <div class="flex flex-col space-y-0.5 pr-4 pl-1 flex-1 min-w-0 pointer-events-none">
        <label class="text-[13px] font-semibold leading-none tracking-tight flex items-center gap-1.5 truncate transition-colors duration-200 ${isLocked ? skin.textSubtle : skin.textMain}">
          ${conf.label}
          ${conf.isPro ? `<span class="px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-wider transition-colors ${isLocked ? 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}">Early</span>` : ''}
          ${isLocked ? '<i class="ph ph-lock-key ph-fill text-[12px] text-amber-500/70 ml-1 shrink-0"></i>' : ''}
        </label>
        <p class="text-[12px] ${skin.textMuted} leading-[1.3] tracking-normal line-clamp-2 mt-1">${conf.desc}</p>
      </div>

      <button type="button" class="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-all duration-300 focus-visible:outline-none shadow-inner transform-gpu active:scale-90 switch-bg ${bgClass}" style="${shadowStyle}">
        <span class="pointer-events-none block h-[18px] w-[18px] rounded-full ${isLocked ? 'bg-zinc-400' : 'bg-white'} shadow-[0_2px_5px_rgba(0,0,0,0.4)] ring-1 ring-black/5 switch-thumb ${isActive && !isLocked ? 'translate-x-[16px]' : 'translate-x-[2px]'}"></span>
      </button>
    </div>
    ${slidersHtml}
    <div class="h-[1px] w-full ${skin.borderSubtle} my-1 separator"></div>
  `;
};

const renderSwitches = () => {
  const skin = SKINS[state.skinMode];
  const theme = getThemeConfig(state.skinMode)[state.accentColor];
  
  const stripTrailingSeparator = (html) => html.replace(/<div class="h-\[1px\][^"]*"[^>]*><\/div>\s*$/m, '');
  const buildSwitchList = (items) => stripTrailingSeparator(items.map((conf) => createSwitchHTML(conf, skin, theme)).join(''));
  document.getElementById('general-switches').innerHTML = buildSwitchList(settingsConfig.general);
  document.getElementById('appearance-switches').innerHTML = buildSwitchList(settingsConfig.appearance);
  document.getElementById('pro-switches').innerHTML = buildSwitchList(settingsConfig.pro);
  
  // Attach listeners
  document.querySelectorAll('.switch-row').forEach(row => {
    row.addEventListener('click', (e) => {
      const isLocked = row.getAttribute('data-locked') === 'true';
      if(isLocked) {
        showToast('Early Access feature: Pro membership required.');
        return;
      }
      const id = row.getAttribute('data-id');
      const label = row.querySelector('label').innerText.replace('EARLY','').trim();
      
      // Flash effect
      const flash = row.querySelector('.flash-bg');
      flash.classList.remove('opacity-0');
      flash.classList.add('opacity-100');
      setTimeout(() => {
        flash.classList.remove('opacity-100');
        flash.classList.add('opacity-0');
      }, 300);

      state.settings[id] = !state.settings[id];
      saveState();
      renderSwitches();
      showToast(`${label} ${state.settings[id] ? 'enabled' : 'disabled'}`);
    });
  });

  // Attach slider listeners
  const volRange = document.getElementById('range-volumeBoostLevel');
  if (volRange) {
    volRange.addEventListener('input', (e) => {
      state.settings.volumeBoostLevel = parseInt(e.target.value);
      document.getElementById('lbl-volumeBoostLevel').innerText = state.settings.volumeBoostLevel + '%';
      saveState();
    });
  }

  const bassRange = document.getElementById('range-bassBoostLevel');
  if (bassRange) {
    bassRange.addEventListener('input', (e) => {
      state.settings.bassBoostLevel = parseInt(e.target.value);
      document.getElementById('lbl-bassBoostLevel').innerText = state.settings.bassBoostLevel + ' dB';
      saveState();
    });
  }

  document.querySelectorAll('.filter-slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const key = e.target.getAttribute('data-key');
      state.settings[key] = parseInt(e.target.value);
      document.getElementById('lbl-' + key).innerText = state.settings[key] + '%';
      saveState();
    });
  });

  document.querySelectorAll('.filter-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const key = e.target.getAttribute('data-key');
      state.settings[key] = parseInt(e.target.value);
      saveState();
    });
  });

  document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const key = e.target.getAttribute('data-key');
      state.settings[key] = e.target.checked;
      saveState();
    });
  });

  const cssTA = document.getElementById('ta-customCSS');
  if (cssTA) {
    cssTA.addEventListener('input', (e) => {
      state.customCSSCode = e.target.value;
      saveState();
    });
  }

  document.querySelectorAll('.eq-slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const idx = e.target.getAttribute('data-idx');
      state.eqBands[idx] = parseFloat(e.target.value);
      const val = state.eqBands[idx];
      document.getElementById('lbl-eq-' + idx).innerText = val > 0 ? '+'+val : val;
      saveState();
    });
  });

  document.querySelectorAll('.ff-slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const key = e.target.getAttribute('data-key');
      state.settings[key] = parseInt(e.target.value);
      const suffix = (key === 'skipSeconds' || key === 'skipSecondsBack') ? 's' : 'ms';
      const lbl = document.getElementById('lbl-' + key);
      if (lbl) lbl.innerText = state.settings[key] + suffix;
      saveState();
    });
  });

  document.querySelectorAll('.ff-key-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const key = e.target.getAttribute('data-key');
      state.settings[key] = e.target.value;
      saveState();
    });
  });

  document.querySelectorAll('.ff-check').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const key = e.target.getAttribute('data-key');
      state.settings[key] = e.target.checked;
      saveState();
    });
  });

  document.querySelectorAll('.rowfix-slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const key = e.target.getAttribute('data-key');
      state.settings[key] = parseInt(e.target.value);
      const lbl = document.getElementById('lbl-' + key);
      if (lbl) lbl.innerText = String(state.settings[key]);
      saveState();
    });
  });
};

const renderThemePicker = () => {
  const skin = SKINS[state.skinMode];
  const themes = getThemeConfig(state.skinMode);
  let html = '';
  
  for (const [id, t] of Object.entries(themes)) {
    const isSelected = state.accentColor === id;
    const isLocked = t.isPro && !state.isPro;
    const bgClass = isSelected ? `border-zinc-500 shadow-inner ${state.skinMode === 'dark' ? 'bg-zinc-800/50' : 'bg-zinc-200'}` : `${skin.borderSubtle} ${skin.cardBg} ${skin.bgHover}`;
    
    html += `
      <button data-id="${id}" data-locked="${isLocked}" class="theme-btn relative flex flex-col items-center justify-center aspect-square rounded-[14px] border transition-all duration-300 ease-out active:scale-95 ${bgClass} ${isLocked ? 'opacity-60' : ''}">
        <div class="w-5 h-5 rounded-full ${t.indicator} flex items-center justify-center border border-zinc-950/20 shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isSelected ? 'scale-110' : 'scale-100'}">
           ${isSelected ? `<i class="ph ph-check ph-bold text-[12px] ${t.check}"></i>` : ''}
        </div>
        ${isLocked ? `<div class="absolute -top-1 -right-1 bg-amber-500 rounded-full p-0.5 shadow-sm border border-zinc-900"><i class="ph ph-lock-key ph-fill text-[8px] text-zinc-950"></i></div>` : ''}
      </button>
    `;
  }
  document.getElementById('theme-picker').innerHTML = html;
  
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if(btn.getAttribute('data-locked') === 'true') {
        showToast('Early Access theme: Pro membership required.');
        return;
      }
      state.accentColor = btn.getAttribute('data-id');
      saveState();
      applySkinAndTheme();
      showToast(`${themes[state.accentColor].name.replace(' (Pro)', '')} applied`);
    });
  });
};

const renderProCard = () => {
  const skin = SKINS[state.skinMode];
  const theme = getThemeConfig(state.skinMode)[state.accentColor];
  const card = document.getElementById('pro-card');
  const contentArea = document.getElementById('pro-content-area');
  const bg = document.getElementById('pro-card-bg');
  const proTabText = document.getElementById('pro-tab-text');
  
  if (state.isPro) {
    card.className = `pro-card-3d relative overflow-hidden rounded-[20px] border ${theme.border} ${skin.proBg} p-7 text-center shadow-lg group cursor-pointer`;
    bg.className = `absolute inset-0 pointer-events-none ${state.skinMode === 'light' ? 'opacity-50' : 'opacity-100'}`;
    bg.style.background = `linear-gradient(to bottom, ${theme.glow.replace(/,\s*([0-9.]+)\)$/, ', 0.15)')}, transparent)`;
    proTabText.innerText = "Dashboard";
    contentArea.innerHTML = `
      <div class="pt-2 flex flex-col items-center">
        <div class="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-[16px] ${theme.base} bg-opacity-10 border ${theme.border} shadow-inner transition-transform duration-500 ease-out group-hover:-translate-y-1">
          <i class="ph ph-check-circle ph-fill text-[26px] ${theme.text}" style="filter: drop-shadow(0 0 10px ${theme.glow})"></i>
        </div>
        <h3 class="text-[19px] font-bold ${skin.textMain} tracking-tight mb-2">Early Access Dashboard</h3>
        <p class="text-[13px] ${skin.textMuted} leading-relaxed mb-4 font-medium px-2">
          As a Pro member, you have access to all Early Access tools. Expect occasional light bugs while features are being finalized.
        </p>
      </div>
    `;
    document.getElementById('redeem-prompt-container').classList.add('hidden');
    
    // Update advanced menu license
    document.getElementById('license-icon').className = `ph ph-crown ph-fill text-[18px]`;
    document.getElementById('license-icon-container').className = `p-2.5 rounded-xl transition-colors ${theme.base} bg-opacity-10 border ${theme.border} ${theme.text} shadow-inner`;
    document.getElementById('license-status-title').className = `text-[13px] font-bold truncate ${theme.text}`;
    document.getElementById('license-status-title').innerText = 'Pro Activated';
    document.getElementById('license-status-desc').innerText = 'All premium features are unlocked.';
    document.getElementById('redeem-input-area').classList.add('hidden');

  } else {
    card.className = `pro-card-3d relative overflow-hidden rounded-[20px] border ${skin.border} ${skin.proBg} p-7 text-center shadow-lg group cursor-pointer`;
    bg.className = `absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none ${state.skinMode === 'light' ? 'opacity-50' : 'opacity-100'}`;
    proTabText.innerText = "Pro";
    contentArea.innerHTML = `
      <div class="mx-auto mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-[16px] bg-gradient-to-br ${skin.gradientStart} ${skin.gradientEnd} border ${skin.borderSubtle} shadow-inner group-hover:-translate-y-1 transition-transform duration-500 ease-out">
        <i class="ph ph-crown ph-fill text-[26px] text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]"></i>
      </div>
      <h3 class="text-[19px] font-bold ${skin.textMain} tracking-tight mb-2">BetterYouTube Early Access</h3>
      <p class="text-[13px] ${skin.textMuted} leading-relaxed mb-7 font-medium px-2">
        Pro membership unlocks all Early Access tools. Expect some light issues as these features are actively iterated.
      </p>
      <a href="https://buymeacoffee.com/galore/e/521365" target="_blank" class="w-full inline-flex h-11 items-center justify-center rounded-[12px] bg-gradient-to-b from-amber-400 to-amber-500 px-4 py-2 text-[14px] font-bold text-amber-950 shadow-[0_4px_15px_rgba(245,158,11,0.2),inset_0_1px_0_rgba(255,255,255,0.4)] hover:from-amber-300 hover:to-amber-400 transition-all active:scale-95 transform-gpu">
        Upgrade to Pro
      </a>
    `;
    document.getElementById('redeem-prompt-container').classList.remove('hidden');
    
     // Update advanced menu license
    document.getElementById('license-icon').className = `ph ph-key ph-fill text-[18px]`;
    document.getElementById('license-icon-container').className = `p-2.5 rounded-xl transition-colors ${skin.bgButton} border ${skin.borderSubtle} ${skin.textMuted}`;
    document.getElementById('license-status-title').className = `text-[13px] font-bold truncate ${skin.textMain}`;
    document.getElementById('license-status-title').innerText = 'Free Version';
    document.getElementById('license-status-desc').innerText = 'Upgrade to unlock Pro features.';
    document.getElementById('redeem-input-area').classList.remove('hidden');
  }
};

const applySkinAndTheme = () => {
  const skin = SKINS[state.skinMode];
  const theme = getThemeConfig(state.skinMode)[state.accentColor];
  
  // Apply CSS Variables for scrollbar
  document.documentElement.style.setProperty('--scrollbar-bg', state.skinMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.15)');
  document.documentElement.style.setProperty('--scrollbar-hover', state.skinMode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)');
  document.documentElement.style.setProperty('--scrollbar-active', state.skinMode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)');

  // Update Body & Container
  document.body.className = `antialiased selection:bg-zinc-800 transition-colors duration-500 overflow-hidden w-[380px] h-[580px] ${skin.bgApp} ${skin.textMain}`;
  document.body.dataset.skinMode = state.skinMode;
  document.getElementById('app-container').className = `w-full h-full flex flex-col relative z-10 transform-gpu transition-colors duration-500 ring-1 ${skin.ring} overflow-hidden ${skin.shadowMain} ${skin.bgPanel}`;
  
  // Update Header & Footer
  const header = document.getElementById('main-header');
  if(state.isScrolled) {
    header.className = `px-5 pt-6 pb-3 flex flex-col gap-4 z-30 sticky top-0 transition-all duration-300 transform-gpu ${skin.bgPanelTransparent} backdrop-blur-xl border-b ${skin.borderSubtle} shadow-sm`;
  } else {
    header.className = `px-5 pt-6 pb-3 flex flex-col gap-4 z-30 sticky top-0 transition-all duration-300 transform-gpu bg-transparent border-b border-transparent`;
  }
  
  // Make the top-left app title a bit softer (muted gray) instead of pure white in dark mode.
  document.querySelector('.header-title').className = `text-[21px] font-semibold tracking-tight leading-none header-title ${skin.textMuted}`;
  document.querySelector('.settings-btn').className = `h-[36px] w-[36px] inline-flex items-center justify-center rounded-xl border border-transparent ${skin.bgHover} ${skin.textSubtle} hover:${skin.textMain} transition-all duration-200 active:scale-95 group settings-btn`;
  
  document.getElementById('main-footer').className = `px-5 py-3 border-t ${skin.borderSubtle} ${skin.bgPanelTransparent} backdrop-blur-xl flex justify-end items-center z-40 relative transition-colors duration-300`;
  document.querySelector('.footer-version').className = `hidden text-[10px] font-bold ${skin.textSubtle} tracking-[0.15em] uppercase cursor-default footer-version`;
  document.querySelector('.support-btn').className = `group relative inline-flex h-9 items-center justify-center rounded-xl border ${skin.borderSubtle} ${skin.bgButton} px-3.5 py-1 text-[12px] font-semibold ${skin.textMuted} transition-all duration-300 ${skin.bgButtonHover} hover:${skin.textMain} shadow-sm overflow-hidden active:scale-95 support-btn`;
  document.querySelector('.support-icon').className = `ph ph-heart ph-fill text-[14px] mr-2 opacity-70 group-hover:opacity-100 transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 ${theme.text} shrink-0 support-icon`;

  // Update Tabs
  document.querySelector('.tab-container').className = `relative flex h-10 items-center rounded-xl ${skin.pillBg} p-1 border ${skin.borderSubtle} tab-container`;
  document.getElementById('tab-indicator').className = `absolute top-1 bottom-1 rounded-[8px] ${skin.pillIndicator} transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu indicator-style`;
  
  document.querySelectorAll('.tab-btn').forEach(btn => {
    const isActive = btn.getAttribute('data-tab') === state.activeTab;
    btn.className = `tab-btn relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1 text-[13px] font-bold transition-colors w-full flex-1 gap-1.5 focus-visible:outline-none ${isActive ? skin.pillTextActive : skin.pillTextInactive}`;
    if(btn.getAttribute('data-tab') === 'pro') {
        btn.querySelector('i').className = `ph ph-crown ph-fill text-[13px] ${isActive ? (state.isPro ? theme.text : 'text-amber-500') : skin.textSubtle}`;
    }
  });

  // Update Skin Selector
  document.querySelector('.skin-selector-bg').className = `relative flex h-[42px] items-center rounded-xl p-1 border ${skin.borderSubtle} ${skin.cardBg} skin-selector-bg`;
  document.getElementById('skin-indicator').className = `absolute top-1 bottom-1 rounded-[8px] ${skin.pillIndicator} transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu skin-indicator-style`;
  document.getElementById('skin-indicator').style.transform = `translateX(${state.skinMode === 'dark' ? '0' : '100%'})`;
  
  document.getElementById('btn-dark-mode').className = `relative z-10 flex-1 flex items-center justify-center gap-2 text-[13px] font-bold transition-colors duration-300 ${state.skinMode === 'dark' ? skin.pillTextActive : skin.pillTextInactive}`;
  document.getElementById('btn-light-mode').className = `relative z-10 flex-1 flex items-center justify-center gap-2 text-[13px] font-bold transition-colors duration-300 ${state.skinMode === 'light' ? skin.pillTextActive : skin.pillTextInactive}`;

  // Update Advanced Overlay Colors
  document.getElementById('advanced-overlay').className = `absolute inset-0 z-50 ${skin.bgPanel} flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu ${state.activePage === 'advanced' ? 'translate-x-0' : `translate-x-full ${state.skinMode === 'dark' ? 'shadow-[-20px_0_40px_rgba(0,0,0,0.5)]' : 'shadow-[-20px_0_40px_rgba(0,0,0,0.1)]'}`}`;
  document.querySelector('.advanced-header').className = `px-5 pt-6 pb-4 flex items-center gap-3.5 z-30 sticky top-0 ${skin.bgPanelTransparent} backdrop-blur-xl border-b ${skin.borderSubtle} shadow-sm advanced-header`;
  document.querySelector('.advanced-back-btn').className = `h-[36px] w-[36px] inline-flex items-center justify-center rounded-xl border border-transparent ${skin.bgHover} ${skin.textSubtle} hover:${skin.textMain} transition-all duration-200 active:scale-95 group shrink-0 advanced-back-btn`;
  document.querySelector('.advanced-title').className = `text-[17px] font-bold tracking-tight leading-none truncate advanced-title ${skin.textMain}`;
  
  document.querySelectorAll('.advanced-card').forEach(c => c.className = `p-4 rounded-[16px] ${skin.cardBg} border ${skin.borderSubtle} flex flex-col gap-3.5 advanced-card`);
  const waCard = document.getElementById('watch-analytics-card');
  if (waCard) waCard.className = `p-4 rounded-[16px] ${skin.cardBg} border ${skin.borderSubtle} flex flex-col gap-3 advanced-card`;
  document.querySelectorAll('.wa-period').forEach(btn => {
    const isActive = btn.getAttribute('data-period') === watchAnalyticsState.period;
    btn.className = `wa-period h-7 rounded-lg border text-[10px] font-bold transition-colors ${isActive ? `${theme.base} text-white border-transparent` : `${skin.bgButton} ${skin.borderSubtle} ${skin.textMuted}`}`;
  });
  document.getElementById('redeem-input').className = `flex-1 h-10 ${skin.inputBg} border ${skin.border} rounded-xl px-3.5 text-[13px] ${skin.textMain} placeholder:${skin.textSubtle} focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all`;
  document.getElementById('redeem-btn').className = `h-10 px-4 ${skin.bgButton} ${skin.bgButtonHover} ${skin.textMain} text-[13px] font-bold rounded-xl border ${skin.borderSubtle} transition-colors active:scale-95`;
  
  document.querySelector('.review-card').className = `group flex items-center justify-between p-4 rounded-[16px] ${skin.cardBg} border ${skin.borderSubtle} ${skin.bgHover} transition-all duration-300 active:scale-[0.98] overflow-hidden relative advanced-action-card review-card`;
  document.querySelector('.card-title').className = `text-[13px] font-bold ${skin.textMain} transition-colors truncate card-title`;
  document.querySelector('.card-desc').className = `text-[12px] ${skin.textMuted} mt-0.5 truncate card-desc`;
  document.querySelector('.review-arrow').className = `ph ph-caret-right text-[16px] ${skin.textSubtle} group-hover:${theme.text} transition-colors relative z-10 review-arrow`;
  document.querySelector('.review-icon-bg').className = `p-2.5 rounded-xl bg-opacity-10 border shadow-inner transition-colors duration-300 ${theme.base} ${theme.border} ${theme.text} review-icon-bg`;
  document.querySelector('.review-icon').style.filter = `drop-shadow(0 0 5px ${theme.glow})`;

  document.querySelector('.issue-inline-link').className = `issue-inline-link text-[11px] font-medium transition-colors underline underline-offset-4 ${skin.textSubtle} hover:${theme.text}`;
  document.querySelector('.issue-card').className = `group flex items-center justify-between p-4 rounded-[16px] ${skin.cardBg} border ${skin.borderSubtle} ${skin.bgHover} transition-all duration-300 active:scale-[0.98] overflow-hidden relative advanced-action-card issue-card`;
  document.querySelector('.issue-title').className = `text-[13px] font-bold ${skin.textMain} transition-colors truncate issue-title`;
  document.querySelector('.issue-desc').className = `text-[12px] ${skin.textMuted} mt-0.5 truncate issue-desc`;
  document.querySelector('.issue-arrow').className = `ph ph-caret-right text-[16px] ${skin.textSubtle} group-hover:${theme.text} transition-colors relative z-10 issue-arrow`;
  document.querySelector('.issue-icon-bg').className = `p-2.5 rounded-xl bg-opacity-10 border shadow-inner transition-colors duration-300 ${theme.base} ${theme.border} ${theme.text} issue-icon-bg`;
  document.querySelector('.issue-icon').style.filter = `drop-shadow(0 0 5px ${theme.glow})`;

  document.querySelector('.contact-help-text').className = `text-[12px] leading-relaxed ${skin.textMuted} contact-help-text`;
  document.querySelectorAll('.contact-input').forEach((el) => {
    el.className = `h-10 ${skin.inputBg} border ${skin.border} rounded-xl px-3.5 text-[13px] ${skin.textMain} focus:outline-none transition-all focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 contact-input`;
  });
  document.querySelector('.contact-textarea').className = `min-h-[88px] ${skin.inputBg} border ${skin.border} rounded-xl px-3.5 py-2.5 text-[13px] ${skin.textMain} resize-none focus:outline-none transition-all focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 contact-textarea`;
  document.querySelector('.contact-submit').className = `h-10 px-4 ${skin.bgButton} ${skin.bgButtonHover} ${skin.textMain} text-[13px] font-bold rounded-xl border ${skin.borderSubtle} transition-colors active:scale-95 contact-submit`;

  // Update Toast
  document.getElementById('toast-container').className = `absolute bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2.5 rounded-full border ${skin.toastBg} backdrop-blur-xl px-4 py-2.5 text-sm ${skin.textMain} ${skin.shadowToast} transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu translate-y-4 opacity-0 scale-95 pointer-events-none`;

  // General Text Updates
  document.querySelectorAll('.section-title').forEach(el => el.className = `text-[11px] font-bold ${skin.textSubtle} uppercase tracking-widest px-1 section-title`);
  document.querySelector('.section-title-pro').className = `text-[11px] font-bold ${state.isPro ? theme.text : 'text-amber-500/80'} uppercase tracking-widest px-1 flex items-center gap-1.5 section-title-pro`;
  document.querySelector('.section-title-pro i').className = `ph ph-crown ph-fill text-[11px] ${state.isPro ? theme.text : 'text-amber-500/80'}`;
  document.querySelector('.redeem-prompt-text').className = `text-[12px] font-medium ${skin.textSubtle} hover:${skin.textMuted} transition-colors underline underline-offset-4 decoration-zinc-500/50 hover:decoration-zinc-500 redeem-prompt-text`;
  document.querySelector('.pro-glare-effect').style.background = `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${skin.proGlare}, transparent 40%)`;

  renderSwitches();
  renderThemePicker();
  renderProCard();
  if (watchAnalyticsState.summary) renderWatchAnalytics();
};

const switchTab = (tabId) => {
  state.activeTab = tabId;
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.getElementById(`tab-${tabId}`).classList.remove('hidden');
  
  const index = ['general', 'appearance', 'pro'].indexOf(tabId);
  document.getElementById('tab-indicator').style.transform = `translateX(calc(${index * 100}%))`;
  
  applySkinAndTheme();
};

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
  initializeFirebase();
  
  // Init
  loadState(() => {
    applySkinAndTheme();
    initWatchAnalytics();
  });

  // Show welcome dialog only once ever per installed profile.
  chrome.storage.local.get(['BetterYT_WelcomeSeen'], (res) => {
    const modal = document.getElementById('welcome-dialog');
    if (!modal) return;
    const seen = res.BetterYT_WelcomeSeen === true || res.BetterYT_WelcomeSeen === 'true' || res.BetterYT_WelcomeSeen === 1;
    if (seen) {
      modal.classList.add('is-hidden');
    } else {
      modal.classList.remove('is-hidden');
    }
  });
  
  // Welcome Modal
  document.getElementById('close-welcome').addEventListener('click', () => {
    const modal = document.getElementById('welcome-dialog');
    modal.classList.add('is-hidden');
    chrome.storage.local.set({ BetterYT_WelcomeSeen: true });
  });

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      switchTab(e.currentTarget.getAttribute('data-tab'));
      document.getElementById('main-scroll').scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Scroll Header
  document.getElementById('main-scroll').addEventListener('scroll', (e) => {
    state.isScrolled = e.target.scrollTop > 5;
    applySkinAndTheme();
  });

  // Skin Toggles
  document.getElementById('btn-dark-mode').addEventListener('click', () => {
    state.skinMode = 'dark'; saveState(); applySkinAndTheme();
  });
  document.getElementById('btn-light-mode').addEventListener('click', () => {
    state.skinMode = 'light'; saveState(); applySkinAndTheme();
  });

  // Pro Card 3D
  const proCard = document.getElementById('pro-card');
  proCard.addEventListener('mousemove', (e) => {
    const rect = proCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    proCard.style.setProperty('--mouse-x', `${x}px`);
    proCard.style.setProperty('--mouse-y', `${y}px`);
    proCard.style.setProperty('--rotate-x', `${((y - centerY) / centerY) * -10}deg`);
    proCard.style.setProperty('--rotate-y', `${((x - centerX) / centerX) * 10}deg`);
  });
  proCard.addEventListener('mouseleave', () => {
    proCard.style.setProperty('--rotate-x', `0deg`);
    proCard.style.setProperty('--rotate-y', `0deg`);
  });

  // Navigation (Advanced)
  document.getElementById('open-advanced').addEventListener('click', () => {
    state.activePage = 'advanced'; applySkinAndTheme();
  });
  document.getElementById('open-advanced-from-pro').addEventListener('click', () => {
    state.activePage = 'advanced'; applySkinAndTheme();
  });
  document.getElementById('close-advanced').addEventListener('click', () => {
    state.activePage = 'home'; applySkinAndTheme();
  });

  // Redeem
  document.getElementById('redeem-btn').addEventListener('click', () => {
    const val = document.getElementById('redeem-input').value.trim().toUpperCase();
    if (val === 'A7F3-K9Q2-XM4P-Z8L1' || val === 'GALORE') {
      state.isPro = true;
      saveState();
      showToast('BetterYouTube Pro Activated! 🎉');
      document.getElementById('redeem-input').value = '';
      state.activePage = 'home';
      switchTab('pro');
    } else {
      showToast('Invalid activation code.');
    }
  });

  // Support Hover Effect
  const supportBtn = document.querySelector('.support-btn');
  supportBtn.addEventListener('mouseenter', () => {
      const theme = getThemeConfig(state.skinMode)[state.accentColor];
      supportBtn.style.borderColor = theme.glow.replace(/0\.\d+\)/, '0.8)');
  });
  supportBtn.addEventListener('mouseleave', () => supportBtn.style.borderColor = '');
  
  const reviewBtn = document.querySelector('.review-card');
  reviewBtn.addEventListener('mouseenter', () => {
      const theme = getThemeConfig(state.skinMode)[state.accentColor];
      reviewBtn.style.borderColor = theme.glow.replace(/0\.\d+\)/, '0.4)');
  });
  reviewBtn.addEventListener('mouseleave', () => reviewBtn.style.borderColor = '');

  const issueBtn = document.querySelector('.issue-card');
  issueBtn.addEventListener('mouseenter', () => {
      const theme = getThemeConfig(state.skinMode)[state.accentColor];
      issueBtn.style.borderColor = theme.glow.replace(/0\.\d+\)/, '0.4)');
  });
  issueBtn.addEventListener('mouseleave', () => issueBtn.style.borderColor = '');

});