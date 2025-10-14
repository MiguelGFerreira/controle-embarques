'use client';

import { useEffect, useState } from "react";
import ClassificationFilterBar from "./components/ClassificationFilterBar";
import { useRouter } from "next/navigation";
import { ClassificationBatch } from "../types";
import useDebounce from "../utils/useDebounce";
import useSWR from "swr";
import ClassificacaoTable from "./components/ClassificationTable";
import { ChevronRight } from "lucide-react";
import { normalizeDate } from "../utils";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ClassificacaoPage() {
    const router = useRouter();
    const [filters, setFilters] = useState({ date: '', lote: '' });
    const [selectedLote, setSelectedLote] = useState<ClassificationBatch | null>(null);

    const debouncedLote = useDebounce(filters.lote, 500);

    let apiUrl = `/api/classificacao?dia=${normalizeDate(filters.date)}`;

    if (debouncedLote) {
        apiUrl += `&lote=${debouncedLote}`;
    }

    const {data: response, error, isLoading} = useSWR(apiUrl, fetcher, {
        keepPreviousData: true,
    });

    const handleLoteSelect = (lote: ClassificationBatch) => {
        setSelectedLote(prev => (prev?.Lote === lote.Lote ? null : lote));
    };

    const handleClassificarClick = () => {
        if (selectedLote) {
            console.log('Navegando para claissificação do lote:', selectedLote.Lote);
            router.push(`/classificacao/${selectedLote.Lote}`);
        }
    };

    useEffect(() => {
        document.title = 'Classificação'; // Muda o título da página dinamicamente no lado do cliente
    }, [])

    if (error) {
        return <div className="text-red-500">Erro ao carregar dados.</div>
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Lotes para Classificação</h1>
                <p className="mt-1 text-lg text-gray-500">Selecione um lote da lista para iniciar a classificação.</p>
            </div>
            
            <ClassificationFilterBar
                initialFilters={filters}
                onFilterChange={setFilters}
            />

            <ClassificacaoTable
                data={response?.data || []}
                isLoading={isLoading}
                selectedLote={selectedLote}
                onLoteSelect={handleLoteSelect}
            />

            <footer className="mt-6 flex justify-end">
                <button
                    onClick={handleClassificarClick}
                    disabled={!selectedLote}
                    className="botao flex items-center gap-2"
                >
                    <span>Classificar Lote Selecionado</span>
                    <ChevronRight size={24} />
                </button>
            </footer>
        </div>
    )
}