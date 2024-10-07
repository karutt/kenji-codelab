// components/Article.js
"use client";

import React, { useState, useEffect } from "react"; // useStateをインポート
import markdownHtml from "zenn-markdown-html";
import "zenn-content-css";
import { Box } from "@/styles";
import { ArticleCard } from "@/components/common/Card";
import ArticleHead from "./ArticleHead";
import CardSet from "@/components/CardSet/CardSet";
import ProblemSet from "@/components/ProblemSet/ProblemSet"; // ProblemSetをインポート
import { ToggleBtn } from "@/components/common/Btn"; // ToggleBtnをインポート
import Modal from "@/components/common/Modal";
import { useSideMenu } from "@/components/SideMenu/SideMenuContext";
import { InputField } from "@/components/common/Input";

export default function Article({ markdown, card, problem, frontMatter, articleSlug, bookSlug }) {
    const article_html = markdownHtml(markdown);
    // 記事、問題セット、カードセットの表示を切り替えるための状態管理
    const [showCard, setShowCard] = useState(false);
    const [showProblem, setShowProblem] = useState(false);
    const { showSideMenu, setShowSideMenu } = useSideMenu();

    // ボタンクリック時のハンドラー
    const toggleCardView = () => {
        setShowCard((prevShowCard) => !prevShowCard);
        setShowProblem(false); // 別の表示を非表示にする
        setShowSideMenu(true);

        // 画面のトップにスムーズにスクロールする
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const toggleProblemView = () => {
        if (showProblem) {
            setShowProblem(false);
            setShowCard(false); // 別の表示を非表示にする
            setShowSideMenu(true);
            return;
        }
        setIsModalOpen(true);
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
        setShowProblem((prevShowProblem) => !prevShowProblem);
        setShowCard(false); // 別の表示を非表示にする
        setShowSideMenu(false);
        if (name.trim()) {
            localStorage.setItem("kenji_name", name);
            closeModal(); // 保存後モーダルを閉じる
        } else {
            alert("名前を入力してください！");
        }
    };

    const showCardBtn = card ? true : false;
    const showProblemBtn = problem ? true : false;

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
                    {/* 状態に基づいて表示を切り替える */}
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

            {showCardBtn ? <ToggleBtn toggle={showCard} onClick={toggleCardView} /> : ""}

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
