import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch Gold Rates
    const goldRes = await fetch("https://beta-restapi.sarmaaya.pk/api/commodities/goldRates", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    const goldData = await goldRes.json();

    // Fetch Silver Rates
    const silverRes = await fetch("https://beta-restapi.sarmaaya.pk/api/commodities/xag", {
      next: { revalidate: 3600 },
    });
    const silverData = await silverRes.json();

    return NextResponse.json({
      success: true,
      gold: goldData.response,
      silver: silverData.response?.[0] || null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Metals Fetch Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch market data" }, { status: 500 });
  }
}
