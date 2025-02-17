"use client";
import { Card } from "@/components/common/Card";
import { Box, Icon } from "@/styles";
import Link from "next/link";

const Lessons = ({ configs }) => {
    return (
        <Box mt={60} bg='lilac' minHeight='100vh'>
            <Box width='100vw' zIndex={0} position='relative'>
                <Box
                    width='100vw'
                    height={240}
                    bg='blue'
                    mb={-2}
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    flexDirection='column'
                    color='white'
                    lineHeight={1.9}
                    pt={40}>
                    <Box fontSize={40} fontWeight='bold' mb={12}>
                        教科書一覧
                    </Box>
                    <Box maxWidth={600} textAlign='center'>
                        情報の授業で学ぶレッスンを一覧。スライド作成やプログラミングなど、実践的なスキルを身につけるための初心者向けの入門コースがあります。{" "}
                    </Box>
                </Box>

                <Box position='absolute' left={0} width='100vw' zIndex={0}>
                    <Icon name='book_list_bg2' width='100%' height='100%' maxHeight={100} />
                </Box>
            </Box>
            <Box
                mt={32}
                width='100vw'
                display='flex'
                alignItems='center'
                justifyContent='center'
                position='relative'
                zIndex={1}>
                <Box
                    width='100%'
                    maxWidth={800}
                    display='flex'
                    alignItems='stretch'
                    justifyContent='center'
                    gap={16}>
                    {configs.map((config) => {
                        return <LessonCard key={config["slug"]} config={config} />;
                    })}
                </Box>
            </Box>
        </Box>
    );
};

const LessonCard = ({ config }) => {
    const path = `/books/${config["slug"]}`;
    return (
        <Box flex={1} maxWidth={320} m={0}>
            <Link href={path} passHref width='100%' className='link'>
                <Card textAlign='center' width='100%' height={"100%"} p={32}>
                    <Icon name={config["slug"] + "_thumnail"} width={100} height={100} />
                    <Box
                        color='abbey'
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                        flexDirection='column'
                        gap={12}>
                        <Box fontSize={24} fontWeight='bold'>
                            {config["subTitle"]}
                        </Box>
                        <Box fontSize={14} fontWeight='normal' lineHeight={1.7}>
                            {config["description"]}
                        </Box>
                        <Box fontSize={14} fontWeight='bold' lineHeight={1.7} color='hitGray'>
                            記事数{config["articleCount"]}　{config["estimatedTime"]}
                        </Box>
                    </Box>
                </Card>
            </Link>
        </Box>
    );
};

export default Lessons;
