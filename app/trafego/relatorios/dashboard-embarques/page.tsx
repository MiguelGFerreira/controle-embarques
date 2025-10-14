'use client';

import MonthlyShipmentsChart from "@/app/trafego/components/charts/MonthlyShipmentsChart";
import WorldShipmentsMap from "@/app/trafego/components/charts/WorldShipmentsMap";
import { useEffect } from "react";

export default function DashboardEmbarquesPage() {
    useEffect(() => {
        document.title = 'Dashboard de Embarques'; // Muda o título da página dinamicamente no lado do cliente
    }, [])
    
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-gray-800">
                    Dashboard de Análise de Embarques
                </h1>
                <p className="mt-1 text-lg text-gray-500">
                    Análise de tendências e volumes dos embarques realizados.
                </p>
            </header>

            <MonthlyShipmentsChart />

            <WorldShipmentsMap />

        </div>
    );
}