// components/Article.js
"use client";

import CardSet from "@/components/CardSet/CardSet";
import ProblemSet from "@/components/ProblemSet/ProblemSet";
import { useSideMenu } from "@/components/SideMenu/SideMenuContext";
import { ToggleBtn } from "@/components/common/Btn";
import { ArticleCard } from "@/components/common/Card";
import { InputField } from "@/components/common/Input";
import Modal from "@/components/common/Modal";
import { Box } from "@/styles";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import "zenn-content-css";
import markdownHtml from "zenn-markdown-html";
import ArticleHead from "./ArticleHead";

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
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    // URLクエリに基づく初期状態の設定
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
            setShowProblem(false);
            setShowSideMenu(true);
        }
    }, [searchParams, setShowSideMenu]);

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
            setIsModalOpen(false);
            setShowProblem(true);
            setShowCard(false);
            router.push("?view=problem", { scroll: false });
            setShowSideMenu(false);
        } else {
            alert("名前を入力してください！");
        }
    };

    const showCardBtn = Boolean(card);
    const showProblemBtn = Boolean(problem);

    // Option2: DOM 操作で各コードブロックにコピー用ボタンを追加する
    useEffect(() => {
        // 生成された HTML 内の .code-block-container 要素を全て取得
        const containers = document.querySelectorAll(".code-block-container");
        containers.forEach((container) => {
            // 既にボタンが存在していればスキップ
            if (!container.querySelector(".copy-button")) {
                // コンテナに relative スタイルを設定（ボタンの絶対配置用）
                container.style.position = "relative";

                // コピー用ボタンを作成
                const btn = document.createElement("button");
                btn.className = "copy-button";
                // 初期状態はコピーアイコン（以下は inline SVG の例。global.css でスタイル調整推奨）
                btn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 1H4C2.89543 1 2 1.89543 2 3V17H4V3H16V1Z"/>
            <path d="M19 5H8C6.89543 5 6 5.89543 6 7V21C6 22.1046 6.89543 23 8 23H19C20.1046 23 21 22.1046 21 21V7C21 5.89543 20.1046 5 19 5ZM19 21H8V7H19V21Z"/>
          </svg>
        `;
                // ボタンの位置調整用スタイル（基本的な位置設定。詳細は global.css で上書き可能）
                btn.style.position = "absolute";
                btn.style.top = "10px";
                btn.style.right = "10px";
                btn.style.cursor = "pointer";
                // クリックイベントでコピー処理とツールチップの表示を実装
                btn.addEventListener("click", () => {
                    const codeEl = container.querySelector("pre code");
                    if (codeEl) {
                        let codeText = codeEl.innerText;
                        // 最後に余計な改行がある場合は削除
                        if (codeText.endsWith("\n")) {
                            codeText = codeText.slice(0, -1);
                        }
                        navigator.clipboard
                            .writeText(codeText)
                            .then(() => {
                                // ツールチップ用要素を作成
                                const tooltip = document.createElement("div");
                                tooltip.className = "copy-tooltip";
                                tooltip.textContent = "コピーしました！";

                                container.appendChild(tooltip);
                                setTimeout(() => {
                                    tooltip.remove();
                                }, 1500);
                            })
                            .catch((err) => {
                                console.error("コピーに失敗しました: ", err);
                            });
                    }
                });
                // ボタンをコンテナの先頭に挿入
                container.insertBefore(btn, container.firstChild);
            }
        });
    }, [article_html]);

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
