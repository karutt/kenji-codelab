import { Box, Skeleton } from "@chakra-ui/react";
import { Suspense } from "react";
import ArticleContent from "./ArticleContent";

/** SSR→Client の Suspense ラッパー */
export default function Article(props) {
    return (
        <Suspense
            fallback={
                <Box
                    flex='1'
                    my={8}
                    bg='white'
                    border='solid 1px'
                    borderColor='brand.black12'
                    borderRadius='10px'
                    p={4}
                    h='100vh'
                    boxShadow='0 2px 10px rgba(0, 0, 0, 0.05)'
                    maxW='860px'
                    w='100%'>
                    <Skeleton height='100%' />
                </Box>
            }>
            <ArticleContent {...props} />
        </Suspense>
    );
}
