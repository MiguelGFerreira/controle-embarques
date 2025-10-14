"use client";

import { useState } from "react";
import useDebounce from "@/app/utils/useDebounce";
import useSWR from "swr";
import { Search, X } from "lucide-react";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface Despachante {
    Chave: string;
    Descricao: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDespachanteSelect: (despachante: Despachante) => void;
}

export default function DespachanteLookUpModal({ isOpen, onClose, onDespachanteSelect }: ModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filial, setFilial] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    let apiUrl = `/api/despachantes?filial=${filial}`;

    if (debouncedSearchTerm) {
        apiUrl += `search=${debouncedSearchTerm}`
    }


    const { data: despachantes, error, isLoading } = useSWR<Despachante[]>(apiUrl, fetcher);

    if (!isOpen) return null;

    const handleSelect = (client: Despachante) => {
        onDespachanteSelect(client);
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                <header className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Buscar Despchante</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-600 hover:bg-gray-200 cursor-pointer"><X size={20} /></button>
                </header>

                <main className="p-4">
                    <div className="flex gap-4 relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por código ou nome..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full !pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                            autoFocus
                        />
                        <select
                            id="filial"
                            value={filial}
                            onChange={(e) => setFilial(e.target.value)}
                        >
                            <option value="20">Varginha</option>
                            <option value="21">Viana</option>
                        </select>
                    </div>

                    <div className="overflow-y-auto h-[45vh] border rounded-md">
                        {isLoading && <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}
                        {error && <div className="p-4 text-red-500">Erro ao carregar despachante.</div>}
                        {despachantes && despachantes.length === 0 && <div className="p-4 text-center text-gray-500">Nenhum despachante encontrado.</div>}
                        {despachantes && despachantes.length > 0 && (
                            <table className="grupotristao">
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Nome</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {despachantes.map(despachante => (
                                        <tr key={`${despachante.Chave}`} onClick={() => handleSelect(despachante)} className="border-b hover:bg-blue-50 cursor-pointer">
                                            <td>{despachante.Chave}</td>
                                            <td>{despachante.Descricao}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}