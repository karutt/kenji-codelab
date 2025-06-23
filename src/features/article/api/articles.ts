import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

/**
 * 指定 bookSlug のすべての記事スラッグを取得
 */
export function getAllArticles(bookSlug: string): { slug: string }[] {
    const mdDir = path.join(process.cwd(), `public/books/${bookSlug}/md`);

    if (!fs.existsSync(mdDir)) {
        return [];
    }

    const files = fs.readdirSync(mdDir).filter(f => f.endsWith('.md'));
    const slugs = files.map(f => f.replace(/\.md$/, ''));
    slugs.sort();
    return slugs.map(slug => ({ slug }));
}

/**
 * 単一記事の本文・メタデータ・カード・問題・前後リンクを取得
 */
export function getArticleBySlug(bookSlug: string, articleSlug: string) {
    const mdDir = path.join(process.cwd(), `public/books/${bookSlug}/md`);
    const all = getAllArticles(bookSlug).map(a => a.slug);
    const idx = all.indexOf(articleSlug);

    const prePage =
        idx > 0
            ? {
                  title:
                      matter(fs.readFileSync(path.join(mdDir, `${all[idx - 1]}.md`), 'utf8')).data
                          .title || '',
                  link: `/books/${bookSlug}/${all[idx - 1]}`,
              }
            : null;

    const nextPage =
        idx < all.length - 1
            ? {
                  title:
                      matter(fs.readFileSync(path.join(mdDir, `${all[idx + 1]}.md`), 'utf8')).data
                          .title || '',
                  link: `/books/${bookSlug}/${all[idx + 1]}`,
              }
            : null;

    const mdPath = path.join(mdDir, `${articleSlug}.md`);

    if (!fs.existsSync(mdPath)) {
        throw new Error(`Article not found: ${articleSlug}`);
    }

    const mdRaw = fs.readFileSync(mdPath, 'utf8');
    const { content, data } = matter(mdRaw);

    const cardPath = path.join(process.cwd(), `public/books/${bookSlug}/card`, `${articleSlug}.md`);
    const probPath = path.join(process.cwd(), `public/books/${bookSlug}/prob`, `${articleSlug}.md`);
    const card = fs.existsSync(cardPath) ? fs.readFileSync(cardPath, 'utf8') : '';
    const problem = fs.existsSync(probPath) ? fs.readFileSync(probPath, 'utf8') : '';

    return { content, data, card, problem, neighborsPage: { prePage, nextPage } };
}
