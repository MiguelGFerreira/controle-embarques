import { ClassificationBatch } from "@/app/types";
import { formatarDataIso } from "@/app/utils";

interface ClassificationTableProps {
    data: ClassificationBatch[];
    isLoading: boolean;
    selectedLote: ClassificationBatch | null;
    onLoteSelect: (lote: ClassificationBatch) => void;
}

function SkeletonRow() {
    return (
        <tr className="animate-pulse">
            <td className="p-4"><div className="h-4 bg-gray-200 rounded"></div></td>
            <td className="p-4"><div className="h-4 bg-gray-200 rounded"></div></td>
            <td className="p-4"><div className="h-4 bg-gray-200 rounded"></div></td>
            <td className="p-4"><div className="h-4 bg-gray-200 rounded"></div></td>
        </tr>
    )
}

export default function ClassificacaoTable({ data, isLoading, selectedLote, onLoteSelect }: ClassificationTableProps) {
    if (isLoading) {
        return (
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border">
                <table className="grupotristao">
                    <thead>
                        <tr>
                            <th>Lote</th>
                            <th>Sacas</th>
                            <th>Fornecedor</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
                    </tbody>
                </table>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return <div className="text-center p-8 bg-white rounded-md shadow">Nenhum lote encontrado para os filtros selecionados.</div>
    }

    return (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border">
            <table className="grupotristao">
                <thead>
                    <tr>
                        <th>Lote</th>
                        <th>Sacas</th>
                        <th>Fornecedor</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((lote) => (
                        <tr
                            key={lote.Lote}
                            onClick={() => onLoteSelect(lote)}
                            className={`cursor-pointer transition-colors ${selectedLote === lote ? "bg-green-100 ring-2 ring-green-500" : "hover:bg-gray-50"}`}
                        >
                            <td>{lote.Lote}</td>
                            <td>{lote.Sacas}</td>
                            <td>{lote.Fornecedor}</td>
                            <td>{formatarDataIso(lote.Data)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}