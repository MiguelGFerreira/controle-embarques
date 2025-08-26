import { dbQuery } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    const shipmentInfoQuery = `
        SELECT EEC_PEDREF as pedido, EEC_FILIAL AS filial
        FROM EEC500 WHERE R_E_C_N_O_ = ${id}
    `;
    const shipmentResult = await dbQuery(shipmentInfoQuery);

    if (!shipmentResult || shipmentResult.length === 0) {
        return NextResponse.json({ message: "Embarque não encontrado." }, { status: 404 });
    }
    const { pedido, filial } = shipmentResult[0];

    const samplesQuery = `
    SELECT EXU_NROAMO [Nro. Amostra]
        ,EXU_TIPOAM [Amostra por:]
        ,EXU_STATUS [Status]
        ,EXU_QTD [Quantidade]
        ,EXU_PESOBR [Peso Bruto]
        ,EXU_DTENV [Dt. Envio]
        ,EXU_NROCA [Conh. Aereo]
        ,EXU_DTAPRO [Data Aprov.]
        ,EXU_DTREJE [Dt. Rejeição]
        ,EXU_CLAREJ [Classif. Rej]
        ,EXU_RKFCLI [Cliente]
        ,EXU_RKFLOJ [Loja Cliente]
    FROM EXU500
    WHERE EXU_FILIAL = ${filial} AND EXU_PEDIDO = ${pedido} AND D_E_L_E_T_ = ''
    ORDER BY R_E_C_N_O_ DESC
    `;

    try {
        const samples = await dbQuery(samplesQuery);
        return NextResponse.json(samples);
    }
    catch (error) {
        console.error("API GET Amostras erro:", error);
        return NextResponse.json({ message: "Erro ao buscar amostras." }, { status: 500 });
    }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const body = await request.json();

    const shipmentInfoQuery = `
        SELECT EEC_PEDREF AS pedido, EEC_FILIAL AS filial
        FROM EEX500 WHERE R_E_C_N_O_ = ${id}
    `;
    const shipmentResult = await dbQuery(shipmentInfoQuery);

    if (!shipmentResult || shipmentResult.length === 0) {
        return NextResponse.json({ message: "Embarque não encontrado." }, { status: 404});
    }
    const { pedido, filial } = shipmentResult[0];

    const insertQuery = `
        INSERT INTO EXU500 (
            EXU_FILIAL
            ,EXU_NROAMO
            ,EXU_TIPOAM
            ,EXU_PEDIDO
            ,EXU_STATUS
            ,EXU_QTD
            ,EXU_PESOBR
            ,EXU_DTENV
            ,EXU_NROCA
            ,EXU_DTAPRO
            ,EXU_DTREJE
            ,EXU_CLAREJ
            ,EXU_RKFCLI
            ,EXU_RKFLOJ
        ) VALUES (
            ${filial}
            ,${body.nroAmostra}
            ,${body.tipoAmostra}
            ,${pedido}
            ,'OLHAR'
            ,${body.quantidade}
            ,${body.pesoBruto}
            ,${body.dtEnvio || 'NULL'}
            ,${body.conhecimentoAereo}
            ,${body.dtAprov || 'NULL'}
            ,${body.dtRejeicao || 'NULL'}
            ,${body.classifRejeicao}
            ,${body.clienteCod}
            ,${body.clienteLoja}
        )
    `;

    try {
        await dbQuery(insertQuery);
        return NextResponse.json({ message: "Amostra criada com sucesso!" }, { status: 201 });
    }
    catch (error) {
        console.error("API POST Amostra error:", error);
        return NextResponse.json({ message: "Erro ao criar amostra." }, { status: 500 });
    }
}