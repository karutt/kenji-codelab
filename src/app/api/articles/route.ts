import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

import { getAllArticles, getArticleBySlug } from '@/features/article/api/articles';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const bookSlug = searchParams.get('bookSlug');
    const articleSlug = searchParams.get('articleSlug');
    const getBooks = searchParams.get('getBooks');

    // 利用可能な書籍一覧を取得
    if (getBooks === 'true') {
        try {
            const booksDir = path.join(process.cwd(), 'public/books');
            if (!fs.existsSync(booksDir)) {
                return NextResponse.json([]);
            }

            const entries = fs.readdirSync(booksDir, { withFileTypes: true });
            const books = entries.filter(entry => entry.isDirectory()).map(entry => entry.name);

            return NextResponse.json(books);
        } catch (error) {
            console.error('Error fetching books:', error);
            return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
        }
    }

    if (!bookSlug) {
        return NextResponse.json({ error: 'bookSlug is required' }, { status: 400 });
    }

    try {
        if (articleSlug) {
            // 特定の記事を取得
            const article = getArticleBySlug(bookSlug, articleSlug);
            return NextResponse.json(article);
        } else {
            // 全記事のスラッグを取得
            const articles = getAllArticles(bookSlug);
            return NextResponse.json(articles);
        }
    } catch (error) {
        console.error('Error fetching articles:', error);
        return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
    }
}
