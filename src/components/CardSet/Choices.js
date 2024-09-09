// components/ProblemSet/Choices.jsx
"use client";

import { Box } from "@/styles";

function Choices({ choices, onSelect, selectedChoice }) {
    return (
        <Box>
            {choices.map((choice, i) => (
                <Box
                    key={i}
                    style={{
                        display: "block",
                        margin: "4px 0",
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        cursor: "pointer",
                        backgroundColor:
                            selectedChoice === i
                                ? choice.isCorrect
                                    ? "#d4edda"
                                    : "#f8d7da"
                                : "white",
                        color:
                            selectedChoice === i
                                ? choice.isCorrect
                                    ? "#155724"
                                    : "#721c24"
                                : "black",
                    }}
                    onClick={() => onSelect(i)}>
                    {choice.text}
                    {/* 正解かつ選択された場合にアイコンを表示 */}
                    {selectedChoice === i && choice.isCorrect && (
                        <span style={{ marginLeft: "8px" }}>✔️</span>
                    )}
                    {/* 不正解かつ選択された場合にアイコンを表示 */}
                    {selectedChoice === i && !choice.isCorrect && (
                        <span style={{ marginLeft: "8px" }}>❌</span>
                    )}
                </Box>
            ))}
        </Box>
    );
}

export default Choices;
