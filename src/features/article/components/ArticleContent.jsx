// src/features/article/components/ArticleContent.jsx
"use client";

import CardSet from "@/components/CardSet/CardSet";
import { ToggleBtn } from "@/components/common/Btn";
import { ArticleCard } from "@/components/common/Card";
import { useAuth } from "@/contexts/AuthContext";
import { useSideMenu } from "@/features/article/components/SideMenu/SideMenuContext";
import ProblemSet from "@/features/problem/components/ProblemSet";
import { Box } from "@/styles";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import "zenn-content-css";
import { useKenjiName } from "../hooks/useKenjiName";
import { injectCopyButtons } from "../utils/injectCopyButtons";
import { parseMarkdownToHtml } from "../utils/markdownParser";
import ArticleHead from "./ArticleHead";
import NameModal from "./NameModal";
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
    const htmlWithButtons = useMemo(() => injectCopyButtons(articleHtml), [articleHtml]);

    const [showCard, setShowCard] = useState(false);
    const [showProblem, setShowProblem] = useState(false);
    const { showSideMenu, setShowSideMenu } = useSideMenu();
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    // コードブロックのコピー機能を有効化
    const contentRef = useRef(null);

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
            if (user) {
                setShowProblem(true);
                setShowCard(false);
                setShowSideMenu(false);
                router.push("?view=problem", { scroll: false });
            } else {
                openModal();
            }
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
                <Box className='main' px={[16, "5%", 64]} pb={64}>
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
                        <div dangerouslySetInnerHTML={{ __html: htmlWithButtons }} />
                    )}
                </Box>
            </ArticleCard>

            {showCardBtn && <ToggleBtn toggle={showCard} onClick={toggleCardView} />}

            {!user && (
                <NameModal
                    isOpen={isModalOpen}
                    name={name}
                    onChange={setName}
                    onSave={saveNameToLocalStorage}
                    onCancel={closeModal}
                />
            )}

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
