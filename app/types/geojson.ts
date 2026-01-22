export type ClienteConfig = {
    id: string;
    nome: string;
    properties: Record<string, any>;
    calculados?: Record<string, 'area_ha'>;
}

export type GeoJSONGeometry = {
    type: string;
    coordinates: any;
}

export type GeoJSONFeature = {
    type: "Feature";
    geometry: GeoJSONGeometry;
    properties: Record<string, any>;
}

export type GeoJSON = {
    type: "FeatureCollection";
    features: GeoJSONFeature[];
}

export type ConversorInput = {
    producerName: string;
    producerCountry: string;
    producerPlace: string;
    plotName: string;
    areaHa: number;
}