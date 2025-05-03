import { BlueBtn } from "@/components/common/Btn";

export default function SubmitButton({ loading, onClick }) {
    return (
        <BlueBtn onClick={onClick} disabled={loading}>
            {loading ? "提出中..." : "コードを提出"}
        </BlueBtn>
    );
}
