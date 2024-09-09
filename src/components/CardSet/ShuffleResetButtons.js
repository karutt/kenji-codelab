// components/CardlemSet/ShuffleResetButtons.jsx
"use client";

import React from "react";

function ShuffleResetButtons({ onShuffle, onReset }) {
    // ページトップにスクロールする関数
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // シャッフルボタンをクリックしたときのハンドラー
    const handleShuffleClick = () => {
        onShuffle();
        scrollToTop();
    };

    // リセットボタンをクリックしたときのハンドラー
    const handleResetClick = () => {
        onReset();
        scrollToTop();
    };

    return (
        <div
            style={{
                marginTop: "16px",
                display: "flex",
                gap: "10px",
            }}>
            <button
                onClick={handleShuffleClick}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}>
                問題のシャッフル
            </button>
            <button
                onClick={handleResetClick}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}>
                選択のリセット
            </button>
        </div>
    );
}

export default ShuffleResetButtons;
