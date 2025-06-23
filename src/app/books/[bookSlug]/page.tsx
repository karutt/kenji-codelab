import { Box } from '@chakra-ui/react';
import fs from 'fs';
import path from 'path';

import SectionHead from '@/components/books/SectionHead';
import SectionList from '@/components/books/SectionList';
import { Icon } from '@/components/common/Icon';

// 元のプロジェクトのBookConfigに合わせた型定義
interface BookConfig {
    title: string;
    subTitle: string;
    category: string;
    description: string;
    estimatedTime: string;
    language: string;
    bookList: string[][];
    articleCount: number;
    n: number;
}

export default async function BookPage({ params }: { params: Promise<{ bookSlug: string }> }) {
    const { bookSlug } = await params;
    const configPath = path.join(process.cwd(), `public/books/${bookSlug}/config.json`);

    if (!fs.existsSync(configPath)) {
        return (
            <Box px={4} py={8} pt="80px">
                <Box textAlign="center">
                    <h1>Book not found</h1>
                    <p>The requested book could not be found.</p>
                </Box>
            </Box>
        );
    }

    const config: BookConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    return (
        <Box bg="brand.lilac">
            <SectionHead config={config} />
            <SectionList bookList={config.bookList} bookName={bookSlug} />
            <Box pos="absolute" zIndex={0} top="-90px" w="100vw">
                <Icon name="book_list_bg" width="100vw" height={500} alt="Background decoration" />
            </Box>
        </Box>
    );
}

export async function generateStaticParams() {
    const dirPath = path.join(process.cwd(), 'public/books');
    const dirs = fs.readdirSync(dirPath).filter(file => {
        return fs.statSync(path.join(dirPath, file)).isDirectory();
    });
    return dirs.map(dir => ({
        bookSlug: dir,
    }));
}
