import { promises as fs } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const { urls }: { urls: string[] } = await request.json();

        if (!Array.isArray(urls)) {
            return NextResponse.json({ error: 'URLs must be an array' }, { status: 400 });
        }

        const results = await Promise.allSettled(
            urls.map(async (url: string) => {
                try {
                    // URLをファイルパスに変換（/books/...形式をpublic/books/...に）
                    const filePath = path.join(process.cwd(), 'public', url);

                    // ファイルの存在確認
                    await fs.access(filePath);
                    return { url, exists: true };
                } catch {
                    return { url, exists: false };
                }
            }),
        );

        const checkedUrls = results
            .map(result => (result.status === 'fulfilled' ? result.value : null))
            .filter(Boolean);

        const existingUrls = checkedUrls.filter(item => item?.exists).map(item => item?.url);

        const nonExistingUrls = checkedUrls.filter(item => !item?.exists).map(item => item?.url);

        return NextResponse.json({
            total: urls.length,
            existing: existingUrls,
            nonExisting: nonExistingUrls,
            existingCount: existingUrls.length,
            nonExistingCount: nonExistingUrls.length,
        });
    } catch (error) {
        console.error('Error checking image URLs:', error);
        return NextResponse.json({ error: 'Failed to check image URLs' }, { status: 500 });
    }
}
