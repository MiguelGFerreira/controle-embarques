"use client";

import { useState } from "react";
import useDebounce from "../utils/useDebounce";
import useSWR from "swr";
import { Search, X } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface Cliente {
    Codigo: string;
    Nome: string;
    Loja: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onClientSelect: (cliente: Cliente) => void;
}

export default function ClientLookUpModal({ isOpen, onClose, onClientSelect }: ModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    let apiUrl = `/api/clientes`;

    if (debouncedSearchTerm) {
        apiUrl += `?search=${debouncedSearchTerm}`
    }


    const { data: clients, error, isLoading } = useSWR<Cliente[]>(apiUrl, fetcher);

    if (!isOpen) return null;

    const handleSelect = (client: Cliente) => {
        onClientSelect(client);
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                <header className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Buscar Cliente</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-600 hover:bg-gray-200 cursor-pointer"><X size={20} /></button>
                </header>

                <main className="p-4">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por código, nome ou CNPJ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full !pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                            autoFocus
                        />
                    </div>

                    <div className="overflow-y-auto h-[45vh] border rounded-md">
                        {isLoading && <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}
                        {error && <div className="p-4 text-red-500">Erro ao carregar clientes.</div>}
                        {clients && clients.length === 0 && <div className="p-4 text-center text-gray-500">Nenhum cliente encontrado.</div>}
                        {clients && clients.length > 0 && (
                            <table className="grupotristao">
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Nome</th>
                                        <th>Loja</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clients.map(client => (
                                        <tr key={`${client.Codigo}-${client.Loja}`} onClick={() => handleSelect(client)} className="border-b hover:bg-blue-50 cursor-pointer">
                                            <td>{client.Codigo}</td>
                                            <td>{client.Nome}</td>
                                            <td>{client.Loja}</td>
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