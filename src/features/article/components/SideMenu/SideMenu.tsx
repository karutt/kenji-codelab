'use client';

import { Box } from '@chakra-ui/react';

import { Card } from '@/components/common/Card';
import { useHeader } from '@/contexts/HeaderContext';

import SideMenuBody from './SideMenuBody';
import { useSideMenu } from './SideMenuContext';
interface SideMenuProps {
    bookName: string;
    articleSlug: string;
}

export default function SideMenu({ bookName, articleSlug }: SideMenuProps) {
    const { showSideMenu } = useSideMenu();
    const { showHeader } = useHeader();

    return (
        <Box
            pos="sticky"
            zIndex={2}
            top={16}
            left={0}
            flexShrink={0}
            alignSelf="flex-start"
            display={['none', 'none', 'none', showSideMenu ? 'block' : 'none']}
            overflowY="auto"
            w={[350, 350, 350, 420]}
            h={showHeader ? 'calc(100dvh - 64px)' : '100dvh'}
            px={[1, 1, 1, 4]}
            py={8}
            bg="transparent"
            transform={showHeader ? 'translateY(0px)' : 'translateY(-64px)'}
            transition="0.3s cubic-bezier(.4,0,.2,1)"
        >
            <Card pb={30} h="100%" overflow="scroll">
                <SideMenuBody bookName={bookName} articleSlug={articleSlug} />
                {/* 一覧に戻るボタン */}
                {/* <Box pos="absolute" bottom={16} left={0} w="100%" px={12}>
                    <Link href={`/books/${bookName}`}>
                        <Button
                            w="100%"
                            color="brand.abbey"
                            bg="gray.100"
                            // borderBottomColor="brand.abbey"
                            _hover={{
                                bg: 'gray.200',
                            }}
                            size="sm"
                            variant="plain"
                        >
                            <Flex align="center" gap={1}>
                                <FaListUl size={16} />
                                一覧に戻る
                            </Flex>
                        </Button>
                    </Link>
                </Box> */}
            </Card>
        </Box>
    );
}
