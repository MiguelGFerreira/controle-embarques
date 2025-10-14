import { dbQuery } from "@/app/lib/db";
import { ClassificationBatch } from "@/app/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('dia') || '';
    const lote = searchParams.get('lote') || '';

    const conditionQuery = [`SB8.B8_FILIAL = '21'`];

    if (date) {
        conditionQuery.push(`SB8.B8_DATA = '${date}'`);
    }

    if (lote) {
        conditionQuery.push(`SB8.B8_LOTECTL LIKE '%${lote}%'`);
    }

    if (!date && !lote) {
        conditionQuery.push(`CAST(SB8.B8_DATA AS DATE) = CAST(GETDATE() AS DATE)`);
    }

    conditionQuery.push(`SB8.B8_ORIGLAN = 'NF'`);
    conditionQuery.push(`SB8.D_E_L_E_T_ = ''`);

    const query = `
        SELECT TOP 100 SB8.B8_LOTECTL Lote
            ,TRIM(SB8.B8_PRODUTO) Produto
            ,CAST(SB8.B8_DATA AS DATE) Data
            ,SB8.B8_QTDORI Sacas
            ,TRIM(SA2.A2_NOME) Fornecedor
            ,SB8.R_E_C_N_O_ ID
        FROM SB8500 SB8
        LEFT JOIN SA2500 SA2 ON SA2.A2_COD = SB8.B8_CLIFOR
            AND SB8.B8_LOJA = SA2.A2_LOJA
            AND SA2.D_E_L_E_T_ = ''
        WHERE ${conditionQuery.join(' AND ')}
        ORDER BY SB8.B8_LOTECTL
    `;

    console.log(query);

    try {
        const result = await dbQuery(query);
        return NextResponse.json({ data: result as ClassificationBatch[] });
    }
    catch (error) {
        console.error('API error:', error);
        return NextResponse.json({ message: 'Erro ao buscar lotes para classificação' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    console.log('Received payload:', body);

    const insertQuery = `
        DECLARE @CODQUA VARCHAR(8) = (
                SELECT FORMAT(MAX(ZQ0_CODQUA) + 1, '00000000') CODQUA
                FROM ZQ0500
                )

        ${body.peneiras.map((peneira: { sieveCode: string; percentage: number }) =>
        `INSERT INTO ZQ1500 (
            ZQ1_FILIAL
            ,ZQ1_CODQUA
            ,ZQ1_CODPEN
            ,ZQ1_PERPEN
            ,D_E_L_E_T_
            )
        VALUES (
            ''
            ,@CODQUA
            ,'${peneira.sieveCode}'
            ,'${peneira.percentage}'
            ,''
            )`
        ).join('\n')}

        INSERT INTO ZQ0500 (
            ZQ0_FILIAL
            ,ZQ0_CODQUA
            ,ZQ0_GRUPO
            ,ZQ0_DEFEIT
            ,ZQ0_BEB1
            ,ZQ0_PB1
            ,ZQ0_BEB2
            ,ZQ0_PB2
            ,ZQ0_CODPEN
            ,ZQ0_BROCA
            ,ZQ0_IMPURE
            ,ZQ0_FUNDO
            ,ZQ0_UMIDAD
            ,ZQ0_ONOFF
            ,ZQ0_NUMFDF
            ,ZQ0_PREP
            ,ZQ0_PRONTO
            ,ZQ0_COR
            ,ZQ0_PADRAO
            ,D_E_L_E_T_
            ,ZQ0_PVAPER
            ,ZQ0_PVADEF
            )
        VALUES (
            ''
            ,@CODQUA
            ,'${body.lote.Produto === 'CON' ? 'C' : 'A'}'
            ,${body.defeito || 0}
            ,'${body.Bebida1 || ''}'
            ,${body.Bebida1Qty || 0}
            ,'${body.Bebida2 || ''}'
            ,${body.Bebida2Qty || 0}
            ,'BC'
            ,${body.broca || 0}
            ,${body.impureza || 0}
            ,${body.fundo || 0}
            ,${body.umidade || 0}
            ,0
            ,0
            ,'ZQ0_PREP'
            ,'ZQ0_PRONTO'
            ,'${body.cor || ''}'
            ,'${body.padrao || ''}'
            ,''
            ,0
            ,0
            )

        UPDATE SB8500
        SET B8_TCEQUA = @CODQUA
        WHERE R_E_C_N_O_ = ${body.lote.ID}
    `;

    console.log('query de insert: ', insertQuery);
    return NextResponse.json({ message: 'Teste.'});
}