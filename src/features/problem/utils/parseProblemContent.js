export function parseProblemContent(header) {
    let current = header.nextElementSibling;
    const contents = [];
    let defaultCode = "";

    while (current && current.tagName !== "H1") {
        if (current.tagName === "H2") {
            const next = current.nextElementSibling;
            if (next && next.classList.contains("code-block-container")) {
                defaultCode = next.textContent.trim();
            }
            current = next;
        } else {
            contents.push(current.outerHTML);
        }
        current = current.nextElementSibling;
    }

    console.log(defaultCode);

    return {
        problemContent: contents.join(" "),
        defaultCode,
    };
}
