import { Flex } from '@chakra-ui/react';
import fs from 'fs';
import path from 'path';

import { BookConfigProvider } from '@/contexts/BookConfigContext';
import SideMenu from '@/features/article/components/SideMenu/SideMenu';
import { SideMenuProvider } from '@/features/article/components/SideMenu/SideMenuContext';

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

export default async function ArticleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ bookSlug: string; articleSlug: string }>;
}) {
    const { bookSlug, articleSlug } = await params;
    const configPath = path.join(process.cwd(), `public/books/${bookSlug}/config.json`);
    const config: BookConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    return (
        <SideMenuProvider>
            <BookConfigProvider config={config}>
                <Flex
                    className="books"
                    pos="relative"
                    align="center"
                    justify="center"
                    direction="row"
                    overflow="visible"
                    w="100%"
                    minH="calc(100vh - 80px)"
                    mt="64px"
                    bg="article.bg"
                >
                    <SideMenu bookName={bookSlug} articleSlug={articleSlug} />
                    <Flex flex={1} maxW={800}>
                        {children}
                    </Flex>
                </Flex>
            </BookConfigProvider>
        </SideMenuProvider>
    );
}
