import { NextResponse } from "next/server";

export async function POST(request) {

    try {
        const data = await request.json();

        const { location, cuisine, budget } = data;

        if (!location || location.trim() === "") {
            return NextResponse.json(
                { error: "Faltan campos necesarios" },
                { status: 400 }
            );
        }

        const cuisineText = cuisine && cuisine.trim() !== ""
            ? `especializados en ${cuisine}`
            : "de cualquier tipo (los mejor valorados)";

        const mockResponse = {
            message: `Hola! Pronto te recomendaré sitios de ${cuisineText} en ${location} con presupuesto ${budget}.`
        };

        return NextResponse.json(mockResponse);
    } catch (error) {
        return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
    }
}