import { getBookById, getChapterById } from '@/data/books';

export interface BreadcrumbItem {
    label: string;
    href?: string;
    isCurrent?: boolean;
}

export interface NavigationLink {
    title: string;
    href: string;
}

/**
 * Generate breadcrumb items for book navigation
 */
export function generateBookBreadcrumbs(bookId: string, chapterId?: string): BreadcrumbItem[] {
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'ホーム', href: '/' },
        { label: 'Books', href: '/books' },
    ];

    const book = getBookById(bookId);
    if (!book) return breadcrumbs;

    if (chapterId) {
        // Book > Chapter
        breadcrumbs.push({ label: book.title, href: `/books/${bookId}` });

        const chapter = getChapterById(bookId, chapterId);
        if (chapter) {
            breadcrumbs.push({ label: chapter.title, isCurrent: true });
        }
    } else {
        // Book only
        breadcrumbs.push({ label: book.title, isCurrent: true });
    }

    return breadcrumbs;
}

/**
 * Generate navigation links for previous/next chapters
 */
export function generateChapterNavigation(
    bookId: string,
    currentChapterId: string,
): {
    previous?: NavigationLink;
    next?: NavigationLink;
} {
    const book = getBookById(bookId);
    if (!book) return {};

    const publishedChapters = book.chapters
        .filter(c => c.published)
        .sort((a, b) => a.order - b.order);

    const currentIndex = publishedChapters.findIndex(c => c.id === currentChapterId);
    if (currentIndex === -1) return {};

    const result: {
        previous?: NavigationLink;
        next?: NavigationLink;
    } = {};

    // Previous chapter
    if (currentIndex > 0) {
        const prevChapter = publishedChapters[currentIndex - 1];
        result.previous = {
            title: prevChapter.title,
            href: `/books/${bookId}/${prevChapter.id}`,
        };
    }

    // Next chapter
    if (currentIndex < publishedChapters.length - 1) {
        const nextChapter = publishedChapters[currentIndex + 1];
        result.next = {
            title: nextChapter.title,
            href: `/books/${bookId}/${nextChapter.id}`,
        };
    }

    return result;
}

/**
 * Generate table of contents for book sidebar
 */
export function generateTableOfContents(bookId: string, currentChapterId?: string) {
    const book = getBookById(bookId);
    if (!book) return null;

    const publishedChapters = book.chapters
        .filter(c => c.published)
        .sort((a, b) => a.order - b.order);

    return {
        bookTitle: book.title,
        chapters: publishedChapters.map(chapter => ({
            id: chapter.id,
            title: chapter.title,
            href: `/books/${bookId}/${chapter.id}`,
            isCurrent: chapter.id === currentChapterId,
            estimatedReadTime: chapter.estimatedReadTime,
        })),
    };
}

/**
 * Generate metadata for SEO
 */
export function generateBookMetadata(bookId: string, chapterId?: string) {
    const book = getBookById(bookId);
    if (!book) return null;

    if (chapterId) {
        const chapter = getChapterById(bookId, chapterId);
        if (!chapter) return null;

        return {
            title: `${chapter.title} | ${book.title}`,
            description: chapter.description || `${book.title}の${chapter.title}について学習します`,
            keywords: [...book.tags, chapter.title].join(', '),
        };
    }

    return {
        title: book.title,
        description: book.description,
        keywords: book.tags.join(', '),
    };
}

/**
 * Generate URL patterns for book routes
 */
export function generateBookRoutes() {
    return {
        bookList: '/books',
        bookDetail: (bookId: string) => `/books/${bookId}`,
        chapterDetail: (bookId: string, chapterId: string) => `/books/${bookId}/${chapterId}`,
    };
}
