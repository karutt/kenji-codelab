import { promises as fs } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

async function findImageFiles(dirPath: string, baseUrl: string = ''): Promise<string[]> {
    const imageUrls: string[] = [];

    try {
        const items = await fs.readdir(dirPath, { withFileTypes: true });

        for (const item of items) {
            if (item.name.startsWith('.')) continue; // .DS_Store等を除外

            const itemPath = path.join(dirPath, item.name);
            const urlPath = `${baseUrl}/${item.name}`;

            if (item.isDirectory()) {
                // ディレクトリの場合は再帰的に検索
                const subImages = await findImageFiles(itemPath, urlPath);
                imageUrls.push(...subImages);
            } else if (item.isFile()) {
                // 画像ファイルかチェック
                const ext = path.extname(item.name).toLowerCase();
                if (['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp'].includes(ext)) {
                    imageUrls.push(urlPath);
                }
            }
        }
    } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error);
    }

    return imageUrls;
}

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const bookSlug = url.searchParams.get('book');

        if (!bookSlug) {
            return NextResponse.json({ error: 'Book slug is required' }, { status: 400 });
        }

        const bookImagesDir = path.join(process.cwd(), 'public', 'books', bookSlug, 'images');

        // ディレクトリの存在確認
        try {
            await fs.access(bookImagesDir);
        } catch {
            return NextResponse.json({
                book: bookSlug,
                images: [],
                count: 0,
            });
        }

        const imageUrls = await findImageFiles(bookImagesDir, `/books/${bookSlug}/images`);

        return NextResponse.json({
            book: bookSlug,
            images: imageUrls,
            count: imageUrls.length,
        });
    } catch (error) {
        console.error('Error finding image files:', error);
        return NextResponse.json({ error: 'Failed to find image files' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { books }: { books: string[] } = await request.json();

        if (!Array.isArray(books)) {
            return NextResponse.json({ error: 'Books must be an array' }, { status: 400 });
        }

        const allImages: { [book: string]: string[] } = {};
        let totalCount = 0;

        for (const bookSlug of books) {
            const bookImagesDir = path.join(process.cwd(), 'public', 'books', bookSlug, 'images');

            try {
                await fs.access(bookImagesDir);
                const imageUrls = await findImageFiles(bookImagesDir, `/books/${bookSlug}/images`);
                allImages[bookSlug] = imageUrls;
                totalCount += imageUrls.length;
            } catch {
                allImages[bookSlug] = [];
            }
        }

        return NextResponse.json({
            books: allImages,
            totalCount,
        });
    } catch (error) {
        console.error('Error finding all image files:', error);
        return NextResponse.json({ error: 'Failed to find all image files' }, { status: 500 });
    }
}
