import { ConversorInput, GeoJSON } from "@/app/types/geojson"
import { convertGeoJson } from "./convert"
import { mergeGeoJson } from "./merge"

type MultiItem = {
    geojson: GeoJSON
    input: ConversorInput
}

export function convertMulti( items: MultiItem[] ): GeoJSON {
    const converted = items.map(item => convertGeoJson(item.geojson, item.input))

    return mergeGeoJson(converted);
}