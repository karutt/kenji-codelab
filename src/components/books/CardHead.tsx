import { Box, Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';

import { Icon } from '@/components/common/Icon';

interface CardHeadProps {
    index: number;
    bookName: string;
    title: string;
}

export default function CardHead({ index, bookName, title }: CardHeadProps) {
    const bookNameWithoutLang = bookName.endsWith('_en') ? bookName.slice(0, -3) : bookName;

    return (
        <Link href={`/books/${bookName}/${index + 1}-0`} style={{ textDecoration: 'none' }}>
            <Flex align="center" justify="flex-start" gap={6} cursor="pointer">
                <Icon
                    name={`${bookNameWithoutLang}_icon${index + 1}`}
                    width={46}
                    height={46}
                    alt={`Chapter ${index + 1} icon`}
                />
                <Box>
                    <Text color="brand.abbey" fontSize={14}>
                        Chapter{index + 1}
                    </Text>
                    <Text color="brand.shark" fontSize={18} fontWeight={700}>
                        {title}
                    </Text>
                </Box>
            </Flex>
        </Link>
    );
}
