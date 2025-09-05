'use client';

import ReportFilterBar from "@/app/components/reports/FilterBar";
import ShipmentTable from "@/app/components/reports/ShipmentTable";
import StatusLegendFilter from "@/app/components/reports/StatusLegendFilter";
import { shipmentRecord, ShipmentStatus } from "@/app/types";
import { useMemo, useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function EmbarquesReportPage() {
    const today = new Date();
    const [filters, setFilters] = useState({
        filial: '20',
        mes: String(today.getMonth() + 1),
        ano: String(today.getFullYear()),
    });
    const [activeTab, setActiveTab] = useState<'preparacao' | 'porto'>('preparacao');
    const [statusFilter, setStatusFilter] = useState<ShipmentStatus[]>([]);

    const apiUrl = `/api/relatorio-embarques?filial=${filters.filial}&mes=${filters.mes}&ano=${filters.ano}`;
    const { data: response, error, isLoading } = useSWR(apiUrl, fetcher, { keepPreviousData: true });

    // iseMemo pra otimizar a separacao e filtragem dos dados
    const { portoData, preparacaoData } = useMemo(() => {
        const allData = response?.data || [];
        const porto = allData.filter((item: shipmentRecord) => item.Status === 'No Porto');

        let preparacao = allData.filter((item: shipmentRecord) => item.Status !== 'No Porto');

        if (statusFilter.length > 0) {
            preparacao = preparacao.filter((item: shipmentRecord) => statusFilter.includes(item.Status));
        }

        return { portoData: porto, preparacaoData: preparacao };
    }, [response, statusFilter]);

    return (
        <div className="space-y-6 bg-gray-50">
            <header className="flex px-4 justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Relatório de Embarques</h1>
                <ReportFilterBar
                    initialFilters={filters}
                    onFilterChange={setFilters}
                />
            </header>

            <div className="border-b px-4 border-gray-200">
                <nav className="-mb-px flex space-x-6">
                    <button
                        onClick={() => setActiveTab('preparacao')}
                        className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'preparacao'
                                ? 'border-green-600 text-green-700 cursor-not-allowed' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer'
                        }`}
                    >
                        Em Preparação ({preparacaoData.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('porto')}
                        className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'porto'
                                ? 'border-green-600 text-green-700 cursor-not-allowed'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer'
                        }`}
                    >
                        No Porto ({portoData.length})
                    </button>
                </nav>
            </div>

            {/* ABAS */}
            <div>
                {activeTab === 'preparacao' && (
                    <div className="space-y-4">
                        <StatusLegendFilter onStatusChange={setStatusFilter} />
                        <ShipmentTable data={preparacaoData} isLoading={isLoading && !response} />
                    </div>
                )}

                {activeTab === 'porto' && (
                    <ShipmentTable data={portoData} isLoading={isLoading && !response} />
                )}
            </div>

            {error && <div className="text-red-500 text-center">Falha ao carregar os dados.</div>}
        </div>
    )
}