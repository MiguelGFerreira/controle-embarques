'use client';

import { ShipmentDestinations } from "@/app/types";
import { useMemo, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import useSWR from "swr";

// Esquelo pra carregar
function ChartSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-72 bg-gray-200 rounded-lg"></div>
            <div className="flex justify-center gap-4 mt-4">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
        </div>
    );
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

// Processamento e agregacao dos dados
const processDataForChart = (data: ShipmentDestinations[], monthsToShow: number) => {
    const monthlyData: { [key: string]: any } = {};

    const cutOffDate = new Date();
    cutOffDate.setMonth(cutOffDate.getMonth() - monthsToShow);

    const filteredData = data.filter(item => new Date(item.Data_Embarque) >= cutOffDate);

    console.log(filteredData);

    filteredData.forEach(item => {
        const date = new Date(item.Data_Embarque);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const seriesKey = `${item.Filial === '20' ? 'Varginha' : 'Viana'} - ${item.Produto}`;

        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { name: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }) };
        }
        monthlyData[monthKey][seriesKey] = (monthlyData[monthKey][seriesKey] || 0) + Number(item.Quantidade);
    });

    return Object.entries(monthlyData)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB)) // keyA e keyB são "YYYY-MM"
        .map(([, value]) => value);
}

export default function MonthlyShipmentsChart() {
    const [monthsToShow, setMonthsToShow] = useState(12);
    const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);
    const { data: response, error, isLoading } = useSWR('/api/dashboard-embarques', fetcher);

    const chartData = useMemo(() => {
        if (!response?.data) return [];
        return processDataForChart(response.data, monthsToShow);
    }, [response, monthsToShow]);

    const series = [
        { name: 'Varginha - ARA', color: '#16a34a' }, // Verde
        { name: 'Viana - ARA', color: '#f97316' }, // Laranja
        { name: 'Viana - CON', color: '#8b5cf6' }, // Roxo
    ];

    const handleLegendClick = (e: any) => {
        const { dataKey } = e;
        setHiddenSeries(prev => prev.includes(dataKey) ? prev.filter(key => key !== dataKey) : [...prev, dataKey]);
    };

    if (isLoading) return <ChartSkeleton />;
    if (error) return <div className="text-center text-red-500 p-8 bg-white rounded-lg shadow">Falha ao carregar os dados do gráfico.</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quantidade Embarcada por Mês</h2>
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(value) => new Intl.NumberFormat('pt-BR').format(value)} tick={{ fontSize: 12 }} />
                        <Tooltip
                            formatter={(value: number, name: string) => [`${new Intl.NumberFormat('pt-BR').format(value)} Scs`, name]}
                            labelStyle={{ fontWeight: 'bold' }}
                            contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e0e0e0' }}
                        />
                        <Legend onClick={handleLegendClick} wrapperStyle={{ fontSize: '14px', cursor: 'pointer' }} />
                        {series.map(s => (
                            <Line
                                key={s.name}
                                type="monotone"
                                dataKey={s.name}
                                stroke={s.color}
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 8 }}
                                hide={hiddenSeries.includes(s.name)}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="flex justify-center items-center gap-2 mt-4">
                {[3, 6, 12].map(num => (
                    <button
                        key={num}
                        onClick={() => setMonthsToShow(num)}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 ${monthsToShow === num
                                ? 'bg-green-600 text-white shadow-sm cursor-not-allowed'
                                : 'text-gray-600 bg-gray-200 hover:bg-gray-300 cursor-pointer'
                            }`}
                    >
                        Últimos {num}M
                    </button>
                ))}
            </div>
        </div>
    );
}