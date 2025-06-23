/**
 * Parse problem content from markdown text
 * Extracts template code and cleans problem content
 */
export function parseProblemContent(markdownContent: string): {
    content: string;
    templateCode: string;
} {
    // テンプレートコード抽出
    const templateRegex = /```python:template\n([\s\S]*?)\n```/;
    const match = markdownContent.match(templateRegex);
    const templateCode = match ? match[1].trim() : '';

    // python:templateブロックだけ全て除去（H1は除去しない）
    let cleanContent = markdownContent.replace(/```python:template\n[\s\S]*?\n```/g, '').trim();

    // 余分な空行を整理
    cleanContent = cleanContent.replace(/\n{3,}/g, '\n\n');

    return {
        content: cleanContent,
        templateCode,
    };
}
