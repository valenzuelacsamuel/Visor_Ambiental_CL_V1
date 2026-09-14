// Turf se carga dentro del Worker para mantener el geoproceso fuera del hilo de UI.
importScripts('https://cdn.jsdelivr.net/npm/@turf/turf@7.2.0/turf.min.js');

self.onmessage = ({ data }) => {
    try {
        const { geojson, distance, dissolve } = data;
        const buffered = turf.buffer(geojson, distance, { units: 'meters', steps: 8 });
        const individual = turf.flatten(buffered);

        individual.features.forEach(feature => {
            feature.properties = {
                ...feature.properties,
                buffer_m: distance,
                disuelto: false
            };
        });

        const result = dissolve && individual.features.length
            ? turf.dissolve(individual)
            : individual;

        if (dissolve) {
            result.features.forEach(feature => {
                feature.properties = {
                    buffer_m: distance,
                    disuelto: true,
                    entidades_origen: geojson.features.length
                };
            });
        }

        self.postMessage({ result });
    } catch (error) {
        self.postMessage({ error: error.message || String(error) });
    }
};
