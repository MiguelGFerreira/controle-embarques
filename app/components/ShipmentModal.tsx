"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { FILIAL_NAMES, Shipment } from "../types";
import { toast } from "sonner";
import { Search, X } from "lucide-react";
import { editableFieldsConfig } from "../utils";
import FormField from "./FormField";
import DespachanteLookUpModal from "./gerenciamento/embarques/DespachanteLookUpModal";
import ArmadorLookUpModal from "./gerenciamento/embarques/ArmadorLookUpModal";

interface ModalProps {
    shipment: Shipment | null;
    onClose: () => void;
    onSave: () => void;
}

export default function ShipmentModal({ shipment, onClose, onSave }: ModalProps) {
    const [formData, setFormData] = useState<Partial<Shipment>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [isDespachanteLookUpOpen, setIsDespachanteLookUpOpen] = useState(false);
    const [isArmadorLookUpOpen, setIsArmadorLookUpOpen] = useState(false);

    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (shipment) {
            setFormData(shipment);
        }
    }, [shipment]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', onKeyDown);
    }, [onClose]);

    const handleOverlayMouseDown = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) {
            onClose();
        }
    };

    const handleDespachanteSelect = (despachante: { Chave: string, Descricao: string, }) => {
        setFormData(prev => ({
            ...prev,
            "Cod Despacha": despachante.Chave,
        }));
    };

    const handleArmadorSelect = (armador: { Codigo: string, Nome: string, }) => {
        setFormData(prev => ({
            ...prev,
            "Cod. Arm": armador.Codigo,
        }));
    };

    if (!shipment) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleSave = async () => {
        setIsSaving(true);
        const payload: { [key: string]: any } = {};
        editableFieldsConfig.forEach(field => {
            payload[field.key] = formData[field.key as keyof Shipment];
        });

        if (formData["Cod. Arm"]) {
            payload['armador'] = formData["Cod. Arm"]
        }

        if (formData["Cod Despacha"]) {
            payload['despachante'] = formData["Cod Despacha"]
        }

        try {
            const response = await fetch(`/api/embarques/${shipment.R_E_C_N_O_}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao salvar no servidor.');
            }

            toast.success('Embarque atualizado com sucesso!');
            onSave(); // notifica parent pra atualizar a lista
            onClose(); // fecha o modal
        } catch (error: any) {
            toast.error('Erro ao salvar:', { description: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div
            ref={overlayRef}
            onMouseDown={handleOverlayMouseDown}
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            role="presentation"
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <header className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Editar Datas - Embarque {shipment.Embarque}</h2>
                    <button onClick={onClose} className="text-gray-500 p-1 rounded-full hover:bg-gray-200 cursor-pointer"><X size={20} /></button>
                </header>

                <main className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                        <div className="texto"><strong>IDE</strong> {shipment.IDE}</div>
                        <div className="texto"><strong>Filial</strong> {FILIAL_NAMES[Number(shipment.Filial)]}</div>
                        <div className="texto"><strong>Importador</strong> {shipment.Importador}</div>
                        <div className="texto"><strong>Ref. Importador</strong> {shipment["Ref.Import."]}</div>
                        <div className="texto"><strong>Status</strong> {shipment.Status}</div>
                        <div className="texto"><strong>Rota</strong> {shipment.Rota}</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                        {editableFieldsConfig.map(field => (
                            <div key={field.key}>
                                <label htmlFor={field.key} className="block text-sm font-medium text-gray-700">{field.key}</label>
                                <FormField
                                    field={field}
                                    value={formData[field.key as keyof Shipment]}
                                    maxLength={field.maxLength}
                                    onChange={handleInputChange}
                                />
                            </div>
                        ))}
                        <div>
                            <label htmlFor="despachante" className="block text-sm font-medium text-gray-700">Despachante</label>
                            <div className="flex">
                                <input
                                    id="despachante"
                                    type="text"
                                    value={formData["Cod Despacha"] || ''}
                                    placeholder="Despachante"
                                    className="bg-gray-200 cursor-not-allowed"
                                    readOnly
                                />
                                <button type="button" onClick={() => setIsDespachanteLookUpOpen(true)} className="p-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 cursor-pointer">
                                    <Search size={20} />
                                </button>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="armador" className="block text-sm font-medium text-gray-700">Armador</label>
                            <div className="flex">
                                <input
                                    id="armador"
                                    type="text"
                                    value={formData["Cod. Arm"] || ''}
                                    placeholder="Armador"
                                    className="bg-gray-200 cursor-not-allowed"
                                    readOnly
                                />
                                <button type="button" onClick={() => setIsArmadorLookUpOpen(true)} className="p-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 cursor-pointer">
                                    <Search size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="flex justify-end items-center p-4 border-t bg-gray-50">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 mr-2 cursor-pointer">
                        Cancelar
                    </button>
                    <button onClick={handleSave} disabled={isSaving} className="bg-green-800 text-white font-semibold text-sm px-4 py-2 rounded-md hover:bg-green-600 cursor-pointer transition-all duration-300 disabled:bg-green-300">
                        {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </footer>
            </div>

            <DespachanteLookUpModal
                isOpen={isDespachanteLookUpOpen}
                onClose={() => setIsDespachanteLookUpOpen(false)}
                onDespachanteSelect={handleDespachanteSelect}
            />

            <ArmadorLookUpModal
                isOpen={isArmadorLookUpOpen}
                onClose={() => setIsArmadorLookUpOpen(false)}
                onArmadorSelect={handleArmadorSelect}
            />
        </div>
    );
}