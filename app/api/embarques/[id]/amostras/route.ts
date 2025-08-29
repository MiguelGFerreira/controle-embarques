import { dbQuery } from "@/app/lib/db";
import { normalizeDate } from "@/app/utils";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;

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
        ,SA1.A1_NOME [Cliente Nome]
        ,EXU.R_E_C_N_O_
    FROM EXU500 EXU
    LEFT JOIN SA1500 SA1 ON SA1.A1_COD = EXU.EXU_RKFCLI
        AND SA1.A1_LOJA = EXU.EXU_RKFLOJ
        AND SA1.D_E_L_E_T_ = ''
    WHERE EXU_FILIAL = ${filial} AND EXU_PEDIDO = ${pedido} AND EXU.D_E_L_E_T_ = ''
    ORDER BY EXU.R_E_C_N_O_ DESC
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

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    const body = await request.json();

    const shipmentInfoQuery = `
        SELECT TRIM(EEC_PEDREF) AS pedido, TRIM(EEC_FILIAL) AS filial
        FROM EEC500 WHERE R_E_C_N_O_ = ${id}
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
            ,EXU_QTD
            ,EXU_PESOBR
            ,EXU_DTENV
            ,EXU_NROCA
            ,EXU_DTAPRO
            ,EXU_DTREJE
            ,EXU_CLAREJ
            ,EXU_RKFCLI
            ,EXU_RKFLOJ
            ,R_E_C_N_O_
        ) VALUES (
            '${filial}'
            ,'${body.nroAmostra}'
            ,'${body.tipoAmostra}'
            ,'${pedido}'
            ,${body.quantidade}
            ,${body.pesoBruto}
            ,'${normalizeDate(body.dtEnvio)}'
            ,'${body.conhecimentoAereo}'
            ,'${normalizeDate(body.dtAprov)}'
            ,'${normalizeDate(body.dtRejeicao)}'
            ,'${body.classifRejeicao}'
            ,'${body.clienteCod}'
            ,'${body.clienteLoja}'
            ,(SELECT MAX(R_E_C_N_O_) + 1 FROM EXU500)
        )
    `;

    console.log("insertQuery:", insertQuery)

    try {
        await dbQuery(insertQuery);
        return NextResponse.json({ message: "Amostra criada com sucesso!" }, { status: 201 });
    }
    catch (error) {
        console.error("API POST Amostra error:", error);
        return NextResponse.json({ message: "Erro ao criar amostra." }, { status: 500 });
    }
}