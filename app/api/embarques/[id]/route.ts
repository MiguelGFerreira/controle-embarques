import { NextResponse } from "next/server";
import { dbQuery } from "@/app/lib/db";
import { editableFieldsConfig, normalizeDate } from "@/app/utils";

export async function PUT(request: Request, { params }: { params: Promise<{ id: number }> }) {
    const id = (await params).id;
    const body = await request.json();

    if (!id) {
        return NextResponse.json({ message: 'R_E_C_N_O_ nao veio' }, { status: 400 });
    }

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    oneYearAgo.setHours(0, 0, 0, 0);

    const setClauses: string[] = [];

    for (const field of editableFieldsConfig) {
        // Verifica se o campo foi enviado no corpo da requisição
        if (!Object.prototype.hasOwnProperty.call(body, field.key)) return;

        let value = body[field.key] ? body[field.key] : ''; // se vier null vou salvar vazio

        if (field.type === 'date') {
            const normalized = normalizeDate(value);
            console.log('Normalized date:', normalized);
            if (normalized) {
                const y = Number(normalized.slice(0, 4));
                const m = Number(normalized.slice(4, 6));
                const d = Number(normalized.slice(6, 8));
                const date = new Date(y, m - 1, d);
                console.log("date: ", date);
                if (date <= oneYearAgo) {
                    console.log("entrou no IF");
                    return NextResponse.json({ message: 'Data inválida. A data deve ser de no máximo 1 ano atrás.', field: field.key}, { status: 400 })
                }
            }
            value = normalized;
        }
        setClauses.push(`${field.dbColumn} = '${value}'`);
    };

    if (body['armador']) {
        setClauses.push(`EEC_YARM = '${body['armador']}'`);
    }

    if (body['despachante']) {
        setClauses.push(`EEC_YDESPA = '${body['despachante']}'`);
    }

    if (setClauses.length === 0) {
        return NextResponse.json({ message: 'Nenhum campo valido para atualizar' }, { status: 400 });
    }

    const updateQuery = `
        UPDATE EEC500
        SET ${setClauses.join(', ')}
        WHERE R_E_C_N_O_ = ${id}
    `;

    console.log('Update Query:', updateQuery);

    try {
        await dbQuery(updateQuery);
        return NextResponse.json({ message: 'Embarque atualizado com sucesso' });
    } catch (error) {
        console.error('API update erro:', error);
        return NextResponse.json({ message: 'Erro ao atualizar embarque' }, { status: 500 });
    }
}