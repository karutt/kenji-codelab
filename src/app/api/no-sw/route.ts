// Service Worker を無効化するためのダミーエンドポイント
export async function GET() {
    return new Response('', {
        status: 404,
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}
