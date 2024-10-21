"use client";

import React, { useState, useEffect, useCallback } from "react";
import markdownHtml from "zenn-markdown-html";
import "zenn-content-css";
import Choices from "./Choices";
import ShuffleResetButtons from "./ShuffleResetButtons";
import { parseCardContent, parseExplanationContent, shuffleArray } from "./utils"; // shuffleArrayもインポート

function CardSet({ cardMarkdown }) {
    // MarkdownをHTMLに変換
    const card_html = markdownHtml(cardMarkdown);

    // HTMLをDOMとして解析する
    const parser = new DOMParser();
    const doc = parser.parseFromString(card_html, "text/html");

    // 問題と解説をペアで取得
    const cardHeaders = Array.from(doc.querySelectorAll("h1")); // <h1>要素を取得（問題文）
    const explanationHeaders = Array.from(doc.querySelectorAll("h2")); // <h2>要素を取得（解説文）

    // 問題と解説をペアにする
    const [cardPairs, setCardPairs] = useState(
        cardHeaders.map((header, index) => ({
            question: header,
            explanation: explanationHeaders[index],
        }))
    );

    // シャッフルされた選択肢を保持する状態
    const [shuffledChoices, setShuffledChoices] = useState([]);

    // 状態管理：選択した選択肢と解説の表示状態を管理
    const [selectedChoices, setSelectedChoices] = useState(Array(cardPairs.length).fill(null));
    const [showExplanations, setShowExplanations] = useState(Array(cardPairs.length).fill(false));
    const [isAllAnswered, setIsAllAnswered] = useState(false); // すべての問題が回答されたかのフラグ
    const [correctCount, setCorrectCount] = useState(0); // 正解数のカウント

    // 選択肢のシャッフルを初期化する関数を useCallback でメモ化
    const initializeShuffledChoices = useCallback(() => {
        const initialShuffledChoices = cardPairs.map(({ question }) => {
            const { choices } = parseCardContent(question);
            // シャッフル前のインデックスを持つ選択肢の配列を作成
            const choicesWithIndex = choices.map((choice, index) => ({
                choice,
                originalIndex: index, // 元のインデックスを保持
            }));
            return shuffleArray(choicesWithIndex); // 選択肢をシャッフル
        });
        setShuffledChoices(initialShuffledChoices);
    }, [cardPairs]); // 関数が参照する依存関係を指定

    // キーボードイベントのハンドラも useCallback でメモ化
    const handleReset = useCallback(() => {
        setSelectedChoices(Array(cardPairs.length).fill(null));
        setShowExplanations(Array(cardPairs.length).fill(false));
        setIsAllAnswered(false);
        initializeShuffledChoices(); // 選択肢も再シャッフル
    }, [cardPairs, initializeShuffledChoices]);

    // 選択肢のシャッフルを初期化するための useEffect
    useEffect(() => {
        initializeShuffledChoices();
    }, [initializeShuffledChoices]);
    // キーボードイベントを設定する useEffect
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key.toLowerCase() === "r") {
                handleReset(); // 'R'キーでリセット
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        // クリーンアップ: イベントリスナーを解除
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleReset]);

    // 選択をリセットするハンドラー

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
            const correctAnswers = cardPairs.reduce((count, { question }, index) => {
                const { choices } = parseCardContent(question);
                const selectedChoiceIndex = selectedChoices[index];
                const selectedChoice = shuffledChoices[index][selectedChoiceIndex];

                // 元のインデックスを使って正解をチェック
                return count + (choices[selectedChoice.originalIndex]?.isCorrect ? 1 : 0);
            }, 0);
            setCorrectCount(correctAnswers);
        } else {
            setIsAllAnswered(false);
        }
    }, [selectedChoices, cardPairs, shuffledChoices]);

    // 問題の順序をシャッフルするハンドラー
    const handleShuffle = () => {
        setCardPairs(shuffleArray(cardPairs));
        // シャッフルしたら選択もリセット
        handleReset();
    };

    // 各問題を解析し、表示するための要素を生成
    const formattedCards = cardPairs.map(({ question, explanation }, index) => {
        // 問題文と選択肢を解析
        const { cardContent } = parseCardContent(question);

        // シャッフルされた選択肢を取得
        const choices = shuffledChoices[index] || [];

        // 解説部分の取得
        const explanationHTML = parseExplanationContent(explanation);

        return (
            <div key={index} className='card' style={{ marginBottom: "64px" }}>
                <h3 style={{ fontSize: "20px" }}>
                    {index + 1}. {question.textContent}
                </h3>
                {/* 問題文、詳細、コードブロックを表示 */}
                <div dangerouslySetInnerHTML={{ __html: cardContent }} />
                {/* 選択肢をコンポーネントとして表示 */}
                <div style={{ marginTop: "32px" }}>
                    {choices.length > 0 && (
                        <Choices
                            choices={choices.map((c) => c.choice)} // シャッフルされた選択肢を使用
                            onSelect={(choiceIndex) => handleSelect(index, choiceIndex)}
                            selectedChoice={selectedChoices[index]} // 現在の選択状態を渡す
                        />
                    )}
                </div>
                {/* 解説を表示 */}
                {showExplanations[index] && (
                    <div
                        style={{
                            marginTop: "16px",
                            backgroundColor: "#F8F9FA",
                            padding: "24px",
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
            {formattedCards}
            {/* すべての選択肢が選択された場合に結果を表示 */}
            {isAllAnswered && (
                <div
                    style={{
                        marginTop: "0px",
                        padding: "16px",
                        backgroundColor: "#F8F9FA",
                        borderRadius: "8px",
                        position: "relative",
                    }}>
                    <p>結果</p>
                    <p>
                        {cardPairs.length}個中{correctCount}個正解しました。
                    </p>
                    {/* シャッフルとリセットボタンを結果表示の中に配置 */}
                    <ShuffleResetButtons onShuffle={handleShuffle} onReset={handleReset} />
                </div>
            )}
        </div>
    );
}

export default CardSet;
