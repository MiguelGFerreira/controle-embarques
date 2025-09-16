'use client';

import { useEffect, useState } from "react";

interface Filters {
    filial: string;
    mes: string;
    ano: string;
    ide: string;
}

interface ReportFilterBarProps {
    initialFilters: Filters;
    onFilterChange: (newFilters: Filters) => void;
}

const meses = [
    { value: '1', label: 'Janeiro' }, { value: '2', label: 'Fevereiro' },
    { value: '3', label: 'Março' }, { value: '4', label: 'Abril' },
    { value: '5', label: 'Maio' }, { value: '6', label: 'Junho' },
    { value: '7', label: 'Julho' }, { value: '8', label: 'Agosto' },
    { value: '9', label: 'Setembro' }, { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' }, { value: '12', label: 'Dezembro' },
];

const currentYear = new Date().getFullYear();
const anos = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i); // ultimos 2 anos + atual + proximos 2

export default function ReportFilterBar({ initialFilters, onFilterChange }: ReportFilterBarProps) {
    const [filters, setFilters] = useState<Filters>(initialFilters);

    const handleApplyFilters = () => {
        onFilterChange(filters);
    };

    useEffect(() => {
        const filial = document.getElementById('filial') as HTMLSelectElement | null;
        const mes = document.getElementById('mes') as HTMLSelectElement | null;
        const ano = document.getElementById('ano') as HTMLSelectElement | null;

        const shouldDisable = !!filters.ide;

        if (filial) filial.disabled = shouldDisable;
        if (mes) mes.disabled = shouldDisable;
        if (ano) ano.disabled = shouldDisable;
    }, [filters.ide])

    return (
        <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border">
            <div className="flex flex-col">
                <label htmlFor="ide" className="text-xs font-medium text-gray-600 mb-1">IDE</label>
                <input
                    type="text"
                    id="ide"
                    value={filters.ide}
                    onChange={(e) => setFilters(prev => ({ ...prev, ide: e.target.value }))}
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor="filial" className="text-xs font-medium text-gray-600 mb-1">Filial</label>
                <select
                    id="filial"
                    value={filters.filial}
                    onChange={(e) => setFilters(prev => ({ ...prev, filial: e.target.value }))}
                >
                    <option value="20">Varginha</option>
                    <option value="21">Viana</option>
                </select>
            </div>

            <div className="flex flex-col">
                <label htmlFor="mes" className="text-xs font-medium text-gray-600 mb-1">Mês</label>
                <select
                    id="mes"
                    value={filters.mes}
                    onChange={(e) => setFilters(prev => ({ ...prev, mes: e.target.value }))}
                >
                    {meses.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
            </div>

            <div className="flex flex-col">
                <label htmlFor="ano" className="text-xs font-medium text-gray-600 mb-1">Ano</label>
                <select
                    id="ano"
                    value={filters.ano}
                    onChange={(e) => setFilters(prev => ({ ...prev, ano: e.target.value }))}
                >
                    {anos.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
            </div>

            <button
                onClick={handleApplyFilters}
                className="self-end px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors cursor-pointer"
            >
                Aplicar
            </button>
        </div>
    );
}