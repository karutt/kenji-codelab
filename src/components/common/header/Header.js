"use client";
import { useAuth } from "@/contexts/AuthContext";
import { Box, Icon } from "@/styles";
import { IoArrowBackCircleOutline } from "react-icons/io5";

import { Avatar, Button } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Navigation from "./Navigation";

export default function Header() {
    const pathname = usePathname();

    const { user, loading } = useAuth();
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
            px={[16, "10%"]}
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
                <Box display={["none", "none", "flex"]} alignItems='center'>
                    <Link href='/'>
                        <Icon name='logo_text' width={180} height='100%' />
                    </Link>
                </Box>
                <Navigation pathname={pathname} user={user} loading={loading} />
                {/* ログイン状態によって表示を切り替え */}
                <Box ml={24} display='flex' alignItems='center'>
                    {/* /books/xxx/yyy の場合に「チャプターに戻る」リンクを表示 */}
                    {(() => {
                        const segments = pathname.split("/").filter(Boolean);
                        if (segments.length === 3 && segments[0] === "books") {
                            const chapterPath = `/books/${segments[1]}`;
                            return (
                                <Link
                                    href={chapterPath}
                                    style={{
                                        color: "white",
                                        opacity: 0.85,
                                        fontSize: 14,
                                        fontWeight: 500,
                                        marginRight: 20,
                                    }}>
                                    <Button
                                        variant='plane'
                                        color='white.300'
                                        borderColor='white.300'
                                        bg='whiteAlpha.300'
                                        borderRadius='full'
                                        _hover={{ bg: "whiteAlpha.400" }}>
                                        <IoArrowBackCircleOutline />
                                        一覧に戻る
                                    </Button>
                                </Link>
                            );
                        }
                        return null;
                    })()}
                    {!loading && !user && (
                        <Link
                            href='/login'
                            style={{ color: "white", opacity: 0.85, fontWeight: 500 }}>
                            Sign in
                        </Link>
                    )}
                    {!loading && user && (
                        <Link href='/profile' passHref>
                            <Avatar.Root colorPalette='cyan' size='xs'>
                                {user.displayName && <Avatar.Fallback name={user.displayName} />}
                                {user.photoURL && (
                                    <Avatar.Image src={user.photoURL} borderWidth={1} />
                                )}
                            </Avatar.Root>
                        </Link>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
