'use client';

interface ClassificationFormProps {
    label: string;
    options: { code: string; description: string }[]
    value: string;
    onBebidaChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    qty: number;
    onQtyChange: (qty: number) => void;
    name: string;
}

export default function BebidaInputGroup({ label, options, value, onBebidaChange, qty, onQtyChange, name }: ClassificationFormProps) {
    return (
        <div className="col-span-1">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="mt-1 flex rounded-md shadow-md">
                <select
                    name={name}
                    id={name}
                    value={value}
                    onChange={onBebidaChange}
                    className="flex-grow block w-full p-3 border-gray-300 rounded-none rounded-l-md focus:ring-green-500 focus:border-green-500"
                >
                    <option value="">Selecione</option>
                    {options.map(opt => <option key={opt.code} value={opt.code}>{opt.description}</option>)}
                </select>
                <input
                    id={`${name}Qty`}
                    type="number"
                    value={qty}
                    onChange={(e) => onQtyChange(Number(e.target.value))}
                    className="block w-24 text-center p-3 border-gray-300 focus:ring-green-500 focus:border-green-500"
                    placeholder="Qtd"
                    min="0"
                    max="100"
                />
            </div>
        </div>
    )
}