import markdownHtml from "zenn-markdown-html";

/** Markdown → HTML 変換ユーティリティ */
export function parseMarkdownToHtml(markdown) {
    return markdownHtml(markdown);
}
