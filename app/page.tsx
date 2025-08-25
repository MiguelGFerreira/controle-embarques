"use client";

import { useState } from "react";
import useSWR from 'swr';
import { FILIAL_NAMES, PaginatedShipmentResponse, Shipment } from "./types";
import { Bean, Edit, Search } from "lucide-react";
import ShipmentModal from "./components/ShipmentModal";
import useDebounce from "./utils/useDebounce";
import Pagination from "./components/Pagination";
import LoadingSpinner from "./components/LoadingSpinner";
import SampleModal from "./components/SampleModal";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Home() {
    const [page, setPage] = useState(1);
    const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
    const [selectedSampleShipment, setSelectedSampleShipment] = useState<Shipment | null>(null);

    const [refFilter, setRefFilter] = useState('');
    const debouncedRefFilter = useDebounce(refFilter, 500);

    const [ideFilter, setIdeFilter] = useState('');
    const debouncedIdeFilter = useDebounce(ideFilter, 500);

    let apiUrl = `/api/embarques?page=${page}&limit=20`;

    if (debouncedIdeFilter) {
        apiUrl += `&ide=${debouncedIdeFilter}`
    }

    if (debouncedRefFilter) {
        apiUrl += `&ref=${debouncedRefFilter}`
    }

    const { data, error, isLoading, mutate } = useSWR<PaginatedShipmentResponse>(apiUrl, fetcher, { keepPreviousData: true })

    const handleModalSave = () => {
        mutate(); // revalida os dados da api
    };

    return (
        <main className="bg-gray-50 min-h-screen">
            <div className="max-w-dvw mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Controle de Datas de Embarque</h1>
                    <p className="text-md text-gray-500">Visualize e edite os embarques Pendentes.</p>
                </header>

                {/* Barra de filtro */}
                <div className="flex mb-4 gap-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Filtrar por IDE"
                            value={ideFilter}
                            onChange={(e) => {
                                setIdeFilter(e.target.value);
                                setPage(1);
                            }}
                            className="!pl-10"
                        />
                    </div>
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Filtrar por Ref. Importador"
                            value={refFilter}
                            onChange={(e) => {
                                setRefFilter(e.target.value);
                                setPage(1);
                            }}
                            className="!pl-10"
                        />
                    </div>
                </div>

                {/* Tabela de dados */}
                <div className="bg-white shadow-sm rounded-lg overflow-hidden border">
                    <div className="overflow-x-auto">
                        <table className="grupotristao">
                            <thead>
                                <tr>
                                    <th>Ação</th>
                                    <th>Embarque</th>
                                    <th>IDE</th>
                                    <th>Filial</th>
                                    <th>Importador</th>
                                    <th>Ref. Importador</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading && <tr><td colSpan={6} className="!text-center !p-4"><LoadingSpinner /></td></tr>}
                                {error && <tr><td colSpan={6} className="!text-center !p-4 !text-red-500">Falha ao carregar dados.</td></tr>}
                                {data?.data.map((shipment: Shipment) => (
                                    <tr key={shipment.R_E_C_N_O_}>
                                        <td className="!px-6 !py-4 !whitespace-nowrap">
                                            <button onClick={() => setSelectedShipment(shipment)} className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 cursor-pointer rounded-full">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => setSelectedSampleShipment(shipment)} className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 cursor-pointer rounded-full">
                                                <Bean size={16} />
                                            </button>
                                        </td>
                                        <td className="!font-medium !text-gray-900">{shipment.Embarque}</td>
                                        <td>{shipment.IDE}</td>
                                        <td>{FILIAL_NAMES[Number(shipment.Filial)]}</td>
                                        <td>{shipment.Importador}</td>
                                        <td>{shipment["Ref.Import."]}</td>
                                        <td>{shipment.Status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* paginacao */}
                    {data && data.totalPages > 1 && (
                        <Pagination
                            currentPage={data.currentPage}
                            totalPages={data.totalPages}
                            totalRecords={data.totalRecords}
                            onPageChange={setPage}
                            isLoading={isLoading}
                            limit={20}
                        />
                    )}
                </div>
            </div>

            {/* Modal dados embarque */}
            <ShipmentModal
                shipment={selectedShipment}
                onClose={() => setSelectedShipment(null)}
                onSave={handleModalSave}
            />

            {/* Modal amostra embarque */}
            <SampleModal
                shipment={selectedSampleShipment}
                onClose={() => setSelectedSampleShipment(null)}
            />
        </main>
    );
}
