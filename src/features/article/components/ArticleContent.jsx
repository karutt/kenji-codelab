"use client";

import CardSet from "@/components/CardSet/CardSet";
import { ToggleBtn } from "@/components/common/Btn";
import { ArticleCard } from "@/components/common/Card";
import { InputField } from "@/components/common/Input";
import Modal from "@/components/common/Modal";
import { useSideMenu } from "@/features/article/components/SideMenu/SideMenuContext";
import ProblemSet from "@/features/problem/components/ProblemSet";
import { Box } from "@/styles";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "zenn-content-css";
import { useKenjiName } from "../hooks/useKenjiName";
import { parseMarkdownToHtml } from "../utils/markdownParser";
import ArticleHead from "./ArticleHead";
import NeighborLinkCard from "./NeighborLinkCard";

export default function ArticleContent({
    markdown,
    card,
    problem,
    frontMatter,
    articleSlug,
    bookSlug,
    neighborsPage,
}) {
    const articleHtml = parseMarkdownToHtml(markdown);
    const [showCard, setShowCard] = useState(false);
    const [showProblem, setShowProblem] = useState(false);
    const { showSideMenu, setShowSideMenu } = useSideMenu();
    const router = useRouter();
    const searchParams = useSearchParams();

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

    const { name, setName, isModalOpen, openModal, closeModal, saveNameToLocalStorage } =
        useKenjiName(router, setShowProblem, setShowCard, setShowSideMenu);

    const toggleProblemView = () => {
        if (showProblem) {
            setShowProblem(false);
            setShowSideMenu(true);
            router.back();
        } else {
            openModal();
        }
    };

    const showCardBtn = Boolean(card);
    const showProblemBtn = Boolean(problem);

    // コードブロックにコピーボタンを追加
    useEffect(() => {
        const containers = document.querySelectorAll(".code-block-container");
        containers.forEach((container) => {
            if (!container.querySelector(".copy-button")) {
                container.style.position = "relative";
                const btn = document.createElement("button");
                btn.className = "copy-button";
                btn.innerHTML = `
<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M16 1H4C2.89543 1 2 1.89543 2 3V17H4V3H16V1Z"/>
  <path d="M19 5H8C6.89543 5 6 5.89543 6 7V21C6 22.1046 6.89543 23 8 23H19C20.1046 23 21 22.1046 21 21V7C21 5.89543 20.1046 5 19 5ZM19 21H8V7H19V21Z"/>
</svg>`;
                btn.style.position = "absolute";
                btn.style.top = "10px";
                btn.style.right = "10px";
                btn.style.cursor = "pointer";
                btn.addEventListener("click", () => {
                    const codeEl = container.querySelector("pre code");
                    if (codeEl) {
                        let txt = codeEl.innerText;
                        if (txt.endsWith("\n")) txt = txt.slice(0, -1);
                        navigator.clipboard
                            .writeText(txt)
                            .then(() => {
                                const tip = document.createElement("div");
                                tip.className = "copy-tooltip";
                                tip.textContent = "コピーしました！";
                                container.appendChild(tip);
                                setTimeout(() => tip.remove(), 1500);
                            })
                            .catch((e) => console.error("コピー失敗:", e));
                    }
                });
                container.insertBefore(btn, container.firstChild);
            }
        });
    }, [articleHtml]);

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
                        <div dangerouslySetInnerHTML={{ __html: articleHtml }} />
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
                    onChange={(e) => setName(e.target.value)}
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

            <Box
                mt={24}
                display='flex'
                justifyContent='space-between'
                flexDirection={["column", "row"]}
                gap={8}>
                {neighborsPage.prePage && (
                    <NeighborLinkCard
                        link={neighborsPage.prePage.link}
                        title={neighborsPage.prePage.title}
                    />
                )}
                {neighborsPage.nextPage && (
                    <NeighborLinkCard
                        link={neighborsPage.nextPage.link}
                        title={neighborsPage.nextPage.title}
                        next
                    />
                )}
            </Box>
        </Box>
    );
}
