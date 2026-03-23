/**
 * BetterYouTube — Audio Only / Video Handler
 * Adapted from use/17/js/video_handler.js (YouTube Nonstop).
 *
 * Injected into the main world (page context) from content.js when
 * BetterYT_Settings.audioOnly is enabled. Intercepts XHR and fetch
 * to redirect the player to audio-only streams and sets the player
 * background to the current video's thumbnail.
 *
 * Communicates with content.js via the dataset flag:
 *   document.documentElement.dataset.bytAudioOnly === 'true'
 */
(function () {
    'use strict';

    let blockVideo = document.documentElement.dataset.bytAudioOnly === 'true';
    let currentVideoId = null;

    // Listen for flag changes from content.js
    new MutationObserver(() => {
        const newFlag = document.documentElement.dataset.bytAudioOnly === 'true';
        if (newFlag !== blockVideo) {
            blockVideo = newFlag;
            if (blockVideo) {
                setPlayerBackground(getPlayer());
            } else {
                clearPlayerBackground();
            }
        }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-byt-audio-only'] });

    // -----------------------------------------------------------------------
    // Thumbnail background
    // -----------------------------------------------------------------------
    async function setPlayerBackground(videoPlayer) {
        let stylesheet = document.getElementById('byt-audio-only-bg');
        if (!blockVideo) { clearPlayerBackground(); return; }
        const imgurl = await getThumbnailImage(videoPlayer);
        if (!imgurl) return;
        if (!stylesheet) {
            stylesheet = document.createElement('style');
            stylesheet.id = 'byt-audio-only-bg';
            document.documentElement.appendChild(stylesheet);
        }
        stylesheet.textContent = `
            .html5-video-player, ytmusic-player {
                background-image: url('${imgurl}') !important;
                background-repeat: no-repeat !important;
                background-position: center !important;
                background-size: contain !important;
            }
        `;
    }

    function clearPlayerBackground() {
        const el = document.getElementById('byt-audio-only-bg');
        if (el) el.remove();
    }

    async function getThumbnailImage(videoPlayer) {
        let videoId = null;
        if (videoPlayer) {
            try {
                const response = videoPlayer.getPlayerResponse();
                if (response && response.videoDetails) {
                    const thumbs = response.videoDetails.thumbnail.thumbnails;
                    if (thumbs && thumbs.length) return thumbs.slice(-1)[0].url;
                    videoId = response.videoDetails.videoId;
                }
            } catch (e) {}
            if (!videoId) {
                try { videoId = videoPlayer.getVideoData().video_id; } catch (e) {}
            }
        }
        if (!videoId) videoId = new URLSearchParams(location.search).get('v');
        if (!videoId) return null;
        // Skip probing maxresdefault.jpg (which 404s often) to prevent console spam
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }

    function getPlayer() {
        const video = findVisibleVideo();
        if (video && video.parentNode && video.parentNode.parentNode) return video.parentNode.parentNode;
        return null;
    }

    function findVisibleVideo() {
        for (const v of document.querySelectorAll('video')) {
            const r = v.getBoundingClientRect();
            if (r.width > 0 && r.height > 0) return v;
        }
        return null;
    }

    // -----------------------------------------------------------------------
    // Video change tracking — update background when the video changes
    // -----------------------------------------------------------------------
    function checkVideoChange(url) {
        try {
            if (url.includes('api/stats') || url.includes('ptracking')) {
                const params = new URLSearchParams(url.split('?')[1]);
                const vid = params.get('docid') || params.get('video_id');
                if (vid && vid !== currentVideoId) {
                    currentVideoId = vid;
                    setTimeout(() => setPlayerBackground(getPlayer()), 400);
                }
            }
        } catch (e) {}
    }

    // -----------------------------------------------------------------------
    // XHR interception — for non-fetch loaders
    // -----------------------------------------------------------------------
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        if (blockVideo) {
            checkVideoChange(url);
            // Let audio streams through; drop video-only range requests
            if (typeof url === 'string' && url.includes('mime=video') && !url.includes('live=1')) {
                url = url.replace('mime=video', 'mime=audio'); // graceful fallback attempt
            }
        }
        return origOpen.apply(this, arguments);
    };

    // -----------------------------------------------------------------------
    // Fetch interception — primary path for modern YouTube
    // -----------------------------------------------------------------------
    const origFetch = window.fetch;
    window.fetch = async (...args) => {
        if (blockVideo) {
            let url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
            if (url && typeof url === 'string') {
                checkVideoChange(url);
                if (url.includes('mime=video') && !url.includes('live=1')) {
                    // Drop video chunk requests → effectively audio-only
                    return new Response('', { status: 204 });
                }
            }
        }
        return origFetch(...args);
    };

    // -----------------------------------------------------------------------
    // Initialise on load and on navigation
    // -----------------------------------------------------------------------
    if (blockVideo) setPlayerBackground(getPlayer());

    document.addEventListener('yt-navigate-finish', () => {
        currentVideoId = null;
        if (blockVideo) setTimeout(() => setPlayerBackground(getPlayer()), 500);
    });
})();
