// src/components/SideMenu/SideMenuBody.js
"use client";

import { useBookConfig } from "@/contexts/BookConfigContext";
import { Box } from "@/styles";
import Link from "next/link";

export default function SideMenuBody({ bookName, articleSlug }) {
    const config = useBookConfig();
    const [_section, _subSection] = articleSlug.split("-").map((num) => Number(num));

    return (
        <Box pt={32} color='abbey' px={32}>
            {config.bookList.map((list, index) => {
                const isChapterActive = _section === index + 1 && _subSection === 0;
                return (
                    <Box mb={12} key={index}>
                        <Box fontSize={14} mb={2}>
                            Chapter {index + 1}
                        </Box>
                        <Link href={`/books/${bookName}/${index + 1}-0`}>
                            <Box fontSize={18} fontWeight={isChapterActive ? "700" : "500"}>
                                {list[0]}
                            </Box>
                        </Link>
                        <Box
                            display='flex'
                            flexDirection='column'
                            gap={4}
                            ml={4}
                            fontSize={14}
                            pl={12}
                            py={12}>
                            {list.slice(1).map((title, subIdx) => {
                                const isActive =
                                    _section === index + 1 && subIdx + 1 === _subSection;
                                return (
                                    <Box
                                        key={subIdx}
                                        position='relative'
                                        fontWeight={isActive ? "700" : "400"}
                                        py={4}
                                        pl={4}>
                                        <Link
                                            href={`/books/${bookName}/${index + 1}-${subIdx + 1}`}>
                                            {title}
                                        </Link>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
}
