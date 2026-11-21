import { NextResponse } from "next/server";
import { getProducts, getCategories } from "@/data/store";

export const revalidate = 60; // 60s ISR / CDN caching

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 24;

  const [{ data: products, count }, { data: categories }] = await Promise.all([
    getProducts({ page, limit, category }),
    getCategories(),
  ]);

  return NextResponse.json(
    { products, categories, count },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
      },
    }
  );
}
