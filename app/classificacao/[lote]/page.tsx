'use client';

import LoadingSpinner from "@/app/components/LoadingSpinner";
import { ClassificationBatch, Padrao } from "@/app/types";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import useSWR from "swr";
import ClassificationForm from "../components/ClassificationForm";

const fetcher = (url: string) => fetch(url).then(res => res.json());


interface DropdownOption {
    code: string;
    description: string;
}

export interface PeneiraEntry {
    sieveCode: string;
    percentage: number | string;
}

export interface ClassificacaoFormData {
    padrao: string;
    cor: string;
    Bebida1: string;
    Bebida2: string;
    Bebida1Qty: number;
    Bebida2Qty: number;
    broca: number | string;
    impureza: number | string;
    fundo: number | string;
    umidade: number | string;
    onoff: number | string;
    defeito: number | string;
    peneiras: PeneiraEntry[];
    // certificado: string;
}

const initialFormData: ClassificacaoFormData = {
    padrao: '', cor: '', Bebida1: '', Bebida2: '',
    Bebida1Qty: 100, Bebida2Qty: 0,
    broca: '', impureza: '', fundo: '', umidade: '', onoff: '', defeito: '',
    peneiras: [{ sieveCode: '', percentage: 100 }],
}

export default function ClassificacaoPage({ params }: { params: Promise<{ lote: string }> }) {
    const router = useRouter();
    const { lote } = use(params);

    const { data: loteResponse, error: loteError, isLoading: isLoteLoading } = useSWR(`/api/classificacao?lote=${lote}`, fetcher);

    const loteData: ClassificationBatch | undefined = loteResponse?.data[0];

    const { data: padroesData } = useSWR<Padrao[]>(loteData ? `/api/padroes?produto=${loteData.Produto}` : null, fetcher);
    const { data: certificadosData } = useSWR<DropdownOption[]>('/api/certificados', fetcher);
    const { data: peneirasData } = useSWR<DropdownOption[]>('/api/peneiras', fetcher);
    const { data: bebidasData } = useSWR<DropdownOption[]>('/api/bebidas', fetcher);
    const { data: coresData } = useSWR<DropdownOption[]>('/api/cores', fetcher);

    const [formData, setFormData] = useState<ClassificacaoFormData>(initialFormData);

    const handleSave = () => {
        const apiUrl = '/api/classificacao';
        const payload = { lote: loteData, ...formData };
        console.log('Payload a ser enviado:', payload);

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao salvar dados');
                }
                return response.json();
            })
            .then(data => {
                console.log('Dados salvos com sucesso:', data);
            })
            .catch(error => {
                console.error('Erro ao salvar dados:', error);
            });
    }

    useEffect(() => {
        if (loteData?.Lote) {
            document.title = `Classificação do Lote ${loteData.Lote}`; // Muda o título da página dinamicamente no lado do cliente
        }
    }, [loteData?.Lote])

    if (isLoteLoading) return <LoadingSpinner />;
    if (loteError || !loteData) return <div className="p-8 text-center text-red-500">Erro ao carregar dados do lote.</div>;

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <header className="space-y-4">
                <div>
                    <button onClick={() => router.back()} className="botao flex gap-2">
                        <ArrowLeft size={16} />
                        Voltar para a lista de lotes
                    </button>
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Classificação do Lote {loteData.Lote}</h1>
                    <div className="mt-2 flex items-center gap-6 text-base text-gray-600">
                        <span><strong>Grupo:</strong> {loteData.Produto === 'ARA' ? 'Arábica' : 'Conilon'}</span>
                        <span><strong>Fornecedor:</strong> {loteData.Fornecedor}</span>
                        <span><strong>Sacas:</strong> {loteData.Sacas}</span>
                    </div>
                </div>
            </header>

            <ClassificationForm
                formData={formData}
                setFormData={setFormData}
                dropdownOptions={{
                    certificados: certificadosData || [],
                    peneiras: peneirasData || [],
                    bebidas: bebidasData || [],
                    cores: coresData || [],
                }}
                onSave={handleSave}
                padraoData={padroesData || []}
            />
        </div>
    )
}