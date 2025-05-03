import React from "react";
import { Box, Icon } from "@/styles";

/** パンくず表示 */
export default function Breadcrumb({ bookName, chapter }) {
    return (
        <Box display='inline-block'>
            <Box
                borderRadius={100}
                bg='lightBlue'
                color='blue75'
                fontWeight={500}
                px={20}
                py={10}
                gap={12}
                display='flex'
                alignItems='center'
                justifyContent='center'>
                <Box fontSize={14}>{bookName}</Box>
                <Icon name='triangle' />
                <Box fontSize={14}>Chapter {chapter.split("-")[0]}</Box>
            </Box>
        </Box>
    );
}
