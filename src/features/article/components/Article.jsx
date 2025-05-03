import React, { Suspense } from "react";
import ArticleContent from "./ArticleContent";

/** SSR→Client の Suspense ラッパー */
export default function Article(props) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ArticleContent {...props} />
        </Suspense>
    );
}
