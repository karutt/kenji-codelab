'use client';

import { Box, Flex } from '@chakra-ui/react';
import Link from 'next/link';

import { useBookConfig } from '@/contexts/BookConfigContext';

interface SideMenuBodyProps {
    bookName: string;
    articleSlug: string;
}

export default function SideMenuBody({ bookName, articleSlug }: SideMenuBodyProps) {
    const config = useBookConfig();
    const [_section, _subSection] = articleSlug.split('-').map(num => Number(num));

    return (
        <Box px={8} pt={8} color="brand.shark">
            {config.bookList.map((list, index) => {
                const isChapterActive = _section === index + 1 && _subSection === 0;
                return (
                    <Box key={index} mb={3}>
                        <Box mb={2} fontSize={14}>
                            Chapter {index + 1}
                        </Box>
                        <Link
                            href={`/books/${bookName}/${index + 1}-0`}
                            style={{ textDecoration: 'none' }}
                        >
                            <Box
                                fontSize={18}
                                fontWeight={isChapterActive ? '700' : '500'}
                                _hover={{ color: 'brand.blue' }}
                                cursor="pointer"
                            >
                                {list[0]}
                            </Box>
                        </Link>
                        <Flex direction="column" gap={0.5} ml={1} py={3} pl={3} fontSize={14}>
                            {list.slice(1).map((title, subIdx) => {
                                const isActive =
                                    _section === index + 1 && subIdx + 1 === _subSection;
                                return (
                                    <Box
                                        key={subIdx}
                                        pos="relative"
                                        py={1}
                                        pl={1}
                                        color={isActive ? 'brand.blue' : 'brand.shark'}
                                        fontWeight={isActive ? '700' : '400'}
                                    >
                                        <Link
                                            href={`/books/${bookName}/${index + 1}-${subIdx + 1}`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <Box _hover={{ color: 'brand.blue' }} cursor="pointer">
                                                {title}
                                            </Box>
                                        </Link>
                                    </Box>
                                );
                            })}
                        </Flex>
                    </Box>
                );
            })}
        </Box>
    );
}
