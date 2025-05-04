import { fetchSubmissions } from "@/utils/notion/actions"; // Notion APIを呼び出す関数
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor") || "initial";
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const filterName = searchParams.get("filter") || "";

    const records = await fetchSubmissions(
        cursor === "initial" ? null : cursor,
        pageSize,
        filterName
    );

    // キャッシュヘッダーを設定
    return NextResponse.json(records, {
        headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" }, // 60秒間はキャッシュ、それ以降は300秒間再検証
    });
}
