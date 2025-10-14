'use client';

import { Calendar, Search } from "lucide-react";

interface FilterProps {
    date: string;
    lote: string;
}

interface ClassificationFilterBarProps {
    onFilterChange: (filters: FilterProps) => void;
    initialFilters: FilterProps;
}

export default function ClassificationFilterBar({ onFilterChange, initialFilters }: ClassificationFilterBarProps) {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onFilterChange({ ...initialFilters, [name]: value });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md border flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-auto flex-1">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Data:
                </label>
                <div className="relative">
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={initialFilters.date}
                        onChange={handleInputChange}
                        // className="text-base"
                    />
                    {/* <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" /> */}
                </div>
            </div>

            <div className="w-full sm:w-auto flex-1">
                <label htmlFor="lote" className="block text-sm font-medium text-gray-700 mb-1">
                    Lote:
                </label>
                <div className="relative">
                    <input
                        type="text"
                        id="lote"
                        name="lote"
                        value={initialFilters.lote}
                        onChange={handleInputChange}
                        placeholder="Digite o lote..."
                        className="!pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
            </div>
        </div>
    )
}