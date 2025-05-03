import React from "react";
import { ProbBtn } from "@/components/common/Btn";
import { Box, Icon } from "@/styles";
import Breadcrumb from "./Breadcrumb";

/** 記事ヘッダー部分 */
export default function ArticleHead({
    frontMatter,
    articleSlug,
    bookSlug,
    onClick,
    showProblemBtn,
    showProblem,
}) {
    return (
        <Box mb={32} bg='lilac' py={32} px={44} borderRadius={10} position='relative'>
            {showProblemBtn && <ProbBtn toggle={showProblem} onClick={onClick} />}
            <Box>
                <Breadcrumb bookName={bookSlug} chapter={articleSlug} />
                <Box
                    fontSize={24}
                    color='shark'
                    style={{ marginTop: "32px !important" }}
                    fontWeight='500'
                    borderBottom='1px solid #E5E5E5'
                    mt={24}
                    mb={16}>
                    {frontMatter.title}
                </Box>
                <Box display='flex' alignItems='center' gap={8}>
                    <Icon name='profile_karutt' width={46} height='100%' />
                    <Box fontSize={14} lineHeight='1'>
                        <Box mb={6}>
                            <Box as='span' color='abbey' mr={4}>
                                by
                            </Box>
                            <Box as='span' color='blue' fontWeight={700}>
                                karutt
                            </Box>
                        </Box>
                        <Box color='hitGray'>{frontMatter.lastModified}</Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
