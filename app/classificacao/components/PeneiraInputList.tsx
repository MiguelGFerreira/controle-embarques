import { useMemo } from "react";
import { PeneiraEntry } from "../[lote]/page";
import { PlusCircle, Trash2 } from "lucide-react";

interface PeneiraInputListProps {
    peneiras: PeneiraEntry[];
    options: { code: string; description: string }[];
    onAdd: () => void;
    onRemove: (index: number) => void;
    onUpdate: (index: number, field: keyof PeneiraEntry, value: string | number) => void;
}

export default function PeneiraInputList({ peneiras, options, onAdd, onRemove, onUpdate }: PeneiraInputListProps) {
    const totalPercentage = useMemo(() => {
        return peneiras.reduce((sum, item) => sum + (Number(item.percentage) || 0), 0);
    }, [peneiras]);

    const isTotalValid = totalPercentage === 100;

    return (
        <fieldset className="col-span-full">
            <div className="flex justify-between items-center mb-4">
                <legend className="text-lg font-semibold text-gray-800">Peneiras</legend>
                <div className={`text-lg font-bold px-3 py-1 rounded-md ${isTotalValid ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'}`}>
                    Total {totalPercentage}%
                </div>
            </div>
            <div className="space-y-3">
                {peneiras.map((entry, index) => (
                    <div key={index} className="flex items-center gap-3">
                        {/* dropdown das peneiras */}
                        <select
                            id={`sieveCode${index}`}
                            name={`sieveCode${index}`}
                            value={entry.sieveCode}
                            onChange={(e) => onUpdate(index, 'sieveCode', e.target.value)}
                        >
                            <option value="">Selecione a peneira</option>
                            {options.map(opt => (
                                <option key={opt.code} value={opt.code}>{opt.description}</option>
                            ))}
                        </select>
                        <input
                            id={`percentage${index}`}
                            name={`percentage${index}`}
                            type="number"
                            value={entry.percentage}
                            onChange={(e) => onUpdate(index, 'percentage', e.target.value === '' ? '' : Number(e.target.value))}
                            className="block w-32 p-3 border-gray-300 rounded-md shadow-sm text-center"
                            placeholder="%"
                            min={0}
                            max={100}
                        />
                        {peneiras.length > 1 && (
                            <button type="button" onClick={() => onRemove(index)} className="p-3 text-red-600 hover:text-red-800">
                                <Trash2 size={20} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <button
                type="button"
                onClick={onAdd}
                className="mt-4 flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-800"
            >
                <PlusCircle size={18} />
                Adicionar Peneira
            </button>
        </fieldset>
    )
}