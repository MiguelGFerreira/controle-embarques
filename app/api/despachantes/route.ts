import { dbQuery } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const filial = searchParams.get('filial') || '20';

    const whereClause = search ? `AND (X5_CHAVE LIKE '%${search}%' OR UPPER(X5_DESCRI) LIKE '%${search.toUpperCase()}%')` : '';

    const query = `
        SELECT TOP 50 TRIM(X5_CHAVE) Chave
            ,TRIM(X5_DESCRI) Descricao
        FROM SX5500
        WHERE D_E_L_E_T_ = ''
            AND X5_FILIAL = '${filial}'
            AND X5_TABELA = 'WD'
        ${whereClause}
        ORDER BY X5_CHAVE
    `;

    console.log(query);

    try {
        const despachantes = await dbQuery(query);
        return NextResponse.json(despachantes);
    }
    catch (error) {
        console.error("API GET Despachantes error:", error);
        return NextResponse.json({ message: "Erro ao buscar despachantes." }, { status: 500 });
    }
}