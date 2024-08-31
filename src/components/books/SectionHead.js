"use client";
import { Box, Icon } from "@/styles";

export default function SectionHead({ config }) {
    return (
        <Box position='relative' width='100%' color='white' py={64} bg='lilac' mt={64}>
            <Box
                position='relative'
                display='flex'
                alignItems='center'
                justifyContent='center'
                flexDirection='column'
                gap={6}
                zIndex={1}>
                <Box fontSize={40} fontWeight='700'>
                    {config.title}
                </Box>
                <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    gap={32}
                    fontSize={16}>
                    <Box>想定学習時間 / {config.estimatedTime}</Box>
                    <Box>記事数 / {config.articleCount}</Box>
                </Box>
            </Box>
            <Box position='absolute' top={-90} width='100%'>
                <Icon name='book_list_bg' width='100%' height='100%' />
            </Box>
        </Box>
    );
}
