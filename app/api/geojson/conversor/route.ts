import { convertGeoJson } from "@/app/lib/geojson/convert"
import { ConversorInput, GeoJSON } from "@/app/types/geojson"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        console.log("api body: ", body);

        const geojson = body.geojson as GeoJSON
        const input = body.input as ConversorInput
        console.log("api Geojson: ", geojson);
        console.log("api input: ", input);

        const result = convertGeoJson(geojson, input)
        
        return NextResponse.json(result)
    } catch (e: any) {
        return NextResponse.json({ error: e.message}, { status: 400 })
    }
}