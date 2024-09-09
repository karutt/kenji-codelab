// components/CardlemSet/CardlemSet.jsx
"use client";

import React, { useState, useEffect } from "react";
import markdownHtml from "zenn-markdown-html";
import "zenn-content-css";
import Choices from "./Choices";
import ShuffleResetButtons from "./ShuffleResetButtons"; // シャッフルとリセットボタンのコンポーネントをインポート
import { parseCardlemContent, parseExplanationContent, shuffleArray } from "./utils"; // shuffleArrayもインポート

function CardlemSet({ cardMarkdown }) {
    // MarkdownをHTMLに変換
    const card_html = markdownHtml(cardMarkdown);

    // HTMLをDOMとして解析する
    const parser = new DOMParser();
    const doc = parser.parseFromString(card_html, "text/html");

    // 問題と解説を分割するための準備
    const [cardlemHeaders, setCardlemHeaders] = useState(
        Array.from(doc.querySelectorAll("h1")) // <h1>要素を取得（問題文）
    );
    const explanationHeaders = Array.from(doc.querySelectorAll("h2")); // <h2>要素を取得（解説文）

    // 状態管理：選択した選択肢と解説の表示状態を管理
    const [selectedChoices, setSelectedChoices] = useState(Array(cardlemHeaders.length).fill(null));
    const [showExplanations, setShowExplanations] = useState(
        Array(cardlemHeaders.length).fill(false)
    );
    const [isAllAnswered, setIsAllAnswered] = useState(false); // すべての問題が回答されたかのフラグ
    const [correctCount, setCorrectCount] = useState(0); // 正解数のカウント

    // 選択肢の選択ハンドラー
    const handleSelect = (index, choiceIndex) => {
        const updatedSelectedChoices = [...selectedChoices];
        updatedSelectedChoices[index] = choiceIndex; // 新しい選択を保存
        setSelectedChoices(updatedSelectedChoices);

        // 選択したら解説を表示する
        const updatedShowExplanations = [...showExplanations];
        updatedShowExplanations[index] = true;
        setShowExplanations(updatedShowExplanations);
    };

    // すべての問題に回答が選択されているかをチェック
    useEffect(() => {
        if (selectedChoices.every((choice) => choice !== null)) {
            setIsAllAnswered(true); // すべての問題に回答が選択された場合はtrue
            // 正解数を計算
            const correctAnswers = cardlemHeaders.reduce((count, header, index) => {
                const { choices } = parseCardlemContent(header);
                const selectedChoiceIndex = selectedChoices[index];
                return count + (choices[selectedChoiceIndex]?.isCorrect ? 1 : 0);
            }, 0);
            setCorrectCount(correctAnswers);
        } else {
            setIsAllAnswered(false);
        }
    }, [selectedChoices, cardlemHeaders]);

    // 問題の順序をシャッフルするハンドラー
    const handleShuffle = () => {
        setCardlemHeaders(shuffleArray(cardlemHeaders));
        // シャッフルしたら選択もリセット
        handleReset();
    };

    // 選択をリセットするハンドラー
    const handleReset = () => {
        setSelectedChoices(Array(cardlemHeaders.length).fill(null));
        setShowExplanations(Array(cardlemHeaders.length).fill(false));
        setIsAllAnswered(false);
    };

    // 各問題を解析し、表示するための要素を生成
    const formattedCardlems = cardlemHeaders.map((header, index) => {
        // 問題文と選択肢を解析
        const { cardlemContent, choices } = parseCardlemContent(header);

        // 解説部分の取得
        const explanationHTML = parseExplanationContent(explanationHeaders[index]);

        return (
            <div key={index} className='cardlem' style={{ marginBottom: "32px" }}>
                <h3>{header.textContent}</h3>
                {/* 問題文、詳細、コードブロックを表示 */}
                <div dangerouslySetInnerHTML={{ __html: cardlemContent }} />
                {/* 選択肢をコンポーネントとして表示 */}
                {choices.length > 0 && (
                    <Choices
                        choices={choices}
                        onSelect={(choiceIndex) => handleSelect(index, choiceIndex)}
                        selectedChoice={selectedChoices[index]} // 現在の選択状態を渡す
                    />
                )}
                {/* 解説を表示 */}
                {showExplanations[index] && (
                    <div
                        style={{
                            marginTop: "16px",
                            backgroundColor: "#f8f9fa",
                            padding: "12px",
                            borderRadius: "4px",
                        }}
                        dangerouslySetInnerHTML={{ __html: explanationHTML }}
                    />
                )}
            </div>
        );
    });

    return (
        <div>
            {formattedCardlems}
            {/* すべての選択肢が選択された場合に結果を表示 */}
            {isAllAnswered && (
                <div
                    style={{
                        marginTop: "32px",
                        padding: "16px",
                        backgroundColor: "#e0e0e0",
                        borderRadius: "8px",
                        position: "relative",
                    }}>
                    <h3>結果</h3>
                    <p>
                        {cardlemHeaders.length}個中{correctCount}個正解しました。
                    </p>
                    {/* シャッフルとリセットボタンを結果表示の中に配置 */}
                    <ShuffleResetButtons onShuffle={handleShuffle} onReset={handleReset} />
                </div>
            )}
        </div>
    );
}

export default CardlemSet;
