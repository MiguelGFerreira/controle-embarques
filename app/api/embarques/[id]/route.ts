import { NextResponse } from "next/server";
import { dbQuery } from "@/app/lib/db";
import { editableFieldsConfig, normalizeDate } from "@/app/utils";

export async function PUT(request: Request, { params }: { params: Promise<{ id: number }> }) {
    const id = (await params).id;
    const body = await request.json();

    if (!id) {
        return NextResponse.json({ message: 'R_E_C_N_O_ nao veio' }, { status: 400 });
    }

    const setClauses: string[] = [];

    editableFieldsConfig.forEach(field => {
        // Verifica se o campo foi enviado no corpo da requisição
        if (Object.prototype.hasOwnProperty.call(body, field.key)) {
            let value = body[field.key] ? body[field.key] : ''; // se vier null vou salvar vazio
            if (field.type === 'date') {
                value = normalizeDate(value);
            }
            setClauses.push(`${field.dbColumn} = '${value}'`);
        }
    });

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