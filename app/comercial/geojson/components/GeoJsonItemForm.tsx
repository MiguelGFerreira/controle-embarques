import { ConversorInput } from "@/app/types/geojson";

type Props = {
    fileName: string;
    input: ConversorInput;
    showCopyButton?: boolean;
    onCopyFromPrevious?: () => void;
    onChange: (field: keyof ConversorInput, value: string | number) => void;
};

export function GeoJsonItemForm({ fileName, input, showCopyButton, onCopyFromPrevious, onChange }: Props) {
    return (
        <fieldset className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <legend className="px-2 text-sm font-semibold text-green-700">
                {fileName}
            </legend>

            {showCopyButton && onCopyFromPrevious && (
                <div className="flex justify-end">
                    <button type="button" onClick={onCopyFromPrevious} className="text-xs text-green-700 hover:text-green-800 underline cursor-pointer">
                        Copiar dados do arquivo anterior
                    </button>
                </div>
            )}

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                    placeholder="Producer Name"
                    value={input.producerName}
                    onChange={e => onChange("producerName", e.target.value)}
                />

                <input
                    placeholder="Producer Country"
                    value={input.producerCountry}
                    onChange={e => onChange("producerCountry", e.target.value)}
                />

                <input
                    placeholder="Producer Place"
                    value={input.producerPlace}
                    onChange={e => onChange("producerPlace", e.target.value)}
                />

                <input
                    placeholder="Plot Name"
                    value={input.plotName}
                    onChange={e => onChange("plotName", e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Area (ha)"
                    value={input.areaHa}
                    onChange={e => onChange("areaHa", Number(e.target.value))}
                />
            </div>
        </fieldset>
    );
}
