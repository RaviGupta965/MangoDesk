import { NextResponse } from "next/server";
import { sendResponse } from "../../lib/Mail";

export async function POST(req) {
  try {
    const { email, content } = await req.json();
    await sendResponse(email, content);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}