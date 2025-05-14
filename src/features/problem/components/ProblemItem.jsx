import { Button, Spinner } from "@chakra-ui/react";
import { parseProblemContent } from "../utils/parseProblemContent";
import CodeEditorPanel from "./CodeEditorPanel";

export default function ProblemItem({ index, header, code, loading, onChange, onSubmit }) {
    const { problemContent, defaultCode } = parseProblemContent(header);

    const initialValue = code || defaultCode;

    return (
        <section style={{ marginBottom: 32 }}>
            <h3>{header.textContent}</h3>
            <div dangerouslySetInnerHTML={{ __html: problemContent }} />
            <CodeEditorPanel value={initialValue} onChange={(v) => onChange(index, v)} />

            <Button
                onClick={() => onSubmit(index)}
                disabled={loading}
                bg='brand.blue'
                py={5}
                w='100%'
                fontSize='md'
                colorScheme='blue'>
                コードを提出 {loading ? <Spinner size='sm' /> : ""}
            </Button>
        </section>
    );
}
