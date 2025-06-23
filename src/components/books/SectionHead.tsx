import { Box, Flex, Text } from '@chakra-ui/react';

interface SectionHeadProps {
    config: {
        title: string;
        estimatedTime: string;
        articleCount: number;
    };
}

export default function SectionHead({ config }: SectionHeadProps) {
    return (
        <Box pos="relative" w="100%" mt={16} py={16} color="white" bg="brand.lilac">
            <Flex
                pos="relative"
                zIndex={1}
                align="center"
                justify="center"
                direction="column"
                gap={2}
            >
                <Text fontSize={40} fontWeight="700">
                    {config.title}
                </Text>
                <Flex align="center" justify="center" gap={8} fontSize={16}>
                    <Text>想定学習時間 / {config.estimatedTime}</Text>
                    <Text>記事数 / {config.articleCount}</Text>
                </Flex>
            </Flex>
        </Box>
    );
}
