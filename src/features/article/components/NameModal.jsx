"use client";

import { InputField } from "@/components/common/Input";
import Modal from "@/components/common/Modal";
import { Box } from "@/styles";

export default function NameModal({ isOpen, name, onChange, onSave, onCancel }) {
    return (
        <Modal isOpen={isOpen}>
            <Box fontSize={24} fontWeight='bold' mb={8}>
                あなたの名前を入力
            </Box>
            <Box color='abbey' fontSize={14} mb={24}>
                「決定」を押すと名前が保存され、問題が開始されます。
            </Box>
            <InputField
                type='text'
                value={name}
                onChange={(e) => onChange(e.target.value)}
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
                onClick={onCancel}
                width='100%'
                bg='white'
                color='abbey'
                border='1.5px solid #dee2e6'
                borderRadius={4}
                py={10}
                style={{ cursor: "pointer" }}>
                キャンセル
            </Box>
        </Modal>
    );
}
