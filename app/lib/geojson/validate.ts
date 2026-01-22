import { GeoJSON } from '@/app/types/geojson';

export function validate(input: GeoJSON) {
    console.log("Validate: ", input);
    if (!input || input.type !== 'FeatureCollection') {
        throw new Error(
            'GeoJSON inválido: esperado FeatureCollection'
        )
    }

    if (!Array.isArray(input.features)) {
        throw new Error(
            'GeoJSON inválido: features não é um array'
        )
    }

    input.features.forEach((feature, index) => {
        if (!feature) {
            throw new Error(`Feature ${index} inválida`)
        }

        if (!feature.geometry) {
            throw new Error(`Feature ${index} sem geometry`)
        }

        if (!feature.geometry.type) {
            throw new Error(
                `Feature ${index} com geometry sem type`
            )
        }

        if (!feature.geometry.coordinates) {
            throw new Error(
                `Feature ${index} com geometry sem coordinates`
            )
        }
    })
}
