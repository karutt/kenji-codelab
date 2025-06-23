import { NextRequest, NextResponse } from 'next/server';

import { authAdmin } from '@/utils/firebaseAdmin';

const SESSION_COOKIE_NAME = 'session';
const MAX_AGE = 60 * 60 * 24 * 5; // 5 days

export const runtime = 'nodejs';
// この API ハンドラは絶対キャッシュさせない
export const revalidate = 0;

export async function POST(request: NextRequest) {
    try {
        const { idToken } = await request.json();

        if (!idToken) {
            return NextResponse.json({ error: 'idToken is required' }, { status: 400 });
        }

        // Firebase Admin でトークンを検証
        await authAdmin.verifyIdToken(idToken);

        // セッション Cookie を作成
        const sessionCookie = await authAdmin.createSessionCookie(idToken, {
            expiresIn: MAX_AGE * 1000,
        });

        // レスポンスにクッキーを設定
        const response = NextResponse.json({ success: true });
        response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
            maxAge: MAX_AGE,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Session POST error:', error);
        return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        const response = NextResponse.json({ success: true });

        // セッション Cookie を削除
        response.cookies.set(SESSION_COOKIE_NAME, '', {
            maxAge: 0,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Session DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
    }
}
