import { shipmentRecord, ShipmentStatus } from "@/app/types";
import LoadingSpinner from "../LoadingSpinner";
import { formatarDataIso } from "@/app/utils";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, ChevronRight } from "lucide-react";

type SortableKeys = keyof shipmentRecord;
type SortDirection = 'ascending' | 'descending';

// const statusColorMap: Record<ShipmentStatus, string> = {
//     'No Porto': 'bg-blue-200 text-blue-800',
//     'Amostra Aprovada': 'bg-green-200 text-green-800',
//     'Amostra Pendente': 'bg-yellow-200 text-yellow-800',
//     'Amostra Enviada': 'bg-orange-200 text-orange-800',
//     'Sem Amostra': 'bg-gray-200 text-gray-800',
// }

function ExpandedDetails({ item }: { item: shipmentRecord }) {
    const DetailItem = ({ label, value }: { label: string; value: string | number | null | undefined }) => {
        if (!value) return null;
        return (
            <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-500">{label}</span>
                <span className="text-sm text-gray-800">{value}</span>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-3 p-4 bg-green-50/40">
            <DetailItem label="Booking" value={item.Nr_Booking} />
            <DetailItem label="Prazo Freetime" value={item.Prazo_Freetime} />
            <DetailItem label="Rota" value={item.Rota} />
            <DetailItem label="Navio" value={item.Navio} />
            <DetailItem label="Quantidade (Kg)" value={item.Quantidade} />
            <DetailItem label="Embalagem" value={item.Embalagem} />
            <DetailItem label="Invoice" value={item.Invoice} />
            <DetailItem label="Viagem" value={item.Viagem} />
            <DetailItem label="Fumigação" value={item.Fumigacao} />
            <DetailItem label="Data Fumigação" value={formatarDataIso(item.Dt_Fumigacao)} />
            <DetailItem label="Local Fumigação" value={item.Local_Fumigacao} />
            <DetailItem label="Inspeção Fito." value={item.Inspecao_Fitossanitaria} />
            <DetailItem label="Data Inspeção Fito." value={formatarDataIso(item.Dt_Insp_Fitossan)} />
            <DetailItem label="Armador" value={item.Armador} />
            <DetailItem label="Despachante" value={item.Despachante} />
            <DetailItem label="Obs." value={item.Obs_Planilha} />
        </div>
    )
}

function TableRow({ item }: { item: shipmentRecord }) {
    const [isExpanded, setIsExpanded] = useState(false);

    // const statusColorMap: Record<ShipmentStatus, string> = {
    //     'No Porto': 'bg-blue-200 text-blue-800',
    //     'Amostra Aprovada': 'bg-green-200 text-green-800',
    //     'Amostra Pendente': 'bg-yellow-200 text-yellow-800',
    //     'Amostra Enviada': 'bg-orange-200 text-orange-800',
    //     'Sem Amostra': 'bg-gray-200 text-gray-800',
    // }

    return (
        <>
            <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                {/* <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColorMap[item.Status]}`}>
                        {item.Status}
                    </span>
                </td> */}
                <td>{Math.floor(item.Quantidade / 60)}</td>
                <td>{item.IDE}</td>
                <td>{formatarDataIso(item.ETA)}</td>
                <td>{formatarDataIso(item.Retir_CTNR)}</td>
                <td>{formatarDataIso(item.Dt_Estufagem)}</td>
                <td>{formatarDataIso(item.Chegar_Porto)}</td>
                <td>{formatarDataIso(item.DeadLine_Carga)}</td>
                <td>{formatarDataIso(item.DeadLine_Draft)}</td>
                <td>{item.Destino}</td>
                <td>{item.Ref_Import}</td>
                <td>
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </td>
            </tr>
            {isExpanded && (
                <tr>
                    <td colSpan={11}>
                        <ExpandedDetails item={item} />
                    </td>
                </tr>
            )}
        </>
    );
}

interface ShipmentTableProps {
    data: shipmentRecord[];
    isLoading: boolean;
}

export default function ShipmentTable({ data, isLoading }: ShipmentTableProps) {
    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys, direction: SortDirection} | null>(null);

    const sortedItems = useMemo(() => {
        let sortableItems = [...data];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue === null || aValue === '') return 1;
                if (bValue === null || aValue === '') return -1;

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [data, sortConfig]);

    const requestSort = (key: SortableKeys) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const SortableHeader = ({ label, columnKey }: { label: string; columnKey: SortableKeys }) => {
        const isSorted = sortConfig?.key === columnKey;
        return (
            <th className="cursor-pointer" onClick={() => requestSort(columnKey)}>
                <div className="flex items-center gap-2">
                    {label}
                    {isSorted && (
                        sortConfig.direction === 'ascending' ? <ArrowUp size={14} className="text-white" /> : <ArrowDown size={14} className="text-white" />
                    ) || <ArrowUpDown size={14} />}
                </div>
            </th>
        );
    };

    if (isLoading) return <LoadingSpinner />;
    if (!data || data.length === 0) return <div className="text-center text-gray-700 p-8 bg-white rounded-md shadow">Nenhum registro encontrado.</div>;

    return (
        <div className="bg-white shadow-sm rounded-lg overflow-x-auto border">
            <table className="grupotristao">
                <thead>
                    <tr>
                        {/* <th>Status</th> */}
                        <th>Sacas</th>
                        <SortableHeader label="IDE" columnKey="IDE" />
                        <SortableHeader label="ETA" columnKey="ETA" />
                        <SortableHeader label="Retirada CTNR." columnKey="Retir_CTNR" />
                        <SortableHeader label="Estufagem" columnKey="Dt_Estufagem" />
                        <SortableHeader label="Chegada Porto" columnKey="Chegar_Porto" />
                        <SortableHeader label="Deadline Carga" columnKey="DeadLine_Carga" />
                        <SortableHeader label="Deadline Draft" columnKey="DeadLine_Draft" />
                        <th>Destino</th>
                        <th>Ref. Importador</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {sortedItems.map((item) => <TableRow key={item.ID} item={item} />)}
                </tbody>
            </table>
        </div>
    );
}