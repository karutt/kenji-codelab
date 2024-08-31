import styled from "styled-components";
import { space, layout, typography } from "styled-system";

const Btn = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 40px;
    font-size: 18px;
    font-weight: 700;
    line-height: 100%;
    border-radius: 6px;
    border: none;
    outline: none;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
    text-decoration: none !important;
    &:hover {
        opacity: 0.85;
    }

    &:active {
        opacity: 1;
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

    ${space} // 追加: スペースを調整できるようにする
    ${layout} // 追加: レイアウトの調整を可能にする
    ${typography} // 追加: タイポグラフィを調整できるようにする
`;

export const WhiteBtn = styled(Btn)`
    background-color: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.blue};

    &:hover {
        background-color: ${(props) => props.theme.colors.lightGray}; // Optional: hover状態の色変更
    }
`;

export const BlackBtn = styled(Btn)`
    background-color: ${(props) => props.theme.colors.portgore};
    color: ${(props) => props.theme.colors.white};

    &:hover {
        background-color: ${(props) => props.theme.colors.darkGray}; // Optional: hover状態の色変更
    }
`;
