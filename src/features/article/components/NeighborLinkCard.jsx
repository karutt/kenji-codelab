import React from "react";
import Link from "next/link";
import { Box } from "@/styles";

/** 前後記事へのリンクカード */
export default function NeighborLinkCard({ link, title, next }) {
    return (
        <Box flex={1} maxWidth={["100%", 360]}>
            <Link href={link} passHref>
                <Box
                    display='flex'
                    alignItems='center'
                    justifyContent={next ? "space-between" : "flex-start"}
                    flexDirection={next ? "row-reverse" : "row"}
                    py={16}
                    px={24}
                    border='solid 1px #e9ecef'
                    borderRadius={8}
                    style={{ cursor: "pointer" }}
                    gap={12}
                    bg='white'>
                    <Box as='span'>{next ? "→" : "←"}</Box>
                    <Box fontSize={16}>
                        <Box color='hitGray' mb={-4}>
                            {next ? "Next" : "Prev"}
                        </Box>
                        <Box color='shark' fontWeight='bold'>
                            {title}
                        </Box>
                    </Box>
                </Box>
            </Link>
        </Box>
    );
}
