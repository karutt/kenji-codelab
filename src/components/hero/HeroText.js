// src/components/hero/HeroText.js
import React from "react";
import { Box } from "@/styles";
import { WhiteBtn, BlackBtn } from "@/components/common/Btn";
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
                CodeLabは、プログラミングを楽しく学べる場所。創造力を刺激する学習記事やチュートリアルも充実。
            </Box>
            <Box display='flex' gap={32}>
                <Link href='books/p5_tutorial' style={{ textDecoration: "none" }}>
                    <WhiteBtn>レッスンを始める</WhiteBtn>
                </Link>
                <Link href='/submit' style={{ textDecoration: "none" }}>
                    <BlackBtn>コードを提出</BlackBtn>
                </Link>
            </Box>
        </Box>
    );
};

export default HeroText;