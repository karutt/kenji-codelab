"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme";

export default function StyledComponentsRegistry({ children }) {
    const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

    useServerInsertedHTML(() => {
        const styles = styledComponentsStyleSheet.getStyleElement();
        styledComponentsStyleSheet.instance.clearTag();
        return <>{styles}</>;
    });

    if (typeof window !== "undefined") {
        return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
    }

    return (
        <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </StyleSheetManager>
    );
}
