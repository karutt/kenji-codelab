// src/features/article/hooks/useCopyCodeButtons.js
"use client";

import { useLayoutEffect } from "react";

export function useCopyCodeButtons(containerRef) {
    useLayoutEffect(() => {
        const root = containerRef.current;
        if (!root) return;

        const containers = root.querySelectorAll(".code-block-container");
        containers.forEach((container) => {
            if (container.querySelector(".copy-button")) return;

            container.style.position = "relative";
            const btn = document.createElement("button");
            console.log("container", container);
            btn.className = "copy-button";
            btn.innerHTML = `
<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
 xmlns="http://www.w3.org/2000/svg">
  <path d="M16 1H4C2.89543 1 2 1.89543 2 3V17H4V3H16V1Z"/>
  <path d="M19 5H8C6.89543 5 6 5.89543 6 7V21C6 22.1046 
6.89543 23 8 23H19C20.1046 23 21 22.1046 
21 21V7C21 5.89543 20.1046 5 19 5ZM19 21H8V7H19V21Z"/>
</svg>`;
            Object.assign(btn.style, {
                position: "absolute",
                top: "8px",
                right: "8px",
                cursor: "pointer",
                zIndex: "999",
                background: "transparent",
                border: "none",
                padding: "4px",
                color: "#fff",
            });
            btn.addEventListener("click", () => {
                const codeEl = container.querySelector("pre code");
                if (!codeEl) return;
                let txt = codeEl.innerText;
                if (txt.endsWith("\n")) txt = txt.slice(0, -1);
                navigator.clipboard.writeText(txt);
            });
            container.appendChild(btn);
        });
    }, [containerRef]);
}
