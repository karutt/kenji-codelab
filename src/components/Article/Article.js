// components/Article.js
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation"; // 追加
import markdownHtml from "zenn-markdown-html";
import "zenn-content-css";
import { Box } from "@/styles";
import { ArticleCard } from "@/components/common/Card";
import ArticleHead from "./ArticleHead";
import CardSet from "@/components/CardSet/CardSet";
import ProblemSet from "@/components/ProblemSet/ProblemSet";
import { ToggleBtn } from "@/components/common/Btn";
import Modal from "@/components/common/Modal";
import { useSideMenu } from "@/components/SideMenu/SideMenuContext";
import { InputField } from "@/components/common/Input";
import { Suspense } from "react"; // Suspenseをインポート

export default function Article(props) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ArticleContent {...props} />
        </Suspense>
    );
}

function ArticleContent({ markdown, card, problem, frontMatter, articleSlug, bookSlug }) {
    const article_html = markdownHtml(markdown);
    const [showCard, setShowCard] = useState(false);
    const [showProblem, setShowProblem] = useState(false);
    const { showSideMenu, setShowSideMenu } = useSideMenu();
    const router = useRouter(); // useRouterの使用
    const searchParams = useSearchParams(); // 現在のクエリパラメータを取得
    const pathname = usePathname(); // 現在のパスを取得

    // 初期レンダリングでURLクエリに基づいて状態を設定
    useEffect(() => {
        const view = searchParams.get("view");
        if (view === "card") {
            setShowCard(true);
            setShowProblem(false);
        } else if (view === "problem") {
            setShowProblem(true);
            setShowCard(false);
            setShowSideMenu(false);
        } else {
            setShowCard(false);
            setShowProblem(false); // 初期状態に戻す
            setShowSideMenu(true);
        }
    }, [searchParams, setShowSideMenu]); //

    const toggleCardView = () => {
        if (showCard) {
            setShowCard(false);
            setShowProblem(false);
            router.back();
        } else {
            setShowCard(true);
            setShowProblem(false);
            router.push("?view=card", { scroll: false });
        }
    };

    const toggleProblemView = () => {
        if (showProblem) {
            setShowProblem(false);
            setShowSideMenu(true);
            router.back();
            return;
        }
        setIsModalOpen(true); // まずはモーダルを開く
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState("");

    useEffect(() => {
        const savedName = localStorage.getItem("kenji_name");
        if (savedName) {
            setName(savedName);
        }
    }, []);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const saveNameToLocalStorage = () => {
        if (name.trim()) {
            localStorage.setItem("kenji_name", name);
            setIsModalOpen(false); // モーダルを閉じる
            setShowProblem(true); // 問題画面を表示
            setShowCard(false); // カードを非表示
            router.push("?view=problem", { scroll: false }); // URLを更新
            setShowSideMenu(false);
        } else {
            alert("名前を入力してください！");
        }
    };

    const showCardBtn = Boolean(card);
    const showProblemBtn = Boolean(problem);

    return (
        <Box as='article' className='znc' color='shark' my={32} width='100%' maxWidth={860}>
            <ArticleCard>
                <ArticleHead
                    frontMatter={frontMatter}
                    articleSlug={articleSlug}
                    bookSlug={bookSlug}
                    showProblemBtn={showProblemBtn}
                    showProblem={showProblem}
                    onClick={toggleProblemView}
                />
                <Box className='main' px={64} pb={64}>
                    {showCard ? (
                        <CardSet cardMarkdown={card} />
                    ) : showProblem ? (
                        <ProblemSet
                            problemMarkdown={problem}
                            articleSlug={articleSlug}
                            bookSlug={bookSlug}
                            showProblemBtn={showProblemBtn}
                            showProblem={showProblem}
                            onClick={toggleProblemView}
                        />
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: article_html }} />
                    )}
                </Box>
            </ArticleCard>

            {showCardBtn && <ToggleBtn toggle={showCard} onClick={toggleCardView} />}

            <Modal isOpen={isModalOpen}>
                <Box fontSize={24} fontWeight='bold' mb={8}>
                    あなたの名前を入力
                </Box>
                <Box color='abbey' fontSize={14} mb={24}>
                    「決定」を押すと名前が保存され、問題が開始されます。
                </Box>
                <InputField
                    type='text'
                    value={name}
                    onChange={handleNameChange}
                    placeholder='名前を入力'
                />
                <Box
                    onClick={saveNameToLocalStorage}
                    mt={24}
                    mb={8}
                    width='100%'
                    bg='blue'
                    color='white'
                    borderRadius={4}
                    py={10}
                    style={{ cursor: "pointer" }}>
                    決定
                </Box>
                <Box
                    onClick={closeModal}
                    width='100%'
                    bg='white'
                    color='abbey'
                    border='1.5px solid #dee2e6'
                    borderRadius={4}
                    py={10}
                    style={{ cursor: "pointer" }}>
                    キャンセル
                </Box>
            </Modal>
        </Box>
    );
}
