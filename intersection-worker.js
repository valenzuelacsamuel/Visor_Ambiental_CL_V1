importScripts('https://cdn.jsdelivr.net/npm/@turf/turf@7.2.0/turf.min.js', './intersection-core.js');

self.onmessage = ({ data }) => {
    try {
        self.postMessage(self.runSpatialIntersection(data.layers));
    } catch (error) {
        self.postMessage({ error: error.message || String(error) });
    }
};
