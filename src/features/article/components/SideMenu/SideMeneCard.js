"use client";
import { Box } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

const SideMeneCard = ({ children }) => {
    // Header と同じステート・参照を持つ
    const [showHeader, setShowHeader] = useState(true);
    const lastScrollY = useRef(0);
    const scrollDelta = useRef(0);
    const HIDE_THRESHOLD = 120; // Header と揃える

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            if (currentY < 128) {
                // 上部近くなら常に表示
                setShowHeader(true);
                scrollDelta.current = 0;
            } else if (currentY > lastScrollY.current) {
                // 下スクロール中
                scrollDelta.current += currentY - lastScrollY.current;
                if (scrollDelta.current > HIDE_THRESHOLD) {
                    setShowHeader(false);
                }
            } else {
                // 上スクロールしたら再表示
                setShowHeader(true);
                scrollDelta.current = 0;
            }
            lastScrollY.current = currentY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <Box
            position='sticky'
            top={showHeader ? "64px" : "32px"}
            transition='top 0.3s cubic-bezier(.4,0,.2,1)'
            height='calc(100vh - 64px)'
            border='solid 1px'
            borderColor='brand.black12'
            overflowY='auto'
            pb='120px'
            bg='white'
            borderRadius='xl'>
            {children}
        </Box>
    );
};

export default SideMeneCard;
