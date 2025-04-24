// next.config.mjs
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

/** ESM 環境で __filename/__dirname 相当を定義 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  webpack(config) {
    // ◆ ① filesystem キャッシュ設定
    config.cache = {
      type: 'filesystem',
      cacheDirectory: resolve(__dirname, '.next/cache/webpack'),
      buildDependencies: {
        config: [__filename],
      },
      compression: 'brotli',
    };

    // ◆ ② SVG 用ローダー設定
    const fileLoaderRule = config.module.rules.find(
      (rule) => rule.test?.test?.('.svg')
    );
    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: {
          not: [...(fileLoaderRule.resourceQuery?.not || []), /url/],
        },
        use: [
          {
            loader: '@svgr/webpack',
            options: { icon: true },
          },
        ],
      }
    );
    fileLoaderRule.exclude = /\.svg$/i;

    // ◆ ③ 警告抑制（任意）
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /webpack\.cache\.PackFileCacheStrategy/,
        message:
          /Serializing big strings \(\d+kiB\) impacts deserialization performance/,
      },
    ];

    return config;
  },
};

export default nextConfig;
