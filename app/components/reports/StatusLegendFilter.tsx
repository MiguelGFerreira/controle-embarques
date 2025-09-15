// 'use client';

// import { ShipmentStatus } from "@/app/types";
// import { useEffect, useState } from "react";

// interface StatusLegendFilterProps {
//     onStatusChange: (selectedStatuses: ShipmentStatus[]) => void;
// }

// const statusConfig: { status: ShipmentStatus; color: string; label: string }[] = [
//     { status: 'Amostra Aprovada', color: 'bg-green-500', label: 'Amostra Aprovada' },
//     { status: 'Amostra Pendente', color: 'bg-yellow-500', label: 'Amostra Pendente' },
//     { status: 'Amostra Enviada', color: 'bg-orange-500', label: 'Amostra Enviada' },
//     { status: 'Sem Amostra', color: 'bg-gray-500', label: 'Sem Amostra' },
// ]

// export default function StatusLegendFilter({ onStatusChange }: StatusLegendFilterProps) {
//     const [selected, setSelected] = useState<ShipmentStatus[]>([]);

//     const handleToggle = (status: ShipmentStatus) => {
//         setSelected(prev =>
//             prev.includes(status)
//                 ? prev.filter(s => s !== status)
//                 : [...prev, status]
//         );
//     };

//     useEffect(() => {
//         onStatusChange(selected);
//     }, [selected, onStatusChange]);

//     return (
//         <div className="flex items-center gap-4 p-3 px-4 bg-gray-50 rounded-lg border">
//             <span className="text-sm font-medium text-gray-600">Filtrar por Status:</span>
//             <div className="flex items-center gap-3">
//                 {statusConfig.map(({ status, color, label }) => (
//                     <button
//                         key={status}
//                         onClick={() => handleToggle(status)}
//                         className={`flex items-center gap-2 px-3 py-1 text-xs font-semibold text-white reounded-full cursor-pointer transition-all duration-200
//                             ${selected.includes(status) || selected.length === 0 ? 'opacity-100' : 'opacity-40 hover:opacity-80'}
//                             ${color}`}
//                     >
//                         {label}
//                     </button>
//                 ))}
//             </div>
//         </div>
//     );
// }