import { convertMulti } from "@/app/lib/geojson/convertMulti";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        if (!Array.isArray(body.items)) {
            throw new Error('Payload inválido: items ausente');
        }

        const result = convertMulti(body.items);

        return NextResponse.json(result);
    }
    catch (e: any) {
        return NextResponse.json( { error: e.message }, { status: 400 });
    }
}