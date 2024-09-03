"use client";

import { useEffect } from "react";

export default function WebSocketClient() {
    useEffect(() => {
        const ws = new WebSocket("ws://localhost:3001"); // WebSocketサーバーに接続
        ws.onopen = () => console.log("WebSocket connection established.");
        ws.onmessage = (event) => {
            console.log("WebSocket message received:", event.data); // メッセージを受信した際のログ
            if (event.data === "reload") {
                console.log("Reloading the page...");
                window.location.reload(); // ページをリロード
            }
        };
        ws.onerror = (error) => console.error("WebSocket error:", error);
        ws.onclose = () => console.log("WebSocket connection closed.");

        return () => ws.close(); // クリーンアップ
    }, []);

    return null; // 特に何もレンダリングしない
}
