// src/components/SideMenu/SideMenuHead.js
"use client";

import { useBookConfig } from "@/contexts/BookConfigContext";
import { Box, Icon } from "@/styles";
import Link from "next/link";

export default function SideMenuHead({ bookName }) {
    const config = useBookConfig();
    const bookNameWithoutLang = bookName.endsWith("_en") ? bookName.slice(0, -3) : bookName;

    return (
        <Box
            borderBottom='1px solid rgba(0, 0, 0, 0.1)'
            pb={24}
            py={32}
            bg='white'
            px={32}
            borderRadius={10}>
            <Link href={`/books/${bookName}`}>
                <Box display='flex' alignItems='center' gap={12}>
                    <Icon name={`${bookNameWithoutLang}_icon`} width={48} height='100%' />
                    <Box>
                        <Box fontSize={18} fontWeight='500' color='shark'>
                            {config.subTitle}
                        </Box>
                        <Box fontSize={12} color='hitGray'>
                            {config.category}
                        </Box>
                    </Box>
                </Box>
            </Link>
        </Box>
    );
}
