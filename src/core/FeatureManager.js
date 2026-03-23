export default class FeatureManager {
    static registeredFeatures = new Map();

    /**
     * Safely wraps any feature initialization function in an Error Boundary.
     */
    static safeExecute(featureId, initFunction) {
        try {
            console.log(`[BetterYT:FeatureManager] Bootstrapping [${featureId}]...`);
            initFunction();
        } catch (error) {
            console.error(`[BetterYT:Fatal] Module [${featureId}] crashed during initialization.`);
            console.error(error);
            
            // Render a small diagnostic toast in the DOM for developers
            if (window.BYT_DEBUG) {
                const toast = document.createElement('div');
                toast.style.cssText = 'position:fixed;top:10px;right:10px;background:red;color:white;padding:10px;z-index:999999;border-radius:4px;';
                toast.textContent = `BetterYT Error: ${featureId} failed. See console.`;
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 5000);
            }
        }
    }

    /**
     * Used by the main initializer to run multiple features at once.
     */
    static runPipeline(featuresToRun) {
        for (const [id, func] of Object.entries(featuresToRun)) {
            this.safeExecute(id, func);
        }
    }
}
