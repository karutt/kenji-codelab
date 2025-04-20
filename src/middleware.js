// src/middleware.js
import { parse, serialize } from "cookie";
import { NextResponse } from "next/server";

export const config = {
    matcher: ["/profile/:path*", "/chat/:path*", "/dashboard/:path*"],
};

const SESSION_COOKIE_NAME = "session";

// JWT の exp を見るユーティリティ
function isJwtExpired(token) {
    try {
        const [, payloadB64] = token.split(".");
        const payloadJson = Buffer.from(payloadB64, "base64").toString("utf-8");
        const { exp } = JSON.parse(payloadJson);
        return exp < Math.floor(Date.now() / 1000);
    } catch {
        return true; // デコードエラーも期限切れ扱い
    }
}

export function middleware(request) {
    const url = request.nextUrl.clone();
    const { pathname } = url;

    // API と静的ファイルは素通り
    if (pathname.startsWith("/api/") || /\.(.*)$/.test(pathname)) {
        return NextResponse.next();
    }

    const cookies = parse(request.headers.get("cookie") || "");
    const token = cookies[SESSION_COOKIE_NAME];

    // Cookie がない or 期限切れならクリア＆リダイレクト
    if (!token || isJwtExpired(token)) {
        const res = NextResponse.redirect(new URL("/login", request.url));
        res.headers.append(
            "Set-Cookie",
            serialize(SESSION_COOKIE_NAME, "", { maxAge: -1, path: "/" })
        );
        return res;
    }

    return NextResponse.next();
}
