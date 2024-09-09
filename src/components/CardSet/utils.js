// components/CardlemSet/utils.js

// 問題文と選択肢を解析する関数
export function parseCardlemContent(header) {
    let currentElement = header.nextElementSibling;
    const cardlemContent = [];
    let choices = [];

    // <h2>タグが来るまでの要素を収集
    while (currentElement && currentElement.tagName !== "H2") {
        if (currentElement.tagName === "UL") {
            // 最後の要素が選択肢リスト（<ul>）の場合、選択肢として処理
            const choiceList = Array.from(currentElement.querySelectorAll("li"));
            choices = choiceList.map((choice) => {
                const text = choice.textContent.trim();
                const isCorrect = text.startsWith("⚪︎"); // 正解の判定
                return { text: isCorrect ? text.slice(2).trim() : text, isCorrect };
            });
        } else {
            // それ以外の要素は問題文の詳細に追加
            cardlemContent.push(currentElement.outerHTML);
        }
        currentElement = currentElement.nextElementSibling;
    }

    return { cardlemContent: cardlemContent.join(" "), choices };
}

// 解説文を解析する関数
export function parseExplanationContent(explanationHeader) {
    const explanationContent = [];
    let explanationElement = explanationHeader.nextElementSibling;
    while (
        explanationElement &&
        explanationElement.tagName !== "H1" &&
        explanationElement.tagName !== "H2"
    ) {
        explanationContent.push(explanationElement.outerHTML);
        explanationElement = explanationElement.nextElementSibling;
    }
    return explanationContent.join("");
}

// 配列をシャッフルするユーティリティ関数
export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
