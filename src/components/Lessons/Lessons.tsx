import { Box, Flex } from '@chakra-ui/react';
import Link from 'next/link';

import { Card } from '@/components/common/Card';
import { Icon } from '@/components/common/Icon';

interface BookConfig {
    slug: string;
    subTitle: string;
    description: string;
    articleCount: number;
    estimatedTime: string;
    n: number;
}

interface LessonsProps {
    configs: BookConfig[];
}

const Lessons = ({ configs }: LessonsProps) => {
    return (
        <Box minH="100vh" mt={16} bg="brand.lilac">
            <Box pos="relative" zIndex={0} w="100vw">
                <Flex
                    align="center"
                    justify="center"
                    direction="column"
                    w="100vw"
                    h={240}
                    mb={'-1px'}
                    color="white"
                    lineHeight={1.9}
                    bg="brand.blue"
                >
                    <Box mb={3} fontSize={40} fontWeight="bold">
                        教科書一覧
                    </Box>
                    <Box maxW={600} textAlign="center">
                        情報の授業で学ぶレッスンを一覧。スライド作成やプログラミングなど、
                        <br />
                        初心者向けの入門コースを用意しています。
                    </Box>
                </Flex>

                <Box pos="absolute" zIndex={0} left={0} w="100vw">
                    <Icon
                        name="book_list_bg2"
                        width="100vw"
                        height={130}
                        alt="Background decoration"
                        m="0 0 auto 0"
                    />
                </Box>
            </Box>

            <Flex pos="relative" zIndex={1} align="center" justify="center" w="100vw">
                <Flex align="stretch" justify="center" wrap="wrap" gap={4} w="100%" maxW={1200}>
                    {configs.map(config => (
                        <LessonCard key={config.slug} config={config} />
                    ))}
                </Flex>
            </Flex>
        </Box>
    );
};

const LessonCard = ({ config }: { config: BookConfig }) => {
    const path = `/books/${config.slug}`;

    return (
        <Box flex={1} maxW={300} m={0}>
            <Link href={path} passHref style={{ textDecoration: 'none' }}>
                <Card textAlign="center" width="100%" height="100%" p={8} py={10}>
                    <Flex align="center" justify="center" direction="column" gap={4}>
                        {/* サムネイル画像 */}
                        <Icon
                            name={`${config.slug}_thumnail`}
                            width={84}
                            height={84}
                            alt={config.subTitle}
                        />

                        <Flex
                            align="center"
                            justify="center"
                            direction="column"
                            gap={3}
                            minW={200}
                            color="brand.abbey"
                        >
                            <Box fontSize={24} fontWeight="bold">
                                {config.subTitle}
                            </Box>
                            <Box fontSize={14} fontWeight="normal" lineHeight={1.7}>
                                {config.description}
                            </Box>
                            <Box
                                color="brand.hitGray"
                                fontSize={14}
                                fontWeight="normal"
                                lineHeight={1.7}
                            >
                                記事数{config.articleCount}　{config.estimatedTime}
                            </Box>
                        </Flex>
                    </Flex>
                </Card>
            </Link>
        </Box>
    );
};

export default Lessons;
