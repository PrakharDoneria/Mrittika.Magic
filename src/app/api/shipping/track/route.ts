import { NextResponse } from "next/server";
import { getDelhiveryTracking } from "@/lib/delhivery";

export async function GET(request: Request) {
  const awb = new URL(request.url).searchParams.get("awb")?.trim() || "";
  if (!awb) {
    return NextResponse.json({ error: "A tracking number is required." }, { status: 400 });
  }

  try {
    const tracking = await getDelhiveryTracking(awb);
    return NextResponse.json({ success: true, tracking });
  } catch (error) {
    console.error("Delhivery tracking failed:", error);
    return NextResponse.json({ error: "Could not retrieve Delhivery tracking information." }, { status: 502 });
  }
}
