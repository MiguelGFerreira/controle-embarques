import { dbQuery } from "@/app/lib/db";
import { ShipmentDestinations } from "@/app/types";
import { NextResponse } from "next/server";

export async function GET() {
    const query = `
        SELECT EEC_FILIAL [Filial]
            ,TRIM(EEC_PREEMB) [Embarque]
            ,EEC_DEST [Pais_Destino_Sigla]
            ,Y9_PAIS [Cod_Siscomex]
            ,TRIM(Y9_DESCR) [Pais_Dest]
            ,CAST(EEC_DTEMBA AS DATE) [Data_Embarque]
            ,LEFT(EE9_COD_I,3) [Produto]
            ,SUM(EE9_SLDINI)/60 [Quantidade]
        FROM EEC500
        INNER JOIN EE9500 ON EE9_FILIAL = EEC_FILIAL
            AND EE9_PREEMB = EEC_PREEMB
            AND EE9500.D_E_L_E_T_ = ''
        INNER JOIN SY9500 ON EEC_DEST = Y9_SIGLA
            AND SY9500.D_E_L_E_T_ = ''
        WHERE EEC500.D_E_L_E_T_ = ''
            AND EEC_DTEMBA >= GETDATE()-365
        GROUP BY EEC_FILIAL
            ,EEC_PREEMB
            ,EEC_DEST
            ,Y9_PAIS
            ,EEC_DTEMBA
            ,LEFT(EE9_COD_I,3)
            ,Y9_DESCR
    `;

    try {
        const result = await dbQuery(query);
        // TODO: formatar data?
        return NextResponse.json({ data: result as ShipmentDestinations[] });
    }
    catch (error) {
        console.error('API error:', error);
        return NextResponse.json({ message: 'Erro ao buscar dados do relatório' }, { status: 500 });
    }
}