import { Box, Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';

import { Icon } from '@/components/common/Icon';
import { useBookConfig } from '@/contexts/BookConfigContext';

interface SideMenuHeadProps {
    bookName: string;
}

export default function SideMenuHead({ bookName }: SideMenuHeadProps) {
    const config = useBookConfig();
    const bookNameWithoutLang = bookName.endsWith('_en') ? bookName.slice(0, -3) : bookName;

    return (
        <Box
            px={8}
            py={8}
            pb={6}
            bg="white"
            borderBottom="1px solid rgba(0, 0, 0, 0.1)"
            borderRadius="lg"
        >
            <Link href={`/books/${bookName}`} style={{ textDecoration: 'none' }}>
                <Flex align="center" gap={3}>
                    <Icon name={`${bookNameWithoutLang}_icon`} width={48} height={48} />
                    <Box>
                        <Text color="brand.shark" fontSize={18} fontWeight="500">
                            {config.subTitle}
                        </Text>
                        <Text color="brand.hitGray" fontSize={12}>
                            {config.category}
                        </Text>
                    </Box>
                </Flex>
            </Link>
        </Box>
    );
}
