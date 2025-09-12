'use client';

import ReportFilterBar from "@/app/components/reports/FilterBar";
import ShipmentTable from "@/app/components/reports/ShipmentTable";
import StatusLegendFilter from "@/app/components/reports/StatusLegendFilter";
import { shipmentRecord, ShipmentStatus } from "@/app/types";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function EmbarquesReportPage() {
    const today = new Date();
    const [filters, setFilters] = useState({
        filial: '20',
        mes: String(today.getMonth() + 1),
        ano: String(today.getFullYear()),
    });
    const [activeTab, setActiveTab] = useState<'Em preparação' | 'No porto' | 'Embarcado'>('Em preparação');
    const [statusFilter, setStatusFilter] = useState<ShipmentStatus[]>([]);

    const apiUrl = `/api/relatorio-embarques?filial=${filters.filial}&mes=${filters.mes}&ano=${filters.ano}`;
    const { data: response, error, isLoading } = useSWR(apiUrl, fetcher, { keepPreviousData: true });

    // iseMemo pra otimizar a separacao e filtragem dos dados
    const { portoData, preparacaoData, embarcadoData } = useMemo(() => {
        const allData = response?.data || [];
        const porto = allData.filter((item: shipmentRecord) => item.Status === 'No Porto');

        let preparacao = allData.filter((item: shipmentRecord) => item.Status === 'Em preparação');

        let embarcado = allData.filter((item: shipmentRecord) => item.Status === 'Embarcado');

        // if (statusFilter.length > 0) {
        //     preparacao = preparacao.filter((item: shipmentRecord) => statusFilter.includes(item.Status));
        // }

        return { portoData: porto, preparacaoData: preparacao, embarcadoData: embarcado };
    }, [response, statusFilter]);

    useEffect(() => {
        document.title = 'Relatório Embarques'; // Muda o título da página dinamicamente no lado do cliente
    }, [])

    const totalsByStatus = useMemo(() => {
        const allData = response?.data || [];
        const result: Record<string, number> = {};
        allData.forEach((item: shipmentRecord) => {
            const status = item.Status;
            const sacas = Math.floor(Number(item.Quantidade) / 60);
            result[status] = (result[status] || 0) + (isNaN(sacas) ? 0 : sacas);
        });
        return result;
    }, [response]);

    return (
        <div className="space-y-6 bg-gray-50">
            <header className="flex px-4 justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Relatório de Embarques</h1>
                <ReportFilterBar
                    initialFilters={filters}
                    onFilterChange={setFilters}
                />
            </header>

            <div className="px-4 py-2 bg-white rounded-md shadow flex gap-8 my-4">
                <div>
                    <span className="font-semibold text-gray-700">Em preparação:</span>
                    <span className="ml-2 text-green-700">{totalsByStatus['Em preparação']?.toLocaleString('pt-BR', { maximumFractionDigits: 0 }) || 0} sacas</span>
                </div>
                <div>
                    <span className="font-semibold text-gray-700">No porto:</span>
                    <span className="ml-2 text-blue-700">{totalsByStatus['No Porto']?.toLocaleString('pt-BR', { maximumFractionDigits: 0 }) || 0} sacas</span>
                </div>
                <div>
                    <span className="font-semibold text-gray-700">Embarcado:</span>
                    <span className="ml-2 text-gray-700">{totalsByStatus['Embarcado']?.toLocaleString('pt-BR', { maximumFractionDigits: 0 }) || 0} sacas</span>
                </div>
            </div>

            <div className="border-b px-4 border-gray-200">
                <nav className="-mb-px flex space-x-6">
                    <button
                        onClick={() => setActiveTab('Em preparação')}
                        className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'Em preparação'
                            ? 'border-green-600 text-green-700 cursor-not-allowed'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer'
                            }`}
                    >
                        Em Preparação ({preparacaoData.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('No porto')}
                        className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'No porto'
                            ? 'border-green-600 text-green-700 cursor-not-allowed'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer'
                            }`}
                    >
                        No Porto ({portoData.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('Embarcado')}
                        className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'Embarcado'
                            ? 'border-green-600 text-green-700 cursor-not-allowed'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer'
                            }`}
                    >
                        Embarcado ({embarcadoData.length})
                    </button>
                </nav>
            </div>

            {/* ABAS */}
            <div>
                {activeTab === 'Em preparação' && (
                    <div className="space-y-4">
                        {/* <StatusLegendFilter onStatusChange={setStatusFilter} /> */}
                        <ShipmentTable data={preparacaoData} isLoading={isLoading && !response} />
                    </div>
                )}

                {activeTab === 'No porto' && (
                    <ShipmentTable data={portoData} isLoading={isLoading && !response} />
                )}

                {activeTab === 'Embarcado' && (
                    <ShipmentTable data={embarcadoData} isLoading={isLoading && !response} />
                )}
            </div>

            {error && <div className="text-red-500 text-center">Falha ao carregar os dados.</div>}
        </div>
    )
}