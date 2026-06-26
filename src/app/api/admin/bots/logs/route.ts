import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const logPath = path.join(process.cwd(), "public", "bot-logs.json");
    if (!fs.existsSync(logPath)) {
      return NextResponse.json([]);
    }
    const data = fs.readFileSync(logPath, "utf8");
    const logs = JSON.parse(data);
    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error reading bot logs:", error);
    return NextResponse.json({ error: "Failed to read logs" }, { status: 500 });
  }
}
