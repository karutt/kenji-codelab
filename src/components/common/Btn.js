import { Box, Icon } from "@/styles";
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

export const BlueBtn = styled(Btn)`
    background-color: ${(props) => props.theme.colors.blue};
    color: ${(props) => props.theme.colors.white};
    padding: 16px 32px;
    font-size: 14px;
    font-weight: 600;
    &:hover {
        background-color: ${(props) => props.theme.colors.darkGray}; // Optional: hover状態の色変更
    }
`;

export function ToggleBtn({ toggle, onClick }) {
    return (
        <Box
            as='span'
            onClick={onClick}
            position='fixed'
            bottom='40px'
            right='4%'
            opacity={0.9}
            cursor='pointer'
            zIndex={4} // ボタンが常に前面に表示されるように
            borderRadius='100%'>
            <Icon
                name={toggle ? "toggle_on" : "toggle_off"}
                width={60}
                height='100%'
                style={{
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                    borderRadius: "100%",
                    cursor: "pointer",
                }}
            />
        </Box>
    );
}

export function ProbBtn({ toggle, onClick }) {
    return (
        <Box
            as='button'
            onClick={onClick}
            position='absolute'
            top='32px'
            right='20px'
            padding='8px 20px'
            bg='lightBlue'
            color='blue'
            fontWeight={500}
            border='1px solid #E1E1E1'
            borderRadius='100px'
            letterSpacing='0.05em'
            fontSize='14px'
            zIndex={1000}
            style={{ cursor: "pointer", opacity: 0.9 }}>
            {toggle ? "記事に戻る" : "問題を解く"}
        </Box>
    );
}

export function ProbBtn2({ toggle, onClick }) {
    return (
        <Box
            as='button'
            onClick={onClick}
            padding='8px 20px'
            bg='lightBlue'
            color='blue'
            fontWeight={500}
            border='1px solid #E1E1E1'
            borderRadius='100px'
            letterSpacing='0.05em'
            fontSize='14px'
            zIndex={1000}
            style={{ cursor: "pointer", opacity: 0.9 }}>
            {toggle ? "記事に戻る" : "問題を解く"}
        </Box>
    );
}

export const WBtn = styled(Box)`
    display: inline-block;
    padding: 8px 20px;
    background-color: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.shark};
    font-weight: 400;
    border: 1px solid #e1e1e1;
    border-radius: 4px;
    letter-spacing: 0.05em;
    font-size: 14px;
    cursor: pointer;
    transition: 0.3s;
    text-decoration: none !important;
    &:hover {
        opacity: 0.85;
        transition: 0.3s;
    }
    &:active {
        opacity: 1;
        transition: 0.3s;
    }
    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
`;
