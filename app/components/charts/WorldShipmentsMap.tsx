"use client";

import { ShipmentDestinations } from '@/app/types';
import { shipmentsToWorldmap } from '@/app/utils';
import React, { useEffect, useState } from 'react';
import { WorldMap } from 'react-svg-worldmap';

function ChartSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-102 bg-gray-200 rounded-lg"></div>
        </div>
    );
}

export default function WorldShipmentsMap() {
    const [loading, setLoading] = useState(true);
    const [mapData, setMapData] = useState<{ country: string; value: number }[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const res = await fetch('/api/dashboard-embarques');
                if (!res.ok) throw new Error(`Erro na API: ${res.status}`);
                const response = await res.json();
                const rows: ShipmentDestinations[] = response.data;

                // se quiser somar apenas ARA, passar { product: 'ARA' } no segundo argumento
                const data = shipmentsToWorldmap(rows /*, { product: 'ARA' } */);

                setMapData(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Erro desconhecido');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) return ChartSkeleton();
    if (error) return <div className="text-red-600">Erro: {error}</div>;

    return (
        <div className="flex justify-center bg-white p-4 rounded-lg shadow-md border relative">
            <WorldMap
                color="green"
                title="Principais Destinos de Embarques"
                valueSuffix="Scs"
                size="xxl"
                data={mapData}
                richInteraction
            />
        </div>
    );
}
