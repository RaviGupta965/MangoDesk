import { NextResponse } from "next/server";
import mammoth from "mammoth";
import PDFParser from "pdf2json";
import { main } from "@/app/model/Model";
export async function POST(req) {
    try {
        const formData = await req.formData();

        // Extracting Form data from the request
        const file = formData.get("file");
        const prompt = formData.get('prompt');

        // File Absence Error Handler
        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Converting Incoming File into Buffer
        const buffer = await Buffer.from(await file.arrayBuffer());

        // EXtracting Raw Text From the File
        let text = "";

        // PDF Data extractor
        if (file.name.endsWith(".pdf")) {
            text = await new Promise((resolve, reject) => {
                const pdfParser = new PDFParser();

                pdfParser.on("pdfParser_dataError", err => reject(err));
                pdfParser.on("pdfParser_dataReady", pdfData => {
                    // Extract text from pdfData
                    let rawText = "";
                    pdfData.Pages.forEach(page => {
                        page.Texts.forEach(t => {
                            t.R.forEach(r => {
                                rawText += decodeURIComponent(r.T) + " ";
                            });
                        });
                    });
                    resolve(rawText.trim());
                });

                pdfParser.parseBuffer(buffer);
            });
        }

        // Doc File Extractor
        else if (file.name.endsWith(".docx")) {
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
        }

        // Text File Data
        else if (file.name.endsWith(".txt")) {
            text = buffer.toString("utf-8");
        }
        else {
            return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
        }
        const AIresponse = await main(text, prompt)
        return NextResponse.json({ response: AIresponse }, { status: 200 });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: `DATA EXTRACTION ERROR :: ${error.message}` }, { status: 500 });
    }
}