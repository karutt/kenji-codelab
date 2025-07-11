import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    webpack: config => {
        // SVGをReactコンポーネントとして読み込めるようにする
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },
    // 画像の最適化設定
    images: {
        domains: ['localhost'],
    },
    // 実験的機能
    experimental: {
        turbo: {
            rules: {
                '*.svg': {
                    loaders: ['@svgr/webpack'],
                    as: '*.js',
                },
            },
        },
    },
};

export default nextConfig;
