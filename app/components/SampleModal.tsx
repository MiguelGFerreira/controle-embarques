"use client";

import { useEffect, useRef, useState } from "react";
import { Sample, Shipment } from "../types";
import { Loader2, PlusCircle, X } from "lucide-react";
import { toast } from "sonner";
import useSWR from "swr";
import LoadingSpinner from "./LoadingSpinner";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const SampleForm = ({ shipment, existingSamplesCount, onSave, onCancel }: any) => {
    const [formData, setFormData] = useState({
        nroAmostra: '',
        quantidade: '',
        pesoBruto: '',
        dtEnvio: '',
        conhecimentoAereo: '',
        dtAprov: '',
        dtRejeicao: '',
        classifRejeicao: '',
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const tipoAmostra = existingSamplesCount === 0 ? 'P' : 'E';

        try {
            const response = await fetch(`api/embarques/${shipment.R_E_C_N_O_}/amostras`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, tipoAmostra })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao salvar a amostra.');
            }

            toast.success("Amostra salva com sucesso!");
            onSave(); // notificando o pai pra revalidar os dados
        }
        catch (error: any) {
            toast.error('Erro ao salvar amostra:', { description: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="bg-gray-50 p-4 rounded-b-lg mt-4 border-t">
            <h3 className="font-semibold text-lg mb-2 text-gray-700">
                {existingSamplesCount === 0 ? 'Cadastrar primeira amostra' : 'Cadastrar nova amostra'}
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <input name="nroAmostra" onChange={e => setFormData({...formData, nroAmostra: e.target.value})} placeholder="Nro. Amostra" required className="p-2 border rounded" />
                <input name="quantidade" type="number" onChange={e => setFormData({...formData, quantidade: e.target.value})} placeholder="Quantidade" required className="p-2 border rounded" />
                <input name="pesoBruto" type="number" onChange={e => setFormData({...formData, pesoBruto: e.target.value})} placeholder="Peso Bruto" required className="p-2 border rounded" />
                <input name="conhecimentoAereo" onChange={e => setFormData({...formData, conhecimentoAereo: e.target.value})} placeholder="Conh. Aéreo" required className="p-2 border rounded" />
            </div>
            <div className="flex justify-end mt-4 gap-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-white text-gray-600 border rounded cursor-pointer">Cancelar</button>
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-green-300 cursor-pointer">
                    {isSaving ? 'Salvando...' : 'Salvar Amostra'}
                </button>
            </div>
        </form>
    )
}

export default function SampleModal({ shipment, onClose }: { shipment: Shipment | null; onClose: () => void; }) {
    const [isAddingNew, setIsAddingNew] = useState(false);
    const apiUrl = shipment ? `/api/embarques/${shipment.R_E_C_N_O_}/amostras` : null;
    const { data: samples, error, isLoading, mutate } = useSWR<Sample[]>(apiUrl, fetcher);

    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsAddingNew(false);
    }, [shipment]);

    if (!shipment) return null;

    const handleSave = () => {
        mutate();
        setIsAddingNew(false);
    }

    const renderContent = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center p-8"><LoadingSpinner /></div>;
        }
        if (error) {
            return <div className="p-8 text-red-500">Erro ao carregar as amostras.</div>;
        }
        if (samples && samples.length === 0 && !isAddingNew) {
            return <SampleForm shipment={shipment} existingSamplesCount={0} onSave={handleSave} onCancel={onClose} />;
        }
        if (samples && samples.length > 0) {
            return (
                <div>
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 text-left">Nro. Amostra</th>
                                <th className="p-2 text-left">Tipo</th>
                                <th className="p-2 text-left">Status</th>
                                <th className="p-2 text-left">Qtd</th>
                            </tr>
                        </thead>
                        <tbody>
                            {samples.map(sample => (
                                <tr key={sample["Nro. Amostra"]} className="border-b">
                                    <td className="p-2">{sample["Nro. Amostra"]}</td>
                                    <td className="p-2">{sample["Amostra por:"]}</td>
                                    <td className="p-2">{sample.Status}</td>
                                    <td className="p-2">{sample.Quantidade}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {isAddingNew ? (
                        <SampleForm shipment={shipment} existingSamplesCount={samples.length} onSave={handleSave} onCancel={() => setIsAddingNew(false)} />
                    ) : (
                        <div className="p-4 flex justify-end">
                            <button onClick={() => setIsAddingNew(true)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded">
                                <PlusCircle size={16} /> Adicionar Amostra
                            </button>
                        </div>
                    )}
                </div>
            )
        }
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <header className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Amostras do Embarque {shipment.Embarque}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-600 cursor-pointer hover:bg-gray-200"><X size={20} /></button>
                </header>
                <main className="overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}