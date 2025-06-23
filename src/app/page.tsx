import { Box, Button, Flex, Heading, HStack, Text } from '@chakra-ui/react';
import Link from 'next/link';

import { Icon } from '@/components/common/Icon';

export default function Home() {
    return (
        <Box>
            {/* ヒーローセクション - 元のプロジェクトを忠実に再現 */}
            <Flex
                pos="relative"
                align="center"
                justify="center"
                direction="column"
                overflow="hidden"
                minH="100vh"
                px={3}
                py={5}
                bg="brand.blue"
            >
                {/* SVG背景 */}
                <Box pos="absolute" top="-240px" left="-180px">
                    <Icon name="shark_shape" width="663px" height="100%" />
                </Box>
                <Box pos="absolute" right="-100px" bottom="-200px">
                    <Icon name="red_shape" width="624px" height="10%" />
                </Box>
                <Box pos="absolute" right="0px" bottom="0">
                    <Icon name="white_shape" width="100vw" height="180px" m="auto 0 0 0" />
                </Box>

                {/* ヒーローテキスト */}
                <Flex
                    zIndex={1}
                    align="center"
                    justify="center"
                    direction="column"
                    gap={6}
                    color="white"
                    textAlign="center"
                >
                    <Heading
                        as="h1"
                        fontSize={{ base: '32px', md: '64px' }}
                        fontWeight="700"
                        lineHeight={1.2}
                    >
                        Master the Code,
                        <br /> Design Your Path.
                    </Heading>

                    <Text maxW="500px" fontSize={{ base: '14px', md: '16px' }} lineHeight={1.8}>
                        KeNJi
                        CodeLabは、東京賢治シュタイナー学校の、プログラミング教育のための学内プラットフォームです。
                    </Text>

                    <HStack gap={8}>
                        <Link href="/books" style={{ textDecoration: 'none' }}>
                            <Button
                                px={8}
                                py={6}
                                color="brand.blue"
                                fontSize="md"
                                fontWeight="bold"
                                bg="white"
                                _hover={{
                                    boxShadow: 'lg',
                                }}
                            >
                                レッスンを始める
                            </Button>
                        </Link>

                        <Link href="/login" style={{ textDecoration: 'none' }}>
                            <Button
                                px={8}
                                py={6}
                                color="white"
                                fontSize="md"
                                fontWeight="bold"
                                bg="black"
                                _hover={{
                                    boxShadow: 'lg',
                                }}
                            >
                                ログイン
                            </Button>
                        </Link>
                    </HStack>
                </Flex>
            </Flex>
        </Box>
    );
}
