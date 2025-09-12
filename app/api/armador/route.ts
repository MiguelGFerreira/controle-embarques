import { dbQuery } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const whereClause = search ? `AND (Y5_COD LIKE '%${search}%' OR UPPER(Y5_NOME) LIKE '%${search.toUpperCase()}%')` : '';

    const query = `
        SELECT TOP 50 Y5_COD Codigo
            ,Y5_NOME Nome
        FROM SY5500
        WHERE D_E_L_E_T_ = ''
        ${whereClause}
        ORDER BY Y5_COD
    `;

    console.log(query);

    try {
        const armadores = await dbQuery(query);
        return NextResponse.json(armadores);
    }
    catch (error) {
        console.error("API GET Armador error:", error);
        return NextResponse.json({ message: "Erro ao buscar Armadores." }, { status: 500 });
    }
}