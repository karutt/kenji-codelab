"use client";

import markdownHtml from "zenn-markdown-html";
import "zenn-content-css";
import { Box } from "@/styles";
import { ArticleCard } from "@/components/common/Card";
import ArticleHead from "./ArticleHead";

export default function Article({ markdown, frontMatter, articleSlug, bookSlug }) {
    const html = markdownHtml(markdown);

    return (
        <Box as='article' className='znc' color='shark' my={32}>
            <ArticleCard>
                <ArticleHead
                    frontMatter={frontMatter}
                    articleSlug={articleSlug}
                    bookSlug={bookSlug}
                />
                <Box className='main' px={64}>
                    <div dangerouslySetInnerHTML={{ __html: html }} />
                </Box>
            </ArticleCard>
        </Box>
    );
}
