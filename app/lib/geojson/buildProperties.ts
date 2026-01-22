import { ConversorInput } from "@/app/types/geojson";

export function buildProperties(input: ConversorInput) {
    return {
        ProducerName: input.producerName,
        ProducerCountry: input.producerCountry || 'BR',
        ProducerPlace: input.producerPlace,
        PlotName: input.plotName,
        'Area(ha)': input.areaHa
    }
}