import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {

    try {
        const { location, cuisine, budget } = await request.json();

        if (!location || location.trim() === "") {
            return NextResponse.json(
                { error: "Faltan campos necesarios" },
                { status: 400 }
            );
        };

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
            Actúa como un experto crítico gastronómico. 
            Busca hasta 6 restaurantes REALES que existan en Google Maps en la zona de ${location}.
            Tipo de cocina: ${cuisine || "cualquiera, pero los mejor valorados"}.
            Presupuesto aproximado: ${budget}.
            
            REGLAS ESTRICTAS:
            1. Si la localización "${location}" no existe o no encuentras restaurantes reales allí, devuelve el objeto JSON con el array "restaurants" vacío: {"restaurants": []}.
            2. No te inventes nombres. Si no estás 100% seguro de que el lugar existe, no lo incluyas.
            3. La descripción debe mencionar algo específico del lugar.

            FORMATO JSON DE SALIDA:
            {
                "restaurants": [
                {
                    "name": "Nombre",
                    "description": "Descripción",
                    "rating": 5,
                    "address": "Dirección"
                }
                ],
                "reason": "Opciones: 'LOCATION_NOT_FOUND', 'CUISINE_NOT_FOUND' o 'SUCCESS'"
            }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return NextResponse.json(JSON.parse(text));

    } catch (error) {
        console.error("Error en la IA:", error);
        return NextResponse.json({ error: "Error pude obtener recomendaciones" }, { status: 500 });
    }
}