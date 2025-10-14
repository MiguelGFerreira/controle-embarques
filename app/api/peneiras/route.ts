import { dbQuery } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    // const whereClause = search ? `AND (A1_COD LIKE '%${search}%' OR UPPER(A1_NOME) LIKE '%${search.toUpperCase()}%' OR A1_CGC LIKE '%${search}%')` : '';

    const query = `
        SELECT TRIM(EXX_CODPEN) code,
            TRIM(EXX_DSCPEN) description
        FROM EXX500
        WHERE D_E_L_E_T_ = ''
        ORDER BY EXX_CODPEN
    `;

    console.log(query);

    try {
        const clientes = await dbQuery(query);
        return NextResponse.json(clientes);
    }
    catch (error) {
        console.error("API GET Peneiras error:", error);
        return NextResponse.json({ message: "Erro ao buscar Peneiras." }, { status: 500 });
    }
}