import { Box, Circle, Flex, VStack } from '@chakra-ui/react';
import Link from 'next/link';

interface CardBodyProps {
    list: string[];
    bookName: string;
    section: number;
}

export default function CardBody({ list, bookName, section }: CardBodyProps) {
    return (
        <Box ml={6} pt={5}>
            <VStack pos="relative" align="stretch" gap={4}>
                {/* Vertical line */}
                <Box pos="absolute" zIndex={0} top="0" bottom="0" left="10px" w="1px" bg="border" />

                {list.map((title, subSection) => (
                    <Flex key={subSection} pos="relative" align="flex-start" gap={4}>
                        {/* Indicator circle */}
                        <Circle
                            zIndex={1}
                            color="fg"
                            fontSize="sm"
                            fontWeight="500"
                            bg="bg"
                            border="1px solid"
                            borderColor="border"
                            size="20px"
                        ></Circle>

                        {/* Content */}
                        <Box flex={1} mt="-3px">
                            <Link
                                href={`/books/${bookName}/${String(section + 1)}-${String(subSection + 1)}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <Box
                                    color="brand.shark"
                                    fontSize="16px"
                                    fontWeight="400"
                                    _hover={{ color: 'brand.blue' }}
                                    cursor="pointer"
                                >
                                    {title}
                                </Box>
                            </Link>
                        </Box>
                    </Flex>
                ))}
            </VStack>
        </Box>
    );
}
