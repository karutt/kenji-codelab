// src/app/api/session/route.js
import { authAdmin } from "@/utils/firebaseAdmin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "session";
const MAX_AGE = 60 * 60 * 24 * 5;

export const runtime = "nodejs";
// この API ハンドラは絶対キャッシュさせない
export const revalidate = 0;

export async function POST(request) {
    const { idToken } = await request.json();
    if (!idToken) {
        return NextResponse.json({ error: "No ID token" }, { status: 400 });
    }
    const sessionCookie = await authAdmin.createSessionCookie(idToken, {
        expiresIn: MAX_AGE * 1000,
    });
    const res = NextResponse.json({ ok: true });
    cookies().set({
        name: SESSION_COOKIE_NAME,
        value: sessionCookie,
        httpOnly: true,
        maxAge: MAX_AGE,
        path: "/",
        sameSite: "none",
        secure: true,
    });
    return res;
}

export async function DELETE() {
    const res = NextResponse.json({ ok: true });
    cookies().delete(SESSION_COOKIE_NAME, { path: "/" });
    return res;
}
