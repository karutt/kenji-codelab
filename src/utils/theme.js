import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

// 既存のテーマカラーをChakra UI形式に変換
const customConfig = defineConfig({
    theme: {
        tokens: {
            colors: {
                brand: {
                    white: { value: '#ffffff' },
                    black: { value: '#000000' },
                    black12: { value: 'rgba(0, 0, 0, 0.125)' },
                    white5: { value: 'rgba(255, 255, 255, 0.8)' },
                    gray: { value: '#c0c0c0' },
                    portgore: { value: '#1B1F3B' },
                    abbey: { value: '#495057' },
                    blue: { value: '#3755BE' },
                    blueHover: { value: '#4F68C0FF' },
                    shark: { value: '#212529' },
                    lilac: { value: '#F3F5FB' },
                    lilac2: { value: '#f6f9fc' },
                    hitGray: { value: '#ADB5BD' },
                    e7: { value: '#E7E9EE' },
                    blue75: { value: 'rgba(55, 85, 190, 0.75)' },
                    geyser: { value: '#DEE2E6' },
                    lightBlue: { value: '#E0E5F4' },
                    zennBlue: { value: '#EDF2F6' },
                    green: { value: '#28a745' },
                    e2: { value: '#E2E8F0' },
                },
                code: {
                    bg: { value: '#192638' },
                    inline: { value: '#215aa012' },
                },
                table: {
                    headerBg: { value: '#EDF2F6' },
                },
                list: {
                    marker: { value: '#65717b' },
                },
                article: {
                    bg: { value: '#edf2f6' },
                },
                border: {
                    plain: { value: '#d6e3ed' },
                    hover: { value: '#CBD5E0' },
                },
            },
        },
        breakpoints: {
            sm: '576px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
        },
    },
});

export const system = createSystem(defaultConfig, customConfig);
