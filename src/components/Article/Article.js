// components/Article.js
"use client";

import React, { useState } from "react"; // useStateをインポート
import markdownHtml from "zenn-markdown-html";
import "zenn-content-css";
import { Box } from "@/styles";
import { ArticleCard } from "@/components/common/Card";
import ArticleHead from "./ArticleHead";
import CardlemSet from "@/components/CardSet/CardSet";
import ProblemSet from "@/components/ProblemSet/ProblemSet"; // ProblemSetをインポート

export default function Article({ markdown, card, problem, frontMatter, articleSlug, bookSlug }) {
    const article_html = markdownHtml(markdown);

    // 記事、問題セット、カードセットの表示を切り替えるための状態管理
    const [showCardlem, setShowCardlem] = useState(false);
    const [showProblem, setShowProblem] = useState(false);

    // ボタンクリック時のハンドラー
    const toggleCardlemView = () => {
        setShowCardlem((prevShowCardlem) => !prevShowCardlem);
        setShowProblem(false); // 別の表示を非表示にする
    };

    const toggleProblemView = () => {
        setShowProblem((prevShowProblem) => !prevShowProblem);
        setShowCardlem(false); // 別の表示を非表示にする
    };

    return (
        <Box as='article' className='znc' color='shark' my={32}>
            <ArticleCard>
                <ArticleHead
                    frontMatter={frontMatter}
                    articleSlug={articleSlug}
                    bookSlug={bookSlug}
                />
                <Box className='main' px={64}>
                    {/* 状態に基づいて表示を切り替える */}
                    {showCardlem ? (
                        <CardlemSet cardMarkdown={card} />
                    ) : showProblem ? (
                        <ProblemSet problemMarkdown={problem} />
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: article_html }} />
                    )}
                </Box>
            </ArticleCard>

            {/* 切り替えボタン */}
            <button
                onClick={toggleCardlemView}
                style={{
                    position: "fixed",
                    bottom: "80px",
                    right: "20px",
                    padding: "10px 20px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    zIndex: 1000, // ボタンが常に前面に表示されるように
                }}>
                {showCardlem ? "記事を読む" : "問題を解く"}
            </button>
            {/* ProblemSetの切り替えボタン */}
            <button
                onClick={toggleProblemView}
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    padding: "10px 20px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    zIndex: 1000, // ボタンが常に前面に表示されるように
                }}>
                {showProblem ? "記事を読む" : "問題を解く"}
            </button>
        </Box>
    );
}
