import { ClienteConfig, ConversorInput, GeoJSON } from "@/app/types/geojson";
import { validate } from "./validate";
import { buildProperties } from "./buildProperties";

export function convertGeoJson(geojson: GeoJSON, input: ConversorInput): GeoJSON {
    console.log("Convert: ", geojson);
    validate(geojson);

    return {
        type: "FeatureCollection",
        features: geojson.features.map(feature => ({
            type: "Feature",
            properties: buildProperties(input),
            geometry: feature.geometry,
        }))
    }
}