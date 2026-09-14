// Núcleo reusable en la UI local y en el Worker. GeoJSON usa siempre EPSG:4326.
(function (root) {
    function checkWgs84(geojson) {
        turf.coordEach(geojson, ([lng, lat]) => {
            if (!Number.isFinite(lng) || !Number.isFinite(lat) || lng < -180 || lng > 180 || lat < -90 || lat > 90) {
                throw new Error('Se detectaron coordenadas fuera de EPSG:4326');
            }
        });
    }

    function polygonParts(geojson, warnings) {
        const parts = [];
        turf.flattenEach(geojson, feature => {
            if (feature.geometry.type !== 'Polygon') return;
            try {
                const cleaned = turf.cleanCoords(feature);
                const repaired = turf.kinks(cleaned).features.length
                    ? turf.unkinkPolygon(cleaned).features
                    : [cleaned];
                parts.push(...repaired);
            } catch (error) {
                warnings.skipped += 1;
            }
        });
        return parts;
    }

    function overlaps(a, b) {
        const [minX1, minY1, maxX1, maxY1] = turf.bbox(a);
        const [minX2, minY2, maxX2, maxY2] = turf.bbox(b);
        return minX1 <= maxX2 && maxX1 >= minX2 && minY1 <= maxY2 && maxY1 >= minY2;
    }

    function polygonIntersection(layers, warnings) {
        let current = polygonParts(layers[0].geojson, warnings);
        for (const layer of layers.slice(1)) {
            const next = polygonParts(layer.geojson, warnings);
            const intersections = [];
            for (const left of current) {
                for (const right of next) {
                    if (!overlaps(left, right)) continue;
                    try {
                        const result = turf.intersect(turf.featureCollection([left, right]));
                        if (result) intersections.push(result);
                    } catch (error) {
                        warnings.skipped += 1;
                    }
                }
            }
            current = intersections;
            if (!current.length) break;
        }
        return current;
    }

    function pointInPolygons(pointLayer, polygonLayers, warnings) {
        const polygonGroups = polygonLayers.map(layer => polygonParts(layer.geojson, warnings));
        return pointLayer.geojson.features.filter(feature => {
            if (feature.geometry.type !== 'Point') return false;
            return polygonGroups.every(group => group.some(polygon => {
                try {
                    return overlaps(feature, polygon) && turf.booleanPointInPolygon(feature, polygon);
                } catch (error) {
                    warnings.skipped += 1;
                    return false;
                }
            }));
        });
    }

    root.runSpatialIntersection = function (layers) {
        if (layers.length < 2) throw new Error('Selecciona al menos dos capas');
        layers.forEach(layer => checkWgs84(layer.geojson));

        const warnings = { skipped: 0 };
        const pointLayers = layers.filter(layer => layer.geojson.features.some(f => f.geometry.type === 'Point'));
        const polygonLayers = layers.filter(layer => layer.geojson.features.some(f => f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon'));
        let features;

        if (pointLayers.length) {
            if (pointLayers.length !== 1 || !polygonLayers.length) {
                throw new Error('La intersección puntual requiere una capa de puntos y al menos una poligonal');
            }
            features = pointInPolygons(pointLayers[0], polygonLayers, warnings);
        } else if (polygonLayers.length === layers.length) {
            features = polygonIntersection(polygonLayers, warnings);
        } else {
            throw new Error('Las capas lineales no están disponibles en este visor');
        }

        const layerNames = layers.map(layer => layer.id).join('|');
        features.forEach(feature => {
            feature.properties = { ...feature.properties, interseccion: layerNames, crs: 'EPSG:4326' };
        });
        return { geojson: turf.featureCollection(features), warnings };
    };
}(self));
