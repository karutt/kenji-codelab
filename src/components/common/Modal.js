import { Box } from "@/styles";
import React from "react";
import ReactDOM from "react-dom";
import styled, { keyframes, css } from "styled-components";

// アニメーションの定義
const slideInFromBottom = keyframes`
    from {
        transform: translateY(40%); // 下からのアニメーション
        opacity: 0; // 初めは透明
    }
    to {
        transform: translateY(0); // 元の位置
        opacity: 1; // 完全に表示
    }
`;

const slideInFromLeft = keyframes`
    from {
        transform: translateX(-100%); // 左からのアニメーション
        opacity: 0; // 初めは透明
    }
    to {
        transform: translateX(0); // 元の位置
        opacity: 1; // 完全に表示
    }
`;

const slideInFromRight = keyframes`
    from {
        transform: translateX(100%); // 右からのアニメーション
        opacity: 0; // 初めは透明
    }
    to {
        transform: translateX(0); // 元の位置
        opacity: 1; // 完全に表示
    }
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: ${({ hasBackground }) =>
        hasBackground ? "rgba(0, 0, 0, 0.5)" : "transparent"};
    display: flex;
    justify-content: ${({ position }) => {
        if (position === "center") return "center";
        if (position === "left") return "flex-start";
        if (position === "right") return "flex-end";
        return "center"; // デフォルトは中央表示
    }};
    align-items: center;
    z-index: 1000;
    pointer-events: auto; // 常にクリック可能にする
`;

const ModalContent = styled(Box)`
    padding: 64px;
    border-radius: 10px;
    text-align: center;
    background-color: white;
    animation: ${({ position }) => {
        if (position === "center")
            return css`
                ${slideInFromBottom} 0.3s ease
            `;
        if (position === "left")
            return css`
                ${slideInFromLeft} 0.3s ease
            `;
        if (position === "right")
            return css`
                ${slideInFromRight} 0.3s ease
            `;
        return css`
            ${slideInFromBottom} 0.3s ease
        `; // デフォルトのアニメーション
    }};
`;

const Modal = ({ children, isOpen, position = "center", hasBackground = true }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <ModalOverlay
            position={position}
            hasBackground={hasBackground}
            onClick={hasBackground ? undefined : (e) => e.stopPropagation()} // 背景がない場合にクリックをキャンセル
        >
            <ModalContent
                position={position}
                onClick={(e) => e.stopPropagation()} // モーダルの内容をクリックしたときのイベントをキャンセル
            >
                {children}
            </ModalContent>
        </ModalOverlay>,
        document.body
    );
};

export default Modal;
