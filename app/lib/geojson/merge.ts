import { GeoJSON } from "@/app/types/geojson";

export function mergeGeoJson( collections: GeoJSON[] ): GeoJSON {
    return {
        type: 'FeatureCollection',
        features: collections.flatMap(c => c.features)
    }
}