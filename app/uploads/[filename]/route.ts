import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import mime from "mime"; // MIME turini aniqlash uchun kutubxona

export async function GET(req: Request, { params }: any) {
  try {
    const { filename } = params;

    if (!filename) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const filePath = path.join(process.cwd(), "public/uploads", filename);
    console.log(filePath);

    // Fayl mavjudligini tekshirish
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    // MIME turini aniqlash
    const mimeType = mime.getType(filePath) || "application/octet-stream";

    return new Response(fileBuffer, {
      headers: { "Content-Type": mimeType },
    });
  } catch (error) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
