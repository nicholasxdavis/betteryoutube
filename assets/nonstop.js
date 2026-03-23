(function () {
  "use strict";

  // 1. Bypass "Are you still watching?" AFK popup permanently
  Object.defineProperties(document, {
    hidden: { value: false },
    visibilityState: { value: "visible" },
  });
  window.addEventListener("visibilitychange", (e) => e.stopImmediatePropagation(), true);
  
  const keepAlive = () => {
    if ("_lact" in window) {
      setInterval(() => (window._lact = Date.now()), 300000);
    } else {
      setTimeout(keepAlive, 1000);
    }
  };
  keepAlive();

  // 2. Audio Only - Intercept Fetch to drop video chunks
  const origFetch = window.fetch;
  window.fetch = async (...args) => {
    if (document.documentElement.dataset.bytNonstop === 'true') {
        let url = typeof args[0] === "string" ? args[0] : args[0]?.url;
        if (url && typeof url === "string" && url.includes("mime=video") && !url.includes("live=1")) {
             return new Response("", { status: 204 });
        }
    }
    return await origFetch(...args);
  };
})();
