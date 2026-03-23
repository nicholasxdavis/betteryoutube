/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 694
() {

/**
 * BetterYouTube Content Script Bundle
 * Integrates multiple features into a lightweight, unified injection script.
 */

// ---- Extension Context Invalidation Guard ----
// Stops all polling intervals and exits gracefully when the extension is reloaded.
function _bytIsContextValid() {
    try { return !!chrome.runtime?.id; } catch (e) { return false; }
}
const _bytAllIntervals = (/* unused pure expression or super */ null && ([]));
const _bytSetInterval = (fn, ms) => {
    const id = setInterval(() => {
        if (!_bytIsContextValid()) { clearInterval(id); return; }
        fn();
    }, ms);
    _bytAllIntervals.push(id);
    return id;
};
// Override window.setInterval for feature intervals so they self-stop on context invalidation.
// Native setInterval is still available as window.__nativeSetInterval if needed.
window.__nativeSetInterval = window.setInterval;
// -----------------------------------------------
function _bytSafeSendMessage(message, callback) {
    if (!_bytIsContextValid()) return;
    try {
        if (typeof callback === "function") {
            chrome.runtime.sendMessage(message, (response) => {
                if (chrome.runtime.lastError) return;
                callback(response);
            });
        } else {
            const pr = chrome.runtime.sendMessage(message);
            if (pr && typeof pr.then === "function") pr.catch(() => {});
        }
    } catch (e) {}
}


let BetterYT_Settings = {};

function initFeatures() {
    if (BetterYT_Settings.autoHD) initAutoHD();
    if (BetterYT_Settings.controlFix) initControlFix();
    if (BetterYT_Settings.hideComments) initHideComments();
    if (BetterYT_Settings.clickbaitRemover) initClickbaitRemover();
    if (BetterYT_Settings.nonstopAudio) initNonstop();
    if (BetterYT_Settings.twitchChat) initTwitchChat();
    if (BetterYT_Settings.randomVideo) initRandomVideo();
    if (BetterYT_Settings.returnDislike) initReturnDislike();
    
    // Phase 3 Features
    if (BetterYT_Settings.adBlock) initAdBlocker();
    if (BetterYT_Settings.sponsorBlock) initSponsorBlock();
    if (BetterYT_Settings.hideShorts) initShortsBlocker();
    
    // Phase 4 Features
    if (BetterYT_Settings.fastForward) initFastForward();
    if (BetterYT_Settings.pipMode) initPiP();
    if (BetterYT_Settings.screenshot) initScreenshot();
    
    // Phase 5 Features
    if (BetterYT_Settings.compactGrid) initCompactGrid();
    if (BetterYT_Settings.showTags) initShowTags();
    if (BetterYT_Settings.colorizeDislike) initColorizeDislike();
    if (BetterYT_Settings.forceDarkMode) initDarkMode();
    
    // Phase 6 Features
    if (BetterYT_Settings.watchTimeTracker) initWatchTimeTracker();
    if (BetterYT_Settings.videoHighlights) initHighlights();
    
    // Phase 8 Features
    if (BetterYT_Settings.cinemaMode) initCinemaMode();
    if (BetterYT_Settings.customTheme) initCustomTheme();
    if (BetterYT_Settings.volumeBoost) initVolumeBoost();

    // Phase 9 Features
    if (BetterYT_Settings.hideEndCards) initHideEndCards();
    if (BetterYT_Settings.hideAnnotations) initHideAnnotations();
    if (BetterYT_Settings.playbackSpeed) initPlaybackSpeed();
    if (BetterYT_Settings.videoFilters) initVideoFilters();

    // Phase 10 Features (Advanced)
    if (BetterYT_Settings.loopButton) initLoopButton();
    if (BetterYT_Settings.scrollToTop) initScrollToTop();
    if (BetterYT_Settings.reversePlaylist) initReversePlaylist();
    if (BetterYT_Settings.customShortcuts) initShortcuts();
    if (BetterYT_Settings.pauseBackground) initPauseBackground();

    // Phase 11 Features (Ghost Toggles)
    if (BetterYT_Settings.cinemaMode) initCinemaMode();
    if (BetterYT_Settings.autoPlay) initAutoPlayDisable();
    if (BetterYT_Settings.pipMode) initPipMode();
    if (BetterYT_Settings.strictAdBlock) initStrictAdBlock();
    if (BetterYT_Settings.nonstopAudio) initNonstopAudio();
    if (BetterYT_Settings.audioOnly) initAudioOnly();

    // Phase 12 Features (Final Polish)

    if (BetterYT_Settings.watchTimeTracker) initWatchTimeTracker();
    if (BetterYT_Settings.randomVideo) initRandomVideo();
    if (BetterYT_Settings.highlightMentions) initHighlightMentions();
    if (BetterYT_Settings.mouseVolume) initMouseVolume();

    // Phase 13 Features (Big Integrations)
    if (BetterYT_Settings.sponsorBlock) initSponsorBlock();
    if (BetterYT_Settings.channelBlocklist) initChannelBlocklist();
    if (BetterYT_Settings.redirectHome) initRedirectHome();
    if (BetterYT_Settings.hideRelatedTheater) initHideRelatedTheater();
    if (BetterYT_Settings.hideLogo) initHideLogo();
    if (BetterYT_Settings.hideSidebar) initHideSidebar();

    // Phase 14 Features (Visual Overhaul)
    if (BetterYT_Settings.customTheme) initCustomTheme();
    if (BetterYT_Settings.customPlayerSkin) initCustomPlayerSkin();
    if (BetterYT_Settings.hideChannelAvatars) initHideChannelAvatars();
    if (BetterYT_Settings.displayFullTitle) initDisplayFullTitle();
    if (BetterYT_Settings.channelWideLayout) initChannelWideLayout();

    // Phase 15 Features (Pro Tier Finale)
    if (BetterYT_Settings.clickbaitRemover) initClickbaitRemover();
    if (BetterYT_Settings.eqEnabled || BetterYT_Settings.bassEnhancer) initAudioEQ();
    if (BetterYT_Settings.customCSS) initCustomCSS();
    if (BetterYT_Settings.devMode) initDevMode();
}

try {
    chrome.storage.local.get(['BetterYT_Settings'], (res) => {
        if (res.BetterYT_Settings) {
            BetterYT_Settings = typeof res.BetterYT_Settings === 'string' ? JSON.parse(res.BetterYT_Settings) : res.BetterYT_Settings;
            initFeatures();
        }
    });
} catch (e) { /* Extension context may be invalid on first inject */ }

try {
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.BetterYT_Settings) {
        const newVal = changes.BetterYT_Settings.newValue;
        BetterYT_Settings = typeof newVal === 'string' ? JSON.parse(newVal) : newVal;
        
        if (BetterYT_Settings.autoHD) initAutoHD();
        else removeAutoHD();
        
        if (BetterYT_Settings.controlFix) initControlFix();
        else removeControlFix();
        
        if (BetterYT_Settings.hideComments) initHideComments();
        else removeHideComments();
        
        if (BetterYT_Settings.clickbaitRemover) initClickbaitRemover();
        else removeClickbaitRemover();
        
        if (BetterYT_Settings.randomVideo) initRandomVideo();
        else removeRandomVideo();
        
        if (BetterYT_Settings.twitchChat) initTwitchChat();
        else removeTwitchChat();
        
        if (BetterYT_Settings.nonstopAudio) initNonstop();
        else removeNonstop();
        
        if (BetterYT_Settings.sponsorBlock) initSponsorBlock();
        else removeSponsorBlock();

        if (BetterYT_Settings.hideShorts) initShortsBlocker();
        else removeShortsBlocker();
        
        if (BetterYT_Settings.fastForward) initFastForward();
        else removeFastForward();
        
        if (BetterYT_Settings.pipMode) initPiP();
        else removePiP();
        
        if (BetterYT_Settings.screenshot) initScreenshot();
        else removeScreenshot();
        
        if (BetterYT_Settings.compactGrid) initCompactGrid();
        else removeCompactGrid();
        
        if (BetterYT_Settings.showTags) initShowTags();
        else removeShowTags();
        
        if (BetterYT_Settings.colorizeDislike) initColorizeDislike();
        else removeColorizeDislike();
        
        if (BetterYT_Settings.returnDislike) initReturnDislike();
        else removeReturnDislike();
        
        if (BetterYT_Settings.forceDarkMode) initDarkMode();
        else removeDarkMode();
        
        if (BetterYT_Settings.watchTimeTracker) initWatchTimeTracker();
        else removeWatchTimeTracker();
        
        if (BetterYT_Settings.videoHighlights) initHighlights();
        else removeHighlights();
        
        if (BetterYT_Settings.cinemaMode) initCinemaMode();
        else removeCinemaMode();
        
        if (BetterYT_Settings.customTheme) initCustomTheme();
        else removeCustomTheme();
        
        if (BetterYT_Settings.volumeBoost) initVolumeBoost();
        else removeVolumeBoost();

        if (BetterYT_Settings.hideEndCards) initHideEndCards();
        else removeHideEndCards();

        if (BetterYT_Settings.hideAnnotations) initHideAnnotations();
        else removeHideAnnotations();

        if (BetterYT_Settings.playbackSpeed) initPlaybackSpeed();
        else removePlaybackSpeed();

        if (BetterYT_Settings.videoFilters) initVideoFilters();
        else removeVideoFilters();

        if (BetterYT_Settings.loopButton) initLoopButton();
        else removeLoopButton();

        if (BetterYT_Settings.scrollToTop) initScrollToTop();
        else removeScrollToTop();

        if (BetterYT_Settings.reversePlaylist) initReversePlaylist();
        else removeReversePlaylist();

        if (BetterYT_Settings.customShortcuts) initShortcuts();
        else removeShortcuts();

        if (BetterYT_Settings.pauseBackground) initPauseBackground();
        else removePauseBackground();

        if (BetterYT_Settings.cinemaMode) initCinemaMode();
        else removeCinemaMode();

        if (BetterYT_Settings.autoPlay) initAutoPlayDisable();
        else removeAutoPlayDisable();

        if (BetterYT_Settings.pipMode) initPipMode();
        else removePipMode();

        if (BetterYT_Settings.strictAdBlock) initStrictAdBlock();
        else removeStrictAdBlock();

        if (BetterYT_Settings.nonstopAudio) initNonstopAudio();
        else removeNonstopAudio();

        if (BetterYT_Settings.audioOnly) initAudioOnly();
        else removeAudioOnly();



        if (BetterYT_Settings.watchTimeTracker) initWatchTimeTracker();
        else removeWatchTimeTracker();

        if (BetterYT_Settings.randomVideo) initRandomVideo();
        else removeRandomVideo();

        if (BetterYT_Settings.highlightMentions) initHighlightMentions();
        else removeHighlightMentions();

        if (BetterYT_Settings.mouseVolume) initMouseVolume();
        else removeMouseVolume();

        if (BetterYT_Settings.sponsorBlock) initSponsorBlock();
        else removeSponsorBlock();

        if (BetterYT_Settings.channelBlocklist) initChannelBlocklist();
        else removeChannelBlocklist();

        if (BetterYT_Settings.redirectHome) initRedirectHome();
        else removeRedirectHome();

        if (BetterYT_Settings.hideRelatedTheater) initHideRelatedTheater();
        else removeHideRelatedTheater();

        if (BetterYT_Settings.hideLogo) initHideLogo();
        else removeHideLogo();

        if (BetterYT_Settings.hideSidebar) initHideSidebar();
        else removeHideSidebar();

        // Phase 14 Features (Visual Overhaul)
        // Check if accent changed or toggle flipped
        if (BetterYT_Settings.customTheme || changes.BetterYT_Accent) {
            removeCustomTheme();
            if (BetterYT_Settings.customTheme) initCustomTheme();
        } else { removeCustomTheme(); }

        if (BetterYT_Settings.customPlayerSkin) initCustomPlayerSkin();
        else removeCustomPlayerSkin();

        if (BetterYT_Settings.hideChannelAvatars) initHideChannelAvatars();
        else removeHideChannelAvatars();

        if (BetterYT_Settings.displayFullTitle) initDisplayFullTitle();
        else removeDisplayFullTitle();

        if (BetterYT_Settings.channelWideLayout) initChannelWideLayout();
        else removeChannelWideLayout();

        // Phase 15 Features (Pro Tier)
        if (BetterYT_Settings.clickbaitRemover) initClickbaitRemover();
        else removeClickbaitRemover();

        if (BetterYT_Settings.eqEnabled || BetterYT_Settings.bassEnhancer) {
            initAudioEQ();
            if (changes.BetterYT_EQBands && window.bytEQNodes) {
                _bytApplyEQBandsFromStorage();
            }
        } else {
            removeAudioEQ();
        }

        if (BetterYT_Settings.customCSS || changes.BetterYT_CustomCSS_Code) {
            removeCustomCSS();
            if (BetterYT_Settings.customCSS) initCustomCSS();
        } else { removeCustomCSS(); }

        if (BetterYT_Settings.devMode) initDevMode();
        else removeDevMode();
    }
});
} catch (e) { /* Extension may have been invalidated */ }

try {
chrome.runtime.onMessage.addListener((message) => {
    if (!message || message.type !== 'BETTERYT_LIVE_STATE') return;
    const payload = message.payload || {};
    if (payload.settings && typeof payload.settings === 'object') {
        BetterYT_Settings = Object.assign({}, BetterYT_Settings, payload.settings);
    }

    const video = document.querySelector('video') || window.bytBoostedVideo;
    if (!video) return;

    _bytRebuildAudioGraph(video);
    if (Array.isArray(payload.eqBands) && window.bytEQNodes) {
        payload.eqBands.forEach((g, i) => {
            if (window.bytEQNodes[i]) window.bytEQNodes[i].gain.value = BetterYT_Settings.eqEnabled ? Number(g) : 0;
        });
    } else {
        _bytApplyEQBandsFromStorage();
    }
});
} catch (e) { /* Extension may have been invalidated */ }

// --- Feature: Auto HD ---
// Uses YouTube's native player API and PREF cookies — no fragile UI clicks.
const BYT_QUALITY_MAP = {
    4320: 'highres',
    2160: 'hd2160',
    1440: 'hd1440',
    1080: 'hd1080',
    720: 'hd720',
    480: 'large',
    360: 'medium',
    240: 'small',
    144: 'tiny'
};
const BYT_RES_LEVELS = [4320, 2160, 1440, 1080, 720, 480, 360, 240, 144];

function _bytGetMoviePlayer() {
    return /** @type {any} */ (document.getElementById('movie_player'));
}

function _bytSetPrefCookie(qualityStr) {
    try {
        let pref = '';
        const match = document.cookie.match(/(^| )PREF=([^;]+)/);
        if (match) pref = match[2];
        const params = new URLSearchParams(pref);
        
        // Remove vq if setting auto, or set to string
        if (qualityStr === 'auto') {
            params.delete('vq');
        } else {
            params.set('vq', qualityStr);
            params.set('f6', '8');
        }
        
        const stringified = params.toString().replace(/\+/g, '%20');
        document.cookie = 'PREF=' + stringified + '; domain=.youtube.com; path=/; max-age=31536000';
    } catch(e) {}
}

function _bytApplyAutoHD() {
    if (!BetterYT_Settings.autoHD) return;
    const player = _bytGetMoviePlayer();
    if (!player) return;
    if (typeof player.getAvailableQualityData !== 'function' || typeof player.setPlaybackQualityRange !== 'function') {
        // Fallback: queue another attempt after player initializes
        setTimeout(_bytApplyAutoHD, 1000);
        return;
    }

    // 1. Gather settings
    let targetRes = BetterYT_Settings.autoHDResolution || 4320;
    const maxFps = BetterYT_Settings.autoHDFps || 60;
    const wantEnhanced = !!BetterYT_Settings.autoHDEnhanced;

    // 2. Cap by screen resolution
    const screenRes = Math.max(window.screen.height, window.screen.width);
    let logicalRes = 4320;
    for (let res of BYT_RES_LEVELS) {
        if (screenRes >= res * 0.9) {
            logicalRes = res;
            break;
        }
    }
    targetRes = Math.min(targetRes, logicalRes);

    // 3. Find available qualities that meet criteria
    let availableData = [];
    try {
        availableData = player.getAvailableQualityData() || [];
    } catch (e) {}

    if (availableData.length === 0) {
        try {
            const levels = player.getAvailableQualityLevels ? player.getAvailableQualityLevels() : [];
            availableData = levels.map(l => ({ quality: l, qualityLabel: l }));
        } catch(e) {}
    }

    let bestQualityStr = 'auto';

    for (let res of BYT_RES_LEVELS) {
        if (res > targetRes) continue;
        const qStr = BYT_QUALITY_MAP[res];

        let candidates = availableData.filter(d => d.quality && d.quality.startsWith(qStr));
        if (candidates.length === 0) continue;

        let validCandidates = candidates.filter(c => {
            if (!c.qualityLabel) return true;
            const fpsMatch = c.qualityLabel.match(/p(\d+)/i);
            if (fpsMatch && parseInt(fpsMatch[1]) > maxFps) return false;
            return true;
        });

        if (validCandidates.length === 0 && res < targetRes) {
            continue; // step down
        } else if (validCandidates.length === 0) {
            validCandidates = candidates;
        }

        let chosen = validCandidates[0];
        if (wantEnhanced) {
            const premium = validCandidates.find(c => c.quality.includes('premium'));
            if (premium) chosen = premium;
        } else {
            const standard = validCandidates.find(c => !c.quality.includes('premium'));
            if (standard) chosen = standard;
        }

        bestQualityStr = chosen.quality;
        break;
    }

    if (bestQualityStr === 'auto') {
        bestQualityStr = BYT_QUALITY_MAP[targetRes] || 'hd1080';
    }

    // 4. Engine Application
    try {
        player.setPlaybackQualityRange(bestQualityStr, bestQualityStr);
        if (typeof player.setPlaybackQuality === 'function') {
            player.setPlaybackQuality(bestQualityStr);
        }
    } catch(e) {}

    // 5. Persistent Sync
    _bytSetPrefCookie(bestQualityStr);
}

function initAutoHD() {
    if (window.betterYtAutoHDInitialized) return;
    window.betterYtAutoHDInitialized = true;

    // Apply on video ready
    document.addEventListener('canplay', (e) => {
        if (!BetterYT_Settings.autoHD) return;
        if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'video') {
            setTimeout(_bytApplyAutoHD, 300);
        }
    }, true);

    // Apply on SPA navigation
    document.addEventListener('yt-navigate-finish', () => {
        if (BetterYT_Settings.autoHD) setTimeout(_bytApplyAutoHD, 1200);
    });

    _bytApplyAutoHD();
}

function removeAutoHD() {
    window.betterYtAutoHDInitialized = false;
}

// --- Feature: Random Video ---
function initRandomVideo() {
    if (window.betterYtRandomVideoInitialized) return;
    window.betterYtRandomVideoInitialized = true;

    const injectButton = () => {
        if (!BetterYT_Settings.randomVideo) return;
        
        // Run only on channel pages
        if (window.location.pathname.startsWith('/@') || window.location.pathname.startsWith('/channel/') || window.location.pathname.startsWith('/c/')) {
            const actionButtons = document.querySelector('#inner-header-container #buttons');
            if (actionButtons && !document.getElementById('byt-random-video-btn')) {
                const btn = document.createElement('ytd-button-renderer');
                btn.id = 'byt-random-video-btn';
                btn.className = 'style-scope ytd-c4-tabbed-header-renderer';
                btn.style.marginRight = '8px';
                btn.innerHTML = `
                    <a class="yt-simple-endpoint style-scope ytd-button-renderer" tabindex="-1">
                        <tp-yt-paper-button id="button" class="style-scope ytd-button-renderer style-default size-default" role="button" tabindex="0" animated="" elevation="0" aria-disabled="false" aria-label="Play Random Video" style="background-color: var(--yt-spec-button-chip-background-hover); color: var(--yt-spec-text-primary); border-radius: 18px; padding: 0 16px; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 500;">
                            <yt-icon class="style-scope ytd-button-renderer" style="margin-right: 6px; width: 20px; height: 20px;"><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%; fill: currentColor;"><g class="style-scope yt-icon"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" class="style-scope yt-icon"></path></g></svg></yt-icon>
                            <yt-formatted-string id="text" class="style-scope ytd-button-renderer">Random Video</yt-formatted-string>
                        </tp-yt-paper-button>
                    </a>
                `;
                
                btn.onclick = (e) => {
                    e.preventDefault();
                    let channelId = '';
                    const meta = document.querySelector('meta[itemprop="channelId"]');
                    if (meta) {
                        channelId = meta.content;
                    } else if (window.location.pathname.startsWith('/channel/')) {
                        channelId = window.location.pathname.split('/')[2];
                    } else {
                        // Fallback: try to fetch from the /videos URL
                        channelId = window.location.pathname.split('/')[1];
                    }
                    
                    if (channelId) {
                        const btnText = btn.querySelector('yt-formatted-string');
                        const originalText = btnText.innerText;
                        btnText.innerText = 'Picking...';
                        
                        const targetUrl = channelId.startsWith('UC') ? '/channel/' + channelId + '/videos' : '/' + channelId + '/videos';
                        
                        fetch(targetUrl).then(res => res.text()).then(html => {
                            try {
                                // Find all video IDs in the heavily nested ytInitialData using a global regex
                                const videoIds = [...new Set(Array.from(html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)).map(m => m[1]))];
                                
                                if (videoIds.length > 0) {
                                    const randomId = videoIds[Math.floor(Math.random() * videoIds.length)];
                                    window.location.href = '/watch?v=' + randomId;
                                } else {
                                    btnText.innerText = 'No videos';
                                    setTimeout(() => btnText.innerText = originalText, 2000);
                                }
                            } catch(err) {
                                console.error('BetterYouTube Random Video Error:', err);
                                btnText.innerText = 'Error';
                                setTimeout(() => btnText.innerText = originalText, 2000);
                            }
                        }).catch(err => {
                            console.error('BetterYouTube Random Video Error:', err);
                            btnText.innerText = 'Failed';
                            setTimeout(() => btnText.innerText = originalText, 2000);
                        });
                    }
                };
                
                actionButtons.prepend(btn);
            }
        }
    };

    document.addEventListener('yt-navigate-finish', injectButton);
    setTimeout(injectButton, 1500);
}

function removeRandomVideo() {
    const btn = document.getElementById('byt-random-video-btn');
    if (btn) btn.remove();
}

// --- Feature: Hide Shorts & Redirect ---
function handleShortsNavigation(e) {
    if (!BetterYT_Settings.hideShorts) return;
    const url = e.detail ? e.detail.url : (e.target && e.target.baseURI ? e.target.baseURI : window.location.href);
    if (url && url.includes('/shorts/')) {
        const videoId = url.split('/shorts/')[1].split(/[?#]/)[0];
        // Convert Shorts route directly to standard watch player route.
        if (videoId) location.replace(`/watch?v=${videoId}`);
    }
}

function initShortsBlocker() {
    let style = document.getElementById("byt-hide-shorts-style");
    if (!style) {
        style = document.createElement("style");
        style.id = "byt-hide-shorts-style";
        style.textContent = `
            ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts]),
            ytd-reel-shelf-renderer, 
            ytd-mini-guide-entry-renderer[aria-label="Shorts"],
            ytd-guide-entry-renderer:has([title="Shorts"]) {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    if (!window.bytShortsNavListenerAdded) {
        document.addEventListener("yt-navigate-start", handleShortsNavigation);
        window.bytShortsNavListenerAdded = true;
        
        if (window.location.href.includes('/shorts/')) {
            handleShortsNavigation({ detail: { url: window.location.href } });
        }
    }
}

function removeShortsBlocker() {
    const style = document.getElementById("byt-hide-shorts-style");
    if (style) style.remove();
    
    if (window.bytShortsNavListenerAdded) {
        document.removeEventListener("yt-navigate-start", handleShortsNavigation);
        window.bytShortsNavListenerAdded = false;
    }
}

// --- Feature: Cinema Mode ---
function initCinemaMode() {
    if (window.betterYtCinemaModeInitialized) return;
    window.betterYtCinemaModeInitialized = true;
    const style = document.createElement('style');
    style.id = 'byt-cinema-mode';
    style.textContent = `
        ytd-watch-flexy[theater] #player-theater-container {
            width: 100% !important;
            max-width: 100% !important;
            height: 85vh !important;
            max-height: 85vh !important;
        }
        ytd-watch-flexy[theater] #full-bleed-container.ytd-watch-flexy {
            height: 85vh !important;
        }
        html[dark] body, body.dark { background: #000 !important; }
        html[dark] #masthead-container.ytd-app, body.dark #masthead-container.ytd-app { background: rgba(0,0,0,0.85) !important; }
    `;
    document.head.appendChild(style);
}

function removeCinemaMode() {
    const el = document.getElementById('byt-cinema-mode');
    if (el) el.remove();
    window.betterYtCinemaModeInitialized = false;
}

// --- Feature: Custom YouTube Progress Bar Theme ---
function initCustomTheme() {
    if (window.betterYtThemeInitialized) return;
    window.betterYtThemeInitialized = true;
    
    chrome.storage.local.get(['BetterYT_Accent'], (res) => {
        const accent = res.BetterYT_Accent || 'red';
        const colors = {
            red: '#ff0000', blue: '#3ea6ff', green: '#1f8c35', 
            purple: '#b426ff', pink: '#ff2692', orange: '#ff8800',
            emerald: '#10b981', amber: '#f59e0b', cyan: '#06b6d4', gold: '#eab308'
        };
        const color = colors[accent] || '#ff0000';
        
        const style = document.createElement('style');
        style.id = 'byt-custom-theme';
        style.textContent = `
            .ytp-swatch-background-color { background-color: ${color} !important; }
            .ytp-play-progress { background: ${color} !important; }
            .ytp-scrubber-button { background: ${color} !important; border-color: ${color} !important; box-shadow: 0 0 8px ${color}88 !important; }
            
            /* YouTube Logo accent color */
            ytd-logo #logo-icon svg path[fill="#FF0000"],
            ytd-logo #logo-icon svg path[fill="red"],
            #logo svg path[fill="#FF0000"],
            #logo svg path[fill="red"] {
                fill: ${color} !important;
            }
        `;
        document.head.appendChild(style);
    });
}

function removeCustomTheme() {
    const el = document.getElementById('byt-custom-theme');
    if (el) el.remove();
    window.betterYtThemeInitialized = false;
}

// --- Feature: Volume Booster ---
// Unified audio engine: source -> gain -> bass -> eq -> destination.
// Keeps one AudioContext/media source per active video and safely rewires nodes.
function _bytGetGainValue() {
    if (!BetterYT_Settings.volumeBoost) return 1;
    return Math.max(1, Math.min(10, (BetterYT_Settings.volumeBoostLevel || 300) / 100));
}

function _bytGetBassValue() {
    return Math.max(0, Math.min(24, Number(BetterYT_Settings.bassBoostLevel || 0)));
}

function _bytEnsureAudioContext() {
    if (!window.bytAudioCtx) {
        try {
            window.bytAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.error('BetterYT AudioContext Error', e);
            return null;
        }
    }
    return window.bytAudioCtx;
}

function _bytEnsureMediaSource(videoElement) {
    if (!videoElement) return false;
    if (!_bytEnsureAudioContext()) return false;
    if (window.bytBoostedVideo === videoElement && window.bytMediaSource) return true;

    if (window.bytMediaSource) {
        try { window.bytMediaSource.disconnect(); } catch (e) {}
        window.bytMediaSource = null;
    }
    window.bytBoostedVideo = videoElement;

    try {
        window.bytMediaSource = window.bytAudioCtx.createMediaElementSource(videoElement);
        return true;
    } catch (e) {
        // Happens if video was already wrapped by a stale source; keep previous graph.
        console.warn('[BetterYT] Audio source reuse warning:', e?.message || e);
        return !!window.bytMediaSource;
    }
}

function _bytEnsureAudioNodes() {
    const ctx = _bytEnsureAudioContext();
    if (!ctx) return false;

    if (!window.bytGainNode) window.bytGainNode = ctx.createGain();
    window.bytGainNode.gain.value = _bytGetGainValue();

    if (!window.bytBassNode) {
        window.bytBassNode = ctx.createBiquadFilter();
        window.bytBassNode.type = 'lowshelf';
        window.bytBassNode.frequency.value = 180;
        window.bytBassNode.Q.value = 0.9;
    }
    window.bytBassNode.gain.value = BetterYT_Settings.bassEnhancer ? _bytGetBassValue() : 0;

    if (!window.bytEQNodes) {
        const freqs = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
        window.bytEQNodes = freqs.map((freq, i) => {
            const filter = ctx.createBiquadFilter();
            filter.type = (i === 0) ? 'lowshelf' : (i === freqs.length - 1) ? 'highshelf' : 'peaking';
            filter.frequency.value = freq;
            filter.Q.value = 1.0;
            filter.gain.value = 0;
            return filter;
        });
    }
    return true;
}

function _bytApplyEQBandsFromStorage() {
    if (!window.bytEQNodes) return;
    chrome.storage.local.get(['BetterYT_EQBands'], (res) => {
        if (!_bytIsContextValid()) return;
        if (!window.bytEQNodes) return;
        const gains = res.BetterYT_EQBands || [6.0, 4.5, 2.0, -1.0, -2.0, -1.0, 1.5, 4.0, 5.0, 6.0];
        gains.forEach((g, i) => {
            if (window.bytEQNodes[i]) window.bytEQNodes[i].gain.value = BetterYT_Settings.eqEnabled ? Number(g) : 0;
        });
    });
}

function _bytRebuildAudioGraph(videoElement) {
    if (!videoElement) return;
    if (!_bytEnsureMediaSource(videoElement)) return;
    if (!_bytEnsureAudioNodes()) return;

    const nodes = [];
    // Always keep gain node in the chain, so volume changes are instant.
    nodes.push(window.bytGainNode);
    // Dedicated bass enhancement node (active via gain level).
    nodes.push(window.bytBassNode);
    // Optional 10-band EQ.
    if (BetterYT_Settings.eqEnabled) {
        nodes.push(...window.bytEQNodes);
    }

    try { window.bytMediaSource.disconnect(); } catch (e) {}
    try { window.bytGainNode.disconnect(); } catch (e) {}
    try { window.bytBassNode.disconnect(); } catch (e) {}
    if (window.bytEQNodes) window.bytEQNodes.forEach(n => { try { n.disconnect(); } catch (e) {} });

    let prev = window.bytMediaSource;
    nodes.forEach(node => {
        prev.connect(node);
        prev = node;
    });
    prev.connect(window.bytAudioCtx.destination);
}

function _bytEnsureAudioStorageListener() {
    if (window.bytAudioStorageListenerBound) return;
    window.bytAudioStorageListenerBound = true;
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace !== 'local') return;
        if (!changes.BetterYT_Settings && !changes.BetterYT_EQBands) return;

        if (changes.BetterYT_Settings) {
            const next = typeof changes.BetterYT_Settings.newValue === 'string'
                ? JSON.parse(changes.BetterYT_Settings.newValue)
                : (changes.BetterYT_Settings.newValue || {});
            BetterYT_Settings = Object.assign({}, BetterYT_Settings, next);
        }

        const video = document.querySelector('video') || window.bytBoostedVideo;
        if (!video) return;
        _bytRebuildAudioGraph(video);
        _bytApplyEQBandsFromStorage();
    });
}

function initVolumeBoost() {
    if (window.betterYtVolumeInitialized) return;
    window.betterYtVolumeInitialized = true;

    const tryBoost = () => {
        const video = document.querySelector('video');
        if (!video) return;
        _bytRebuildAudioGraph(video);
        _bytApplyEQBandsFromStorage();
    };

    document.addEventListener('canplay', (e) => {
        if (BetterYT_Settings.volumeBoost && e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'video') {
            tryBoost();
        }
    }, true);

    _bytEnsureAudioStorageListener();
    tryBoost();
}

function removeVolumeBoost() {
    if (window.bytGainNode) window.bytGainNode.gain.value = 1;
    const video = document.querySelector('video') || window.bytBoostedVideo;
    if (video) _bytRebuildAudioGraph(video);
    window.betterYtVolumeInitialized = false;
}

// --- Feature: YouTube Control Fix ---
// Uses an intelligent ES6 binder (ported from use/4) that cleanly
// handles YouTube SPA navigation and accurately excludes all inputs.
class VideoEventBinder {
    constructor() {
        this.playerElement = null;
        this.forwardElement = null;
        this.binded = false;
        this.forwardedKeys = ["Space", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
        this.ignoredElements = ["INPUT", "TEXTAREA", "SELECT"];

        this.keyDownListener = (e) => {
            if (!BetterYT_Settings.controlFix) return;
            if (!e.isTrusted || e.altKey || e.metaKey || e.ctrlKey) return;
            if (!this.forwardedKeys.includes(e.code)) return;
            
            // Comprehensive input filtering including contenteditable
            if (e.target && (e.target.isContentEditable || this.ignoredElements.includes(e.target.nodeName))) return;
            if (!this.forwardElement) return;

            const evt = new KeyboardEvent(e.type, e);
            this.forwardElement.dispatchEvent(evt);
            e.preventDefault();
            e.stopImmediatePropagation();
        };
    }

    bindElements() {
        this.playerElement = document.querySelector("#content #player-container, ytd-app #player-container");
        this.forwardElement = document.querySelector("#movie_player");
        this.binded = !!(this.playerElement && this.forwardElement);
        return this.binded;
    }

    bindEvents() {
        if (this.playerElement) {
            this.playerElement.addEventListener("keydown", this.keyDownListener, true);
        }
    }

    bind() {
        if (this.bindElements()) this.bindEvents();
        return this.binded;
    }

    unbind() {
        if (!this.binded) return;
        if (this.playerElement) {
            this.playerElement.removeEventListener("keydown", this.keyDownListener, true);
        }
        this.playerElement = null;
        this.forwardElement = null;
        this.binded = false;
    }
}

let bytControlFixInstance = null;
let bytControlFixNavListener = null;

function initControlFix() {
    if (window.betterYtControlFixInitialized) return;
    window.betterYtControlFixInitialized = true;

    if (!bytControlFixInstance) {
        bytControlFixInstance = new VideoEventBinder();
    }
    
    bytControlFixInstance.bind();

    // Use SPA events instead of a heavy MutationObserver
    if (!bytControlFixNavListener) {
        bytControlFixNavListener = () => {
            if (!BetterYT_Settings.controlFix) return;
            if (!bytControlFixInstance.binded || !document.body.contains(bytControlFixInstance.playerElement)) {
                bytControlFixInstance.unbind();
                // Attempt to rebind when navigation finishes
                setTimeout(() => bytControlFixInstance.bind(), 1200);
            }
        };
        document.addEventListener('yt-navigate-finish', bytControlFixNavListener);
    }
}

function removeControlFix() {
    if (bytControlFixInstance) {
        bytControlFixInstance.unbind();
    }
    if (bytControlFixNavListener) {
        document.removeEventListener('yt-navigate-finish', bytControlFixNavListener);
        bytControlFixNavListener = null;
    }
    window.betterYtControlFixInitialized = false;
}

// --- Feature: Hide Comments ---
function initHideComments() {
    let style = document.getElementById("byt-hide-comments-style");
    if (!style) {
        style = document.createElement("style");
        style.id = "byt-hide-comments-style";
        style.textContent = `
            #comments,
            ytd-comments,
            ytd-live-chat-frame,
            #comment-teaser,
            ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-comments-section"] {
                opacity: 0 !important;
                max-height: 0 !important;
                overflow: hidden !important;
                pointer-events: none !important;
                transform: translateY(-6px) !important;
                transition: opacity .2s ease, transform .2s ease, max-height .2s ease !important;
            }
        `;
        document.head.appendChild(style);
    }
}
function removeHideComments() {
    const style = document.getElementById("byt-hide-comments-style");
    if (style) style.remove();
}

// --- Feature: Clickbait Remover ---
// Ported from use/16: 3 title transformation modes + improved thumbnail regex.
const BYT_CLICKBAIT_TITLE_SELECTORS = [
    '#video-title',
    '.ytp-videowall-still-info-title',
    '.large-media-item-metadata > a > h3 > span',
    '.media-item-metadata > a > h3 > span',
    '.compact-media-item-headline > span'
].join(',\n            ');

const BYT_CLICKBAIT_MODES = {
    // sentence: lowercase + capitalize only the very first letter
    sentence: `
        ${BYT_CLICKBAIT_TITLE_SELECTORS.replace(/,\n            /g, ',').split(',').map(s => s.trim()).join(',\n            ')} {
            text-transform: lowercase; display: block !important;
        }
        #video-title::first-letter,
        .ytp-videowall-still-info-title::first-letter,
        .large-media-item-metadata > a > h3 > span::first-letter,
        .media-item-metadata > a > h3 > span::first-letter,
        .compact-media-item-headline > span::first-letter {
            text-transform: uppercase;
        }`,
    // lowercase: transform everything to lowercase, no exceptions
    lowercase: `
        #video-title,
        .ytp-videowall-still-info-title,
        .large-media-item-metadata > a > h3 > span,
        .media-item-metadata > a > h3 > span,
        .compact-media-item-headline > span {
            text-transform: lowercase;
        }`,
    // titlecase: lowercase + capitalize first word of each line
    titlecase: `
        #video-title,
        .ytp-videowall-still-info-title,
        .large-media-item-metadata > a > h3 > span,
        .media-item-metadata > a > h3 > span,
        .compact-media-item-headline > span {
            text-transform: lowercase; display: block !important;
        }
        #video-title::first-line,
        .ytp-videowall-still-info-title::first-line,
        .large-media-item-metadata > a > h3 > span::first-line,
        .media-item-metadata > a > h3 > span::first-line,
        .compact-media-item-headline > span::first-line {
            text-transform: capitalize;
        }`
};

// Matches: vi or vi_webp CDN paths, hq1/hq2/hq3/hqdefault/mqdefault/hq720 variants
// --- Feature: Nonstop & Audio Only ---
// nonstop.js handles: document.hidden override, visibilitychange suppression, _lact keepalive.
// audio_only.js handles: XHR+fetch interception to drop video chunks + CSS thumbnail background.
function initNonstop() {
    if (window.betterYtNonstopInitialized) return;
    window.betterYtNonstopInitialized = true;

    // Always inject nonstop.js for AFK prevention
    if (!document.getElementById('byt-nonstop-script')) {
        const s = document.createElement('script');
        s.id = 'byt-nonstop-script';
        try {
            if (!_bytIsContextValid()) return;
            s.src = chrome.runtime.getURL('assets/nonstop.js');
        } catch (e) { return; }
        (document.head || document.documentElement).appendChild(s);
    }

    // Keep the nonstop dataset flag in sync (nonstop.js reads dataset.bytNonstop
    // — but we no longer use it for audio-only, that's handled by audio_only.js)
    const syncNonstopFlag = () => {
        document.documentElement.dataset.bytNonstop = BetterYT_Settings.nonstopAudio ? 'true' : 'false';
    };
    syncNonstopFlag();

    // Inject audio_only.js separately (true video stream interception)
    const syncAudioFlag = () => {
        const shouldBlock = !!(BetterYT_Settings.nonstopAudio && BetterYT_Settings.audioOnly);
        if (location.hostname === 'music.youtube.com') {
            document.documentElement.dataset.bytAudioOnly = 'false';
            return;
        }
        document.documentElement.dataset.bytAudioOnly = shouldBlock ? 'true' : 'false';
        if (shouldBlock && !document.getElementById('byt-audio-only-script')) {
            const s = document.createElement('script');
            s.id = 'byt-audio-only-script';
            try {
                if (!_bytIsContextValid()) return;
                s.src = chrome.runtime.getURL('assets/audio_only.js');
            } catch (e) { return; }
            (document.head || document.documentElement).appendChild(s);
        }
    };
    syncAudioFlag();

    // Re-sync both flags on navigation
    if (!window.bytNonstopNavBound) {
        window.bytNonstopNavBound = true;
        document.addEventListener('yt-navigate-finish', () => {
            syncNonstopFlag();
            syncAudioFlag();
        });
    }

    // Dialog click fallback
    if (!window.bytNonstopDialogInterval) {
        window.bytNonstopDialogInterval = setInterval(() => {
            if (!BetterYT_Settings.nonstopAudio) return;
            const dialog = document.querySelector('yt-confirm-dialog-renderer');
            if (dialog) {
                const btn = dialog.querySelector('yt-button-renderer[dialog-action="confirm"]');
                if (btn) btn.click();
            }
        }, 3000);
    }
}

function removeNonstop() {
    document.documentElement.dataset.bytNonstop = 'false';
    document.documentElement.dataset.bytAudioOnly = 'false';
    if (window.bytNonstopDialogInterval) {
        clearInterval(window.bytNonstopDialogInterval);
        window.bytNonstopDialogInterval = null;
    }
    window.betterYtNonstopInitialized = false;
}

// --- Feature: Twitch Chat ---
function _bytTwitchNormalizeChannel(raw) {
    return (raw || '').trim().toLowerCase().replace(/^@/, '').replace(/[^a-z0-9_]/g, '');
}

function _bytGetCurrentYTChannelId() {
    const meta = document.querySelector('meta[itemprop="channelId"]');
    if (meta && meta.content) return meta.content;
    const byLink = document.querySelector('ytd-video-owner-renderer a[href*="/channel/"]');
    if (byLink && byLink.href) {
        const m = byLink.href.match(/\/channel\/([^/?]+)/);
        if (m) return m[1];
    }
    return 'unknown_channel';
}

function _bytIsLiveStreamPage() {
    if (window.location.pathname !== '/watch') return false;
    if (document.querySelector('ytd-watch-flexy[is-live]')) return true;
    if (document.querySelector('.ytp-live-badge, .badge-style-type-live-now-alternate')) return true;
    const txt = document.querySelector('#info #title')?.textContent || '';
    if (/\bLIVE\b/i.test(txt)) return true;
    return false;
}

function _bytLoadTwitchPrefs(callback) {
    chrome.storage.local.get(['BetterYT_TwitchPrefs'], (res) => {
        const prefs = res.BetterYT_TwitchPrefs || { map: {}, recent: [], autoOpen: false };
        callback(prefs);
    });
}

function _bytSaveTwitchPrefs(prefs) {
    chrome.storage.local.set({ BetterYT_TwitchPrefs: prefs });
}

function _bytGetChatContainer() {
    return document.querySelector('#chat-container') || document.querySelector('ytd-live-chat-frame');
}

function _bytGetHostParentParam() {
    const host = window.location.hostname || 'www.youtube.com';
    return host.replace(/^m\./, 'www.');
}

function _bytSetTwitchEmbedState(active) {
    const chatContainer = _bytGetChatContainer();
    if (!chatContainer) return;
    chatContainer.querySelectorAll(':scope > *:not(#byt-twitch-panel):not(#byt-twitch-embed-wrap)')
        .forEach(el => { el.style.display = active ? 'none' : ''; });
}

function _bytRenderTwitchEmbed(channel) {
    const chatContainer = _bytGetChatContainer();
    if (!chatContainer) return;
    _bytSetTwitchEmbedState(true);
    let wrap = document.getElementById('byt-twitch-embed-wrap');
    if (!wrap) {
        wrap = document.createElement('div');
        wrap.id = 'byt-twitch-embed-wrap';
        wrap.style.cssText = 'height:calc(100% - 58px);min-height:430px;background:#0b0b0f;';
        chatContainer.appendChild(wrap);
    }
    const host = _bytGetHostParentParam();
    wrap.innerHTML = `<iframe id="byt-twitch-chat-iframe" src="https://www.twitch.tv/embed/${channel}/chat?parent=${encodeURIComponent(host)}" style="width:100%;height:100%;border:0;" allowfullscreen></iframe>`;
}

function _bytBuildTwitchPanel(chatContainer, prefs) {
    let panel = document.getElementById('byt-twitch-panel');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'byt-twitch-panel';
        panel.style.cssText = 'padding:10px;display:flex;flex-direction:column;gap:8px;background:var(--yt-spec-brand-background-solid,#212121);border-bottom:1px solid var(--yt-spec-10-percent-layer,#3f3f3f);';
        chatContainer.prepend(panel);
    }

    const ytChannelId = _bytGetCurrentYTChannelId();
    const mapped = prefs.map?.[ytChannelId] || '';
    const recent = Array.isArray(prefs.recent) ? prefs.recent.slice(0, 8) : [];
    const live = _bytIsLiveStreamPage();

    panel.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:nowrap;min-width:0;">
            <span style="font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;color:${live ? '#22c55e' : '#f59e0b'};">${live ? 'LIVE' : 'NOT LIVE'}</span>
            <input id="byt-twitch-channel-input" type="text" placeholder="twitch channel" value="${mapped}" style="flex:1;min-width:120px;height:32px;border-radius:8px;border:1px solid #444;background:#111;color:#fff;padding:0 10px;font-size:12px;" />
            <select id="byt-twitch-recent" style="height:32px;border-radius:8px;border:1px solid #444;background:#111;color:#fff;min-width:98px;max-width:132px;font-size:12px;padding:0 6px;">
                <option value="">Recent</option>
                ${recent.map(ch => `<option value="${ch}">${ch}</option>`).join('')}
            </select>
            <button id="byt-twitch-connect" style="height:32px;padding:0 12px;border:none;border-radius:8px;background:#9146FF;color:#fff;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;">Connect</button>
        </div>
        <div style="display:flex;align-items:center;gap:8px;justify-content:space-between;">
            <button id="byt-twitch-native" style="height:30px;padding:0 12px;border:none;border-radius:8px;background:#3f3f46;color:#fff;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;">Native</button>
            <label style="display:flex;align-items:center;gap:6px;font-size:12px;color:#ddd;white-space:nowrap;">
                <input id="byt-twitch-auto" type="checkbox" ${prefs.autoOpen ? 'checked' : ''}/> Auto
            </label>
        </div>
    `;

    const input = panel.querySelector('#byt-twitch-channel-input');
    const recentSel = panel.querySelector('#byt-twitch-recent');
    const btnConnect = panel.querySelector('#byt-twitch-connect');
    const btnNative = panel.querySelector('#byt-twitch-native');
    const autoChk = panel.querySelector('#byt-twitch-auto');

    recentSel.addEventListener('change', () => {
        if (recentSel.value) input.value = recentSel.value;
    });
    btnConnect.addEventListener('click', () => {
        const channel = _bytTwitchNormalizeChannel(input.value);
        if (!channel) return;
        prefs.map = prefs.map || {};
        prefs.map[ytChannelId] = channel;
        prefs.recent = [channel, ...(prefs.recent || []).filter(c => c !== channel)].slice(0, 12);
        _bytSaveTwitchPrefs(prefs);
        _bytRenderTwitchEmbed(channel);
    });
    btnNative.addEventListener('click', () => {
        const wrap = document.getElementById('byt-twitch-embed-wrap');
        if (wrap) wrap.remove();
        _bytSetTwitchEmbedState(false);
    });
    autoChk.addEventListener('change', () => {
        prefs.autoOpen = !!autoChk.checked;
        _bytSaveTwitchPrefs(prefs);
    });

    if (prefs.autoOpen && live && mapped && !document.getElementById('byt-twitch-chat-iframe')) {
        _bytRenderTwitchEmbed(mapped);
    }
}

function initTwitchChat() {
    if (window.bytTwitchChatInterval) return;
    window.bytTwitchChatInterval = setInterval(() => {
        if (!BetterYT_Settings.twitchChat) return;
        const chatContainer = _bytGetChatContainer();
        if (!chatContainer) return;
        _bytLoadTwitchPrefs((prefs) => {
            if (!_bytIsContextValid()) return;
            _bytBuildTwitchPanel(chatContainer, prefs);
        });
    }, 2500);
}
function removeTwitchChat() {
    if (window.bytTwitchChatInterval) {
        clearInterval(window.bytTwitchChatInterval);
        window.bytTwitchChatInterval = null;
    }
    const panel = document.getElementById('byt-twitch-panel');
    if (panel) panel.remove();
    const wrap = document.getElementById('byt-twitch-embed-wrap');
    if (wrap) wrap.remove();
    _bytSetTwitchEmbedState(false);
}

// --- Feature: Ad Blocker ---
function initAdBlocker() {
    setInterval(() => {
        if (!BetterYT_Settings.adBlock) return;
        
        // 1. Click skip ad buttons
        const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button');
        if (skipBtn) skipBtn.click();
        
        // 2. Fast-forward unskippable video ads
        const adShowing = document.querySelector('.ad-showing, .ad-interrupting');
        if (adShowing) {
            const video = document.querySelector('video');
            if (video && video.duration) {
                video.currentTime = video.duration;
            }
        }
        
        // 3. Remove ad overlays and generic ad slots
        const overlays = document.querySelectorAll('.ytp-ad-text-overlay, #player-ads, ytd-ad-slot-renderer, ytd-promoted-sparkles-web-renderer');
        overlays.forEach(el => el.remove());
        
        // Bonus: Hide paid promotion badge if sponsor block enabled (local only, no API)
        if (BetterYT_Settings.sponsorBlock) {
            const promo = document.querySelector('.ytp-paid-content-overlay');
            if (promo) promo.style.display = 'none';
        }
    }, 500);
}

// --- Feature: SponsorBlock (sponsor.ajay.app API) ---
// Uses the official public API — no auth or API key required.
// Categories: sponsor, selfpromo, interaction, intro, outro, preview, filler, music_offtopic
const BYT_SB = {
    API: 'https://sponsor.ajay.app/api/skipSegments',
    // Map category key → human-readable label
    LABELS: {
        sponsor: 'Sponsor',
        selfpromo: 'Self Promo',
        interaction: 'Interaction',
        intro: 'Intro',
        outro: 'Outro',
        preview: 'Preview',
        filler: 'Filler',
        music_offtopic: 'Offtopic Music',
        poi_highlight: 'Highlight'
    },
    // Categories we want to skip by default (excludes highlight which is a timecode, not a skip)
    DEFAULT_CATS: ['sponsor','selfpromo','interaction','intro','outro','preview','filler','music_offtopic'],

    cache: {},          // { videoId: segment[] | null }
    currentVideoId: null,
    video: null,
    _listenerBound: false,
    _interval: null,
    _toastTimeout: null,
    _lastSkipped: null, // { segmentUUID, skippedAt }
    accentColor: '#3ea6ff',
    _accentBound: false,

    refreshAccent() {
        chrome.storage.local.get(['BetterYT_Accent'], (res) => {
            const accent = res.BetterYT_Accent || 'red';
            const colors = {
                red: '#ff0000', blue: '#3ea6ff', green: '#1f8c35',
                purple: '#b426ff', pink: '#ff2692', orange: '#ff8800',
                emerald: '#10b981', amber: '#f59e0b', cyan: '#06b6d4', gold: '#eab308', mono: '#a1a1aa', oled: '#71717a'
            };
            this.accentColor = colors[accent] || '#3ea6ff';
        });
    },

    async fetchSegments(videoId) {
        if (this.cache[videoId] !== undefined) return this.cache[videoId];
        try {
            const cats = encodeURIComponent(JSON.stringify(this.DEFAULT_CATS));
            const url = `${this.API}?videoID=${videoId}&categories=${cats}&actionTypes=%5B%22skip%22%5D`;
            const res = await fetch(url);
            if (res.status === 404) { this.cache[videoId] = []; return []; }
            if (!res.ok) { this.cache[videoId] = null; return null; }
            const data = await res.json();
            this.cache[videoId] = Array.isArray(data) ? data : [];
            return this.cache[videoId];
        } catch (e) {
            this.cache[videoId] = null;
            return null;
        }
    },

    showToast(segment, onSkip) {
        this.removeToast();
        const label = this.LABELS[segment.category] || segment.category;
        const dur = Math.round(segment.segment[1] - segment.segment[0]);
        const toast = document.createElement('div');
        toast.id = 'byt-sb-toast';
        toast.style.cssText = `
            position:absolute; right:12px; bottom:64px;
            z-index:99999; display:flex; align-items:center; gap:8px;
            background:rgba(18,18,18,0.95);
            border:1px solid rgba(255,255,255,0.18); border-radius:8px;
            padding:6px 8px; font-size:12px; font-weight:600; color:#fff;
            font-family:Roboto,Arial,sans-serif; box-shadow:0 2px 8px rgba(0,0,0,0.35);
            pointer-events:all; user-select:none;
        `;

        // YouTube-like skip button with countdown.
        let countdown = 3;
        const skipBtn = document.createElement('button');
        skipBtn.style.cssText = `
            background:${this.accentColor};
            border:none;color:#fff;cursor:pointer;border-radius:18px;
            padding:6px 12px;font-size:12px;font-weight:700;line-height:1;
            min-height:32px;
        `;
        skipBtn.textContent = `Skip (${countdown}s)`;
        skipBtn.onclick = () => { onSkip(); this.removeToast(); };

        const label_ = document.createElement('span');
        label_.textContent = `${label} ${dur}s`;
        label_.style.cssText = 'opacity:.92;white-space:nowrap;';

        toast.appendChild(label_);
        toast.appendChild(skipBtn);

        // Inject into player container for positioning
        const player = document.querySelector('#ytd-player, .html5-video-player');
        if (player) { player.style.position = 'relative'; player.appendChild(toast); }

        const tick = setInterval(() => {
            countdown--;
            if (countdown <= 0) {
                clearInterval(tick);
                if (document.getElementById('byt-sb-toast')) { onSkip(); this.removeToast(); }
            } else {
                skipBtn.textContent = `Skip (${countdown}s)`;
            }
        }, 1000);
        this._toastTimeout = () => clearInterval(tick);
    },

    removeToast() {
        const el = document.getElementById('byt-sb-toast');
        if (el) el.remove();
        if (this._toastTimeout) { this._toastTimeout(); this._toastTimeout = null; }
    },

    async onTimeUpdate() {
        if (!BetterYT_Settings.sponsorBlock) return;
        const video = this.video;
        if (!video) return;
        const t = video.currentTime;

        const videoId = new URLSearchParams(location.search).get('v');
        if (!videoId) return;

        // Load segments for this video if not already cached
        if (videoId !== this.currentVideoId) {
            this.currentVideoId = videoId;
            this._lastSkipped = null;
            this.removeToast();
            await this.fetchSegments(videoId);
        }

        const segments = this.cache[videoId];
        if (!Array.isArray(segments) || segments.length === 0) return;

        for (const seg of segments) {
            const [start, end] = seg.segment;
            if (t >= start && t < end - 0.2) {
                // Don't re-skip the same segment within 3s
                if (this._lastSkipped?.segmentUUID === seg.UUID && (Date.now() - this._lastSkipped.at) < 3000) continue;

                if (BetterYT_Settings.autoSkipSponsors) {
                    video.currentTime = end;
                    this._lastSkipped = { segmentUUID: seg.UUID, at: Date.now() };
                } else {
                    // Show prompt toast only if not already showing for this segment
                    if (document.getElementById('byt-sb-toast')) return;
                    this.showToast(seg, () => {
                        video.currentTime = end;
                        this._lastSkipped = { segmentUUID: seg.UUID, at: Date.now() };
                    });
                }
                break;
            }
        }
    },

    bindVideo() {
        const video = document.querySelector('video');
        if (!video || video === this.video) return;
        if (this.video) this.video.removeEventListener('timeupdate', this._handler);
        this.video = video;
        this._handler = () => this.onTimeUpdate();
        video.addEventListener('timeupdate', this._handler);
    },

    start() {
        if (this._interval) return;
        this.refreshAccent();
        if (!this._accentBound) {
            this._accentBound = true;
            chrome.storage.onChanged.addListener((changes, area) => {
                if (area === 'local' && changes.BetterYT_Accent) this.refreshAccent();
            });
        }
        this.bindVideo();
        this._interval = setInterval(() => {
            if (!BetterYT_Settings.sponsorBlock) return;
            this.bindVideo();
        }, 2000);
        // Re-bind on navigation
        if (!this._listenerBound) {
            this._listenerBound = true;
            document.addEventListener('yt-navigate-finish', () => {
                this.currentVideoId = null;
                this._lastSkipped = null;
                this.removeToast();
                if (this.video) {
                    this.video.removeEventListener('timeupdate', this._handler);
                    this.video = null;
                }
                setTimeout(() => this.bindVideo(), 800);
            });
        }
    },

    stop() {
        if (this._interval) { clearInterval(this._interval); this._interval = null; }
        if (this.video && this._handler) this.video.removeEventListener('timeupdate', this._handler);
        this.video = null;
        this.removeToast();
    }
};

function initSponsorBlock() { BYT_SB.start(); }
function removeSponsorBlock() { BYT_SB.stop(); }


// Ported from use/8: uses MutationObserver with 3 distinct filter functions.
// Reactively removes Shorts elements when YouTube injects them into the DOM.
const BYT_ShortsFilter = {
    observer: null,

    reelShelfFilter() {
        document.querySelectorAll('ytd-reel-shelf-renderer, ytm-reel-shelf-renderer').forEach(el => el.remove());
    },

    richShelfFilter() {
        const selectors = [
            'ytd-rich-shelf-renderer:has(h2 > yt-icon:not([hidden]))',
            'grid-shelf-view-model:has(ytm-shorts-lockup-view-model)'
        ];
        selectors.forEach(sel => document.querySelectorAll(sel).forEach(el => el.remove()));
    },

    videoLinkFilter() {
        const tags = ['YTD-RICH-ITEM-RENDERER', 'YTD-VIDEO-RENDERER', 'YTD-GRID-VIDEO-RENDERER', 'YTM-VIDEO-WITH-CONTEXT-RENDERER'];
        document.querySelectorAll(
            'ytd-rich-item-renderer ytd-thumbnail a, ytd-video-renderer ytd-thumbnail a, ytd-grid-video-renderer ytd-thumbnail a, ytm-video-with-context-renderer a.media-item-thumbnail-container'
        ).forEach(a => {
            if (a.href && a.href.includes('/shorts/')) {
                let node = a.parentNode;
                while (node) {
                    if (tags.includes(node.nodeName)) { node.remove(); break; }
                    node = node.parentNode;
                }
            }
        });
    },

    runAllFilters() {
        this.reelShelfFilter();
        this.richShelfFilter();
        this.videoLinkFilter();
    },

    // When navigating TO a Shorts URL, inject an "Open in standard player" button
    // instead of force-redirecting (preserves browser history)
    injectOpenInPlayerBtn() {
        const result = window.location.href.match(/shorts\/(.{11})/);
        if (!result) return;
        const videoId = result[1];
        const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

        const checkAndInject = setInterval(() => {
            const actions = document.querySelector('#actions.ytd-reel-player-overlay-renderer');
            if (actions && !actions.querySelector('.byt-open-in-player-btn')) {
                clearInterval(checkAndInject);
                const btn = document.createElement('div');
                btn.className = 'byt-open-in-player-btn';
                btn.title = 'Open in standard player';
                btn.style.cssText = 'display:inline-flex;align-items:center;gap:8px;cursor:pointer;background:rgba(15,15,15,0.85);backdrop-filter:blur(8px);color:#fff;border-radius:24px;padding:8px 16px;font-size:13px;font-weight:600;margin:8px 0;border:1px solid rgba(255,255,255,0.15);box-shadow:0 2px 12px rgba(0,0,0,0.4);user-select:none;transition:background 0.2s;';
                // Phosphor ph-arrow-square-out
                const arrowOutPath = 'M224,104a8,8,0,0,1-16,0V59.32l-82.34,82.34a8,8,0,0,1-11.32-11.32L196.68,48H152a8,8,0,0,1,0-16h64a8,8,0,0,1,8,8Zm-40,24a8,8,0,0,0-8,8v72H48V80h72a8,8,0,0,0,0-16H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V136A8,8,0,0,0,184,128Z';
                btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="18" height="18"><path d="${arrowOutPath}" fill="#fff"/></svg>Open in Player`;
                btn.onmouseenter = () => btn.style.background = 'rgba(255,255,255,0.15)';
                btn.onmouseleave = () => btn.style.background = 'rgba(15,15,15,0.85)';
                btn.onclick = () => {
                    document.querySelectorAll('video').forEach(v => v.pause());
                    window.open(watchUrl);
                };
                actions.insertAdjacentElement('afterbegin', btn);
            }
        }, 300);
        // Clear if we navigated away within 5s
        setTimeout(() => clearInterval(checkAndInject), 5000);
    },

    start() {
        if (this.observer) return;
        const container = document.querySelector('#content, ytd-app');
        if (!container) return;
        this.observer = new MutationObserver(() => this.runAllFilters());
        this.observer.observe(container, { childList: true, subtree: true });
        this.runAllFilters();
    },

    stop() {
        if (this.observer) { this.observer.disconnect(); this.observer = null; }
    }
};

function initShortsBlocker() {
    // CSS: hide sidebar Shorts link
    let style = document.getElementById('byt-shorts-style');
    if (!style) {
        style = document.createElement('style');
        style.id = 'byt-shorts-style';
        style.textContent = `
            a[title='Shorts'],
            ytd-guide-entry-renderer:has(a[href^="/shorts"]),
            ytd-mini-guide-entry-renderer:has(a[href^="/shorts"]) { display: none !important; }
        `;
        document.head.appendChild(style);
    }
    // Hook navigation events for redirect/button injection
    if (!window.bytShortsNavBound) {
        window.bytShortsNavBound = true;
        document.addEventListener('yt-navigate-start', (e) => {
            if (!BetterYT_Settings.hideShorts) return;
            const dest = e && e.detail && e.detail.endpoint && e.detail.endpoint.urlEndpoint && e.detail.endpoint.urlEndpoint.url;
            const url = dest || (e.target && e.target.baseURI) || '';
            const match = url.match(/shorts\/(.{11})/);
            if (match) BYT_ShortsFilter.injectOpenInPlayerBtn();
        });
        // Also catch direct page load on a shorts URL
        if (window.location.href.includes('/shorts/')) BYT_ShortsFilter.injectOpenInPlayerBtn();
    }
    BYT_ShortsFilter.start();
}

function removeShortsBlocker() {
    const style = document.getElementById('byt-shorts-style');
    if (style) style.remove();
    BYT_ShortsFilter.stop();
}

// --- Feature: Fast Forward / Rewind Buttons ---
// Icons: Phosphor ph-skip-back / ph-skip-forward (256px viewBox)
function _bytFFNorm(val, min, max, fallback) {
    const n = Number(val);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, n));
}

function _bytFFConfig() {
    const fSkip = _bytFFNorm(BetterYT_Settings.skipSeconds, 1, 99, 10);
    const bSkip = _bytFFNorm(BetterYT_Settings.skipSecondsBack || BetterYT_Settings.skipSeconds, 1, 99, fSkip);
    const delay = _bytFFNorm(BetterYT_Settings.fastForwardTriggerDelay, 0, 1000, 0);
    const throttle = _bytFFNorm(BetterYT_Settings.fastForwardThrottleMs, 0, 500, 120);
    return {
        fSkip,
        bSkip,
        delay,
        throttle,
        keyForward: BetterYT_Settings.fastForwardKeyForward || 'ArrowRight',
        keyBack: BetterYT_Settings.fastForwardKeyBack || 'ArrowLeft',
        scrollSeek: BetterYT_Settings.fastForwardScrollSeek !== false
    };
}

function _bytFFShouldIgnoreTarget(target) {
    if (!target) return false;
    const tag = target.tagName ? target.tagName.toUpperCase() : '';
    if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(tag)) return true;
    if (target.isContentEditable) return true;
    return !!target.closest?.('input, textarea, select, [contenteditable="true"], #search, ytd-searchbox');
}

function _bytFFQueueSeek(secondsDelta) {
    const cfg = _bytFFConfig();
    const now = Date.now();
    const lastAt = window.bytFFLastSeekAt || 0;
    if (cfg.throttle > 0 && now - lastAt < cfg.throttle) return;
    window.bytFFLastSeekAt = now;
    const run = () => {
        const video = document.querySelector('video');
        if (!video) return;
        video.currentTime += secondsDelta;
    };
    if (cfg.delay > 0) setTimeout(run, cfg.delay);
    else run();
}

function _bytMakeSkipSvg(seconds, direction) {
    const isBack = direction === 'back';
    // Swap pathBack and pathForward due to reverse orientation fix
    const pathForward = 'M208,32a16,16,0,0,0-16,16V111.38L72.77,34.84A15.93,15.93,0,0,0,48,48V208a15.93,15.93,0,0,0,24.77,13.16L192,144.62V208a16,16,0,0,0,32,0V48A16,16,0,0,0,208,32Z';
    const pathBack = 'M48,224a16,16,0,0,0,16-16V144.62l119.23,76.54A15.93,15.93,0,0,0,208,208V48a15.93,15.93,0,0,0-24.77-13.16L64,111.38V48A16,16,0,0,0,32,48V208A16,16,0,0,0,48,224Z';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24" style="display:block;flex-shrink:0">
        <path d="${isBack ? pathBack : pathForward}" fill="#fff"/>
    </svg>`;
}

function _bytInjectFFButtons() {
    if (!BetterYT_Settings.fastForward) return;
    const leftControls = document.querySelector('.ytp-left-controls');
    if (!leftControls || document.getElementById('byt-ff-btn')) return;
    const timeDisplay = leftControls.querySelector('.ytp-time-display');
    if (!timeDisplay) return;

    const fSkip = BetterYT_Settings.skipSeconds || 10;
    const bSkip = BetterYT_Settings.skipSecondsBack || fSkip;

    const container = document.createElement('div');
    container.id = 'byt-ff-btn';
    container.style.cssText = 'display:flex;align-items:center;height:100%;';

    const btnRw = document.createElement('button');
    btnRw.className = 'ytp-button';
    btnRw.title = `Skip back ${bSkip}s`;
    btnRw.style.cssText = 'display:flex;justify-content:center;align-items:center;width:40px;height:100%;';
    btnRw.innerHTML = _bytMakeSkipSvg(bSkip, 'back');
    btnRw.onclick = () => _bytFFQueueSeek(-bSkip);

    const btnFf = document.createElement('button');
    btnFf.className = 'ytp-button';
    btnFf.title = `Skip forward ${fSkip}s`;
    btnFf.style.cssText = 'display:flex;justify-content:center;align-items:center;width:40px;height:100%;';
    btnFf.innerHTML = _bytMakeSkipSvg(fSkip, 'forward');
    btnFf.onclick = () => _bytFFQueueSeek(fSkip);

    container.appendChild(btnRw);
    container.appendChild(btnFf);
    const ffParent = timeDisplay.parentNode;
    if (ffParent) ffParent.insertBefore(container, timeDisplay.nextSibling);
    else leftControls.appendChild(container);
}

function _bytFFKeydown(e) {
    if (!BetterYT_Settings.fastForward) return;
    if (e.altKey || e.ctrlKey || e.metaKey || !e.isTrusted) return;
    if (_bytFFShouldIgnoreTarget(e.target)) return;
    const cfg = _bytFFConfig();
    if (e.code === cfg.keyForward) {
        e.preventDefault();
        e.stopImmediatePropagation();
        _bytFFQueueSeek(cfg.fSkip);
    } else if (e.code === cfg.keyBack) {
        e.preventDefault();
        e.stopImmediatePropagation();
        _bytFFQueueSeek(-cfg.bSkip);
    }
}

function _bytFFWheelSeek(e) {
    if (!BetterYT_Settings.fastForward) return;
    const cfg = _bytFFConfig();
    if (!cfg.scrollSeek) return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (_bytFFShouldIgnoreTarget(e.target)) return;
    const playerScope = e.target && e.target.closest && e.target.closest('#movie_player, .html5-video-player, .ytp-progress-bar');
    if (!playerScope) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? cfg.fSkip : -cfg.bSkip;
    _bytFFQueueSeek(delta);
}

function initFastForward() {
    if (window.bytFFObserver) return;
    // MutationObserver: inject buttons whenever left controls appear/reappear
    window.bytFFObserver = new MutationObserver(() => _bytInjectFFButtons());
    window.bytFFObserver.observe(document.body, { childList: true, subtree: true });
    if (!window.bytFFKeyBound) {
        window.bytFFKeyBound = true;
        document.addEventListener('keydown', _bytFFKeydown, true);
    }
    if (!window.bytFFWheelBound) {
        window.bytFFWheelBound = true;
        document.addEventListener('wheel', _bytFFWheelSeek, { capture: true, passive: false });
    }
    // Also re-inject after SPA navigation
    document.addEventListener('yt-navigate-finish', () => {
        const old = document.getElementById('byt-ff-btn');
        if (old) old.remove();
        setTimeout(_bytInjectFFButtons, 600);
    });
    _bytInjectFFButtons();
    setTimeout(_bytInjectFFButtons, 1200);
}
function removeFastForward() {
    if (window.bytFFObserver) {
        window.bytFFObserver.disconnect();
        window.bytFFObserver = null;
    }
    if (window.bytFFKeyBound) {
        document.removeEventListener('keydown', _bytFFKeydown, true);
        window.bytFFKeyBound = false;
    }
    if (window.bytFFWheelBound) {
        document.removeEventListener('wheel', _bytFFWheelSeek, { capture: true });
        window.bytFFWheelBound = false;
    }
    const el = document.getElementById('byt-ff-btn');
    if (el) el.remove();
}

// --- Feature: Picture in Picture ---
// Icon: Phosphor ph-picture-in-picture (256px viewBox)
function _bytGetPipWindowSize() {
    const sw = (window.screen && window.screen.availWidth) ? window.screen.availWidth : 1920;
    const sh = (window.screen && window.screen.availHeight) ? window.screen.availHeight : 1080;
    const w = Math.max(320, Math.min(720, Math.floor(sw * 0.28)));
    const h = Math.max(180, Math.min(420, Math.floor(sh * 0.26)));
    return { width: w, height: h };
}

async function _bytEnterPiP(video) {
    if (!video) return;
    // Prefer Document PiP when available so we can set a bounded window size.
    if (window.documentPictureInPicture && typeof window.documentPictureInPicture.requestWindow === 'function') {
        try {
            const size = _bytGetPipWindowSize();
            const pipWindow = await window.documentPictureInPicture.requestWindow(size);
            const pipVideo = video.cloneNode(true);
            pipVideo.muted = true;
            pipVideo.controls = true;
            pipVideo.style.cssText = 'width:100%;height:100%;object-fit:contain;background:#000;';
            pipWindow.document.body.style.margin = '0';
            pipWindow.document.body.style.background = '#000';
            pipWindow.document.body.appendChild(pipVideo);
            pipVideo.currentTime = video.currentTime;
            return;
        } catch (e) {}
    }
    if (typeof video.requestPictureInPicture === 'function') {
        video.requestPictureInPicture().catch(e => console.error(e));
    }
}

function initPiP() {
    if (window.bytPipInterval) return;
    // ph-picture-in-picture path
    const pipPath = 'M232,48H24A16,16,0,0,0,8,64V192a16,16,0,0,0,16,16H232a16,16,0,0,0,16-16V64A16,16,0,0,0,232,48ZM232,192H24V64H232ZM208,112H128a8,8,0,0,0-8,8v56a8,8,0,0,0,8,8h80a8,8,0,0,0,8-8V120A8,8,0,0,0,208,112Zm-8,56H136V128h64Z';
    window.bytPipInterval = setInterval(() => {
        if (!BetterYT_Settings.pipMode) return;
        const rightControls = document.querySelector('.ytp-right-controls');
        if (rightControls && !document.getElementById('byt-pip-btn')) {
            const btn = document.createElement('button');
            btn.id = 'byt-pip-btn';
            btn.className = 'ytp-button';
            btn.title = 'Picture in Picture';
            btn.style.cssText = 'display:flex;align-items:center;justify-content:center;width:36px;height:100%;padding:0;';
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><path d="${pipPath}" fill="#fff"/></svg>`;
            btn.onclick = () => {
                const video = document.querySelector('video');
                if (video) {
                    if (document.pictureInPictureElement) document.exitPictureInPicture();
                    else _bytEnterPiP(video);
                }
            };
            rightControls.prepend(btn);
        }
    }, 2000);
}
function removePiP() {
    if (window.bytPipInterval) {
        clearInterval(window.bytPipInterval);
        window.bytPipInterval = null;
    }
    const el = document.getElementById("byt-pip-btn");
    if (el) el.remove();
}

// --- Feature: Screenshot Button ---
// Icon: Phosphor ph-camera (256px viewBox)
// Filename sanitization ported from use/6/js/page.js
const _bytIllegalRe = /[\/\?<>\\:\*\|"|]/g;
const _bytControlRe = /[\x00-\x1f\x80-\x9f]/g;
const _bytReservedRe = /^\.+$/;
const _bytWinReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
const _bytWinTrailingRe = /[\. ]+$/;

function _bytSanitizeFilename(input) {
    const base = String(input || 'screenshot')
        .normalize('NFKC')
        .replace(_bytIllegalRe, '')
        .replace(_bytControlRe, '')
        .replace(_bytReservedRe, '')
        .replace(_bytWinReservedRe, '')
        .replace(_bytWinTrailingRe, '')
        .trim()
        .slice(0, 246);
    return base || `screenshot_${Date.now()}`;
}

function _bytVideoTimestamp(video) {
    const secs = Math.floor(video ? video.currentTime : 0);
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return [h, m, s].map(v => String(v).padStart(2, '0')).join('-');
}

function _bytInjectScreenshotBtn() {
    if (!BetterYT_Settings.screenshot) return;
    const rightControls = document.querySelector('.ytp-right-controls');
    if (!rightControls || document.getElementById('byt-screenshot-btn')) return;

    const cameraPath = 'M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.72,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80a8,8,0,0,0,6.65-3.56L100.28,48h55.44l13.63,20.44A8,8,0,0,0,176,72h32a8,8,0,0,1,8,8ZM128,88a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,88Zm0,72a28,28,0,1,1,28-28A28,28,0,0,1,128,160Z';
    const btn = document.createElement('button');
    btn.id = 'byt-screenshot-btn';
    btn.className = 'ytp-button';
    btn.title = 'Take Screenshot';
    btn.style.cssText = 'display:flex;align-items:center;justify-content:center;width:36px;height:100%;padding:0;';
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="22" height="22"><path d="${cameraPath}" fill="#fff"/></svg>`;
    btn.onclick = () => {
        const video = document.querySelector('video');
        if (!video) return;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        const rawTitle = document.title.replace(/ - YouTube$/, '') || 'Screenshot';
        const ts = _bytVideoTimestamp(video);
        const filename = _bytSanitizeFilename(`${rawTitle} ${ts}`) + '.png';
        const a = document.createElement('a');
        a.download = filename;
        canvas.toBlob(blob => {
            a.href = URL.createObjectURL(blob);
            a.click();
            setTimeout(() => URL.revokeObjectURL(a.href), 10000);
        }, 'image/png');
    };
    rightControls.prepend(btn);
}

function initScreenshot() {
    if (window.bytScreenshotObserver) return;
    // Use MutationObserver to detect when right controls appear/reappear
    window.bytScreenshotObserver = new MutationObserver(() => _bytInjectScreenshotBtn());
    window.bytScreenshotObserver.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('yt-navigate-finish', () => {
        const old = document.getElementById('byt-screenshot-btn');
        if (old) old.remove();
        setTimeout(_bytInjectScreenshotBtn, 800);
    });
    _bytInjectScreenshotBtn();
    // Also try after a short delay in case player isn't ready yet
    setTimeout(_bytInjectScreenshotBtn, 1500);
}
function removeScreenshot() {
    if (window.bytScreenshotObserver) {
        window.bytScreenshotObserver.disconnect();
        window.bytScreenshotObserver = null;
    }
    const el = document.getElementById('byt-screenshot-btn');
    if (el) el.remove();
}

// --- Feature: Row Fixer (Compact Grid) ---
// Ported from use/5: 7 independent CSS settings for granular control.
function _bytInjectStyle(id, css) {
    let el = document.getElementById(id);
    if (el) el.remove();
    if (!css) return;
    el = document.createElement('style');
    el.id = id;
    el.className = 'byt-row-fixer-style';
    el.textContent = css;
    (document.head || document.documentElement).appendChild(el);
}

function initCompactGrid() {
    const s = BetterYT_Settings;
    const clampCount = (value, fallback, min = 1, max = 12) => {
        const n = Number(value);
        if (!Number.isFinite(n)) return fallback;
        return Math.max(min, Math.min(max, Math.floor(n)));
    };
    const rowCount = clampCount(s.rowFixer, 5);
    const postCount = clampCount(s.postPerRow, 3);
    const shortsCount = clampCount(s.shortsPerRow, 6);
    const channelRowCount = clampCount(s.channelRowFixer, 5);

    const rowMd = Math.max(1, rowCount - 2);
    const rowLg = Math.max(1, rowCount - 1);
    const shortsMd = Math.max(1, shortsCount - 2);
    const shortsLg = Math.max(1, shortsCount - 1);
    const channelMd = Math.max(1, channelRowCount - 2);
    const channelLg = Math.max(1, channelRowCount - 1);

    // 1. Videos per row — home page with responsive breakpoints
    _bytInjectStyle('byt-row-fixer-vprow', `
        ytd-rich-grid-renderer {
            --ytd-rich-grid-items-per-row: ${rowCount} !important;
        }
        ytd-rich-item-renderer:not([is-post]):not([is-slim-media]) {
            min-width: 180px !important;
        }
        @media (max-width: 1600px) {
            ytd-rich-grid-renderer { --ytd-rich-grid-items-per-row: ${rowLg} !important; }
        }
        @media (max-width: 1200px) {
            ytd-rich-grid-renderer { --ytd-rich-grid-items-per-row: ${rowMd} !important; }
        }
    `);

    // 2. Posts per row — community/subscription feed
    _bytInjectStyle('byt-row-fixer-posts', `
        ytd-rich-grid-renderer {
            --ytd-rich-grid-posts-per-row: ${postCount} !important;
        }
    `);

    // 3. Shorts shelf items per row with responsive breakpoints
    _bytInjectStyle('byt-row-fixer-shorts', `
        ytd-rich-shelf-renderer[is-shorts] {
            --ytd-rich-grid-items-per-row: ${shortsCount} !important;
        }
        @media (max-width: 1600px) {
            ytd-rich-shelf-renderer[is-shorts] { --ytd-rich-grid-items-per-row: ${shortsLg} !important; }
        }
        @media (max-width: 1200px) {
            ytd-rich-shelf-renderer[is-shorts] { --ytd-rich-grid-items-per-row: ${shortsMd} !important; }
        }
    `);

    // 4. Channel page videos per row with responsive breakpoints
    _bytInjectStyle('byt-row-fixer-channel', `
        [page-subtype="channels"] ytd-rich-grid-renderer {
            --ytd-rich-grid-items-per-row: ${channelRowCount} !important;
        }
        @media (max-width: 1600px) {
            [page-subtype="channels"] ytd-rich-grid-renderer { --ytd-rich-grid-items-per-row: ${channelLg} !important; }
        }
        @media (max-width: 1200px) {
            [page-subtype="channels"] ytd-rich-grid-renderer { --ytd-rich-grid-items-per-row: ${channelMd} !important; }
        }
    `);

    // 5. Hide channel avatars (optional)
    if (s.hideChannelAvatars) {
        _bytInjectStyle('byt-row-fixer-avatars', `
            .channel-avatar.ytd-ghost-grid-renderer,
            #home-page-skeleton .channel-avatar,
            #avatar-container.ytd-rich-grid-media,
            ytd-rich-grid-media a#avatar-link,
            .yt-lockup-metadata-view-model--standard .yt-lockup-metadata-view-model__avatar,
            .yt-lockup-metadata-view-model-wiz--standard .yt-lockup-metadata-view-model-wiz__avatar { display: none !important; }
        `);
    } else {
        _bytInjectStyle('byt-row-fixer-avatars', null);
    }

    // 6. Display full video titles (no truncation)
    if (s.displayFullTitle) {
        _bytInjectStyle('byt-row-fixer-fulltitle', `
            .yt-lockup-metadata-view-model--standard .yt-lockup-metadata-view-model__title,
            .yt-lockup-metadata-view-model-wiz--standard .yt-lockup-metadata-view-model-wiz__title,
            #video-title.yt-simple-endpoint.ytd-grid-video-renderer,
            #video-title.ytd-rich-grid-media,
            #video-title.ytd-compact-video-renderer,
            #video-title.ytd-video-renderer,
            #video-title.ytd-rich-grid-slim-media {
                max-height: unset !important;
                -webkit-line-clamp: unset !important;
                overflow: visible !important;
                white-space: normal !important;
            }
        `);
    } else {
        _bytInjectStyle('byt-row-fixer-fulltitle', null);
    }

    // 7. Channel page wide layout (remove sidebar, full-width grid)
    if (s.channelWideLayout) {
        _bytInjectStyle('byt-row-fixer-widelayout', `
            [page-subtype="channels"] ytd-two-column-browse-results-renderer,
            [page-subtype="channels"] #page-manager ytd-two-column-browse-results-renderer {
                max-width: 100% !important;
                width: 100% !important;
            }
            [page-subtype="channels"] ytd-two-column-browse-results-renderer #secondary {
                display: none !important;
                width: 0 !important;
                min-width: 0 !important;
            }
            [page-subtype="channels"] ytd-two-column-browse-results-renderer #primary {
                max-width: 100% !important;
                min-width: 100% !important;
                flex: 1 1 100% !important;
            }
            [page-subtype="channels"] ytd-two-column-browse-results-renderer #primary.ytd-two-column-browse-results-renderer {
                padding-inline: 20px !important;
            }
            @media (max-width: 1200px) {
                [page-subtype="channels"] ytd-two-column-browse-results-renderer #primary.ytd-two-column-browse-results-renderer {
                    padding-inline: 12px !important;
                }
            }
        `);
    } else {
        _bytInjectStyle('byt-row-fixer-widelayout', null);
    }
}

function removeCompactGrid() {
    document.querySelectorAll('.byt-row-fixer-style').forEach(el => el.remove());
}

// --- Feature: Show Tags ---
const BYT_TAGS_MAX = 15;

function _bytRenderTags() {
    if (!BetterYT_Settings.showTags) return;
    if (window.location.pathname !== '/watch') return;
    if (document.getElementById('byt-video-tags')) return;

    const titleContainer = document.querySelector('#title.ytd-watch-metadata');
    if (!titleContainer) return;
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords || !metaKeywords.content) return;

    let tags = metaKeywords.content.split(',').map(t => t.trim()).filter(Boolean);
    const overflow = tags.length > BYT_TAGS_MAX ? tags.length - BYT_TAGS_MAX : 0;
    if (overflow) tags = tags.slice(0, BYT_TAGS_MAX);

    const tagGroup = document.createElement('div');
    tagGroup.id = 'byt-video-tags';
    tagGroup.style.cssText = 'margin:10px 0 6px;display:flex;flex-wrap:wrap;align-items:center;gap:8px;';

    if (!document.getElementById('byt-video-tags-style')) {
        const st = document.createElement('style');
        st.id = 'byt-video-tags-style';
        st.textContent = `
            #byt-video-tags .byt-tag-chip {
                display: inline-flex;
                align-items: center;
                min-height: 28px;
                padding: 0 11px;
                border-radius: 999px;
                font-size: 12px;
                line-height: 1.2;
                font-weight: 600;
                text-decoration: none;
                border: 1px solid var(--yt-spec-10-percent-layer, rgba(255,255,255,.2));
                background: var(--yt-spec-badge-chip-background, rgba(255,255,255,.08));
                color: var(--yt-spec-text-secondary, #aaa);
                transition: background-color .15s ease, color .15s ease, border-color .15s ease, transform .15s ease;
            }
            #byt-video-tags .byt-tag-chip:hover {
                color: var(--yt-spec-text-primary, #fff);
                background: var(--yt-spec-10-percent-layer, rgba(255,255,255,.15));
                border-color: var(--yt-spec-text-primary, #fff);
                transform: translateY(-1px);
            }
        `;
        document.head.appendChild(st);
    }

    tags.forEach(tag => {
        const t = document.createElement('a');
        t.className = 'byt-tag-chip';
        t.href = '/results?search_query=' + encodeURIComponent(tag);
        t.textContent = '#' + tag;
        tagGroup.appendChild(t);
    });

    if (overflow) {
        const more = document.createElement('span');
        more.style.cssText = 'padding:0 10px;min-height:24px;border-radius:999px;border:1px dashed var(--yt-spec-10-percent-layer, rgba(255,255,255,.2));display:inline-flex;align-items:center;color:var(--yt-spec-text-secondary,#aaa);font-size:12px;font-weight:600;';
        more.textContent = `+${overflow} more`;
        tagGroup.appendChild(more);
    }

    try {
        titleContainer.appendChild(tagGroup);
    } catch (e) {}
}

function initShowTags() {
    if (window.bytShowTagsInitialized) return;
    window.bytShowTagsInitialized = true;

    // Render immediately and on navigation
    setTimeout(_bytRenderTags, 1000);
    document.addEventListener('yt-navigate-finish', () => {
        const old = document.getElementById('byt-video-tags');
        if (old) old.remove();
        setTimeout(_bytRenderTags, 1000);
    });
}
function removeShowTags() {
    const el = document.getElementById('byt-video-tags');
    if (el) el.remove();
    const st = document.getElementById('byt-video-tags-style');
    if (st) st.remove();
    window.bytShowTagsInitialized = false;
}

// --- Feature: Colorize YouTube Dislike ---
function initColorizeDislike() {
    let style = document.getElementById("byt-colorize-dislike-style");
    if (!style) {
        style = document.createElement("style");
        style.id = "byt-colorize-dislike-style";
        style.textContent = `
            ytd-segmented-like-dislike-button-renderer ytd-toggle-button-renderer:first-child button,
            ytd-segmented-like-dislike-button-renderer ytd-toggle-button-renderer:first-child yt-icon {
                color: #22c55e !important;
            }
            ytd-segmented-like-dislike-button-renderer ytd-toggle-button-renderer:last-child button,
            ytd-segmented-like-dislike-button-renderer ytd-toggle-button-renderer:last-child yt-icon {
                color: #ef4444 !important;
            }
        `;
        document.head.appendChild(style);
    }
}
function removeColorizeDislike() {
    const style = document.getElementById("byt-colorize-dislike-style");
    if (style) style.remove();
}

// --- Feature: Force Dark Mode & Custom Colors ---
function initDarkMode() {
    document.documentElement.setAttribute('dark', 'true');
    const existingTheme = document.getElementById('byt-theme');
    if (!existingTheme) {
        const style = document.createElement("style");
        style.id = "byt-theme";
        style.textContent = `
            html[dark="true"] {
                --yt-spec-base-background: #0f0f0f !important;
                --yt-spec-raised-background: #212121 !important;
                --yt-spec-menu-background: #282828 !important;
            }
        `;
        document.head.appendChild(style);
    }
}
function removeDarkMode() {
    document.documentElement.removeAttribute('dark');
    const el = document.getElementById("byt-theme");
    if (el) el.remove();
}

// --- Feature: Watch Time Tracker ---
let ytWatchStarted = false;
let ytWatchTempArr = [];
let ytLastURL = location.href;
let bytWatchTimeInterval;

function initWatchTimeTracker() {
    if (bytWatchTimeInterval) clearInterval(bytWatchTimeInterval);
    bytWatchTimeInterval = setInterval(() => {
        if (!BetterYT_Settings.watchTimeTracker) return;
        const newURL = location.href;
        if (newURL !== ytLastURL) {
            if (ytLastURL.includes("/watch") || ytLastURL.includes("/shorts")) {
                pushWatchTime(ytLastURL, Date.now(), document.querySelector('#title h1 yt-formatted-string')?.textContent || " ");
            }
            ytLastURL = newURL;
        }
        
        const video = document.querySelector('video');
        if (video && !video.bytWatchTimeAttached) {
            video.bytWatchTimeAttached = true;
            video.addEventListener("timeupdate", () => {
                if (!BetterYT_Settings.watchTimeTracker) return;
                if (!ytWatchStarted && !video.paused && video.currentTime > 0) {
                    ytWatchStarted = true;
                    ytWatchTempArr.push({ id: getYTVideoID(window.location.href), time: Date.now() });
                }
            });
            video.addEventListener("play", () => {
                if (!BetterYT_Settings.watchTimeTracker) return;
                if (!ytWatchStarted && video.currentTime > 0) {
                    ytWatchStarted = true;
                    ytWatchTempArr.push({ id: getYTVideoID(window.location.href), time: Date.now() });
                }
            });
            video.addEventListener("pause", () => {
                if (!BetterYT_Settings.watchTimeTracker) return;
                pushWatchTime(window.location.href, Date.now(), document.querySelector('#title h1 yt-formatted-string')?.textContent || " ");
            });
            window.addEventListener("beforeunload", () => {
                if (!BetterYT_Settings.watchTimeTracker) return;
                pushWatchTime(window.location.href, Date.now(), document.querySelector('#title h1 yt-formatted-string')?.textContent || " ");
            });
        }
    }, 1000);
}

function pushWatchTime(url, timeStamp, title) {
    ytWatchStarted = false;
    let vidID = getYTVideoID(url);
    if (!vidID) return;
    let result = ytWatchTempArr.find(obj => obj.id === vidID);
    if (!result) return;
    
    const watchTime = Math.round((timeStamp - result.time) / 1000);
    ytWatchTempArr = ytWatchTempArr.filter(obj => obj.id !== vidID);
    
    _bytSafeSendMessage({
        action: "storeWatchTime",
        data: { vidID, watchTime, title }
    }, () => {});
}

function getYTVideoID(url) {
    try {
        const parsedUrl = new URL(url);
        if (parsedUrl.searchParams.has("v")) return parsedUrl.searchParams.get("v");
        const match = parsedUrl.pathname.match(/\/(embed|shorts|v)\/([\w-]{11})/);
        if (match) return match[2];
        return null;
    } catch(e) { return null; }
}

function removeWatchTimeTracker() {
    if (bytWatchTimeInterval) clearInterval(bytWatchTimeInterval);
}

function exportWatchTime() {
    chrome.runtime.sendMessage({ action: 'exportWatchTime' }, (data) => {
        if (chrome.runtime.lastError || !data) return;
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `betteryt_watchtime_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });
}

// --- Feature: Return YouTube Dislike ---
// Calls the public Return YouTube Dislike API to show real dislike counts.
let bytRYDObserver = null;
let bytRYDInterval = null;
const BYT_RYD_CACHE_TTL = 10 * 60 * 1000;
const BYT_RYD_CACHE_MAX = 120;
const bytRYDCache = new Map();
const bytRYDApiHealth = {
    consecutiveFailures: 0,
    lastFailureAt: 0,
    lastSuccessAt: 0
};
let bytRYDAccent = null;

function _bytGetAccentPalette(accent) {
    const palette = {
        red: '#ff0000', blue: '#3ea6ff', green: '#1f8c35',
        purple: '#b426ff', pink: '#ff2692', orange: '#ff8800',
        emerald: '#10b981', amber: '#f59e0b', cyan: '#06b6d4', gold: '#eab308'
    };
    const likeColor = palette[accent] || '#3ea6ff';
    return { likeColor, dislikeColor: '#ef4444' };
}

function _bytSetRYDTheme() {
    const accent = bytRYDAccent || 'red';
    const colors = _bytGetAccentPalette(accent);
    let style = document.getElementById('byt-ryd-theme-style');
    if (!style) {
        style = document.createElement('style');
        style.id = 'byt-ryd-theme-style';
        document.head.appendChild(style);
    }
    style.textContent = `
        ytd-segmented-like-dislike-button-renderer ytd-toggle-button-renderer:first-child button,
        ytd-segmented-like-dislike-button-renderer ytd-toggle-button-renderer:first-child yt-icon {
            color: ${colors.likeColor} !important;
        }
        ytd-segmented-like-dislike-button-renderer ytd-toggle-button-renderer:last-child button,
        ytd-segmented-like-dislike-button-renderer ytd-toggle-button-renderer:last-child yt-icon {
            color: ${colors.dislikeColor} !important;
        }
        #byt-dislike-count {
            color: ${colors.dislikeColor} !important;
            text-shadow: 0 0 8px ${colors.dislikeColor}55;
        }
    `;
}

function _bytRefreshRYDAccent() {
    chrome.storage.local.get(['BetterYT_Accent'], (res) => {
        bytRYDAccent = res.BetterYT_Accent || 'red';
        _bytSetRYDTheme();
    });
}

function _bytFormatCompactCount(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return '?';
    try {
        return new Intl.NumberFormat(navigator.language || 'en', {
            notation: 'compact',
            compactDisplay: 'short',
            maximumFractionDigits: 1
        }).format(n);
    } catch (e) {
        if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        return n.toLocaleString();
    }
}

function _bytFormatFullCount(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return '?';
    return n.toLocaleString(navigator.language || 'en');
}

function _bytReadCache(videoId, allowStale = false) {
    const entry = bytRYDCache.get(videoId);
    if (!entry) return null;
    const age = Date.now() - entry.fetchedAt;
    if (!allowStale && age > BYT_RYD_CACHE_TTL) return null;
    bytRYDCache.delete(videoId);
    bytRYDCache.set(videoId, entry);
    return {
        data: entry.data,
        stale: age > BYT_RYD_CACHE_TTL,
        ageMs: age
    };
}

function _bytWriteCache(videoId, data) {
    const now = Date.now();
    if (bytRYDCache.has(videoId)) bytRYDCache.delete(videoId);
    bytRYDCache.set(videoId, { data, fetchedAt: now });
    while (bytRYDCache.size > BYT_RYD_CACHE_MAX) {
        const oldestKey = bytRYDCache.keys().next().value;
        bytRYDCache.delete(oldestKey);
    }
}

function _bytApiHealthStatus() {
    if (!bytRYDApiHealth.lastSuccessAt && bytRYDApiHealth.consecutiveFailures > 0) return 'offline';
    if (bytRYDApiHealth.consecutiveFailures >= 2) return 'degraded';
    return 'healthy';
}

async function fetchDislikeCount(videoId) {
    const cached = _bytReadCache(videoId);
    if (cached) {
        return { data: cached.data, stale: cached.stale, source: 'cache' };
    }
    try {
        const res = await fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`);
        if (!res.ok) throw new Error(`RYD HTTP ${res.status}`);
        const data = await res.json();
        _bytWriteCache(videoId, data);
        bytRYDApiHealth.consecutiveFailures = 0;
        bytRYDApiHealth.lastSuccessAt = Date.now();
        return { data, stale: false, source: 'network' };
    } catch (e) {
        bytRYDApiHealth.consecutiveFailures += 1;
        bytRYDApiHealth.lastFailureAt = Date.now();
        const staleEntry = _bytReadCache(videoId, true);
        if (staleEntry) {
            return { data: staleEntry.data, stale: true, source: 'stale-cache' };
        }
        return null;
    }
}

function _bytBuildRYDAnalytics(data) {
    const likes = Math.max(0, Number(data?.likes) || 0);
    const dislikes = Math.max(0, Number(data?.dislikes) || 0);
    const total = likes + dislikes;
    const approvalPct = total > 0 ? (likes / total) * 100 : null;
    const dislikePct = total > 0 ? (dislikes / total) * 100 : null;
    const likeDislikeRatio = dislikes > 0 ? (likes / dislikes) : null;
    return { likes, dislikes, total, approvalPct, dislikePct, likeDislikeRatio };
}

async function injectDislikeCount() {
    if (window.location.pathname !== '/watch') return;
    const videoId = new URLSearchParams(location.search).get('v');
    if (!videoId) return;
    if (document.getElementById('byt-dislike-count')) return;

    // Find the dislike button container - try multiple selectors for robustness
    let dislikeBtnRow = document.querySelector(
        'ytd-segmented-like-dislike-button-renderer ytd-toggle-button-renderer:last-child'
    );
    
    // Fallback selectors for different YouTube layouts
    if (!dislikeBtnRow) {
        dislikeBtnRow = document.querySelector(
            'like-button-view-model + dislike-button-view-model'
        );
    }
    if (!dislikeBtnRow) {
        dislikeBtnRow = document.querySelector(
            '#segmented-dislike-button, button[aria-label*="Dislike"]'
        );
    }
    if (!dislikeBtnRow) {
        console.log('[BetterYT] Return Dislike: Could not find dislike button container');
        return;
    }

    const result = await fetchDislikeCount(videoId);
    if (!result || !result.data) {
        console.log('[BetterYT] Return Dislike: Failed to fetch data for video', videoId);
        return;
    }
    const data = result.data;
    const analytics = _bytBuildRYDAnalytics(data);

    const dislikeCount = _bytFormatCompactCount(analytics.dislikes);
    const likeCount = _bytFormatCompactCount(analytics.likes);
    const approval = analytics.approvalPct !== null ? `${analytics.approvalPct.toFixed(1)}%` : 'N/A';
    const ratio = analytics.likeDislikeRatio !== null ? `${analytics.likeDislikeRatio.toFixed(2)}:1` : 'Infinity:1';
    const apiStatus = _bytApiHealthStatus();
    const freshness = result.stale ? 'stale cache (offline fallback)' : result.source;

    // Inject dislike count label next to the dislike button
    let label = document.getElementById('byt-dislike-count');
    if (!label) {
        label = document.createElement('span');
        label.id = 'byt-dislike-count';
        label.style.cssText = 'font-size:14px;font-weight:600;color:var(--yt-spec-text-primary,#fff);margin-left:6px;align-self:center;pointer-events:none;user-select:none;';
        dislikeBtnRow.style.position = 'relative';
        dislikeBtnRow.style.display = 'flex';
        dislikeBtnRow.style.alignItems = 'center';
        const btn = dislikeBtnRow.querySelector('button');
        if (btn) btn.after(label);
        else dislikeBtnRow.append(label);
    }
    label.textContent = result.stale ? `~${dislikeCount}` : dislikeCount;
    label.dataset.vid = videoId;
    label.dataset.source = freshness;
    label.title = [
        `Return YouTube Dislike`,
        `👍 Likes: ${likeCount} (${_bytFormatFullCount(analytics.likes)})`,
        `👎 Dislikes: ${dislikeCount} (${_bytFormatFullCount(analytics.dislikes)})`,
        `📊 Approval: ${approval}`,
        `⚖️ Like/Dislike: ${ratio}`,
        analytics.dislikePct !== null ? `📉 Dislike share: ${analytics.dislikePct.toFixed(1)}%` : '',
        `🔌 API: ${apiStatus}`,
        `🗄️ Source: ${freshness}`
    ].filter(Boolean).join('\n');
    
    console.log('[BetterYT] Return Dislike: Injected dislike count:', dislikeCount, 'for video', videoId);
}

function initReturnDislike() {
    if (bytRYDInterval) return;
    if (!window.bytRYDStorageListenerBound) {
        window.bytRYDStorageListenerBound = true;
        chrome.storage.onChanged.addListener((changes, area) => {
            if (area === 'local' && changes.BetterYT_Accent) {
                bytRYDAccent = changes.BetterYT_Accent.newValue || 'red';
                _bytSetRYDTheme();
            }
        });
    }
    _bytRefreshRYDAccent();

    // Run once immediately then poll for navigation changes
    injectDislikeCount();
    bytRYDInterval = setInterval(() => {
        if (!BetterYT_Settings.returnDislike) return;
        const videoId = new URLSearchParams(location.search).get('v');
        const existingLabel = document.getElementById('byt-dislike-count');
        // Refresh if video changed or label missing
        if (!existingLabel || existingLabel.dataset.vid !== videoId) {
            if (existingLabel) existingLabel.remove();
            injectDislikeCount();
        }
    }, 3000);
}

function removeReturnDislike() {
    if (bytRYDInterval) { clearInterval(bytRYDInterval); bytRYDInterval = null; }
    const label = document.getElementById('byt-dislike-count');
    if (label) label.remove();
    const themeStyle = document.getElementById('byt-ryd-theme-style');
    if (themeStyle) themeStyle.remove();
    bytRYDCache.clear();
}

// --- Feature: Video Highlights ---
// Levenshtein similarity based clustering + rich interactive tooltips.
function _bytEditDistance(s1, s2) {
    s1 = s1.toLowerCase(); s2 = s2.toLowerCase();
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0) { costs[j] = j; }
            else if (j > 0) {
                let newValue = costs[j - 1];
                if (s1[i - 1] !== s2[j - 1]) newValue = Math.min(newValue, lastValue, costs[j]) + 1;
                costs[j - 1] = lastValue;
                lastValue = newValue;
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

function _bytSimilarity(s1, s2) {
    const longer = s1.length >= s2.length ? s1 : s2;
    const shorter = s1.length >= s2.length ? s2 : s1;
    const len = longer.length;
    if (len === 0) return 1.0;
    return (len - _bytEditDistance(longer, shorter)) / len;
}

function _bytNormalizeHighlightDesc(rawDesc) {
    return (rawDesc || '')
        .replace(/(?:https?|ftp):\/\/\S+/g, '')
        .replace(/\s+/g, ' ')
        .replace(/^[-\[\](){}.,:;!?/\\|]+|[-\[\](){}.,:;!?/\\|]+$/g, '')
        .trim();
}

function _bytFormatSecsToHMS(totalSecs) {
    const sec = Math.max(0, Math.floor(Number(totalSecs) || 0));
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${m}:${String(s).padStart(2, '0')}`;
}

function _bytBuildTimestampClusters(entries) {
    const sorted = entries.slice().sort((a, b) => a.secs - b.secs);
    const clusters = [];
    const timeMergeWindow = 4;
    sorted.forEach(entry => {
        let chosen = null;
        for (let i = clusters.length - 1; i >= 0; i--) {
            const cluster = clusters[i];
            if (entry.secs - cluster.secs > timeMergeWindow) break;
            const similar = cluster.descriptions.some(d => _bytSimilarity(d, entry.desc) > 0.82);
            if (Math.abs(entry.secs - cluster.secs) <= timeMergeWindow && similar) {
                chosen = cluster;
                break;
            }
        }
        if (!chosen) {
            chosen = {
                secs: entry.secs,
                descriptions: [],
                score: 0,
                mentions: 0
            };
            clusters.push(chosen);
        }
        chosen.mentions += 1;
        chosen.score += 1;
        if (!chosen.descriptions.some(d => _bytSimilarity(d, entry.desc) > 0.86)) {
            chosen.descriptions.push(entry.desc);
        }
        if (entry.secs < chosen.secs) chosen.secs = entry.secs;
    });
    return clusters;
}

function _bytCollectHighlightsFromChunks(textChunks) {
    const timeRegex = /\b(?:(\d{1,2}):)?([0-5]?\d):([0-5]\d)\b/g;
    const entries = [];
    textChunks.forEach(chunk => {
        const lines = (chunk || '').split('\n');
        lines.forEach(line => {
            let match;
            while ((match = timeRegex.exec(line)) !== null) {
                const raw = match[0];
                const secs = convertHighlightTime(raw);
                if (!Number.isFinite(secs) || secs <= 0) continue;
                const desc = _bytNormalizeHighlightDesc(line.replace(raw, ''));
                if (desc.length < 2) continue;
                entries.push({ secs, desc });
            }
            timeRegex.lastIndex = 0;
        });
    });
    return _bytBuildTimestampClusters(entries);
}

function _bytEnsureHighlightsStyle() {
    if (document.getElementById('byt-hl-style')) return;
    const style = document.createElement('style');
    style.id = 'byt-hl-style';
    style.textContent = `
        .byt-hl-mark{
            background:linear-gradient(180deg,#ffc14d,#ff9800);
            width:4px;height:100%;position:absolute;pointer-events:auto;cursor:pointer;border-radius:2px;
            transition:transform 0.15s ease,filter 0.15s ease,opacity 0.15s ease;opacity:.92;
        }
        .byt-hl-mark:hover{transform:scaleY(1.55);filter:brightness(1.08) drop-shadow(0 0 4px #ff9800);opacity:1;}
        .byt-hl-tooltip{
            position:absolute;bottom:28px;left:50%;transform:translateX(-50%);
            min-width:220px;max-width:360px;padding:10px 12px;border-radius:10px;
            color:#f8fafc;background:rgba(12,12,16,0.96);border:1px solid rgba(255,255,255,0.14);
            box-shadow:0 10px 28px rgba(0,0,0,.45);font-size:12px;line-height:1.45;
            opacity:0;visibility:hidden;pointer-events:none;transition:opacity .13s ease;
            white-space:normal;z-index:45;
        }
        .byt-hl-mark.byt-open-tooltip .byt-hl-tooltip{opacity:1;visibility:visible;}
        .byt-hl-tooltip-title{font-weight:700;color:#fbbf24;margin-bottom:6px;}
        .byt-hl-tooltip-meta{color:#cbd5e1;font-size:11px;margin-bottom:6px;}
        .byt-hl-tooltip-desc{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#e2e8f0;}
    `;
    document.head.appendChild(style);
}

function _bytCreateHighlightTooltip(cluster) {
    const tooltip = document.createElement('div');
    tooltip.className = 'byt-hl-tooltip';
    const title = document.createElement('div');
    title.className = 'byt-hl-tooltip-title';
    title.textContent = `Jump to ${_bytFormatSecsToHMS(cluster.secs)}`;
    tooltip.appendChild(title);

    const meta = document.createElement('div');
    meta.className = 'byt-hl-tooltip-meta';
    meta.textContent = `${cluster.mentions} mention${cluster.mentions === 1 ? '' : 's'} in comments/description`;
    tooltip.appendChild(meta);

    cluster.descriptions.slice(0, 3).forEach(desc => {
        const line = document.createElement('div');
        line.className = 'byt-hl-tooltip-desc';
        line.textContent = `• ${desc}`;
        tooltip.appendChild(line);
    });
    return tooltip;
}

function _bytBindHighlightTooltip(mark) {
    let hideTimer = null;
    const open = () => {
        if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
        mark.classList.add('byt-open-tooltip');
    };
    const close = () => {
        hideTimer = setTimeout(() => mark.classList.remove('byt-open-tooltip'), 120);
    };
    mark.addEventListener('mouseenter', open);
    mark.addEventListener('mouseleave', close);
    mark.addEventListener('focus', open);
    mark.addEventListener('blur', close);
}

const BYT_HL_MAX_MARKERS = 20;
const BYT_HL_MIN_COMMENT_NODES = 3;
let bytHighlightsInterval;
let bytHighlightsObserver = null;
let bytHighlightsLastVideo = null;

function _bytForceCommentsLoad() {
    const commentsContainer = document.querySelector('ytd-comments#comments');
    if (!commentsContainer) return false;
    if (!commentsContainer.bytForcedLoad) {
        commentsContainer.bytForcedLoad = true;
        commentsContainer.setAttribute('style', 'position:absolute;top:0;z-index:-999;');
        window.dispatchEvent(new Event('scroll'));
        setTimeout(() => commentsContainer.removeAttribute('style'), 1800);
    }
    return true;
}

function _bytSetupHighlightsCommentObserver() {
    const commentsContainer = document.querySelector('ytd-comments#comments');
    if (!commentsContainer) return;
    if (bytHighlightsObserver) bytHighlightsObserver.disconnect();
    bytHighlightsObserver = new MutationObserver(() => {
        const maybeNeedRender = !document.getElementById('byt-highlights-wrapper');
        if (maybeNeedRender) setTimeout(() => initHighlights(), 200);
    });
    bytHighlightsObserver.observe(commentsContainer, { childList: true, subtree: true });
}

function initHighlights() {
    if (bytHighlightsInterval) clearInterval(bytHighlightsInterval);
    _bytEnsureHighlightsStyle();
    _bytSetupHighlightsCommentObserver();
    bytHighlightsInterval = setInterval(() => {
        if (!BetterYT_Settings.videoHighlights) return;
        if (window.location.pathname !== '/watch') return;

        const progressBar = document.querySelector('#ytd-player .ytp-progress-bar');
        if (!progressBar) return;
        const videoId = new URLSearchParams(location.search).get('v');
        const existing = document.getElementById('byt-highlights-wrapper');
        if (existing && existing.dataset.vid === videoId) return;
        if (existing) existing.remove();
        bytHighlightsLastVideo = videoId;

        const commentsSection = document.querySelectorAll('ytd-comments#comments #sections #contents #content-text');
        if (commentsSection.length < BYT_HL_MIN_COMMENT_NODES) {
            _bytForceCommentsLoad();
            return;
        }

        const descElement = document.querySelector('#description-inline-expander');
        const textChunks = [];
        if (descElement) textChunks.push(descElement.textContent);
        commentsSection.forEach(c => textChunks.push(c.textContent));

        const timestampClusters = _bytCollectHighlightsFromChunks(textChunks);

        const vidLengthStr = document.querySelector('.ytp-time-duration')?.textContent;
        if (!vidLengthStr || timestampClusters.length === 0) return;
        const totalSecs = convertHighlightTime(vidLengthStr);
        if (totalSecs === 0) return;

        const wrapper = document.createElement('div');
        wrapper.id = 'byt-highlights-wrapper';
        wrapper.dataset.vid = videoId || '';
        wrapper.style.cssText = 'position:absolute;width:100%;height:100%;top:0;pointer-events:none;z-index:40;';

        const topClusters = timestampClusters
            .filter(c => c.secs < totalSecs)
            .sort((a, b) => b.score - a.score || a.secs - b.secs)
            .slice(0, BYT_HL_MAX_MARKERS)
            .sort((a, b) => a.secs - b.secs);

        topClusters.forEach(cluster => {
            const pos = (cluster.secs / totalSecs) * 100;
            if (pos > 100) return;

            const mark = document.createElement('div');
            mark.className = 'byt-hl-mark';
            mark.style.left = pos.toFixed(2) + '%';
            mark.setAttribute('role', 'button');
            mark.setAttribute('tabindex', '0');
            mark.setAttribute('aria-label', `Highlight at ${_bytFormatSecsToHMS(cluster.secs)}`);

            const tt = _bytCreateHighlightTooltip(cluster);
            mark.appendChild(tt);
            _bytBindHighlightTooltip(mark);

            mark.addEventListener('click', e => {
                e.stopPropagation();
                const player = document.getElementById('movie_player');
                if (player && player.seekTo) player.seekTo(Number(cluster.secs), true);
            });
            mark.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const player = document.getElementById('movie_player');
                    if (player && player.seekTo) player.seekTo(Number(cluster.secs), true);
                }
            });
            wrapper.appendChild(mark);
        });
        if (wrapper.childElementCount > 0) progressBar.appendChild(wrapper);
    }, 5000);

    // Reset when navigating to a new video
    if (!window.bytHighlightsNavBound) {
        window.bytHighlightsNavBound = true;
        document.addEventListener('yt-navigate-finish', () => {
            const old = document.getElementById('byt-highlights-wrapper');
            if (old) old.remove();
            const commentsContainer = document.querySelector('ytd-comments#comments');
            if (commentsContainer) commentsContainer.bytForcedLoad = false;
            bytHighlightsLastVideo = null;
            _bytSetupHighlightsCommentObserver();
        });
    }
}

function convertHighlightTime(timeStr) {
    const parts = timeStr.split(':').reverse();
    let secs = 0;
    if (parts[0]) secs += parseInt(parts[0]);
    if (parts[1]) secs += parseInt(parts[1]) * 60;
    if (parts[2]) secs += parseInt(parts[2]) * 3600;
    return secs;
}

function removeHighlights() {
    if (bytHighlightsInterval) clearInterval(bytHighlightsInterval);
    bytHighlightsInterval = null;
    const wrapper = document.getElementById('byt-highlights-wrapper');
    if (wrapper) wrapper.remove();
    if (bytHighlightsObserver) {
        bytHighlightsObserver.disconnect();
        bytHighlightsObserver = null;
    }
}

// --- Feature: Hide End Cards ---
function initHideEndCards() {
    let style = document.getElementById('byt-endcards-style');
    if (!style) {
        style = document.createElement('style');
        style.id = 'byt-endcards-style';
        style.textContent = `.ytp-ce-element, .ytp-endscreen-element, .ytp-ce-covering-overlay { display: none !important; }`;
        document.head.appendChild(style);
    }
}
function removeHideEndCards() {
    const el = document.getElementById('byt-endcards-style');
    if (el) el.remove();
}

// --- Feature: Hide Annotations ---
function initHideAnnotations() {
    let style = document.getElementById('byt-annotations-style');
    if (!style) {
        style = document.createElement('style');
        style.id = 'byt-annotations-style';
        style.textContent = `.iv-video-annotations, .iv-card, .iv-branding, .ytp-cards-teaser { display: none !important; }`;
        document.head.appendChild(style);
    }
}
function removeHideAnnotations() {
    const el = document.getElementById('byt-annotations-style');
    if (el) el.remove();
}

// --- Feature: Playback Speed Buttons ---
const BYT_SPEED_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

function _bytInjectSpeedBar() {
    if (!BetterYT_Settings.playbackSpeed) return;
    if (document.getElementById('byt-speed-bar')) return;
    const player = document.getElementById('ytd-player');
    if (!player) return;

    const bar = document.createElement('div');
    bar.id = 'byt-speed-bar';
    bar.style.cssText = 'position:absolute;top:8px;right:12px;z-index:9999;display:flex;gap:4px;pointer-events:all;';

    BYT_SPEED_RATES.forEach(rate => {
        const btn = document.createElement('button');
        btn.textContent = rate + '×';
        btn.dataset.rate = rate;
        btn.style.cssText = 'background:rgba(0,0,0,0.6);color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:2px 7px;font-size:11px;font-weight:700;cursor:pointer;backdrop-filter:blur(4px);transition:background 0.15s;';
        btn.onmouseenter = () => btn.style.background = 'rgba(255,255,255,0.2)';
        btn.onmouseleave = () => { btn.style.background = btn.classList.contains('byt-speed-active') ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.6)'; };
        btn.onclick = () => {
            const video = document.querySelector('video');
            if (video) video.playbackRate = rate;
            bar.querySelectorAll('button').forEach(b => {
                b.classList.remove('byt-speed-active');
                b.style.background = 'rgba(0,0,0,0.6)';
                b.style.borderColor = 'rgba(255,255,255,0.2)';
            });
            btn.classList.add('byt-speed-active');
            btn.style.background = 'rgba(255,255,255,0.25)';
            btn.style.borderColor = 'rgba(255,255,255,0.6)';
        };
        if (rate === 1) { btn.classList.add('byt-speed-active'); btn.style.background = 'rgba(255,255,255,0.25)'; btn.style.borderColor = 'rgba(255,255,255,0.6)'; }
        bar.appendChild(btn);
    });

    player.style.position = 'relative';
    player.appendChild(bar);
}

function initPlaybackSpeed() {
    if (window.bytSpeedObserver) return;
    window.bytSpeedObserver = new MutationObserver(() => _bytInjectSpeedBar());
    window.bytSpeedObserver.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('yt-navigate-finish', () => {
        const old = document.getElementById('byt-speed-bar');
        if (old) old.remove();
        setTimeout(_bytInjectSpeedBar, 800);
    });
    setTimeout(_bytInjectSpeedBar, 1000);
}
function removePlaybackSpeed() {
    if (window.bytSpeedObserver) { window.bytSpeedObserver.disconnect(); window.bytSpeedObserver = null; }
    const el = document.getElementById('byt-speed-bar');
    if (el) el.remove();
}

// --- Feature: Video Filters ---
function _bytApplyVideoFilter() {
    const video = document.querySelector('video');
    if (!video) return;
    if (!BetterYT_Settings.videoFilters) {
        video.style.filter = '';
        return;
    }
    const b = BetterYT_Settings.videoFilterBrightness ?? 100;
    const c = BetterYT_Settings.videoFilterContrast ?? 100;
    const s = BetterYT_Settings.videoFilterSaturation ?? 100;
    video.style.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%)`;
}

function initVideoFilters() {
    if (window.bytVideoFiltersInitialized) return;
    window.bytVideoFiltersInitialized = true;
    _bytApplyVideoFilter();
    document.addEventListener('yt-navigate-finish', _bytApplyVideoFilter);
    document.addEventListener('canplay', (e) => {
        if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'video') _bytApplyVideoFilter();
    }, true);
    chrome.storage.onChanged.addListener((changes) => {
        if (changes.BetterYT_Settings) _bytApplyVideoFilter();
    });
}
function removeVideoFilters() {
    const video = document.querySelector('video');
    if (video) video.style.filter = '';
    window.bytVideoFiltersInitialized = false;
}

// --- Feature: Loop Button ---
function _bytInjectLoopBtn() {
    if (!BetterYT_Settings.loopButton) return;
    const rightControls = document.querySelector('.ytp-right-controls');
    if (!rightControls || document.getElementById('byt-loop-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'byt-loop-btn';
    btn.className = 'ytp-button';
    btn.title = 'Toggle Loop Video';
    btn.style.cssText = 'display:flex;align-items:center;justify-content:center;width:40px;height:100%;padding:0;';
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>`;
    
    const updateState = () => {
        const video = document.querySelector('video');
        if (!video) return;
        btn.style.color = video.loop ? 'var(--yt-spec-brand-text-button)' : '#fff';
    };

    btn.onclick = () => {
        const video = document.querySelector('video');
        if (!video) return;
        video.loop = !video.loop;
        updateState();
    };
    
    // Insert before autoplay/fullscreen only if that node is still a *direct child* of rightControls.
    // YouTube re-renders the player often; a stale reference causes insertBefore NotFoundError.
    const ref = rightControls.querySelector('.ytp-autonav-toggle-button-container') || rightControls.querySelector('.ytp-fullscreen-button');
    if (ref && ref.parentNode === rightControls) {
        rightControls.insertBefore(btn, ref);
    } else {
        rightControls.prepend(btn);
    }
    
    updateState();
}

function initLoopButton() {
    if (window.bytLoopObserver) return;
    window.bytLoopObserver = new MutationObserver(() => _bytInjectLoopBtn());
    window.bytLoopObserver.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('yt-navigate-finish', () => {
        const old = document.getElementById('byt-loop-btn');
        if (old) old.remove();
        setTimeout(_bytInjectLoopBtn, 800);
    });
    setTimeout(_bytInjectLoopBtn, 1000);
}
function removeLoopButton() {
    if (window.bytLoopObserver) { window.bytLoopObserver.disconnect(); window.bytLoopObserver = null; }
    const el = document.getElementById('byt-loop-btn');
    if (el) el.remove();
}

// --- Feature: Scroll to Top ---
function initScrollToTop() {
    if (window.bytScrollToTopInitialized) return;
    window.bytScrollToTopInitialized = true;

    const btn = document.createElement('button');
    btn.id = 'byt-scroll-top';
    btn.title = 'Scroll to Top';
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg>`;
    // Get accent color from storage and apply it
    chrome.storage.local.get(['BetterYT_Accent'], (res) => {
        const accent = res.BetterYT_Accent || 'red';
        const colors = {
            red: '#ff0000', blue: '#3ea6ff', green: '#1f8c35', 
            purple: '#b426ff', pink: '#ff2692', orange: '#ff8800',
            emerald: '#10b981', amber: '#f59e0b', cyan: '#06b6d4', gold: '#eab308'
        };
        const accentColor = colors[accent] || '#ff0000';
        
        btn.style.cssText = `
            position: fixed; bottom: 30px; right: 30px; z-index: 9999;
            width: 48px; height: 48px;
            background: ${accentColor};
            color: #fff;
            border: none; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; opacity: 0; pointer-events: none;
            transition: opacity 0.3s, transform 0.2s, background 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 16px ${accentColor}66, 0 2px 8px rgba(0,0,0,0.3);
        `;
    });
    btn.onmouseenter = () => btn.style.transform = 'translateY(-4px)';
    btn.onmouseleave = () => btn.style.transform = 'translateY(0)';
    btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.appendChild(btn);

    window.bytScrollListener = () => {
        if (!BetterYT_Settings.scrollToTop) return;
        const btn = document.getElementById('byt-scroll-top');
        if (btn) {
            if (window.scrollY > 500) {
                btn.style.opacity = '1'; btn.style.pointerEvents = 'auto';
            } else {
                btn.style.opacity = '0'; btn.style.pointerEvents = 'none';
            }
        }
    };
    window.addEventListener('scroll', window.bytScrollListener);
}
function removeScrollToTop() {
    if (window.bytScrollListener) {
        window.removeEventListener('scroll', window.bytScrollListener);
        window.bytScrollListener = null;
    }
    const el = document.getElementById('byt-scroll-top');
    if (el) el.remove();
    window.bytScrollToTopInitialized = false;
}

// --- Feature: Reverse Playlist ---
function _bytInjectReverseBtn() {
    if (!BetterYT_Settings.reversePlaylist) return;
    if (window.location.pathname !== '/watch' || !window.location.search.includes('list=')) return;
    
    const panel = document.querySelector('ytd-playlist-panel-renderer');
    if (!panel || document.getElementById('byt-reverse-playlist')) return;
    const header = panel.querySelector('#header-contents') || panel.querySelector('.header');
    if (!header) return;

    const btn = document.createElement('button');
    btn.id = 'byt-reverse-playlist';
    btn.title = 'Reverse Playlist Order';
    btn.style.cssText = 'background:transparent;border:1px solid var(--yt-spec-10-percent-layer);color:var(--yt-spec-text-secondary);padding:4px 8px;border-radius:16px;font-size:12px;cursor:pointer;margin-left:auto;display:flex;align-items:center;gap:4px;';
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z"/></svg> Reverse`;

    btn.onclick = () => {
        const container = panel.querySelector('#items.ytd-playlist-panel-renderer');
        if (!container) return;
        const items = Array.from(container.children);
        items.reverse().forEach(item => container.appendChild(item));
        
        // Ensure scroll keeps active element in view
        const active = container.querySelector('[selected]');
        if (active && active.scrollIntoView) {
            setTimeout(() => active.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
        }
    };
    
    header.appendChild(btn);
}

function initReversePlaylist() {
    if (window.bytReverseObserver) return;
    window.bytReverseObserver = new MutationObserver(() => _bytInjectReverseBtn());
    window.bytReverseObserver.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('yt-navigate-finish', () => {
        const old = document.getElementById('byt-reverse-playlist');
        if (old) old.remove();
        setTimeout(_bytInjectReverseBtn, 1000);
    });
}
function removeReversePlaylist() {
    if (window.bytReverseObserver) { window.bytReverseObserver.disconnect(); window.bytReverseObserver = null; }
    const el = document.getElementById('byt-reverse-playlist');
    if (el) el.remove();
}

// --- Feature: Power User Shortcuts ---
function _bytGlobalKeydown(e) {
    if (!BetterYT_Settings.customShortcuts) return;
    // Ignore if typing in input/textarea/editable
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable) return;

    if (e.shiftKey && !e.ctrlKey && !e.altKey) {
        let matched = false;
        switch(e.code) {
            case 'KeyS': // Screenshot
                e.preventDefault();
                const btnS = document.getElementById('byt-screenshot-btn');
                if (btnS) btnS.click();
                matched = true;
                break;
            case 'KeyL': // Loop
                e.preventDefault();
                const videoL = document.querySelector('video');
                if (videoL) {
                    videoL.loop = !videoL.loop;
                    const btnL = document.getElementById('byt-loop-btn');
                    if (btnL) btnL.style.color = videoL.loop ? 'var(--yt-spec-brand-text-button)' : '#fff';
                }
                matched = true;
                break;
            case 'KeyR': // Rotate
                e.preventDefault();
                const videoR = document.querySelector('video');
                if (videoR) {
                    let rot = parseInt(videoR.dataset.bytRotation || '0');
                    rot = (rot + 90) % 360;
                    videoR.dataset.bytRotation = rot;
                    const flip = videoR.dataset.bytFlip === 'true' ? 'scaleX(-1)' : '';
                    videoR.style.transform = `rotate(${rot}deg) ${flip}`;
                }
                matched = true;
                break;
            case 'KeyF': // Flip Horizontal
                e.preventDefault();
                const videoF = document.querySelector('video');
                if (videoF) {
                    const isFlipped = videoF.dataset.bytFlip === 'true';
                    videoF.dataset.bytFlip = !isFlipped;
                    const rot = videoF.dataset.bytRotation || '0';
                    videoF.style.transform = `rotate(${rot}deg) ${!isFlipped ? 'scaleX(-1)' : ''}`;
                }
                matched = true;
                break;
            case 'KeyP': // Picture in Picture
                e.preventDefault();
                const videoP = document.querySelector('video');
                if (videoP && typeof videoP.requestPictureInPicture === 'function') {
                    if (document.pictureInPictureElement) document.exitPictureInPicture();
                    else videoP.requestPictureInPicture();
                }
                matched = true;
                break;
            case 'ArrowRight': // Custom Skip Forward
                e.preventDefault();
                const vRight = document.querySelector('video');
                if (vRight) vRight.currentTime += (BetterYT_Settings.skipSeconds || 10);
                matched = true;
                break;
            case 'ArrowLeft': // Custom Skip Back
                e.preventDefault();
                const vLeft = document.querySelector('video');
                const bSkip = BetterYT_Settings.skipSecondsBack || BetterYT_Settings.skipSeconds || 10;
                if (vLeft) vLeft.currentTime -= bSkip;
                matched = true;
                break;
        }
    }
}

function initShortcuts() {
    if (window.bytShortcutsBound) return;
    window.bytShortcutsBound = true;
    document.addEventListener('keydown', _bytGlobalKeydown, true);
}
function removeShortcuts() {
    if (window.bytShortcutsBound) {
        document.removeEventListener('keydown', _bytGlobalKeydown, true);
        window.bytShortcutsBound = false;
    }
}

// --- Feature: Auto-Pause Background ---
function _bytVisibilityHandler() {
    if (!BetterYT_Settings.pauseBackground) return;
    const video = document.querySelector('video');
    if (!video) return;

    if (document.visibilityState === 'hidden') {
        if (!video.paused) {
            video.pause();
            window.bytWasPlaying = true;
        }
    } else {
        if (window.bytWasPlaying && video.paused) {
            video.play().catch(()=>{});
            window.bytWasPlaying = false;
        }
    }
}

function initPauseBackground() {
    if (window.bytVisibilityBound) return;
    window.bytVisibilityBound = true;
    document.addEventListener('visibilitychange', _bytVisibilityHandler);
}
function removePauseBackground() {
    if (window.bytVisibilityBound) {
        document.removeEventListener('visibilitychange', _bytVisibilityHandler);
        window.bytVisibilityBound = false;
        window.bytWasPlaying = false;
    }
}

// --- Feature: Cinema Mode ---
function _bytCinemaModeCheck() {
    if (!BetterYT_Settings.cinemaMode) return;
    const isTheater = document.querySelector('ytd-watch-flexy[theater]');
    let style = document.getElementById('byt-cinema-style');
    
    if (isTheater) {
        if (!style) {
            style = document.createElement('style');
            style.id = 'byt-cinema-style';
            style.textContent = `
                ytd-app { background: #000 !important; }
                #page-manager { background: #000 !important; }
            `;
            document.head.appendChild(style);
        }
    } else {
        if (style) style.remove();
    }
}

function initCinemaMode() {
    if (window.bytCinemaObserver) return;
    window.bytCinemaObserver = new MutationObserver(_bytCinemaModeCheck);
    const watchFlexy = document.querySelector('ytd-watch-flexy');
    if (watchFlexy) {
        window.bytCinemaObserver.observe(watchFlexy, { attributes: true, attributeFilter: ['theater'] });
    } else {
        window.bytCinemaObserver.observe(document.body, { childList: true, subtree: true });
    }
    _bytCinemaModeCheck();
}
function removeCinemaMode() {
    if (window.bytCinemaObserver) { window.bytCinemaObserver.disconnect(); window.bytCinemaObserver = null; }
    const style = document.getElementById('byt-cinema-style');
    if (style) style.remove();
}

// --- Feature: Disable AutoPlay ---
function _bytAutoPlayCheck() {
    if (!BetterYT_Settings.autoPlay) return;
    const btn = document.querySelector('.ytp-autonav-toggle-button');
    if (btn && btn.getAttribute('aria-checked') === 'true') {
        btn.click(); // Turn it off
    }
}

function initAutoPlayDisable() {
    if (window.bytAutoPlayObserver) return;
    window.bytAutoPlayObserver = new MutationObserver(_bytAutoPlayCheck);
    window.bytAutoPlayObserver.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('yt-navigate-finish', _bytAutoPlayCheck);
    setTimeout(_bytAutoPlayCheck, 1500);
}
function removeAutoPlayDisable() {
    if (window.bytAutoPlayObserver) { window.bytAutoPlayObserver.disconnect(); window.bytAutoPlayObserver = null; }
    document.removeEventListener('yt-navigate-finish', _bytAutoPlayCheck);
}

// --- Feature: Auto PiP Mode ---
function _bytPipVisibilityHandler() {
    if (!BetterYT_Settings.pipMode) return;
    const video = document.querySelector('video');
    if (!video || typeof video.requestPictureInPicture !== 'function') return;

    if (document.visibilityState === 'hidden') {
        if (!video.paused && !document.pictureInPictureElement) {
            video.requestPictureInPicture().catch(()=>{});
        }
    } else {
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture().catch(()=>{});
        }
    }
}

function initPipMode() {
    if (window.bytPipBound) return;
    window.bytPipBound = true;
    document.addEventListener('visibilitychange', _bytPipVisibilityHandler);
}
function removePipMode() {
    if (window.bytPipBound) {
        document.removeEventListener('visibilitychange', _bytPipVisibilityHandler);
        window.bytPipBound = false;
        if (document.pictureInPictureElement) document.exitPictureInPicture().catch(()=>{});
    }
}

// --- Feature: Strict Ad-Blocker (Pro) ---
function _bytStrictAdCheck() {
    if (!BetterYT_Settings.strictAdBlock) return;
    const adSelectors = [
        'ytd-ad-slot-renderer', 
        '.ytp-ad-module', 
        'ytd-in-feed-ad-layout-renderer',
        'ytd-banner-promo-renderer',
        '.ytd-promoted-sparkles-web-renderer',
        '.video-ads'
    ];
    let removed = false;
    adSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => { el.remove(); removed = true; });
    });
    
    // Also skip skip-buttons instantly if found
    const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern');
    if (skipBtn) { skipBtn.click(); removed = true; }
    
    if (removed) console.log('[BetterYT] Strict AdBlock removed ad elements.');
}

function initStrictAdBlock() {
    if (window.bytStrictAdObserver) return;
    window.bytStrictAdObserver = new MutationObserver(_bytStrictAdCheck);
    window.bytStrictAdObserver.observe(document.body, { childList: true, subtree: true });
    _bytStrictAdCheck();
}
function removeStrictAdBlock() {
    if (window.bytStrictAdObserver) { window.bytStrictAdObserver.disconnect(); window.bytStrictAdObserver = null; }
}

// --- Feature: Nonstop Playback ---
function _bytNonstopCheck() {
    if (!BetterYT_Settings.nonstopAudio) return;
    // Look for "Video paused. Continue watching?"
    const dialog = document.querySelector('yt-confirm-dialog-renderer[dialog-messages~="watching"]');
    if (dialog) {
        const btn = dialog.querySelector('#confirm-button, button[aria-label="Yes"]');
        if (btn) {
            btn.click();
            console.log('[BetterYT] Bypassed continue watching prompt.');
        }
    }
}

function initNonstopAudio() {
    if (window.bytNonstopInterval) return;
    window.bytNonstopInterval = setInterval(_bytNonstopCheck, 5000);
}
function removeNonstopAudio() {
    if (window.bytNonstopInterval) { clearInterval(window.bytNonstopInterval); window.bytNonstopInterval = null; }
}

// --- Feature: Audio-Only Mode ---
function _bytInjectAudioOnlyFlag() {
    if (BetterYT_Settings.audioOnly) {
        document.documentElement.dataset.bytAudioOnly = 'true';
    } else {
        document.documentElement.removeAttribute('data-byt-audio-only');
    }
}

function initAudioOnly() {
    _bytInjectAudioOnlyFlag();
    // Assuming assets/audio_only.js is already running as web_accessible_resource,
    // we just need to set the config via dataset so it knows to block streams.
    // If we need to inject it:
    if (!document.getElementById('byt-audio-only-script')) {
        const s = document.createElement('script');
        s.id = 'byt-audio-only-script';
        s.src = chrome.runtime.getURL('assets/audio_only.js');
        s.onload = () => s.remove();
        (document.head || document.documentElement).appendChild(s);
    }
}
function removeAudioOnly() {
    document.documentElement.dataset.bytAudioOnly = 'false';
}



// --- Feature: Watch Time Tracker ---
function _bytWatchTimeTick() {
    if (!BetterYT_Settings.watchTimeTracker) return;
    const video = document.querySelector('video');
    if (video && !video.paused && video.currentTime > 0) {
        let videoId = new URLSearchParams(window.location.search).get('v');
        if (!videoId) return;
        let title = document.title.replace(' - YouTube', '').trim();
        _bytSafeSendMessage({
            action: 'storeWatchTime',
            data: { vidID: videoId, title: title, watchTime: 60 }
        });
    }
}

function initWatchTimeTracker() {
    if (window.bytWatchInterval) return;
    window.bytWatchInterval = setInterval(_bytWatchTimeTick, 60000); // exactly 60 seconds
}
function removeWatchTimeTracker() {
    if (window.bytWatchInterval) { clearInterval(window.bytWatchInterval); window.bytWatchInterval = null; }
}

// --- Feature: Random Video ---
const _bytRandomCache = {
    channelId: null,
    ids: [],
    fetchedAt: 0
};

function _bytExtractChannelId() {
    const meta = document.querySelector('meta[itemprop="channelId"]');
    if (meta && /^UC[\w-]{20,}$/.test(meta.content || '')) return meta.content;
    const canonical = document.querySelector('link[rel="canonical"]')?.href || '';
    let m = canonical.match(/\/channel\/([^/?]+)/);
    if (m) return m[1];
    m = window.location.pathname.match(/\/channel\/([^/?]+)/);
    if (m) return m[1];
    const ownerLink = document.querySelector('ytd-video-owner-renderer a[href*="/channel/"], #owner a[href*="/channel/"]')?.href || '';
    m = ownerLink.match(/\/channel\/([^/?]+)/);
    if (m) return m[1];
    return null;
}

async function _bytFetchChannelVideoIds(channelId) {
    const isFresh = _bytRandomCache.channelId === channelId && (Date.now() - _bytRandomCache.fetchedAt) < 5 * 60 * 1000;
    if (isFresh && _bytRandomCache.ids.length) return _bytRandomCache.ids;
    const urls = [
        `/channel/${channelId}/videos`,
        `/channel/${channelId}/streams`,
        `/channel/${channelId}/shorts`
    ];
    let merged = [];
    for (let attempt = 0; attempt < 2; attempt++) {
        for (const url of urls) {
            try {
                const html = await fetch(url, { cache: 'no-store' }).then(r => r.text());
                const ids = [...new Set(Array.from(html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)).map(m => m[1]))];
                merged = merged.concat(ids);
            } catch (e) {}
        }
        merged = [...new Set(merged)];
        if (merged.length > 4) break;
    }
    _bytRandomCache.channelId = channelId;
    _bytRandomCache.ids = merged;
    _bytRandomCache.fetchedAt = Date.now();
    return merged;
}

function _bytRandomChoice() {
    if (!BetterYT_Settings.randomVideo) return;
    const currentVideoId = new URLSearchParams(window.location.search).get('v');
    const links = Array.from(document.querySelectorAll('a#video-title'))
        .filter(a => !!a.href && a.href.includes('/watch') && !a.href.includes('start_radio'))
        .map(a => new URL(a.href, location.origin).searchParams.get('v'))
        .filter(Boolean);
    const uniqueOnPage = [...new Set(links)].filter(v => v !== currentVideoId);
    if (uniqueOnPage.length > 0) {
        const rand = uniqueOnPage[Math.floor(Math.random() * uniqueOnPage.length)];
        window.location.href = `/watch?v=${rand}`;
        return Promise.resolve(true);
    }
    const channelId = _bytExtractChannelId();
    if (!channelId) return Promise.resolve(false);
    return _bytFetchChannelVideoIds(channelId).then(ids => {
        const pool = ids.filter(v => v !== currentVideoId);
        if (!pool.length) return false;
        const rand = pool[Math.floor(Math.random() * pool.length)];
        window.location.href = `/watch?v=${rand}`;
        return true;
    });
}

function _bytInjectRandomBtn() {
    if (!BetterYT_Settings.randomVideo) return;
    if (window.location.pathname !== '/watch') return;
    if (document.getElementById('byt-random-sub-btn')) return;

    const subscribeHost = document.querySelector('#subscribe-button');
    if (!subscribeHost) return;

    const subscribeBtn = subscribeHost.querySelector('button');
    if (!subscribeBtn || !subscribeBtn.parentElement) return;

    // Clone native subscribe button so the random button matches YT styling.
    const randomBtn = subscribeBtn.cloneNode(true);
    randomBtn.id = 'byt-random-sub-btn';
    randomBtn.title = 'Play Random Video';
    randomBtn.setAttribute('aria-label', 'Play Random Video');
    randomBtn.style.marginLeft = '8px';

    const labelNode = randomBtn.querySelector('.yt-core-attributed-string, .cbox, .yt-spec-button-shape-next__button-text-content, span');
    if (labelNode) labelNode.textContent = 'Random';
    else randomBtn.textContent = 'Random';

    randomBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const original = labelNode ? labelNode.textContent : randomBtn.textContent;
        if (labelNode) labelNode.textContent = 'Picking...';
        else randomBtn.textContent = 'Picking...';
        Promise.resolve(_bytRandomChoice()).finally(() => {
            setTimeout(() => {
                if (labelNode) labelNode.textContent = original || 'Random';
                else randomBtn.textContent = original || 'Random';
            }, 1200);
        });
    });

    subscribeBtn.parentElement.appendChild(randomBtn);
}

function initRandomVideo() {
    if (window.bytRandomObserver) return;
    window.bytRandomObserver = new MutationObserver(() => _bytInjectRandomBtn());
    window.bytRandomObserver.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('yt-navigate-finish', () => {
        const old = document.getElementById('byt-random-btn');
        if (old) old.remove();
        setTimeout(_bytInjectRandomBtn, 1000);
    });
}
function removeRandomVideo() {
    if (window.bytRandomObserver) { window.bytRandomObserver.disconnect(); window.bytRandomObserver = null; }
    const el = document.getElementById('byt-random-btn');
    if (el) el.remove();
    const subEl = document.getElementById('byt-random-sub-btn');
    if (subEl) subEl.remove();
}

// --- Feature: Highlight Mentions ---
function initHighlightMentions() {
    if (document.getElementById('byt-highlight-mentions')) return;
    const style = document.createElement('style');
    style.id = 'byt-highlight-mentions';
    // Style youtube native mentions
    style.textContent = `
        ytd-comment-renderer a.yt-core-attributed-string__link--call-to-action-color {
            background-color: var(--yt-spec-brand-background-secondary);
            color: var(--yt-spec-text-primary);
            padding: 0 4px;
            border-radius: 4px;
            font-weight: 500;
        }
    `;
    document.head.appendChild(style);
}
function removeHighlightMentions() {
    const el = document.getElementById('byt-highlight-mentions');
    if (el) el.remove();
}

// --- Feature: Mouse Wheel Volume Control ---
function _bytMouseVolumeHandler(e) {
    if (!BetterYT_Settings.mouseVolume) return;
    const video = document.querySelector('video');
    if (!video) return;

    e.preventDefault();
    e.stopImmediatePropagation();
    
    let vol = video.volume;
    if (e.deltaY < 0) { // scroll up
        vol = Math.min(1, vol + 0.05);
    } else { // scroll down
        vol = Math.max(0, vol - 0.05);
    }
    
    video.volume = vol;
    video.muted = (vol === 0);
    
    // Attempt to show native YT volume popup
    const ytVolumeBadge = document.querySelector('.ytp-volume-panel');
    if (ytVolumeBadge) {
        ytVolumeBadge.setAttribute('aria-valuenow', Math.round(vol * 100).toString());
        // Simulating the visual change is difficult without dispatching correct YT internal events,
        // but setting actual volume property works universally.
    }
}

function _bytAttachMouseVolume() {
    if (!BetterYT_Settings.mouseVolume) return;
    const container = document.querySelector('.html5-video-player');
    if (container && !container.dataset.bytMouseVolBound) {
        container.dataset.bytMouseVolBound = 'true';
        container.addEventListener('wheel', _bytMouseVolumeHandler, { passive: false });
    }
}

function initMouseVolume() {
    if (window.bytMouseVolObserver) return;
    window.bytMouseVolObserver = new MutationObserver(() => _bytAttachMouseVolume());
    window.bytMouseVolObserver.observe(document.body, { childList: true, subtree: true });
    _bytAttachMouseVolume();
}
function removeMouseVolume() {
    if (window.bytMouseVolObserver) { window.bytMouseVolObserver.disconnect(); window.bytMouseVolObserver = null; }
    const container = document.querySelector('.html5-video-player');
    if (container && container.dataset.bytMouseVolBound) {
        container.removeEventListener('wheel', _bytMouseVolumeHandler);
        delete container.dataset.bytMouseVolBound;
    }
}

// --- Feature: SponsorBlock Integration (legacy; kept for reference, disabled) ---
async function _bytFetchSponsorSegs(videoId) {
    try {
    } catch(e) { 
        console.warn('[BetterYT] SponsorBlock fetch error:', e.message);
        return []; 
    }
}

function _bytSponsorTimeUpdate() {
    if (!BetterYT_Settings.sponsorBlock || !window.bytSponsorSegments) return;
    const video = document.querySelector('video');
    if (!video) return;
    
    const t = video.currentTime;
    let foundSeg = null;
    for (const seg of window.bytSponsorSegments) {
        if (t >= seg.segment[0] && t < seg.segment[1]) {
            foundSeg = seg; break;
        }
    }
    
    const btn = document.getElementById('byt-sponsor-skip-btn');
    if (foundSeg) {
        if (BetterYT_Settings.autoSkipSponsors) {
            video.currentTime = foundSeg.segment[1];
            console.log(`[BetterYT SponsorBlock] Auto-skipped segment ${foundSeg.category}`);
        } else {
            // Show skip button overlay
            if (!btn) {
                const b = document.createElement('button');
                b.id = 'byt-sponsor-skip-btn';
                b.textContent = 'Skip Segment ➔';
                b.style.cssText = 'position:absolute; bottom:60px; right:20px; z-index:9999; background:var(--yt-spec-brand-background-solid,#f00); color:#fff; border:none; padding:10px 16px; border-radius:4px; font-weight:bold; cursor:pointer; opacity:0.9; box-shadow:0 2px 10px rgba(0,0,0,0.5); font-size:14px;';
                b.onclick = () => { video.currentTime = foundSeg.segment[1]; };
                const player = document.querySelector('.html5-video-player');
                if (player) player.appendChild(b);
            }
        }
    } else {
        if (btn) btn.remove();
    }
}

async function _bytInitSponsorVideo() {
    if (!BetterYT_Settings.sponsorBlock) return;
    const videoId = new URLSearchParams(window.location.search).get('v');
    if (!videoId) return;
    
    window.bytSponsorSegments = await _bytFetchSponsorSegs(videoId);
    const video = document.querySelector('video');
    if (video && !video.dataset.bytSponsBound) {
        video.dataset.bytSponsBound = 'true';
        video.addEventListener('timeupdate', _bytSponsorTimeUpdate);
    }
}

function initSponsorBlockLegacy() {
    document.addEventListener('yt-navigate-finish', _bytInitSponsorVideo);
    if (window.location.pathname === '/watch') setTimeout(_bytInitSponsorVideo, 1000);
}
function removeSponsorBlockLegacy() {
    document.removeEventListener('yt-navigate-finish', _bytInitSponsorVideo);
    const video = document.querySelector('video');
    if (video && video.dataset.bytSponsBound) {
        video.removeEventListener('timeupdate', _bytSponsorTimeUpdate);
        delete video.dataset.bytSponsBound;
    }
    const btn = document.getElementById('byt-sponsor-skip-btn');
    if (btn) btn.remove();
    window.bytSponsorSegments = null;
}

// --- Feature: Channel Blocklist ---
function _bytGetChannelCards() {
    return document.querySelectorAll(
        'ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-grid-media, ytm-video-with-context-renderer'
    );
}

function _bytGetCardChannelName(card) {
    const nameEl = card.querySelector(
        'ytd-channel-name yt-formatted-string a, .ytd-channel-name a, #channel-name a, #text-container.ytd-channel-name a, a.yt-simple-endpoint.style-scope.yt-formatted-string'
    );
    if (nameEl && nameEl.textContent) return nameEl.textContent.trim();
    return '';
}

function _bytGetCardChannelContainer(card) {
    return card.querySelector('ytd-channel-name, #channel-name, .ytd-channel-name') || card;
}

function _bytBlocklistCheck() {
    if (!BetterYT_Settings.channelBlocklist) return;
    chrome.storage.local.get(['BetterYT_BlockedChannels'], (res) => {
        const blocked = res.BetterYT_BlockedChannels || [];
        if (blocked.length === 0) return;
        
        let removed = false;
        _bytGetChannelCards().forEach(card => {
            const cName = _bytGetCardChannelName(card);
            if (!cName) return;
            // Block matching channels exactly
            if (blocked.includes(cName)) {
                if (card.style.display !== 'none') {
                    card.style.display = 'none';
                    removed = true;
                }
            }
        });
        if (removed) console.log(`[BetterYT] Hid videos from blocked channels.`);
    });
}

function _bytInjectBlockBtns() {
    if (!BetterYT_Settings.channelBlocklist) return;
    _bytGetChannelCards().forEach(card => {
        if (card.dataset.bytBlockBound) return;
        const channelNameContainer = _bytGetCardChannelContainer(card);
        if (!channelNameContainer) return;
        
        card.dataset.bytBlockBound = 'true';
        const cName = _bytGetCardChannelName(card);
        if (!cName) return;
        
        const btn = document.createElement('span');
        btn.innerHTML = '✕';
        btn.title = 'Block this channel';
        btn.style.cssText = 'color: var(--yt-spec-text-secondary); cursor: pointer; font-size: 11px; margin-left: 6px; padding: 2px 4px; border-radius: 4px; opacity: 0; transition: opacity 0.2s;';
        btn.className = 'byt-block-btn';
        
        // Hide/show on hover over the card
        card.addEventListener('mouseenter', () => btn.style.opacity = '1');
        card.addEventListener('mouseleave', () => btn.style.opacity = '0');
        
        btn.onclick = (e) => {
            e.preventDefault(); e.stopPropagation();
            if (!_bytIsContextValid()) return;
            if (confirm(`Block all videos from "${cName}"?`)) {
                chrome.storage.local.get(['BetterYT_BlockedChannels'], (res) => {
                    const bl = res.BetterYT_BlockedChannels || [];
                    if (!bl.includes(cName)) bl.push(cName);
                    chrome.storage.local.set({ 'BetterYT_BlockedChannels': bl }, () => _bytBlocklistCheck());
                });
            }
        };
        channelNameContainer.appendChild(btn);
    });
}

function initChannelBlocklist() {
    if (window.bytBlockObserver) return;
    window.bytBlockObserver = new MutationObserver(() => {
        _bytInjectBlockBtns();
        _bytBlocklistCheck();
    });
    window.bytBlockObserver.observe(document.body, { childList: true, subtree: true });
    _bytInjectBlockBtns();
    _bytBlocklistCheck();
}
function removeChannelBlocklist() {
    if (window.bytBlockObserver) { window.bytBlockObserver.disconnect(); window.bytBlockObserver = null; }
    document.querySelectorAll('.byt-block-btn').forEach(b => b.remove());
    _bytGetChannelCards().forEach(card => {
        card.style.display = ''; // restore
        delete card.dataset.bytBlockBound;
    });
}

// --- Feature: Homepage Redirect ---
function initRedirectHome() {
    if (window.location.pathname === '/' && BetterYT_Settings.redirectHome) {
        window.location.replace('/feed/subscriptions');
    }
}
function removeRedirectHome() { /* Nothing to remove actively, handled on load via setting */ }

// --- Feature: Hide Related Theater ---
function initHideRelatedTheater() {
    if (document.getElementById('byt-hide-related-theater')) return;
    const style = document.createElement('style');
    style.id = 'byt-hide-related-theater';
    style.textContent = `
        ytd-watch-flexy[theater] #secondary {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
}
function removeHideRelatedTheater() {
    const el = document.getElementById('byt-hide-related-theater');
    if (el) el.remove();
}

// --- Feature: Hide YouTube Logo ---
function initHideLogo() {
    if (document.getElementById('byt-hide-logo-style')) return;
    const style = document.createElement('style');
    style.id = 'byt-hide-logo-style';
    style.textContent = `
        ytd-topbar-logo-renderer,
        #logo,
        a#logo {
            opacity: 0 !important;
            pointer-events: none !important;
            width: 1px !important;
            overflow: hidden !important;
        }
    `;
    document.head.appendChild(style);
}
function removeHideLogo() {
    const el = document.getElementById('byt-hide-logo-style');
    if (el) el.remove();
}

// --- Feature: Hide Sidebar Navigation ---
function initHideSidebar() {
    if (document.getElementById('byt-hide-sidebar-style')) return;
    const style = document.createElement('style');
    style.id = 'byt-hide-sidebar-style';
    style.textContent = `
        ytd-guide-renderer,
        ytd-mini-guide-renderer,
        #guide-content {
            display: none !important;
        }
        ytd-app[guide-persistent-and-visible] #page-manager,
        ytd-app:not([guide-persistent-and-visible]) #page-manager {
            margin-left: 0 !important;
            width: 100% !important;
        }
    `;
    document.head.appendChild(style);
}
function removeHideSidebar() {
    const el = document.getElementById('byt-hide-sidebar-style');
    if (el) el.remove();
}

// --- Feature: Custom Progress Bar Theme ---
function initCustomTheme() {
    if (document.getElementById('byt-custom-theme-style')) return;
    chrome.storage.local.get(['BetterYT_Accent'], (res) => {
        if (!_bytIsContextValid()) return;
        let accent = res.BetterYT_Accent || 'red';
        const colors = {
            'red': '#ff0000', 'blue': '#3ea6ff', 'green': '#1f8c35', 
            'purple': '#b426ff', 'pink': '#ff2692', 'orange': '#ff8800',
            'emerald': '#10b981', 'amber': '#f59e0b', 'cyan': '#06b6d4', 'gold': '#eab308'
        };
        const activeColor = colors[accent] || '#ff0000';
        
        const style = document.createElement('style');
        style.id = 'byt-custom-theme-style';
        style.textContent = `
            /* YouTube Progress Bar */
            .ytp-play-progress, 
            .ytp-scrubber-button, 
            .ytp-swatch-background-color, 
            .ytp-volume-slider-handle:before, 
            .ytp-volume-slider-handle { 
                background: ${activeColor} !important; 
            }
            .ytp-settings-button.ytp-hd-quality-badge::after {
                background-color: ${activeColor} !important;
            }
            
            /* YouTube Subscribe Button */
            #subscribe-button yt-button-shape button.yt-spec-button-shape-next--call-to-action,
            ytd-subscribe-button-renderer yt-button-shape button[aria-label*="Subscribe"] {
                background-color: ${activeColor} !important;
            }
            
            /* YouTube Logo - Apply accent color */
            ytd-logo #logo-icon svg path[fill="#FF0000"],
            ytd-logo #logo-icon svg path[fill="red"],
            ytd-topbar-logo-renderer #logo-icon svg path[fill="#FF0000"],
            ytd-topbar-logo-renderer #logo-icon svg path[fill="red"],
            yt-icon.ytd-logo path[fill="#FF0000"],
            yt-icon.ytd-logo path[fill="red"],
            #logo svg path[fill="#FF0000"],
            #logo svg path[fill="red"] {
                fill: ${activeColor} !important;
            }
            
            /* More accent usage across YouTube */
            /* Notification bell and active states */
            ytd-notification-topbar-button-renderer[has-new-content] #notification-count,
            .badge-style-type-notification {
                background-color: ${activeColor} !important;
            }
            
            /* Channel subscribe button hover */
            #subscribe-button yt-button-shape button:hover,
            ytd-subscribe-button-renderer yt-button-shape button:hover {
                background-color: ${activeColor}dd !important;
            }
            
            /* Liked video icon */
            ytd-toggle-button-renderer.style-text[is-icon-button] button[aria-pressed="true"] yt-icon,
            ytd-toggle-button-renderer.style-text[is-icon-button] button[aria-pressed="true"],
            .ytd-video-owner-renderer[is-selected] {
                color: ${activeColor} !important;
            }
            
            /* Active navigation items */
            ytd-guide-entry-renderer[active] .guide-icon,
            ytd-guide-entry-renderer[active] .title,
            ytd-mini-guide-entry-renderer[active] .guide-icon,
            ytd-mini-guide-entry-renderer[active] .title {
                color: ${activeColor} !important;
            }
            
            /* Links and hashtags */
            a.yt-simple-endpoint.yt-formatted-string[href^="/hashtag/"],
            .yt-core-attributed-string__link--call-to-action-color {
                color: ${activeColor} !important;
            }
            
            /* Selection highlight */
            ::selection {
                background-color: ${activeColor}44 !important;
            }
            
            /* Highlights and chips */
            .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal,
            ytd-feed-filter-chip-bar-renderer[is-dark-theme] #chip-bar paper-tab[aria-selected="true"],
            yt-chip-cloud-chip-renderer[chip-style="STYLE_PRIMARY"],
            yt-chip-cloud-chip-renderer[selected] {
                background-color: ${activeColor}22 !important;
                color: ${activeColor} !important;
            }
        `;
        document.head.appendChild(style);
    });
}
function removeCustomTheme() {
    const el = document.getElementById('byt-custom-theme-style');
    if (el) el.remove();
}

// --- Feature: Custom Player Skin ---
function initCustomPlayerSkin() {
    if (document.getElementById('byt-custom-player-skin')) return;
    const style = document.createElement('style');
    style.id = 'byt-custom-player-skin';
    style.textContent = `
        /* Float the control bar & round borders */
        .ytp-chrome-bottom {
            bottom: 20px !important;
            left: 10px !important;
            right: 10px !important;
            width: auto !important;
            border-radius: 12px !important;
            background: rgba(15, 15, 15, 0.75) !important;
            backdrop-filter: blur(12px) !important; /* Glassmorphism */
            box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.4) !important;
            padding: 0 10px !important;
            transition: bottom 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        /* Adjust scrubber position for floating bar */
        .ytp-progress-bar-container {
            bottom: calc(100% + 5px) !important;
            left: 0 !important;
            right: 0 !important;
            width: auto !important;
            max-width: 100% !important;
            border-radius: 6px !important;
            background: transparent !important;
        }
        .ytp-progress-list {
            border-radius: 6px !important;
            background: rgba(255,255,255,0.2) !important;
            overflow: hidden !important;
        }
        
        /* Stop standard black gradient */
        .ytp-gradient-bottom {
            display: none !important;
        }

        /* Round video container on normal watch page */
        ytd-watch-flexy:not([fullscreen]):not([theater]) #movie_player {
            border-radius: 16px !important;
            overflow: hidden !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15) !important;
            margin-left: auto !important;
            margin-right: auto !important;
        }
        ytd-watch-flexy:not([fullscreen]):not([theater]) video {
            border-radius: 16px !important;
        }
    `;
    document.head.appendChild(style);
}
function removeCustomPlayerSkin() {
    const el = document.getElementById('byt-custom-player-skin');
    if (el) el.remove();
}

// --- Feature: Hide Channel Avatars ---
function initHideChannelAvatars() {
    // Delegated to Row Fixer CSS injection for broader selector coverage.
    initCompactGrid();
}
function removeHideChannelAvatars() {
    _bytInjectStyle('byt-row-fixer-avatars', null);
}

// --- Feature: Display Full Titles ---
function initDisplayFullTitle() {
    // Delegated to Row Fixer CSS injection for full title handling.
    initCompactGrid();
}
function removeDisplayFullTitle() {
    _bytInjectStyle('byt-row-fixer-fulltitle', null);
}

// --- Feature: Channel Wide Layout ---
function _bytCheckChannelLayout() {
    if (!BetterYT_Settings.channelWideLayout) return;
    const isChannelDir = window.location.pathname.startsWith('/@') || 
                         window.location.pathname.startsWith('/channel/') ||
                         window.location.pathname.startsWith('/c/');
                         
    if (isChannelDir) {
        if (!document.getElementById('byt-channel-wide-style')) {
            const style = document.createElement('style');
            style.id = 'byt-channel-wide-style';
            style.textContent = `
                /* Hide secondary column on channels */
                ytd-two-column-browse-results-renderer #secondary,
                app-drawer#guide {
                    display: none !important;
                }
                /* Stretch primary column */
                ytd-two-column-browse-results-renderer #primary {
                    min-width: 100% !important;
                    max-width: 100% !important;
                }
            `;
            document.head.appendChild(style);
        }
    } else {
        const el = document.getElementById('byt-channel-wide-style');
        if (el) el.remove();
    }
}
function initChannelWideLayout() {
    // Delegated to Row Fixer CSS injection with responsive channel grid handling.
    initCompactGrid();
}
function removeChannelWideLayout() {
    document.removeEventListener('yt-navigate-finish', _bytCheckChannelLayout);
    _bytInjectStyle('byt-row-fixer-widelayout', null);
    const el = document.getElementById('byt-channel-wide-style');
    if (el) el.remove();
}

// --- Feature: Clickbait Remover (title styling only; no thumbnail URL swaps) ---
function initClickbaitRemover() {
    const mode = BetterYT_Settings.clickbaitMode || 'sentence';
    let st = document.getElementById('byt-clickbait-style');
    if (st) st.remove();
    st = document.createElement('style');
    st.id = 'byt-clickbait-style';
    st.textContent = BYT_CLICKBAIT_MODES[mode] || BYT_CLICKBAIT_MODES.sentence;
    document.head.appendChild(st);
    const dupTitle = document.getElementById('byt-defuse-titles-style');
    if (dupTitle) dupTitle.remove();
}
function removeClickbaitRemover() {
    if (window.bytClickbaitObserver) { window.bytClickbaitObserver.disconnect(); window.bytClickbaitObserver = null; }
    document.querySelectorAll('img[src*="ytimg"]').forEach(img => {
        if (img.dataset.bytDefused && img.dataset.bytOriginalSrc) {
            img.onerror = null;
            img.src = img.dataset.bytOriginalSrc;
            delete img.dataset.bytOriginalSrc;
            delete img.dataset.bytDefused;
            delete img.dataset.bytThumbVid;
        }
    });
    const el = document.getElementById('byt-defuse-titles-style');
    if (el) el.remove();
    const st2 = document.getElementById('byt-clickbait-style');
    if (st2) st2.remove();
}

// --- Feature: Audio Equalizer ---
function initAudioEQ() {
    const videoElement = document.querySelector('video');
    if (!videoElement) {
        setTimeout(initAudioEQ, 1000);
        return;
    }
    _bytRebuildAudioGraph(videoElement);
    _bytApplyEQBandsFromStorage();
    _bytEnsureAudioStorageListener();
    console.log('[BetterYT] Audio Equalizer Initialized');
}

function removeAudioEQ() {
    const videoElement = document.querySelector('video') || window.bytBoostedVideo;
    if (videoElement) _bytRebuildAudioGraph(videoElement);
    console.log('[BetterYT] Audio Equalizer Removed');
}

// --- Feature: Custom CSS Injector ---
function initCustomCSS() {
    if (document.getElementById('byt-user-custom-css')) return;
    chrome.storage.local.get(['BetterYT_CustomCSS_Code'], (res) => {
        if (!_bytIsContextValid()) return;
        const cssStr = res.BetterYT_CustomCSS_Code;
        if (!cssStr || cssStr.trim() === '') return;
        
        const style = document.createElement('style');
        style.id = 'byt-user-custom-css';
        style.textContent = cssStr;
        document.head.appendChild(style);
        console.log('[BetterYT] Custom User CSS Injected');
    });
}
function removeCustomCSS() {
    const el = document.getElementById('byt-user-custom-css');
    if (el) el.remove();
}

// --- Feature: Developer Mode ---
function initDevMode() {
    window.BYT_DEBUG = true;
    if (document.getElementById('byt-dev-hud')) return;
    
    const hud = document.createElement('div');
    hud.id = 'byt-dev-hud';
    hud.style.cssText = `
        position: fixed; bottom: 10px; left: 10px; z-index: 999999;
        background: rgba(0, 0, 0, 0.85); color: #0aff0a; font-family: monospace;
        padding: 12px; font-size: 11px; border-radius: 6px; border: 1px solid #333;
        box-shadow: 0 4px 15px rgba(0,0,0,0.5); pointer-events: none; width: 220px;
    `;
    document.body.appendChild(hud);
    
    window.bytDevInterval = setInterval(() => {
        const el = document.getElementById('byt-dev-hud');
        if (!el) return;
        const domNodes = document.getElementsByTagName('*').length;
        const mem = performance.memory ? (performance.memory.usedJSHeapSize / 1048576).toFixed(1) : 'N/A';
        const vid = document.querySelector('video');
        
        el.innerHTML = `
            <div style="font-weight:bold;color:#fff;margin-bottom:6px;">BetterYT :: DEV MENU</div>
            <div>[SYS] DOM Nodes: ${domNodes}</div>
            <div>[SYS] JS Heap: ${mem} MB</div>
            <div>[VID] State: ${vid ? (vid.paused ? 'PAUSED' : 'PLAYING') : 'NONE'}</div>
            <div>[VID] Res: ${vid ? vid.videoWidth + 'x' + vid.videoHeight : 'N/A'}</div>
            <div>[VOL] Booster: ${window.bytGainNode ? 'ON' : 'OFF'}</div>
            <div>[VOL] Equalizer: ${window.bytEQNodes ? 'ON' : 'OFF'}</div>
            <div>[FEAT] SponsorBlock: ${window.bytSponsorSegments ? window.bytSponsorSegments.length + ' Segs' : 'OFF'}</div>
            <div style="margin-top:6px;color:#aaa;">v2.0.0 Engine Active</div>
        `;
    }, 1000);
}

function removeDevMode() {
    window.BYT_DEBUG = false;
    if (window.bytDevInterval) {
        clearInterval(window.bytDevInterval);
        window.bytDevInterval = null;
    }
    const hud = document.getElementById('byt-dev-hud');
    if (hud) hud.remove();
}


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/* harmony import */ var _core_content_monolith_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(694);
/* harmony import */ var _core_content_monolith_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_content_monolith_js__WEBPACK_IMPORTED_MODULE_0__);
// BetterYouTube Modulator 


})();

/******/ })()
;