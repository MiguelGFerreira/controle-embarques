'use client';

import { useMemo, useState } from "react";
import BebidaInputGroup from "./BebidaInputGroup";
import { Padrao } from "@/app/types";
import { ClassificacaoFormData, PeneiraEntry } from "../[lote]/page";
import PeneiraInputList from "./PeneiraInputList";

interface ClassificationFormProps {
    formData: ClassificacaoFormData;
    setFormData: (setter: (prev: ClassificacaoFormData) => ClassificacaoFormData) => void;
    dropdownOptions: {
        certificados: { code: string; description: string }[];
        peneiras: { code: string; description: string }[];
        bebidas: { code: string; description: string }[];
        cores: { code: string; description: string }[];
    };
    onSave: () => void;
    padraoData: Padrao[];
}

export default function ClassificationForm({ formData, setFormData, dropdownOptions, onSave, padraoData }: ClassificationFormProps) {
    const [isSaving, setIsSaving] = useState(false);

    const handleSimpleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, padrao: '', [name]: value }));
    }

    const handlePadraoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {

        const selectedPadrao = padraoData.find(p => p.description === e.target.value);
        console.log('Padrão selecionado:', selectedPadrao);
        if (selectedPadrao) {
            setFormData((prev: ClassificacaoFormData) => ({
                ...prev,
                padrao: selectedPadrao.description,
                cor: selectedPadrao.Cor,
                Bebida1: selectedPadrao.Bebida1,
                Bebida2: selectedPadrao.Bebida2,
                Bebida1Qty: selectedPadrao.Percen_beb1,
                Bebida2Qty: selectedPadrao.Percen_beb2,
                broca: selectedPadrao.Broca,
                impureza: selectedPadrao.Impureza,
                fundo: selectedPadrao.Fundo,
                umidade: selectedPadrao.Umidade,
                defeito: selectedPadrao.Defeito,
            }));
        } else {
            // se selecionar "Selecione", limpa os campos relacionados
            setFormData(prev => ({ ...prev, padrao: '' }));
        }
    }

    const handleBebida1QtyChange = (qty: number) => {
        const newQty = Math.min(Math.max(qty, 0), 100);
        setFormData(prev => ({ ...prev, padrao: '', Bebida1Qty: newQty, Bebida2Qty: 100 - newQty }));
    }

    const handleBebida2QtyChange = (qty: number) => {
        const newQty = Math.min(Math.max(qty, 0), 100);
        setFormData(prev => ({ ...prev, padrao: '', Bebida2Qty: newQty, Bebida1Qty: 100 - newQty }));
    }

    const handleAddPeneira = () => {
        setFormData(prev => ({
            ...prev,
            peneiras: [...prev.peneiras, { sieveCode: '', percentage: 0 }],
        }));
    };

    const handleRemovePeneira = (index: number) => {
        setFormData(prev => ({
            ...prev,
            peneiras: prev.peneiras.filter((_, i) => i !== index),
        }));
    };

    const handleUpdatePeneira = (index: number, field: keyof PeneiraEntry, value: string | number) => {
        setFormData(prev => {
            const newPeneiras = [...prev.peneiras];
            newPeneiras[index] = { ...newPeneiras[index], [field]: value };
            return { ...prev, peneiras: newPeneiras };
        });
    };

    const isBebidaSumValid = formData.Bebida1Qty + formData.Bebida2Qty === 100;
    const isPeneiraSumValid = useMemo(() => {
        const total = formData.peneiras.reduce((sum, p) => sum + (Number(p.percentage) || 0), 0);
        return total === 100;
    }, [formData.peneiras]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);

        setTimeout(() => {
            onSave();
            setIsSaving(false);
        }, 1000); // Simula um delay de salvamento
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border space-y-8">
            {/* Características Sensoriais */}
            <fieldset>
                <legend className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 w-full">Características Sensoriais</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Padrão</label>
                        <select name="padrao" id="padrao" value={formData.padrao} onChange={handlePadraoChange} className="mt-1 block w-full p-3 border-gray-300 rounded-md shadow-md">
                            <option value="">Selecione</option>
                            {padraoData.map(opt => <option key={opt.code} value={opt.description}>{opt.description}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Cor</label>
                        <select name="cor" id="cor" value={formData.cor} onChange={handleSimpleChange} className="mt-1 block w-full p-3 border-gray-300 rounded-md shadow-md">
                            <option value="">Selecione</option>
                            {dropdownOptions.cores.map(opt => <option key={opt.code} value={opt.code}>{opt.description}</option>)}
                        </select>
                    </div>
                    <BebidaInputGroup
                        label="Bebida 1"
                        options={dropdownOptions.bebidas}
                        value={formData.Bebida1}
                        onBebidaChange={handleSimpleChange}
                        qty={formData.Bebida1Qty}
                        onQtyChange={handleBebida1QtyChange}
                        name="Bebida1"
                    />
                    <BebidaInputGroup
                        label="Bebida 2"
                        options={dropdownOptions.bebidas}
                        value={formData.Bebida2}
                        onBebidaChange={handleSimpleChange}
                        qty={formData.Bebida2Qty}
                        onQtyChange={handleBebida2QtyChange}
                        name="Bebida2"
                    />
                    {!isBebidaSumValid && <p className="col-span-full text-sm text-red-600">A soma das quantidades de bebida deve ser 100.</p>}
                </div>
            </fieldset>

            <PeneiraInputList
                peneiras={formData.peneiras}
                options={dropdownOptions.peneiras}
                onAdd={handleAddPeneira}
                onRemove={handleRemovePeneira}
                onUpdate={handleUpdatePeneira}
            />

            {/* Caracteristicas Fisicas */}
            <fieldset>
                <legend className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 w-full">Características Físicas</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <label htmlFor="broca" className="block text-sm font-medium text-gray-700">Broca</label>
                        <input type="number" step="0.01" name="broca" value={formData.broca} placeholder="Broca" onChange={handleSimpleChange} className="block w-full p-3 border-gray-300 rounded-md shadow-md" />
                    </div>
                    <div>
                        <label htmlFor="impureza" className="block text-sm font-medium text-gray-700">Impureza</label>
                        <input type="number" step="0.01" name="impureza" value={formData.impureza} placeholder="Impureza" onChange={handleSimpleChange} className="block w-full p-3 border-gray-300 rounded-md shadow-md" />
                    </div>
                    <div>
                        <label htmlFor="fundo" className="block text-sm font-medium text-gray-700">Fundo</label>
                        <input type="number" step="0.01" name="fundo" value={formData.fundo} placeholder="Fundo" onChange={handleSimpleChange} className="block w-full p-3 border-gray-300 rounded-md shadow-md" />
                    </div>
                    <div>
                        <label htmlFor="umidade" className="block text-sm font-medium text-gray-700">Umidade</label>
                        <input type="number" step="0.01" name="umidade" value={formData.umidade} placeholder="Umidade" onChange={handleSimpleChange} className="block w-full p-3 border-gray-300 rounded-md shadow-md" />
                    </div>
                    <div>
                        <label htmlFor="defeito" className="block text-sm font-medium text-gray-700">Defeito</label>
                        <input type="number" step="0.01" name="defeito" value={formData.defeito} placeholder="Defeito" onChange={handleSimpleChange} className="block w-full p-3 border-gray-300 rounded-md shadow-md" />
                    </div>
                </div>
            </fieldset>

            <div className="flex justify-end pt-6 border-t">
                <button type="submit" disabled={!isBebidaSumValid || !isPeneiraSumValid || isSaving} className="botao">
                    {isSaving ? 'Salvando...' : 'Salvar Classificação'}
                </button>
            </div>
        </form>
    )
}