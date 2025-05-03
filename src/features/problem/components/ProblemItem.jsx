import { parseProblemContent } from "../utils/parseProblemContent";
import CodeEditorPanel from "./CodeEditorPanel";
import SubmitButton from "./SubmitButton";

export default function ProblemItem({ index, header, code, loading, onChange, onSubmit }) {
    const { problemContent, defaultCode } = parseProblemContent(header);

    const initialValue = code || defaultCode;

    return (
        <section style={{ marginBottom: 32 }}>
            <h3>{header.textContent}</h3>
            <div dangerouslySetInnerHTML={{ __html: problemContent }} />
            <CodeEditorPanel value={initialValue} onChange={(v) => onChange(index, v)} />
            <SubmitButton loading={loading} onClick={() => onSubmit(index)} />
        </section>
    );
}
