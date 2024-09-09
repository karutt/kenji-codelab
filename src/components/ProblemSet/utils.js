// components/ProblemSet/utils.js

// 問題文の詳細とコードブロックを解析する関数
export function parseProblemContent(header) {
    let currentElement = header.nextElementSibling;
    const problemContent = [];
    let codeSnippet = "";

    // <h1>タグの次の要素から次の<h1>タグまでの内容を収集
    while (currentElement && currentElement.tagName !== "H1") {
        if (currentElement.tagName === "PRE") {
            // コードブロックの場合
            codeSnippet = currentElement.outerHTML;
        } else {
            // 問題文の詳細として追加
            problemContent.push(currentElement.outerHTML);
        }
        currentElement = currentElement.nextElementSibling;
    }

    return { problemContent: problemContent.join(" "), codeSnippet };
}
