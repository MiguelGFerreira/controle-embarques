import { dbQuery } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const whereClause = search ? `AND (A1_COD LIKE '%${search}%' OR UPPER(A1_NOME) LIKE '%${search.toUpperCase()}%' OR A1_CGC LIKE '%${search}%')` : '';

    const query = `
        SELECT TOP 50 A1_COD AS Codigo
            ,A1_NOME Nome
            ,A1_LOJA Loja
        FROM SA1500
        WHERE D_E_L_E_T_ = '' AND A1_MSBLQL <> '1'
        ${whereClause}
        ORDER BY A1_NOME
    `;

    console.log(query);

    try {
        const clientes = await dbQuery(query);
        return NextResponse.json(clientes);
    }
    catch (error) {
        console.error("API GET Clientes error:", error);
        return NextResponse.json({ message: "Erro ao buscar clientes." }, { status: 500 });
    }
}