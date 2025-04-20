// src/app/api/session/route.js
export const runtime = "nodejs";

import { authAdmin } from "@/utils/firebaseAdmin";
import { serialize } from "cookie";
import { NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "session";
const MAX_AGE = 60 * 60 * 24 * 5;

export async function POST(request) {
    const { idToken } = await request.json();
    if (!idToken) {
        return NextResponse.json({ error: "No ID token" }, { status: 400 });
    }
    const sessionCookie = await authAdmin.createSessionCookie(idToken, {
        expiresIn: MAX_AGE * 1000,
    });
    const res = NextResponse.json({ ok: true });
    res.headers.append(
        "Set-Cookie",
        serialize(SESSION_COOKIE_NAME, sessionCookie, {
            maxAge: MAX_AGE,
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        })
    );
    return res;
}

export async function DELETE() {
    const res = NextResponse.json({ ok: true });
    res.headers.append(
        "Set-Cookie",
        serialize(SESSION_COOKIE_NAME, "", {
            maxAge: -1,
            path: "/",
        })
    );
    return res;
}
