import { ProblemData } from '../types';
import ProblemItem from './ProblemItem';

interface ProblemListProps {
    problemData: ProblemData[];
    codes: string[];
    loading: boolean[];
    onChange: (index: number, value: string) => void;
    onSubmit: (index: number) => void;
}

export default function ProblemList({
    problemData,
    codes,
    loading,
    onChange,
    onSubmit,
}: ProblemListProps) {
    // Defensive check to prevent map errors
    if (!problemData || !Array.isArray(problemData) || problemData.length === 0) {
        return <div>問題を読み込み中...</div>;
    }

    if (!codes || !Array.isArray(codes)) {
        return <div>コードエディタを準備中...</div>;
    }

    if (!loading || !Array.isArray(loading)) {
        return <div>読み込み状態を準備中...</div>;
    }

    return (
        <>
            {problemData.map((problem, i) => (
                <ProblemItem
                    key={i}
                    index={i}
                    problem={problem}
                    code={codes[i] || ''}
                    loading={loading[i] || false}
                    onChange={onChange}
                    onSubmit={onSubmit}
                />
            ))}
        </>
    );
}
