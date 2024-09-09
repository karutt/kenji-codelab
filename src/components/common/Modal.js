import { Box } from "@/styles";
import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

// スタイルを定義
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* 高いz-indexを設定 */
`;

const ModalContent = styled.div`
    background-color: white;
    padding: 64px 64px;
    border-radius: 10px;
    text-align: center;
`;

const InputField = styled.input`
    margin: 10px 0;
    padding: 14px 10px;
    font-size: 16px;
    width: 440px;
    outline: none;
    border: 1px solid #dee2e6;
    transition: 0.2s;
    border-radius: 4px;
    display: block;

    &:focus {
        transition: 0.2s;
        box-shadow: 0 0 8px 3px rgba(0, 123, 255, 0.07);
    }
`;

// モーダルコンポーネント
const Modal = ({ isOpen, onClose, name, onNameChange, onSave }) => {
    if (!isOpen) return null; // モーダルが閉じている場合は何もレンダリングしない

    // Portalを使用してbody直下にモーダルを描画
    return ReactDOM.createPortal(
        <ModalOverlay>
            <ModalContent>
                <Box fontSize={24} fontWeight='bold' mb={8}>
                    あなたの名前を入力
                </Box>
                <Box color='abbey' fontSize={14} mb={24}>
                    「決定」を押すと名前が保存され、問題が開始されます。
                </Box>
                <InputField
                    type='text'
                    value={name}
                    onChange={onNameChange}
                    placeholder='名前を入力'
                />
                <Box
                    onClick={onSave}
                    mt={24}
                    mb={8}
                    width='100%'
                    bg='blue'
                    color='white'
                    borderRadius={4}
                    py={10}
                    style={{ cursor: "pointer" }}>
                    決定
                </Box>
                <Box
                    onClick={onClose}
                    width='100%'
                    bg='white'
                    color='abbey'
                    border='1.5px solid #dee2e6'
                    borderRadius={4}
                    py={10}
                    style={{ cursor: "pointer" }}>
                    キャンセル
                </Box>
            </ModalContent>
        </ModalOverlay>,
        document.body // モーダルをbodyタグ直下にレンダリング
    );
};

export default Modal;
