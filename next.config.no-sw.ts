// Service Worker パフォーマンス最適化のテストファイル

// 開発時にService Workerを無効化するテスト用のNext.js設定
const nextConfigWithoutSW = {
    // Serwist を無効化したテスト設定
    async rewrites() {
        return {
            beforeFiles: [
                // Service Worker ファイルを無効化
                {
                    source: '/sw.js',
                    destination: '/api/no-sw',
                },
            ],
        };
    },
};

export default nextConfigWithoutSW;
