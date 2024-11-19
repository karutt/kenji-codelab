// components/ProblemSet/utils.js

export function parseProblemContent(header) {
    let currentElement = header.nextElementSibling;
    const problemContent = [];
    let defaultCode = "";

    while (currentElement && currentElement.tagName !== "H1") {
        if (currentElement.tagName === "H2") {
            currentElement = currentElement.nextElementSibling;
            if (currentElement && currentElement.classList.contains("code-block-container")) {
                defaultCode = currentElement.textContent.trim();
            }
        } else {
            problemContent.push(currentElement.outerHTML);
        }
        currentElement = currentElement.nextElementSibling;
    }

    return {
        problemContent: problemContent.join(" "),
        defaultCode,
    };
}
