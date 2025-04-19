"use client";
import { useAuth } from "@/contexts/AuthContext";
import { Box, Icon } from "@/styles";
import { Avatar } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Navigation from "./Navigation";

export default function Header() {
    const pathname = usePathname();
    const { user, loading } = useAuth();
    console.log("Header", pathname, user, loading);
    // ルートパスか、もしくは"/chat"で始まるパスの場合は透明にする
    const isTransparent = pathname === "/" || pathname.startsWith("/chat");

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
            bg={isTransparent ? "none" : "portgore"}
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
                <Navigation pathname={pathname} user={user} loading={loading} />
                {/* ログイン状態によって表示を切り替え */}
                <Box ml={24} display='flex' alignItems='center'>
                    {!loading && !user && (
                        <Link
                            href='/login'
                            style={{ color: "white", opacity: 0.85, fontWeight: 500 }}>
                            ログイン
                        </Link>
                    )}
                    {!loading && user && (
                        <Link href='/profile' passHref>
                            <Avatar.Root colorPalette='cyan' size='xs'>
                                {user.displayName && <Avatar.Fallback name={user.displayName} />}
                                {user.photoURL && <Avatar.Image src={user.photoURL} />}
                            </Avatar.Root>
                        </Link>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
