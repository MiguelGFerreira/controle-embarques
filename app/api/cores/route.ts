import { dbQuery } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    // const whereClause = search ? `AND (A1_COD LIKE '%${search}%' OR UPPER(A1_NOME) LIKE '%${search.toUpperCase()}%' OR A1_CGC LIKE '%${search}%')` : '';

    const query = `
        SELECT TRIM(ZQ2_COR) code,
            TRIM(ZQ2_DESC) description
        FROM ZQ2500
        WHERE D_E_L_E_T_ = ''
    `;

    console.log(query);

    try {
        const clientes = await dbQuery(query);
        return NextResponse.json(clientes);
    }
    catch (error) {
        console.error("API GET Cores error:", error);
        return NextResponse.json({ message: "Erro ao buscar Cores." }, { status: 500 });
    }
}