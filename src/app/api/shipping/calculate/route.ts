import { NextResponse } from "next/server";
import { getDelhiveryHeaders } from "@/lib/delhivery";

const ORIGIN_PIN = "801503"; // Mrittika Magic origin pincode

export async function POST(request: Request) {
  try {
    const delhiveryHeaders = await getDelhiveryHeaders();
    const body = (await request.json()) as { destinationPin?: string; weight?: number };
    const destinationPin = (body.destinationPin || "").trim().replace(/\D/g, "");

    if (!destinationPin || destinationPin.length !== 6) {
      return NextResponse.json(
        { error: "Please provide a valid 6-digit destination pincode." },
        { status: 400 }
      );
    }

    const weight = Number(body.weight) > 0 ? Number(body.weight) : 0.5;

    // 1. Concurrently fetch postal details (post offices, district, state) and Delhivery rates
    const [postalRes, delhiveryRes] = await Promise.allSettled([
      fetch(`https://api.postalpincode.in/pincode/${destinationPin}`, {
        headers: { "User-Agent": "Mozilla/5.0" },
      }),
      fetch("https://ucp-app-gateway.delhivery.com/open/api/landing_page/bulk_rate_calculator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          ...delhiveryHeaders,
        },
        body: JSON.stringify({
          requests: [
            {
              origin_pin: ORIGIN_PIN,
              destination_pin: destinationPin,
              weight: weight,
              weight_unit: "KG",
              shipment_type: "FORWARD",
              payment_mode: "PREPAID",
              cod_amount: 0,
              length: 20,
              breadth: 20,
              height: 20,
              shipping_mode: "SURFACE",
              id: "dlv_SURFACE",
            },
            {
              origin_pin: ORIGIN_PIN,
              destination_pin: destinationPin,
              weight: weight,
              weight_unit: "KG",
              shipment_type: "FORWARD",
              payment_mode: "PREPAID",
              cod_amount: 0,
              length: 20,
              breadth: 20,
              height: 20,
              shipping_mode: "EXPRESS",
              id: "dlv_EXPRESS",
            },
          ],
        }),
      }),
    ]);

    // Parse postal data
    let postOffices: Array<{ name: string; district: string; state: string; deliveryStatus: string }> = [];
    let locationDistrict = "";
    let locationState = "";

    if (postalRes.status === "fulfilled" && postalRes.value.ok) {
      try {
        const postalData = await postalRes.value.json();
        if (Array.isArray(postalData) && postalData[0]?.Status === "Success") {
          const rawOffices = (postalData[0].PostOffice || []) as Array<{
            Name: string;
            District: string;
            State: string;
            DeliveryStatus: string;
          }>;
          postOffices = rawOffices.map((po) => ({
            name: po.Name,
            district: po.District,
            state: po.State,
            deliveryStatus: po.DeliveryStatus,
          }));
          locationDistrict = postOffices[0]?.district || "";
          locationState = postOffices[0]?.state || "";
        }
      } catch (e) {
        console.warn("Could not parse postal pincode data:", e);
      }
    }

    // Parse Delhivery rates
    if (delhiveryRes.status === "rejected" || !delhiveryRes.value.ok) {
      const status = delhiveryRes.status === "fulfilled" ? delhiveryRes.value.status : "unavailable";
      console.error("Delhivery rate calculation failed:", status);
      return NextResponse.json(
        { error: "Delhivery delivery rates are temporarily unavailable. Please try again." },
        { status: 502 }
      );
    }

    let surfaceRate: number | null = null;
    let expressRate: number | null = null;
    let zone = "D1";

    try {
      const dlvData = await delhiveryRes.value.json();
      const responses = Array.isArray(dlvData?.responses) ? dlvData.responses : [];
      const surface = responses.find((r: { id?: string }) => r.id === "dlv_SURFACE");
      const express = responses.find((r: { id?: string }) => r.id === "dlv_EXPRESS");

      if (surface?.total_amount) surfaceRate = Math.round(Number(surface.total_amount));
      if (express?.total_amount) expressRate = Math.round(Number(express.total_amount));
      if (surface?.zone) zone = surface.zone;
    } catch (error) {
      console.error("Could not parse Delhivery response:", error);
      return NextResponse.json({ error: "Invalid delivery rate response." }, { status: 502 });
    }

    if (surfaceRate === null && expressRate === null) {
      return NextResponse.json({ error: "No Delhivery service is available for this pincode." }, { status: 422 });
    }

    return NextResponse.json({
      success: true,
      originPin: ORIGIN_PIN,
      destinationPin,
      district: locationDistrict,
      state: locationState,
      postOffices,
      rates: [
        {
          id: "dlv_SURFACE",
          mode: "SURFACE",
          title: "Standard Surface Delivery",
          amount: surfaceRate ?? expressRate,
          estimatedDays: "4-6 business days",
          zone,
        },
        {
          id: "dlv_EXPRESS",
          mode: "EXPRESS",
          title: "Express Air Delivery",
          amount: expressRate ?? surfaceRate,
          estimatedDays: "2-3 business days",
          zone,
        },
      ],
    });
  } catch (error) {
    console.error("Shipping rate calculation failed:", error);
    const message = error instanceof Error && error.message === "DELHIVERY_API_KEY is not configured."
      ? "Delhivery shipping is not configured."
      : "Could not calculate delivery rates. Please try again.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
