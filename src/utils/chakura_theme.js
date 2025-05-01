// theme.ts
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
    theme: {
        tokens: {
            colors: {
                brand: {
                    white: { value: "#ffffff" },
                    black: { value: "#000000" },
                    black12: { value: "rgba(0, 0, 0, 0.125)" },
                    white5: { value: "rgba(255, 255, 255, 0.8)" },
                    gray: { value: "#c0c0c0" },
                    portgore: { value: "#1B1F3B" },
                    abbey: { value: "#495057" },
                    blue: { value: "#3755BE" },
                    shark: { value: "#212529" },
                    lilac: { value: "#F3F5FB" },
                    hitGray: { value: "#ADB5BD" },
                    e7: { value: "#E7E9EE" },
                    blue75: { value: "rgba(55, 85, 190, 0.75)" },
                    geyser: { value: "#DEE2E6" },
                    lightBlue: { value: "#E0E5F4" },
                    zennBlue: { value: "#EDF2F6" },
                    green: { value: "#28a745" },
                    e2: { value: "#E2E8F0" },
                },
            },
            fonts: {
                body: "",
                heading: "",
                fontWeights: { value: "500" },
            },
        },
    },
});

export const system = createSystem(defaultConfig, config);
