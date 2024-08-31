"use client";
import { Box, Icon } from "@/styles";
import Link from "next/link";
import Navigation from "./Navigation";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();
    const isRoot = pathname === "/";

    // パスを分割してセグメントを取得
    const pathSegments = pathname.split("/").filter(Boolean);

    // `pathname` の長さとセグメント名で記事ページかどうかを判定
    const isArticlePage = pathSegments.length === 3 && /^[0-9]+-[0-9]+$/.test(pathSegments[2]);

    // 記事ページの場合はヘッダーを非表示
    if (isArticlePage) {
        return null;
    }

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
            zIndex={2}>
            <Box
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                mx='auto'
                height='100%'
                maxWidth={1140}>
                <Link href='/'>
                    <Icon name='logo_text' width={240} height='100%' />
                </Link>
                <Navigation pathname={pathname} />
            </Box>
        </Box>
    );
}
