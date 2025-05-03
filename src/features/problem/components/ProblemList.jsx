import ProblemItem from "./ProblemItem";

export default function ProblemList({ headers, codes, loading, onChange, onSubmit }) {
    return (
        <>
            {headers.map((h, i) => (
                <ProblemItem
                    key={i}
                    index={i}
                    header={h}
                    code={codes[i]}
                    loading={loading[i]}
                    onChange={onChange}
                    onSubmit={onSubmit}
                />
            ))}
        </>
    );
}
