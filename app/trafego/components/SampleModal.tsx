"use client";

import { useEffect, useRef, useState } from "react";
import { Sample, Shipment } from "../../types";
import { Edit, Loader2, PlusCircle, Search, X } from "lucide-react";
import { toast } from "sonner";
import useSWR from "swr";
import LoadingSpinner from "../../components/LoadingSpinner";
import ClientLookUpModal from "./gerenciamento/embarques/ClientLookUpModal";
import { formatarDataParaInput, formatarDataView } from "../../utils";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const SampleForm = ({ shipment, existingSamplesCount, onSave, onCancel, defaultClientCode, defaultClientStore, sampleToEdit }: any) => {
    const [formData, setFormData] = useState({
        nroAmostra: '',
        quantidade: '',
        pesoBruto: '',
        dtEnvio: '',
        conhecimentoAereo: '',
        dtAprov: '',
        dtRejeicao: '',
        classifRejeicao: '',
        clienteCod: '',
        clienteLoja: '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isClientLookUpOpen, setIsClientLookUpOpen] = useState(false);

    const isEditMode = !!sampleToEdit;

    useEffect(() => {
        if (isEditMode && sampleToEdit) {
            setFormData({
                nroAmostra: sampleToEdit['Nro. Amostra'],
                quantidade: sampleToEdit['Quantidade'],
                pesoBruto: sampleToEdit['Peso Bruto'],
                dtEnvio: formatarDataParaInput(sampleToEdit['Dt. Envio']),
                conhecimentoAereo: sampleToEdit['Conh. Aereo'],
                dtAprov: formatarDataParaInput(sampleToEdit['Data Aprov.']),
                dtRejeicao: formatarDataParaInput(sampleToEdit['Dt. Rejeição']),
                classifRejeicao: sampleToEdit['Classif. Rej'],
                clienteCod: sampleToEdit['Cliente'],
                clienteLoja: sampleToEdit['Loja Cliente'],
            });
        } else {
            setFormData({
                nroAmostra: '',
                quantidade: '',
                pesoBruto: '',
                dtEnvio: '',
                conhecimentoAereo: '',
                dtAprov: '',
                dtRejeicao: '',
                classifRejeicao: '',
                clienteCod: defaultClientCode || '',
                clienteLoja: defaultClientStore || '',
            });
        }
    }, [isEditMode, sampleToEdit, defaultClientCode, defaultClientStore]);

    // useEffect(() => {
    //     if (defaultClientCode && defaultClientStore) {
    //         setFormData(prev => ({
    //             ...prev,
    //             clienteCod: defaultClientCode,
    //             clienteLoja: defaultClientStore,
    //         }));
    //     }
    // }, [defaultClientCode, defaultClientStore]);

    const handleClientSelect = (client: { Codigo: string, Loja: string, Nome: string }) => {
        setFormData(prev => ({
            ...prev,
            clienteCod: client.Codigo,
            clienteLoja: client.Loja,
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const url = isEditMode
            ? `/api/embarques/${shipment.R_E_C_N_O_}/amostras/${sampleToEdit.R_E_C_N_O_}`
            : `/api/embarques/${shipment.R_E_C_N_O_}/amostras`;

        const method = isEditMode ? 'PUT' : 'POST';

        const bodyPayLoad: any = { ...formData };
        if (!isEditMode) {
            bodyPayLoad.tipoAmostra = existingSamplesCount === 0 ? 'P' : 'E';
        }

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyPayLoad)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Falha ao ${isEditMode ? 'atualizar' : 'salvar'} a amostra.`);
            }

            toast.success(`Amostra ${isEditMode ? 'atualizada' : 'salva'} com sucesso!`);
            onSave(); // notificando o pai pra revalidar os dados
        }
        catch (error: any) {
            toast.error(`Erro ao ${isEditMode ? 'atualizar' : 'salvar'} amostra:`, { description: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSave} className="bg-gray-50 p-4 rounded-b-lg mt-4 border-t border-gray-200">
                <h3 className="font-semibold text-lg mb-2 text-gray-700">
                    {isEditMode ? `Editar Amostra ${sampleToEdit['Nro. Amostra']}` : (existingSamplesCount === 0 ? 'Cadastrar primeira amostra' : 'Cadastrar nova amostra')}
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="nroAmostra" className="block text-sm font-medium text-gray-700 mb-1">Nro. Amostra</label>
                        <input id="nroAmostra" name="nroAmostra" maxLength={20} value={formData.nroAmostra} onChange={e => setFormData({ ...formData, nroAmostra: e.target.value })} placeholder="Nro. Amostra" required readOnly={isEditMode} className="p-2 border rounded w-full" />
                    </div>
                    <div>
                        <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                        <input id="quantidade" name="quantidade" type="number" value={formData.quantidade} onChange={e => setFormData({ ...formData, quantidade: e.target.value })} placeholder="Quantidade" className="p-2 border rounded w-full" />
                    </div>
                    <div>
                        <label htmlFor="pesoBruto" className="block text-sm font-medium text-gray-700 mb-1">Peso Bruto</label>
                        <input id="pesoBruto" name="pesoBruto" type="number" value={formData.pesoBruto} onChange={e => setFormData({ ...formData, pesoBruto: e.target.value })} placeholder="Peso Bruto" className="p-2 border rounded w-full" />
                    </div>
                    <div>
                        <label htmlFor="conhecimentoAereo" className="block text-sm font-medium text-gray-700 mb-1">Conh. Aéreo</label>
                        <input id="conhecimentoAereo" name="conhecimentoAereo" value={formData.conhecimentoAereo} onChange={e => setFormData({ ...formData, conhecimentoAereo: e.target.value })} placeholder="Conh. Aéreo" className="p-2 border rounded w-full" />
                    </div>
                    <div>
                        <label htmlFor="dtEnvio" className="block text-sm font-medium text-gray-700 mb-1">Dt. Envio</label>
                        <input id="dtEnvio" name="dtEnvio" type="date" value={formData.dtEnvio} onChange={e => setFormData({ ...formData, dtEnvio: e.target.value })} placeholder="Dt. Envio" className="p-2 border rounded w-full" />
                    </div>
                    <div>
                        <label htmlFor="dtAprov" className="block text-sm font-medium text-gray-700 mb-1">Data Aprov.</label>
                        <input id="dtAprov" name="dtAprov" type="date" value={formData.dtAprov} onChange={e => setFormData({ ...formData, dtAprov: e.target.value })} placeholder="Data Aprov." className="p-2 border rounded w-full" />
                    </div>
                    <div>
                        <label htmlFor="dtRejeicao" className="block text-sm font-medium text-gray-700 mb-1">Dt. Rejeição</label>
                        <input id="dtRejeicao" name="dtRejeicao" type="date" value={formData.dtRejeicao} onChange={e => setFormData({ ...formData, dtRejeicao: e.target.value })} placeholder="Dt. Rejeição" className="p-2 border rounded w-full" />
                    </div>
                    {/* <div className="flex items-center gap-2">
                        <input name="classifRejeicao" onChange={e => setFormData({ ...formData, classifRejeicao: e.target.value })} placeholder="Classif. Rej" className="p-2 border rounded" />
                        <button type="button" onClick={() => setIsClientLookUpOpen(true)} className="p-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 cursor-pointer">
                            <Search size={20} />
                        </button>
                    </div> */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                        <label htmlFor="cliente" className="block text-sm font-medium text-gray-700">Cliente</label>
                        <div className="flex items-center gap-2 mt-1">
                            <input
                                id="clienteCod"
                                value={formData.clienteCod}
                                placeholder="Código"
                                className="p-2 border rounded w-1/3 bg-gray-200"
                                readOnly
                            />
                            <input
                                id="clienteLoja"
                                value={formData.clienteLoja}
                                placeholder="Loja"
                                className="p-2 border rounded w-1/3 bg-gray-200"
                                readOnly
                            />
                            <button type="button" onClick={() => setIsClientLookUpOpen(true)} className="p-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 cursor-pointer">
                                <Search size={20} />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end mt-4 gap-2">
                    <button type="button" onClick={onCancel} className="px-4 py-2 bg-white text-gray-600 border rounded cursor-pointer">Cancelar</button>
                    <button className="flex justify-center items-center gap-2 px-4 py-2 bg-green-600 text-white rounded disabled:bg-green-300 cursor-pointer">
                        {isSaving && <Loader2 className="animate-spin" size={16} />}
                        {isSaving ? 'Salvando...' : (isEditMode ? 'Salvar alterações' : 'Salvar Amostra')}
                    </button>
                </div>
            </form>

            <ClientLookUpModal
                isOpen={isClientLookUpOpen}
                clientCode={defaultClientCode}
                onClose={() => setIsClientLookUpOpen(false)}
                onClientSelect={handleClientSelect}
            />
        </>
    )
}

export default function SampleModal({ shipment, onClose }: { shipment: Shipment | null; onClose: () => void; }) {
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editingSample, setEditingSample] = useState<Sample | null>(null);

    const apiUrl = shipment ? `/api/embarques/${shipment.R_E_C_N_O_}/amostras` : null;
    const { data: samples, error, isLoading, mutate } = useSWR<Sample[]>(apiUrl, fetcher);

    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsAddingNew(false);
        setEditingSample(null);
    }, [shipment]);

    if (!shipment) return null;

    const handleSave = () => {
        mutate();
        setIsAddingNew(false);
        setEditingSample(null);
    }

    const handleCancel = () => {
        setIsAddingNew(false);
        setEditingSample(null);
        onClose();
    }

    const isFormOpen = isAddingNew || editingSample;

    const renderContent = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center p-8"><LoadingSpinner /></div>;
        }
        if (error) {
            return <div className="p-8 text-red-500">Erro ao carregar as amostras.</div>;
        }
        if (samples && samples.length === 0 && !isFormOpen) {
            return <SampleForm
                shipment={shipment}
                existingSamplesCount={0}
                onSave={handleSave}
                onCancel={handleCancel}
                defaultClientCode={shipment.Cliente}
                defaultClientStore={shipment.Loja}
            />;
        }
        if (samples && samples.length > 0) {
            return (
                <div className="!p-2">
                    <table className="grupotristao">
                        <thead>
                            <tr>
                                <th>Nro. Amostra</th>
                                <th>Tipo</th>
                                <th>Qtd</th>
                                <th>Dt. Envio</th>
                                <th>Cliente</th>
                                <th>Data Aprov.</th>
                                <th>Dt. Rejeição</th>
                                {/* <th>Classif. Rej</th> */}
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {samples.map(sample => (
                                <tr key={sample["Nro. Amostra"]}>
                                    <td>{sample["Nro. Amostra"]}</td>
                                    <td>{sample["Amostra por:"]}</td>
                                    <td>{sample.Quantidade}</td>
                                    <td>{formatarDataView(sample["Dt. Envio"])}</td>
                                    <td>{sample["Cliente Nome"]}</td>
                                    <td>{formatarDataView(sample["Data Aprov."])}</td>
                                    <td>{formatarDataView(sample["Dt. Rejeição"])}</td>
                                    {/* <td>{sample["Classif. Rej"]}</td> */}
                                    <td>
                                        <button
                                            onClick={() => setEditingSample(sample)}
                                            className="p-1 text-green-600 hover:text-green-800 cursor-pointer"
                                            title="Editar Amostra"
                                        >
                                            <Edit size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {isFormOpen ? (
                        <SampleForm
                            shipment={shipment}
                            sampleToEdit={editingSample}
                            existingSamplesCount={samples.length}
                            onSave={handleSave}
                            onCancel={handleCancel}
                            defaultClientCode={shipment.Cliente}
                            defaultClientStore={shipment.Loja}
                        />
                    ) : (
                        <div className="p-4 flex justify-end">
                            <button onClick={() => setIsAddingNew(true)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded cursor-pointer">
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
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
                <header className="flex justify-between items-center p-4 border-b border-gray-200">
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