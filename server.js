const chokidar = require("chokidar");
const express = require("express");
const { WebSocketServer } = require("ws");
const next = require("next");
const path = require("path");

const port = 3000;
const wsPort = 3001;
const dev = process.env.NODE_ENV !== "production"; // NODE_ENVのチェック
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    // Next.jsのすべてのルートを処理
    server.all("*", (req, res) => handle(req, res));

    if (dev) {
        // 開発環境でのみWebSocketを起動
        // WebSocketサーバーの設定
        const wss = new WebSocketServer({ port: wsPort });
        console.log(`WebSocket server listening on ws://localhost:${wsPort}`);

        // chokidarを使ってファイルの変更を監視
        const watcher = chokidar.watch(path.join(__dirname, "public/books/p5_tutorial/md"));
        watcher.on("change", (filePath) => {
            console.log(`File ${filePath} has been changed`);
            // WebSocketクライアントにリロードメッセージを送信
            wss.clients.forEach((client) => {
                if (client.readyState === 1) {
                    // WebSocket.OPEN
                    client.send("reload");
                }
            });
        });
    }

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});
