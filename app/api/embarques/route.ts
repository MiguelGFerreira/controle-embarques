import { dbQuery } from '@/app/lib/db';
import { PaginatedShipmentResponse, Shipment } from '@/app/types';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const ideFilter = searchParams.get('ide');
    const refFilter = searchParams.get('ref');
    const offset = (page - 1) * limit;

    let whereClauses = ["EEC_DTEMBA = ''", "D_E_L_E_T_ = ''"]

    if (ideFilter) {
        whereClauses.push(`UPPER(EEC_PEDREF) LIKE '%${ideFilter.toUpperCase()}%'`);
    }

    if (refFilter) {
        whereClauses.push(`UPPER(EEC_REFIMP) LIKE '%${refFilter.toUpperCase()}%'`);
    }

    const whereString = `WHERE ${whereClauses.join(' AND ')}`;

    const countQuery = `SELECT COUNT(*) AS total FROM EEC500 ${whereString}`;

    const dataQuery = `
        SELECT 
            EEC_FILIAL [Filial]
            ,TRIM(EEC_PREEMB) [Embarque]
            ,TRIM(EEC_PEDREF) [IDE]
            ,TRIM(EEC_STTDES) [Status]
            ,TRIM(EEC_IMPORT) [Cliente]
	        ,TRIM(EEC_IMLOJA) [Loja]
            ,TRIM(EEC_IMPODE) [Importador]
            ,TRIM(EEC_YFUMIG) [Fumigacao ?] -- sim (1) ou nao (2)
            ,TRIM(EEC_YLFUMI) [Local Fumigacao]
            ,TRIM(EEC_YMFUMI) [Material Fumigacao]
            ,TRIM(EEC_YNAVIO) [Navio]
            ,TRIM(EEC_YNOEMB) [Viagem]
            ,TRIM(EEC_YFITOS) [Inspecao Fitossanitaria] -- sim (1) ou nao (2)
            ,TRIM(EEC_NRINVO) [Invoice]
            ,TRIM(EEC_REFIMP) [Ref.Import.]
            ,TRIM(EEC_ORIGEM) + ' - ' + TRIM(EEC_DEST) [Rota]
            ,TRIM(EEC_YBOOK) [Nr. Booking]
            ,TRIM(EEC_YSITUA) [Obs Planilha]
            ,TRIM(EEC_YFREET) [Prazo Freetime]
            ,TRIM(EEC_YDESPA) [Cod. Arm]
            ,TRIM(EEC_YARM) [Cod Despacha]

            ,CASE WHEN EEC_ETD = '' THEN NULL ELSE CAST(EEC_ETD AS DATE) END AS [Retir. CTNR]
            ,CASE WHEN EEC_YESTUF = '' THEN NULL ELSE CAST(EEC_YESTUF AS DATE) END AS [Dt. Estufagem]
            ,CASE WHEN EEC_DTFCPR = '' THEN NULL ELSE CAST(EEC_DTFCPR AS DATE) END AS [Chegar Porto]
            ,CASE WHEN EEC_ETA = '' THEN NULL ELSE CAST(EEC_ETA AS DATE) END AS [ETA]
            ,CASE WHEN EEC_DTCONH = '' THEN NULL ELSE CAST(EEC_DTCONH AS DATE) END AS [Dt. Conhec.]
            ,CASE WHEN EEC_DFUMIG = '' THEN NULL ELSE CAST(EEC_DFUMIG AS DATE) END AS [Dt. Fumigacao]
            ,CASE WHEN EEC_YDFITO = '' THEN NULL ELSE CAST(EEC_YDFITO AS DATE) END AS [Dt. Insp Fitossan.]
            ,CASE WHEN EEC_YDTDRA = '' THEN NULL ELSE CAST(EEC_YDTDRA AS DATE) END AS [DeadLine Draft]
            ,CASE WHEN EEC_YDTCAR = '' THEN NULL ELSE CAST(EEC_YDTCAR AS DATE) END AS [DeadLine Carga]
            ,CASE WHEN EEC_DTINVO = '' THEN NULL ELSE CAST(EEC_DTINVO AS DATE) END AS [Dt. Invoice]

            ,R_E_C_N_O_
        FROM EEC500
        ${whereString}
        ORDER BY EEC_FATURA DESC
        OFFSET ${offset} ROWS
        FETCH NEXT ${limit} ROWS ONLY
    `;

    try {
        const totalResult = await dbQuery(countQuery);
        const totalRecords = totalResult[0].total;

        const dataResult = await dbQuery(dataQuery);

        const formattedData = dataResult.map((row: any) => {
            for (const key in row) {
                if (row[key] instanceof Date) {
                    row[key] = row[key].toISOString().split('T')[0];
                }
            }
            return row;
        }) as Shipment[];

        const response: PaginatedShipmentResponse = {
            data: formattedData,
            totalRecords,
            totalPages: Math.ceil(totalRecords / limit),
            currentPage: page,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ message: 'Erro ao buscar embarques' }, { status: 500 });
    }
}