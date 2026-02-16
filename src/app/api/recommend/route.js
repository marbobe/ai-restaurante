import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

/** * Initialize the Google Generative AI client using the API key from environment variables.
 * @type {GoogleGenerativeAI}
 */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * @async
 * @function POST
 * @description Handles POST requests to generate restaurant recommendations using AI.
 * It validates user input, constructs a specialized prompt for Gemini, and returns 
 * a structured JSON response with real restaurant data.
 * * @param {Request} request - The incoming Next.js request object containing 
 * { location, cuisine, budget } in the JSON body.
 * * @returns {Promise<NextResponse>} A JSON response containing:
 * - restaurants: {Array<Object>} List of recommended places.
 * - reason: {string} 'SUCCESS', 'LOCATION_NOT_FOUND', or 'CUISINE_NOT_FOUND'.
 * - error: {string} (Optional) Error message if validation or AI fails.
 */
export async function POST(request) {

    try {
        // Parse the request body
        const { location, cuisine, budget } = await request.json();

        /** * SERVER-SIDE VALIDATION
         * Ensure 'location' is provided as it is mandatory for the prompt.
         */
        if (!location || location.trim() === "") {
            return NextResponse.json(
                { error: "Faltan campos necesarios" },
                { status: 400 }
            );
        };

        /** * AI MODEL CONFIGURATION
         * Using gemini-2.5-flash for high-speed response.
         * Forcing 'application/json' output via generationConfig.
         */
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        /** * SYSTEM PROMPT
         * Defined with strict rules to prevent AI hallucinations and ensure 
         * the output matches the expected UI component structure.
         */
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
        // Execute the AI generation request
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        /** * Return the parsed JSON from the AI to the client.
         * The AI response is expected to strictly follow the JSON schema provided in the prompt.
         */
        return NextResponse.json(JSON.parse(text));

    } catch (error) {
        /** * LOGGING & ERROR HANDLING
         * Captures API failures, JSON parsing errors, or network issues.
         */
        console.error("Error en la IA:", error);
        return NextResponse.json({ error: "Error pude obtener recomendaciones" }, { status: 500 });
    }
}