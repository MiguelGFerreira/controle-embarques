import { dbQuery } from "@/app/lib/db";
import { Padrao } from "@/app/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const produto = searchParams.get('produto') || '';

    if (!produto || (produto !== 'ARA' && produto !== 'CON')) {
        return NextResponse.json({ message: "Produto inválido." }, { status: 400 });
    }

    console.log('Produto:', produto);

    const query = `
        SELECT TRIM(ZQF_CODQUA) code
            ,TRIM(ZQF_PADRAO) description
            ,TRIM(ZQ0_BEB1) Bebida1
            ,ZQ0_PB1 Percen_beb1
            ,TRIM(ZQ0_BEB2) Bebida2
            ,ZQ0_PB2 Percen_beb2
            ,TRIM(ZQ0_CODPEN) Cod_pen
            ,ZQ0_BROCA Broca
            ,ZQ0_IMPURE Impureza
            ,ZQ0_FUNDO Fundo
            ,ZQ0_UMIDAD Umidade
            ,ZQ0_COR Cor
            ,ZQ0_DEFEIT Defeito
        FROM ZQF500 ZQF
        INNER JOIN ZQ0500 ZQ0 ON ZQF_CODQUA = ZQ0_CODQUA
            AND ZQ0.D_E_L_E_T_ = ''
        WHERE ZQF.D_E_L_E_T_ = ''
            AND ZQF_ATIVO = 'T'
            AND ZQ0_GRUPO = '${produto == 'ARA' ? 'A' : 'C'}'
        ORDER BY ZQF_PADRAO
    `;

    console.log(query);

    try {
        const clientes = await dbQuery(query);
        return NextResponse.json(clientes as Padrao[]);
    }
    catch (error) {
        console.error("API GET Padroes error:", error);
        return NextResponse.json({ message: "Erro ao buscar padroes." }, { status: 500 });
    }
}