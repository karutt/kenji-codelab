// src/components/hero/HeroText.js
import { BlackBtn, WhiteBtn } from "@/components/common/Btn";
import { Box } from "@/styles";
import Link from "next/link";

const HeroText = () => {
    return (
        <Box
            display='flex'
            alignItems='center'
            justifyContent='center'
            flexDirection='column'
            color='white'
            textAlign='center'
            gap={24}
            zIndex={0}>
            <Box as='h1' fontSize={64} lineHeight='120%' fontWeight='700'>
                Master the Code,
                <br /> Design Your Path.
            </Box>
            <Box as='p' fontSize={16} lineHeight='180%' maxWidth={500}>
                KeNJi
                CodeLabは、東京賢治シュタイナー学校の、プログラミング教育のための学内プラットフォームです。
            </Box>
            <Box display='flex' gap={32}>
                <Link href='books/' style={{ textDecoration: "none" }}>
                    <WhiteBtn>レッスンを始める</WhiteBtn>
                </Link>
                <Link href='/login' style={{ textDecoration: "none" }}>
                    <BlackBtn>ログイン</BlackBtn>
                </Link>
            </Box>
        </Box>
    );
};

export default HeroText;
