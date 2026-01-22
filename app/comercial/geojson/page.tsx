'use client';

import { ConversorInput } from "@/app/types/geojson";
import { useEffect, useState } from "react";
import { DropzoneUpload } from "./components/DropzoneUpload";
import { FilesList } from "./components/FilesList";
import { GeoJsonItemForm } from "./components/GeoJsonItemForm";

type Item = {
    file: File
    geojson: any
    input: ConversorInput
}

export default function ConversorGeoJsonPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleFiles(files: FileList | null) {
        if (!files) return;

        const newItems: Item[] = [];

        for (const file of Array.from(files)) {
            const text = await file.text();
            const geojson = JSON.parse(text);

            newItems.push({
                file,
                geojson,
                input: {
                    producerName: '',
                    producerCountry: 'BR',
                    producerPlace: '',
                    plotName: '',
                    areaHa: 0
                }
            })
        }

        setItems(newItems);
    }

    function copyFromPrevious(index: number) {
        setItems(prev => {
            if (index === 0) return prev;

            const copy = [...prev];
            copy[index] = {
                ...copy[index],
                input: { ...copy[index - 1].input }
            };

            return copy;
        })
    }

    function updateInput(index: number, field: keyof ConversorInput, value: string | number) {
        setItems(prev => {
            const copy = [...prev]
            copy[index] = {
                ...copy[index],
                input: {
                    ...copy[index].input,
                    [field]: value
                }
            }
            return copy
        })
    }

    async function handleConvert() {
        setError(null);

        if (items.length === 0) {
            setError('Selecione pelo menos um arquivo');
            return;
        }

        for (const item of items) {
            const i = item.input;
            if (!i.producerName || !i.producerPlace || !i.plotName || !i.areaHa) {
                setError(`Preencha todos os campos do arquivo ${item.file.name}`);
                return;
            }
        }

        try {
            setLoading(true);

            const res = await fetch('/api/geojson/conversor/multi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items.map(i => ({ geojson: i.geojson, input: i.input }))
                })
            })

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || 'Erro ao converter')
            }

            const blob = new Blob(
                [JSON.stringify(result, null, 2)],
                { type: 'application/geo+json' }
            );

            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'output.geojson';
            a.click();

            URL.revokeObjectURL(url);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        document.title = "Geojson";
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6">
            <div className="mx-auto max-w-5xl space-y-8">
                <div>
                    <h1 className="text-3xl font-semibold text-green-700">Conversor GeoJSON</h1>
                    <p className="mt-2 text-sm text-gray-600">Converta múltiplos arquivos GeoJSON preenchendo os dados individualmente</p>
                </div>

                <DropzoneUpload onFiles={handleFiles} />

                <div>
                    <FilesList files={items.map(i => i.file)} />
                </div>

                <div className="space-y-6">
                    {items.map((item, index) => (
                        <GeoJsonItemForm
                            key={index}
                            fileName={item.file.name}
                            input={item.input}
                            showCopyButton={index > 0}
                            onCopyFromPrevious={() => copyFromPrevious(index)}
                            onChange={(field, value) => updateInput(index, field, value)}
                        />
                    ))}
                </div>

                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
                )}

                <div className="flex justify-end">
                    <button onClick={handleConvert} disabled={loading || items.length === 0} className="botao">
                        {loading ? 'Convertendo...' : 'Converter'}
                    </button>
                </div>
            </div>
        </div>
    )
}