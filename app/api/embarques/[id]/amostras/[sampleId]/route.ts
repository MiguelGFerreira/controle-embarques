import { dbQuery } from "@/app/lib/db";
import { normalizeDate } from "@/app/utils";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: { id: string, sampleId: string }}) {
    const { sampleId } = params;
    const body = await request.json();

    if (!sampleId) {
        return NextResponse.json({ message: "ID da amostra não fornecido." }, { status: 400 });
    }

    const updateQuery = `
        UPDATE EXU500 SET
            EXU_QTD = ${body.quantidade}
            ,EXU_PESOBR = ${body.pesoBruto}
            ,EXU_DTENV = '${normalizeDate(body.dtEnvio)}'
            ,EXU_NROCA = '${body.conhecimentoAereo}'
            ,EXU_DTAPRO = '${normalizeDate(body.dtAprov)}'
            ,EXU_DTREJE = '${normalizeDate(body.dtRejeicao)}'
            ,EXU_RKFCLI = '${body.clienteCod}'
            ,EXU_RKFLOJ = '${body.clienteLoja}'
        WHERE R_E_C_N_O_ = ${sampleId}
    `;

    try {
        console.log("Update query:", updateQuery);
        await dbQuery(updateQuery);
        return NextResponse.json({ message: "Amostra atualizada com sucesso." }, { status: 200 });
    }
    catch (error) {
        console.error("API PUT Amostra error:", error);
        return NextResponse.json({ message: "Erro ao atualizar amostra." }, { status: 500 });
    }
}