"use client";
import { Box, Icon } from "@/styles";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Navigation from "./Navigation";

export default function Header() {
    const pathname = usePathname();
    const isRoot = pathname === "/";

    // パスを分割してセグメントを取得
    const pathSegments = pathname.split("/").filter(Boolean);

    // スクロールでヘッダーを隠す/表示する
    const [showHeader, setShowHeader] = useState(true);
    const lastScrollY = useRef(0);
    const scrollDelta = useRef(0);
    const HIDE_THRESHOLD = 120; // これだけ連続で下スクロールしたら隠す

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            if (currentY < 128) {
                setShowHeader(true);
                scrollDelta.current = 0;
            } else if (currentY > lastScrollY.current) {
                // 下スクロール
                scrollDelta.current += currentY - lastScrollY.current;
                if (scrollDelta.current > HIDE_THRESHOLD) {
                    setShowHeader(false);
                }
            } else {
                // 上スクロール
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
            as='header'
            bg={isRoot ? "none" : "portgore"}
            color='white'
            height={64}
            position='fixed'
            top={0}
            left={0}
            width='100vw'
            borderBottom='1px solid rgba(255, 255, 255, 0.2)'
            zIndex={100}
            style={{
                transition: "transform 0.3s cubic-bezier(.4,0,.2,1)",
                transform: showHeader ? "translateY(0)" : "translateY(-100%)",
            }}>
            <Box
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                mx='auto'
                height='100%'
                maxWidth={1140}>
                <Link href='/'>
                    <Icon name='logo_text' width={180} height='100%' />
                </Link>
                <Navigation pathname={pathname} />
            </Box>
        </Box>
    );
}
